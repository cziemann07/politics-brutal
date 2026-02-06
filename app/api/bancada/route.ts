/**
 * GET /api/bancada?ano=YYYY&mes=MM
 * 
 * Returns CEAP data for all deputies using the new data layer
 * with Supabase caching and stale fallback.
 */

import { NextResponse } from "next/server";
import { buildBancadaDataset, unwrapOr } from "@/lib/data";
import { CEAP_TETO_POR_UF } from "@/lib";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const ano = searchParams.get("ano");
  const mes = searchParams.get("mes");

  if (!ano || !mes) {
    return NextResponse.json(
      { error: "Parâmetros ano e mes são obrigatórios" },
      { status: 400 }
    );
  }

  const anoNum = parseInt(ano, 10);
  const mesNum = parseInt(mes, 10);

  if (isNaN(anoNum) || isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
    return NextResponse.json(
      { error: "Parâmetros ano e mes inválidos" },
      { status: 400 }
    );
  }

  try {
    // Use new data layer with cache + stale fallback
    const result = await buildBancadaDataset({
      ano: anoNum,
      mes: mesNum,
    });

    if (!result.success) {
      console.error("[Bancada API] Error:", result.error.message);
      return NextResponse.json(
        { error: "Erro ao processar bancada" },
        { status: 500 }
      );
    }

    // Transform to API response format
    const dados = result.data.map((dep) => ({
      id: dep.id,
      name: dep.nome,
      party: dep.siglaPartido,
      state: dep.siglaUf,
      role: "Deputado Federal",
      image: dep.urlFoto,
      expenses: dep.totalCeap,
      teto: dep.tetoCeap,
      status: dep.status,
    }));

    const payload = {
      ano: anoNum,
      mes: mesNum,
      totalDeputados: dados.length,
      dados,
      stale: result.stale ?? false,
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("[Bancada API] Unexpected error:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar bancada" },
      { status: 500 }
    );
  }
}
