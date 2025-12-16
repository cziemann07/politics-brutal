import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { CEAP_TETO_POR_UF } from "@/lib";

// Helper: retry com backoff exponencial
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Rate limiting ou erro temporário - retry
      if ((response.status === 429 || response.status === 503) && attempt < maxRetries) {
        const delayMs = 1000 * Math.pow(2, attempt);
        console.warn(`Retry ${attempt + 1}/${maxRetries} para ${url} após ${delayMs}ms (status ${response.status})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      return response;
    } catch (error: any) {
      lastError = error;

      if (error.name === "AbortError") {
        console.error(`Timeout ao buscar ${url}`);
      }

      if (attempt < maxRetries) {
        const delayMs = 1000 * Math.pow(2, attempt);
        console.warn(`Retry ${attempt + 1}/${maxRetries} para ${url} após ${delayMs}ms (erro: ${error.message})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error(`Falha após ${maxRetries + 1} tentativas para ${url}`);
}

/**
 * GET /api/bancada?ano=YYYY&mes=MM
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const ano = searchParams.get("ano");
  const mes = searchParams.get("mes");

  if (!ano || !mes) {
    return NextResponse.json({ error: "Parâmetros ano e mes são obrigatórios" }, { status: 400 });
  }

  const cacheDir = path.join(process.cwd(), ".cache");
  const cacheFile = path.join(cacheDir, `bancada-${ano}-${mes}.json`);

  // tenta ler cache
  try {
    const cached = await fs.readFile(cacheFile, "utf-8");
    const json = JSON.parse(cached);

    return NextResponse.json(json);
  } catch {
    // cache não existe → continua
  }

  try {
    /* --------------------------------------------------
     * 1. Buscar deputados em exercício (com retry)
     * -------------------------------------------------- */
    const depRes = await fetchWithRetry(
      "https://dadosabertos.camara.leg.br/api/v2/deputados?itens=513&ordem=ASC&ordenarPor=nome",
      { headers: { Accept: "application/json" } }
    );

    if (!depRes.ok) {
      throw new Error(`Falha ao buscar deputados: HTTP ${depRes.status}`);
    }

    const depJson = await depRes.json();
    const deputados = Array.isArray(depJson?.dados) ? depJson.dados : [];

    console.log(`[Bancada API] Processando ${deputados.length} deputados para ${mes}/${ano}...`);

    /* --------------------------------------------------
     * 2. Processar deputados com controle de concorrência
     * -------------------------------------------------- */
    const resultadoFinal = [];
    const BATCH_SIZE = 5; // Processar 5 por vez
    const DELAY_BETWEEN_BATCHES = 200; // 200ms entre batches

    for (let i = 0; i < deputados.length; i += BATCH_SIZE) {
      const batch = deputados.slice(i, i + BATCH_SIZE);

      const promises = batch.map(async (dep: any) => {
        try {
          const despesasRes = await fetchWithRetry(
            `https://dadosabertos.camara.leg.br/api/v2/deputados/${dep.id}/despesas?ano=${ano}&mes=${mes}&itens=100`,
            { headers: { Accept: "application/json" } },
            2 // Apenas 2 retries para despesas individuais
          );

          if (!despesasRes.ok) {
            console.warn(`[Bancada API] Falha ao buscar despesas do deputado ${dep.id}: HTTP ${despesasRes.status}`);
            return null;
          }

          const despesasJson = await despesasRes.json();
          const despesas = Array.isArray(despesasJson?.dados) ? despesasJson.dados : [];

          const totalGasto = despesas.reduce(
            (acc: number, d: any) => acc + (Number(d.valorLiquido) || 0),
            0
          );

          const teto = CEAP_TETO_POR_UF[dep.siglaUf];

          if (!teto) {
            return null;
          }

          const status = totalGasto > teto ? "Irregular" : "Regular";

          return {
            id: dep.id,
            name: dep.nome,
            party: dep.siglaPartido,
            state: dep.siglaUf,
            role: "Deputado Federal",
            image: dep.urlFoto,
            expenses: Number(totalGasto.toFixed(2)),
            teto,
            status,
          };
        } catch (error: any) {
          console.error(`[Bancada API] Erro ao processar deputado ${dep.id}:`, error.message);
          return null;
        }
      });

      const batchResults = await Promise.all(promises);
      resultadoFinal.push(...batchResults.filter((r) => r !== null));

      // Log de progresso
      console.log(`[Bancada API] Processados ${Math.min(i + BATCH_SIZE, deputados.length)}/${deputados.length}`);

      // Delay entre batches para não sobrecarregar a API
      if (i + BATCH_SIZE < deputados.length) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    console.log(`[Bancada API] Concluído: ${resultadoFinal.length} deputados processados com sucesso.`);

    const payload = {
      ano: Number(ano),
      mes: Number(mes),
      totalDeputados: resultadoFinal.length,
      dados: resultadoFinal,
    };

    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(cacheFile, JSON.stringify(payload, null, 2));

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json({ error: "Erro interno ao processar bancada" }, { status: 500 });
  }
}
