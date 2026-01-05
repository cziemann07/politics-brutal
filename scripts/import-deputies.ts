/**
 * Script para importar deputados da API da Câmara para o Supabase
 *
 * Uso:
 *   npx tsx scripts/import-deputies.ts
 *
 * Certifique-se de ter as variáveis de ambiente configuradas:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY (chave com permissão de escrita)
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Carregar variáveis de ambiente do .env.local
config({ path: ".env.local" });

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não configuradas:");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "OK" : "FALTANDO");
  console.error("   SUPABASE_SERVICE_KEY:", supabaseServiceKey ? "OK" : "FALTANDO");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// API da Câmara
const CAMARA_API_BASE = "https://dadosabertos.camara.leg.br/api/v2";

// Teto CEAP por UF (valores de 2024)
const TETO_CEAP_UF: Record<string, number> = {
  AC: 44632.46, AL: 40944.1, AM: 43570.12, AP: 43374.78,
  BA: 39010.85, CE: 42451.77, DF: 30788.66, ES: 37423.91,
  GO: 35507.06, MA: 42151.69, MG: 36092.71, MS: 40542.84,
  MT: 39428.03, PA: 42227.45, PB: 42032.56, PE: 41676.8,
  PI: 40971.77, PR: 38871.86, RJ: 35759.97, RN: 42731.99,
  RO: 43672.49, RR: 45612.53, RS: 40875.9, SC: 39877.78,
  SE: 40139.26, SP: 37043.53, TO: 39503.61,
};

interface DeputadoAPI {
  id: number;
  uri: string;
  nome: string;
  siglaPartido: string;
  uriPartido: string;
  siglaUf: string;
  idLegislatura: number;
  urlFoto: string;
  email: string;
}

interface DeputadoDetalhes {
  id: number;
  uri: string;
  nomeCivil: string;
  ultimoStatus: {
    nome: string;
    siglaPartido: string;
    siglaUf: string;
    urlFoto: string;
    email: string;
    situacao: string;
    condicaoEleitoral: string;
    gabinete?: {
      nome?: string;
      predio?: string;
      sala?: string;
      andar?: string;
      telefone?: string;
      email?: string;
    };
  };
  cpf?: string;
  sexo?: string;
  dataNascimento?: string;
  dataFalecimento?: string;
  ufNascimento?: string;
  municipioNascimento?: string;
  escolaridade?: string;
  redeSocial?: string[];
}

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.log(`  ⚠️ Tentativa ${i + 1}/${retries} falhou: ${error}`);
      if (i === retries - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1))); // Backoff
    }
  }
}

async function fetchAllDeputados(): Promise<DeputadoAPI[]> {
  console.log("📥 Buscando lista de deputados...");

  const data = await fetchWithRetry(
    `${CAMARA_API_BASE}/deputados?itens=1000&ordenarPor=nome`
  );

  console.log(`  ✅ Encontrados ${data.dados.length} deputados`);
  return data.dados;
}

async function fetchDeputadoDetalhes(id: number): Promise<DeputadoDetalhes | null> {
  try {
    const data = await fetchWithRetry(`${CAMARA_API_BASE}/deputados/${id}`);
    return data.dados;
  } catch (error) {
    console.error(`  ❌ Erro ao buscar detalhes do deputado ${id}:`, error);
    return null;
  }
}

function parseRedesSociais(redes?: string[]): {
  twitter?: string;
  instagram?: string;
  facebook?: string;
} {
  const result: { twitter?: string; instagram?: string; facebook?: string } = {};

  if (!redes) return result;

  for (const rede of redes) {
    const lower = rede.toLowerCase();
    if (lower.includes("twitter.com") || lower.includes("x.com")) {
      result.twitter = rede;
    } else if (lower.includes("instagram.com")) {
      result.instagram = rede;
    } else if (lower.includes("facebook.com")) {
      result.facebook = rede;
    }
  }

  return result;
}

async function importDeputados() {
  console.log("🚀 Iniciando importação de deputados...\n");

  // 1. Buscar todos os deputados
  const deputados = await fetchAllDeputados();

  // 2. Para cada deputado, buscar detalhes e inserir no banco
  let success = 0;
  let errors = 0;

  console.log("\n📝 Importando deputados para o banco de dados...\n");

  for (let i = 0; i < deputados.length; i++) {
    const dep = deputados[i];
    console.log(`[${i + 1}/${deputados.length}] ${dep.nome}...`);

    // Buscar detalhes
    const detalhes = await fetchDeputadoDetalhes(dep.id);

    // Extrair redes sociais
    const redes = parseRedesSociais(detalhes?.redeSocial);

    // Montar objeto para inserção
    const deputadoData = {
      camara_id: dep.id,
      nome: dep.nome,
      nome_civil: detalhes?.nomeCivil || null,
      sigla_partido: dep.siglaPartido,
      sigla_uf: dep.siglaUf,
      url_foto: dep.urlFoto,
      email: dep.email || detalhes?.ultimoStatus?.email || null,
      cpf: detalhes?.cpf || null,
      data_nascimento: detalhes?.dataNascimento || null,
      sexo: detalhes?.sexo || null,
      municipio_nascimento: detalhes?.municipioNascimento || null,
      uf_nascimento: detalhes?.ufNascimento || null,
      escolaridade: detalhes?.escolaridade || null,
      situacao: detalhes?.ultimoStatus?.situacao || "Exercício",
      condicao_eleitoral: detalhes?.ultimoStatus?.condicaoEleitoral || null,
      gabinete_numero: detalhes?.ultimoStatus?.gabinete?.sala || null,
      gabinete_anexo: detalhes?.ultimoStatus?.gabinete?.predio || null,
      gabinete_telefone: detalhes?.ultimoStatus?.gabinete?.telefone || null,
      teto_ceap: TETO_CEAP_UF[dep.siglaUf] || null,
      twitter: redes.twitter || null,
      instagram: redes.instagram || null,
      facebook: redes.facebook || null,
      updated_at: new Date().toISOString(),
    };

    // Inserir ou atualizar no banco
    const { error } = await supabase
      .from("deputies")
      .upsert(deputadoData, { onConflict: "camara_id" });

    if (error) {
      console.error(`  ❌ Erro ao salvar: ${error.message}`);
      errors++;
    } else {
      console.log(`  ✅ Salvo com sucesso`);
      success++;
    }

    // Delay para não sobrecarregar a API
    if (i < deputados.length - 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // 3. Resumo
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMO DA IMPORTAÇÃO");
  console.log("=".repeat(50));
  console.log(`✅ Sucesso: ${success}`);
  console.log(`❌ Erros: ${errors}`);
  console.log(`📝 Total: ${deputados.length}`);
  console.log("=".repeat(50));

  if (errors > 0) {
    process.exit(1);
  }
}

// Executar
importDeputados().catch((error) => {
  console.error("❌ Erro fatal:", error);
  process.exit(1);
});
