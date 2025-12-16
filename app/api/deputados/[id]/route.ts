import { NextResponse } from "next/server";
import { ceapTotalForDeputy, CEAP_TETO_POR_UF } from "@/lib";

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

    // Buscar dados básicos do deputado
    const depRes = await fetchJson<{ dados: any }>(`${BASE}/deputados/${id}`);

    const dep = depRes.dados;
    if (!dep) {
      return NextResponse.json({ error: "Deputado não encontrado" }, { status: 404 });
    }

    // Buscar CEAP do mês padrão (setembro 2024)
    const ano = 2024;
    const mes = 9;

    let expenses = 0;
    let status: "Regular" | "Irregular" = "Regular";
    let teto: number | undefined;

    try {
      expenses = await ceapTotalForDeputy({ id, ano, mes });
      teto = CEAP_TETO_POR_UF[dep.siglaUf];
      if (teto) {
        status = expenses > teto ? "Irregular" : "Regular";
      }
    } catch {
      // Se falhar ao buscar despesas, continua sem elas
    }

    const response = {
      id: dep.id,
      name: dep.nome,
      party: dep.siglaPartido,
      state: dep.siglaUf,
      role: "Deputado Federal",
      image: dep.urlFoto,
      expenses,
      teto,
      status,
      // Campos opcionais que podem não estar disponíveis
      processes: undefined as any,
      absurdities: undefined as any,
      advisors: 25, // padrão
      cabinet_budget: 111000, // padrão
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
