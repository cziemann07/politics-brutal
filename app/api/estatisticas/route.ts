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
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if ((response.status === 429 || response.status === 503) && attempt < maxRetries) {
        const delayMs = 1000 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      return response;
    } catch (error: any) {
      lastError = error;

      if (attempt < maxRetries) {
        const delayMs = 1000 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error(`Falha após ${maxRetries + 1} tentativas para ${url}`);
}

/**
 * GET /api/estatisticas
 * Retorna dados para a seção "Dados que Chocam" da home
 */
export async function GET() {
  const cacheDir = path.join(process.cwd(), ".cache");
  const cacheFile = path.join(cacheDir, "estatisticas-home.json");
  const CACHE_DURATION_MS = 1000 * 60 * 60 * 6; // 6 horas

  // Tenta ler cache
  try {
    const stats = await fs.stat(cacheFile);
    const ageMs = Date.now() - stats.mtimeMs;

    if (ageMs < CACHE_DURATION_MS) {
      const cached = await fs.readFile(cacheFile, "utf-8");
      return NextResponse.json(JSON.parse(cached));
    }
  } catch {
    // cache não existe → continua
  }

  try {
    // Determinar mês/ano mais recente (último mês fechado)
    const now = new Date();
    let ano = now.getFullYear();
    let mes = now.getMonth(); // 0-indexed, então é o mês anterior

    if (mes === 0) {
      mes = 12;
      ano = ano - 1;
    }

    // Buscar deputados em exercício
    const depRes = await fetchWithRetry(
      "https://dadosabertos.camara.leg.br/api/v2/deputados?itens=513&ordem=ASC&ordenarPor=nome",
      { headers: { Accept: "application/json" } }
    );

    if (!depRes.ok) {
      throw new Error(`Falha ao buscar deputados: HTTP ${depRes.status}`);
    }

    const depJson = await depRes.json();
    const deputados = Array.isArray(depJson?.dados) ? depJson.dados : [];

    // Buscar despesas dos top 100 deputados para encontrar o maior gastador
    // (processamos uma amostra para não sobrecarregar)
    const gastos: Array<{
      id: number;
      nome: string;
      partido: string;
      estado: string;
      urlFoto: string;
      gastos: number;
    }> = [];

    const BATCH_SIZE = 10;
    const MAX_DEPUTADOS = 100; // Amostragem para não demorar muito
    const deputadosAmostra = deputados.slice(0, MAX_DEPUTADOS);

    for (let i = 0; i < deputadosAmostra.length; i += BATCH_SIZE) {
      const batch = deputadosAmostra.slice(i, i + BATCH_SIZE);

      const promises = batch.map(async (dep: any) => {
        try {
          const despesasRes = await fetchWithRetry(
            `https://dadosabertos.camara.leg.br/api/v2/deputados/${dep.id}/despesas?ano=${ano}&mes=${mes}&itens=100`,
            { headers: { Accept: "application/json" } },
            2
          );

          if (!despesasRes.ok) return null;

          const despesasJson = await despesasRes.json();
          const despesas = Array.isArray(despesasJson?.dados) ? despesasJson.dados : [];

          const totalGasto = despesas.reduce(
            (acc: number, d: any) => acc + (Number(d.valorLiquido) || 0),
            0
          );

          return {
            id: dep.id,
            nome: dep.nome,
            partido: dep.siglaPartido,
            estado: dep.siglaUf,
            urlFoto: dep.urlFoto,
            gastos: totalGasto,
          };
        } catch {
          return null;
        }
      });

      const batchResults = await Promise.all(promises);
      gastos.push(...batchResults.filter((r): r is NonNullable<typeof r> => r !== null));

      // Delay entre batches
      if (i + BATCH_SIZE < deputadosAmostra.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Encontrar o maior gastador
    const sortedByGastos = gastos.sort((a, b) => b.gastos - a.gastos);
    const topGastador = sortedByGastos[0] || null;

    // Calcular estatísticas adicionais
    const totalGastosMes = gastos.reduce((acc, g) => acc + g.gastos, 0);
    const mediaGastos = gastos.length > 0 ? totalGastosMes / gastos.length : 0;

    const payload = {
      periodo: {
        mes,
        ano,
        label: `${String(mes).padStart(2, "0")}/${ano}`,
      },
      topGastador: topGastador
        ? {
            id: topGastador.id,
            nome: topGastador.nome,
            partido: topGastador.partido,
            estado: topGastador.estado,
            urlFoto: topGastador.urlFoto,
            gastos: Number(topGastador.gastos.toFixed(2)),
          }
        : null,
      estatisticas: {
        totalDeputados: deputados.length,
        mediaGastosCeap: Number(mediaGastos.toFixed(2)),
        totalGastosMes: Number(totalGastosMes.toFixed(2)),
      },
      atualizadoEm: new Date().toISOString(),
    };

    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(cacheFile, JSON.stringify(payload, null, 2));

    return NextResponse.json(payload);
  } catch (err) {
    console.error("[Estatisticas API] Erro:", err);

    // Retorna dados fallback se der erro
    return NextResponse.json({
      periodo: { mes: 11, ano: 2024, label: "11/2024" },
      topGastador: null,
      estatisticas: {
        totalDeputados: 513,
        mediaGastosCeap: 0,
        totalGastosMes: 0,
      },
      atualizadoEm: new Date().toISOString(),
      error: "Dados podem estar desatualizados",
    });
  }
}
