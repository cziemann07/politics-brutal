/**
 * Script para sincronizar lista de deputados da API da Câmara
 * e salvar como JSON estático em lib/data/deputados.json
 *
 * Uso: npx tsx scripts/sync-deputados.ts
 */

const BASE = "https://dadosabertos.camara.leg.br/api/v2";

interface DeputadoAPI {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  email: string;
}

async function fetchDeputados(): Promise<DeputadoAPI[]> {
  console.log("Buscando deputados da API da Câmara...");

  const res = await fetch(`${BASE}/deputados?itens=513&ordem=ASC&ordenarPor=nome`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`API retornou ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  return json.dados;
}

async function main() {
  const deputados = await fetchDeputados();

  const dados = deputados.map((d) => ({
    id: d.id,
    nome: d.nome,
    siglaPartido: d.siglaPartido,
    siglaUf: d.siglaUf,
    urlFoto: d.urlFoto,
    email: d.email || null,
  }));

  const fs = await import("fs");
  const path = await import("path");

  const outPath = path.join(__dirname, "..", "lib", "data", "deputados.json");
  fs.writeFileSync(outPath, JSON.stringify(dados, null, 2), "utf-8");

  console.log(`${dados.length} deputados salvos em ${outPath}`);
  console.log(`Partidos: ${[...new Set(dados.map((d) => d.siglaPartido))].sort().join(", ")}`);
  console.log(`UFs: ${[...new Set(dados.map((d) => d.siglaUf))].sort().join(", ")}`);
}

main().catch((err) => {
  console.error("Erro:", err);
  process.exit(1);
});
