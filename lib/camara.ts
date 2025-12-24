import { CEAP_TETO_POR_UF } from "./ceapTeto";

const BASE = "https://dadosabertos.camara.leg.br/api/v2";

// Configuração de retry e timeout
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 segundo
const REQUEST_TIMEOUT = 30000; // 30 segundos

export type DeputyBasic = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto?: string;
};

export type DeputyWithCeap = DeputyBasic & {
  ano: number;
  mes: number;
  totalCeap: number;
  tetoCeap: number;
  status: "Regular" | "Irregular" | "Sem teto UF";
};

// Helper: delay assíncrono
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper: fetch com timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(`Request timeout após ${timeout}ms: ${url}`);
    }
    throw error;
  }
}

// Função principal com retry e backoff exponencial
async function fetchJson<T>(url: string, init?: RequestInit, retries = MAX_RETRIES): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          ...init,
          headers: {
            Accept: "application/json",
            ...(init?.headers ?? {}),
          },
          // cache do Next (quando chamado em Route Handler)
          next: { revalidate: 60 * 60 },
        },
        REQUEST_TIMEOUT
      );

      // Rate limiting (429) ou erro temporário (503) - retry com backoff
      if (res.status === 429 || res.status === 503) {
        if (attempt < retries) {
          const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
          console.warn(
            `API retornou ${res.status} para ${url}. Tentativa ${attempt + 1}/${retries + 1}. Aguardando ${delayMs}ms...`
          );
          await delay(delayMs);
          continue;
        }
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ao buscar ${url} :: ${text.slice(0, 200)}`);
      }

      return (await res.json()) as T;
    } catch (error: any) {
      lastError = error;

      // Se for erro de rede ou timeout, tenta novamente
      if (attempt < retries && (error.message.includes("timeout") || error.message.includes("fetch"))) {
        const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        console.warn(
          `Erro ao buscar ${url}: ${error.message}. Tentativa ${attempt + 1}/${retries + 1}. Aguardando ${delayMs}ms...`
        );
        await delay(delayMs);
        continue;
      }

      // Se não for retryable ou já esgotou tentativas, lança erro
      throw error;
    }
  }

  throw lastError || new Error(`Falha após ${retries + 1} tentativas para ${url}`);
}

// Paginação padrão da API: response { dados: [...], links: [{rel, href}] }
type Paged<T> = {
  dados: T[];
  links?: Array<{ rel: string; href: string }>;
};

export async function listDeputies(params?: {
  uf?: string;
  emExercicio?: boolean;
  itens?: number;
}): Promise<DeputyBasic[]> {
  const q = new URLSearchParams();
  q.set("ordem", "ASC");
  q.set("ordenarPor", "nome");
  q.set("itens", String(params?.itens ?? 100));

  if (params?.uf && params.uf !== "TODOS") q.set("siglaUf", params.uf);
  // Removido parâmetro emExercicio - a API da Câmara não aceita esse parâmetro
  // Por padrão, a API retorna apenas deputados em exercício

  let url = `${BASE}/deputados?${q.toString()}`;
  const out: DeputyBasic[] = [];

  while (url) {
    const page = await fetchJson<Paged<DeputyBasic>>(url);
    out.push(...(page.dados ?? []));
    const next = page.links?.find((l) => l.rel === "next")?.href;
    url = next ?? "";
  }

  return out;
}

type ExpenseRow = { valorLiquido: number | string };

export async function ceapTotalForDeputy(params: {
  id: number;
  ano: number;
  mes: number;
}): Promise<number> {
  const q = new URLSearchParams();
  q.set("ano", String(params.ano));
  q.set("mes", String(params.mes));
  q.set("itens", "100");
  q.set("ordem", "ASC");
  q.set("ordenarPor", "id");

  let url = `${BASE}/deputados/${params.id}/despesas?${q.toString()}`;
  let total = 0;

  while (url) {
    const page = await fetchJson<Paged<ExpenseRow>>(url);

    for (const row of page.dados ?? []) {
      const v = typeof row.valorLiquido === "string" ? Number(row.valorLiquido) : row.valorLiquido;
      if (Number.isFinite(v)) total += v;
    }

    const next = page.links?.find((l) => l.rel === "next")?.href;
    url = next ?? "";
  }

  // arredonda pra centavos
  return Math.round(total * 100) / 100;
}

function ceilingForUf(uf: string): number | null {
  return typeof CEAP_TETO_POR_UF[uf] === "number" ? CEAP_TETO_POR_UF[uf] : null;
}

function statusFrom(total: number, teto: number | null): DeputyWithCeap["status"] {
  if (!teto) return "Sem teto UF";
  return total > teto ? "Irregular" : "Regular";
}

// limiter com delay entre requisições para não espancar a API
export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, idx: number) => Promise<R>,
  delayBetweenMs = 100 // delay de 100ms entre cada requisição
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;
  const errors: Array<{ idx: number; error: any }> = [];

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) break;

      try {
        results[idx] = await fn(items[idx], idx);
        // Pequeno delay para evitar rate limiting
        if (idx < items.length - 1) {
          await delay(delayBetweenMs);
        }
      } catch (error: any) {
        console.error(`Erro ao processar item ${idx}:`, error.message);
        errors.push({ idx, error });
        // NÃO lança o erro - continua processando
      }
    }
  });

  await Promise.all(workers);

  // Filtra resultados undefined (itens que falharam)
  const validResults = results.filter((r) => r !== undefined);

  if (errors.length > 0) {
    console.warn(`${errors.length} itens falharam no processamento`);
  }

  return validResults;
}

export async function buildBancadaDataset(params: {
  ano: number;
  mes: number;
  uf?: string;
  concurrency?: number;
}): Promise<DeputyWithCeap[]> {
  const deputies = await listDeputies({ uf: params.uf, emExercicio: true, itens: 100 });
  // Reduzindo concorrência de 8 para 3 para evitar sobrecarregar a API
  const concurrency = params.concurrency ?? 3;

  console.log(`Processando ${deputies.length} deputados com concorrência ${concurrency}...`);

  return mapLimit(
    deputies,
    concurrency,
    async (d) => {
      const totalCeap = await ceapTotalForDeputy({ id: d.id, ano: params.ano, mes: params.mes });
      const tetoCeap = ceilingForUf(d.siglaUf);

      return {
        ...d,
        ano: params.ano,
        mes: params.mes,
        totalCeap,
        tetoCeap: tetoCeap ?? 0,
        status: statusFrom(totalCeap, tetoCeap),
      };
    },
    150 // 150ms de delay entre requisições
  );
}

// ========== VOTAÇÕES ==========

export type VotacaoBasic = {
  id: string;
  uri: string;
  data: string;
  dataHoraRegistro: string;
  siglaOrgao: string;
  uriOrgao: string;
  uriEvento: string | null;
  proposicaoObjeto: string | null;
  uriProposicaoObjeto: string | null;
  descricao: string;
  aprovacao: number; // 1 = aprovado, 0 = rejeitado
};

export type VotoDeputado = {
  tipoVoto: string; // "Sim", "Não", "Abstenção", "Obstrução", etc
  dataRegistroVoto: string;
  deputado_: {
    id: number;
    uri: string;
    nome: string;
    siglaPartido: string;
    uriPartido: string;
    siglaUf: string;
    idLegislatura: number;
    urlFoto: string;
    email: string;
  };
};

export type VotacaoComVotos = VotacaoBasic & {
  votos: VotoDeputado[];
  resumo: {
    sim: number;
    nao: number;
    abstencao: number;
    obstrucao: number;
    outros: number;
    total: number;
  };
};

export async function listVotacoes(params?: {
  dataInicio?: string;
  dataFim?: string;
  itens?: number;
  pagina?: number;
  ordem?: "ASC" | "DESC";
}): Promise<VotacaoBasic[]> {
  const q = new URLSearchParams();
  q.set("ordem", params?.ordem ?? "DESC");
  q.set("ordenarPor", "dataHoraRegistro");
  q.set("itens", String(params?.itens ?? 30));

  if (params?.pagina) q.set("pagina", String(params.pagina));
  if (params?.dataInicio) q.set("dataInicio", params.dataInicio);
  if (params?.dataFim) q.set("dataFim", params.dataFim);

  const url = `${BASE}/votacoes?${q.toString()}`;
  const response = await fetchJson<Paged<VotacaoBasic>>(url);

  return response.dados ?? [];
}

export async function getVotacaoVotos(votacaoId: string): Promise<VotoDeputado[]> {
  const url = `${BASE}/votacoes/${votacaoId}/votos`;
  const response = await fetchJson<Paged<VotoDeputado>>(url);

  return response.dados ?? [];
}

export async function getVotacaoCompleta(votacaoId: string): Promise<VotacaoComVotos | null> {
  try {
    // Busca dados básicos da votação
    const votacaoUrl = `${BASE}/votacoes/${votacaoId}`;
    const votacaoResponse = await fetchJson<{ dados: VotacaoBasic }>(votacaoUrl);
    const votacao = votacaoResponse.dados;

    if (!votacao) return null;

    // Busca votos
    const votos = await getVotacaoVotos(votacaoId);

    // Calcula resumo
    const resumo = {
      sim: votos.filter(v => v.tipoVoto === "Sim").length,
      nao: votos.filter(v => v.tipoVoto === "Não").length,
      abstencao: votos.filter(v => v.tipoVoto === "Abstenção").length,
      obstrucao: votos.filter(v => v.tipoVoto === "Obstrução").length,
      outros: votos.filter(v => !["Sim", "Não", "Abstenção", "Obstrução"].includes(v.tipoVoto)).length,
      total: votos.length,
    };

    return {
      ...votacao,
      votos,
      resumo,
    };
  } catch (error) {
    console.error(`Erro ao buscar votação ${votacaoId}:`, error);
    return null;
  }
}

// ========== EVENTOS E PRESENÇA ==========

export type EventoBasic = {
  id: number;
  uri: string;
  dataHoraInicio: string;
  dataHoraFim: string | null;
  situacao: string; // "Encerrada", "Convocada", "Em Andamento", etc
  descricaoTipo: string; // "Sessão Deliberativa", "Reunião Deliberativa", etc
  descricao: string;
  localExterno: string | null;
  orgaos: Array<{
    id: number;
    sigla: string;
    nome: string;
    apelido: string;
    uri: string;
  }>;
  localCamara: {
    nome: string | null;
    predio: string | null;
    sala: string | null;
    andar: string | null;
  } | null;
  urlRegistro: string | null;
};

export type DeputadoEvento = {
  id: number;
  uri: string;
  nome: string;
  siglaPartido: string;
  uriPartido: string;
  siglaUf: string;
  idLegislatura: number;
  urlFoto: string;
  email: string;
};

export type PresencaDeputado = {
  deputado: DeputadoEvento;
  presente: boolean;
  justificativa: string | null;
};

/**
 * Lista eventos (sessões, reuniões) da Câmara
 */
export async function listEventos(params?: {
  dataInicio?: string; // YYYY-MM-DD
  dataFim?: string;    // YYYY-MM-DD
  tipoPauta?: string;  // "votacao", "deliberacao", etc
  situacao?: string;   // "Encerrada", "Convocada", etc
  itens?: number;
  pagina?: number;
}): Promise<EventoBasic[]> {
  const q = new URLSearchParams();
  q.set("ordem", "DESC");
  q.set("ordenarPor", "dataHoraInicio");
  q.set("itens", String(params?.itens ?? 30));

  if (params?.pagina) q.set("pagina", String(params.pagina));
  if (params?.dataInicio) q.set("dataInicio", params.dataInicio);
  if (params?.dataFim) q.set("dataFim", params.dataFim);
  if (params?.tipoPauta) q.set("tipoPauta", params.tipoPauta);
  if (params?.situacao) q.set("situacao", params.situacao);

  const url = `${BASE}/eventos?${q.toString()}`;
  const response = await fetchJson<Paged<EventoBasic>>(url);

  return response.dados ?? [];
}

/**
 * Busca detalhes de um evento específico
 */
export async function getEvento(eventoId: number): Promise<EventoBasic | null> {
  try {
    const url = `${BASE}/eventos/${eventoId}`;
    const response = await fetchJson<{ dados: EventoBasic }>(url);
    return response.dados ?? null;
  } catch (error) {
    console.error(`Erro ao buscar evento ${eventoId}:`, error);
    return null;
  }
}

/**
 * Lista deputados que participaram de um evento
 */
export async function getDeputadosEvento(eventoId: number): Promise<DeputadoEvento[]> {
  try {
    const url = `${BASE}/eventos/${eventoId}/deputados`;
    const response = await fetchJson<Paged<DeputadoEvento>>(url);
    return response.dados ?? [];
  } catch (error) {
    console.error(`Erro ao buscar deputados do evento ${eventoId}:`, error);
    return [];
  }
}

/**
 * Busca votações associadas a um evento
 */
export async function getVotacoesEvento(eventoId: number): Promise<VotacaoBasic[]> {
  try {
    const url = `${BASE}/eventos/${eventoId}/votacoes`;
    const response = await fetchJson<Paged<VotacaoBasic>>(url);
    return response.dados ?? [];
  } catch (error) {
    console.error(`Erro ao buscar votações do evento ${eventoId}:`, error);
    return [];
  }
}

/**
 * Verifica quais deputados faltaram em uma votação específica
 * Compara a lista de todos os deputados em exercício com os que votaram
 */
export async function getAusentesVotacao(votacaoId: string): Promise<DeputyBasic[]> {
  try {
    // Busca todos os deputados em exercício
    const todosDeputados = await listDeputies({ emExercicio: true });
    
    // Busca votos da votação
    const votos = await getVotacaoVotos(votacaoId);
    const idsQueVotaram = new Set(votos.map(v => v.deputado_.id));
    
    // Filtra os que não votaram
    const ausentes = todosDeputados.filter(d => !idsQueVotaram.has(d.id));
    
    return ausentes;
  } catch (error) {
    console.error(`Erro ao buscar ausentes da votação ${votacaoId}:`, error);
    return [];
  }
}

/**
 * Busca histórico de faltas de um deputado específico
 * Analisa as votações recentes e verifica ausências
 */
export async function getFaltasDeputado(params: {
  deputadoId: number;
  dataInicio?: string;
  dataFim?: string;
  limite?: number;
}): Promise<{
  votacao: VotacaoBasic;
  presente: boolean;
  tipoVoto: string | null;
}[]> {
  try {
    // Busca votações recentes
    const votacoes = await listVotacoes({
      dataInicio: params.dataInicio,
      dataFim: params.dataFim,
      itens: params.limite ?? 50,
    });
    
    const resultado: {
      votacao: VotacaoBasic;
      presente: boolean;
      tipoVoto: string | null;
    }[] = [];
    
    // Para cada votação, verifica se o deputado votou
    for (const votacao of votacoes) {
      const votos = await getVotacaoVotos(votacao.id);
      const votoDeputado = votos.find(v => v.deputado_.id === params.deputadoId);
      
      resultado.push({
        votacao,
        presente: !!votoDeputado,
        tipoVoto: votoDeputado?.tipoVoto ?? null,
      });
      
      // Pequeno delay para não sobrecarregar a API
      await delay(100);
    }
    
    return resultado;
  } catch (error) {
    console.error(`Erro ao buscar faltas do deputado ${params.deputadoId}:`, error);
    return [];
  }
}

/**
 * Busca eventos recentes com votação
 */
export async function getEventosComVotacao(params?: {
  dataInicio?: string;
  dataFim?: string;
  limite?: number;
}): Promise<Array<EventoBasic & { votacoes: VotacaoBasic[] }>> {
  try {
    const eventos = await listEventos({
      dataInicio: params?.dataInicio,
      dataFim: params?.dataFim,
      situacao: "Encerrada",
      itens: params?.limite ?? 20,
    });
    
    const eventosComVotacao: Array<EventoBasic & { votacoes: VotacaoBasic[] }> = [];
    
    for (const evento of eventos) {
      const votacoes = await getVotacoesEvento(evento.id);
      if (votacoes.length > 0) {
        eventosComVotacao.push({ ...evento, votacoes });
      }
      await delay(100);
    }
    
    return eventosComVotacao;
  } catch (error) {
    console.error("Erro ao buscar eventos com votação:", error);
    return [];
  }
}

/**
 * Calcula estatísticas de presença de um deputado
 */
export async function getEstatisticasPresenca(params: {
  deputadoId: number;
  dataInicio?: string;
  dataFim?: string;
}): Promise<{
  totalVotacoes: number;
  presencas: number;
  ausencias: number;
  percentualPresenca: number;
  ultimasVotacoes: Array<{
    votacao: VotacaoBasic;
    presente: boolean;
    tipoVoto: string | null;
  }>;
}> {
  const faltas = await getFaltasDeputado({
    deputadoId: params.deputadoId,
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
    limite: 100,
  });
  
  const presencas = faltas.filter(f => f.presente).length;
  const ausencias = faltas.filter(f => !f.presente).length;
  const totalVotacoes = faltas.length;
  const percentualPresenca = totalVotacoes > 0 
    ? Math.round((presencas / totalVotacoes) * 100) 
    : 100;
  
  return {
    totalVotacoes,
    presencas,
    ausencias,
    percentualPresenca,
    ultimasVotacoes: faltas.slice(0, 10),
  };
}