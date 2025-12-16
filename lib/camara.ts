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
