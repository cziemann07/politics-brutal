import { NextResponse } from "next/server";
import { ceapTotalForDeputy, CEAP_TETO_POR_UF } from "@/lib";
import deputadosJson from "@/lib/data/deputados.json";

const BASE = "https://dadosabertos.camara.leg.br/api/v2";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Dados base do JSON estático (instantâneo)
    const deputadoBase = deputadosJson.find((d) => d.id === id);

    // Tentar buscar dados detalhados da API (gabinete, etc.)
    let dep: any = null;
    try {
      const depRes = await fetchJson<{ dados: any }>(`${BASE}/deputados/${id}`);
      dep = depRes.dados;
    } catch {
      // Se a API falhar, usa o JSON estático
    }

    if (!dep && !deputadoBase) {
      return NextResponse.json({ error: "Deputado não encontrado" }, { status: 404 });
    }

    // Buscar CEAP do mês mais recente disponível
    const now = new Date();
    // CEAP tem delay de ~30 dias, usar 2 meses atrás
    const ceapDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const ano = ceapDate.getFullYear();
    const mes = ceapDate.getMonth() + 1;

    const uf = dep?.siglaUf ?? deputadoBase?.siglaUf ?? "";

    let expenses = 0;
    let status: "Regular" | "Irregular" = "Regular";
    let teto: number | undefined;

    try {
      expenses = await ceapTotalForDeputy({ id, ano, mes });
      teto = CEAP_TETO_POR_UF[uf];
      if (teto) {
        status = expenses > teto ? "Irregular" : "Regular";
      }
    } catch {
      // Se falhar ao buscar despesas, continua sem elas
    }

    const response = {
      id,
      name: dep?.nome ?? deputadoBase?.nome,
      party: dep?.siglaPartido ?? deputadoBase?.siglaPartido,
      state: uf,
      role: "Deputado Federal",
      image: dep?.urlFoto ?? deputadoBase?.urlFoto,
      expenses,
      teto,
      status,
      // Dados do gabinete (só disponíveis via API detalhada)
      gabinete: dep?.ultimoStatus?.gabinete ?? null,
      email: dep?.ultimoStatus?.gabinete?.email ?? deputadoBase?.email ?? null,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "Falha ao buscar deputado",
        detail: String(e?.message ?? e),
      },
      { status: 500 }
    );
  }
}
