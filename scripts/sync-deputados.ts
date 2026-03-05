/**
 * Script para sincronizar lista de deputados da API da Câmara
 * e salvar como JSON estático enriquecido em lib/data/deputados.json
 *
 * Puxa:
 * - Lista base de deputados em exercício
 * - Perfil completo de cada deputado (nascimento, sexo, escolaridade, gabinete)
 * - Contagem de secretários parlamentares (assessores) por gabinete
 *
 * Uso: npx tsx scripts/sync-deputados.ts
 */

const BASE = "https://dadosabertos.camara.leg.br/api/v2";
const FUNCIONARIOS_URL = "https://dadosabertos.camara.leg.br/arquivos/funcionarios/json/funcionarios.json";

const CONCURRENCY = 5;
const DELAY_MS = 200;

interface DeputadoListaAPI {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  email: string;
}

interface DeputadoPerfilAPI {
  id: number;
  nomeCivil: string;
  cpf?: string;
  sexo: string;
  dataNascimento: string;
  dataFalecimento: string | null;
  ufNascimento: string;
  municipioNascimento: string;
  escolaridade: string;
  redeSocial: string[];
  ultimoStatus: {
    nome: string;
    siglaPartido: string;
    siglaUf: string;
    urlFoto: string;
    email: string | null;
    nomeEleitoral: string;
    situacao: string;
    condicaoEleitoral: string;
    gabinete?: {
      nome: string;
      predio: string;
      sala: string;
      andar: string;
      telefone: string;
      email: string;
    };
  };
}

interface FuncionarioAPI {
  grupo: string;
  nome: string;
  cargo: string;
  lotacao: string;
  uriLotacao: string;
}

interface DeputadoEnriquecido {
  id: number;
  nome: string;
  nomeCivil: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  email: string | null;
  sexo: string;
  dataNascimento: string;
  ufNascimento: string;
  municipioNascimento: string;
  escolaridade: string;
  redeSocial: string[];
  situacao: string;
  condicaoEleitoral: string;
  gabinete: {
    nome: string;
    predio: string;
    sala: string;
    andar: string;
    telefone: string;
    email: string;
  } | null;
  totalAssessores: number;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ao buscar ${url}`);
  }
  return res.json() as Promise<T>;
}

async function fetchDeputadosLista(): Promise<DeputadoListaAPI[]> {
  console.log("Buscando lista de deputados...");
  const json = await fetchJson<{ dados: DeputadoListaAPI[] }>(
    `${BASE}/deputados?itens=513&ordem=ASC&ordenarPor=nome`
  );
  return json.dados;
}

async function fetchPerfil(id: number): Promise<DeputadoPerfilAPI | null> {
  try {
    const json = await fetchJson<{ dados: DeputadoPerfilAPI }>(
      `${BASE}/deputados/${id}`
    );
    return json.dados;
  } catch (err) {
    console.warn(`Falha ao buscar perfil do deputado ${id}:`, err);
    return null;
  }
}

async function fetchAssessoresPorDeputado(): Promise<Map<number, number>> {
  console.log("Baixando arquivo de funcionários da Câmara...");
  const json = await fetchJson<{ dados: FuncionarioAPI[] }>(FUNCIONARIOS_URL);

  const contagem = new Map<number, number>();

  for (const func of json.dados) {
    if (!func.grupo.includes("ecretário Parlamentar")) continue;

    const match = func.uriLotacao?.match(/\/deputados\/(\d+)/);
    if (match) {
      const depId = parseInt(match[1], 10);
      contagem.set(depId, (contagem.get(depId) || 0) + 1);
    }
  }

  console.log(`Assessores mapeados para ${contagem.size} deputados`);
  return contagem;
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, idx: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) break;
      results[idx] = await fn(items[idx], idx);
      await delay(DELAY_MS);
    }
  });

  await Promise.all(workers);
  return results;
}

async function main() {
  const [lista, assessoresMap] = await Promise.all([
    fetchDeputadosLista(),
    fetchAssessoresPorDeputado(),
  ]);

  console.log(`${lista.length} deputados na lista. Buscando perfis completos...`);

  let completed = 0;
  const dados = await mapLimit(lista, CONCURRENCY, async (dep) => {
    const perfil = await fetchPerfil(dep.id);
    completed++;
    if (completed % 50 === 0) {
      console.log(`  ${completed}/${lista.length} perfis carregados...`);
    }

    const result: DeputadoEnriquecido = {
      id: dep.id,
      nome: perfil?.ultimoStatus?.nome || dep.nome,
      nomeCivil: perfil?.nomeCivil || dep.nome,
      siglaPartido: perfil?.ultimoStatus?.siglaPartido || dep.siglaPartido,
      siglaUf: perfil?.ultimoStatus?.siglaUf || dep.siglaUf,
      urlFoto: perfil?.ultimoStatus?.urlFoto || dep.urlFoto,
      email: perfil?.ultimoStatus?.gabinete?.email || dep.email || null,
      sexo: perfil?.sexo || "N/I",
      dataNascimento: perfil?.dataNascimento || "",
      ufNascimento: perfil?.ufNascimento || "",
      municipioNascimento: perfil?.municipioNascimento || "",
      escolaridade: perfil?.escolaridade || "",
      redeSocial: perfil?.redeSocial || [],
      situacao: perfil?.ultimoStatus?.situacao || "Exercício",
      condicaoEleitoral: perfil?.ultimoStatus?.condicaoEleitoral || "",
      gabinete: perfil?.ultimoStatus?.gabinete || null,
      totalAssessores: assessoresMap.get(dep.id) || 0,
    };

    return result;
  });

  const fs = await import("fs");
  const path = await import("path");

  const outPath = path.join(__dirname, "..", "lib", "data", "deputados.json");
  fs.writeFileSync(outPath, JSON.stringify(dados, null, 2), "utf-8");

  console.log(`\n${dados.length} deputados salvos em ${outPath}`);
  console.log(`Partidos: ${[...new Set(dados.map((d) => d.siglaPartido))].sort().join(", ")}`);
  console.log(`UFs: ${[...new Set(dados.map((d) => d.siglaUf))].sort().join(", ")}`);

  const comAssessores = dados.filter((d) => d.totalAssessores > 0).length;
  const mediaAssessores = dados.reduce((s, d) => s + d.totalAssessores, 0) / dados.length;
  console.log(`Deputados com assessores: ${comAssessores}/${dados.length}`);
  console.log(`Média de assessores: ${mediaAssessores.toFixed(1)}`);
}

main().catch((err) => {
  console.error("Erro:", err);
  process.exit(1);
});
