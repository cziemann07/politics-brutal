import { NextResponse } from "next/server";
import { listDeputies } from "@/lib";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const emExercicio = searchParams.get("emExercicio") === "true";

    const deputados = await listDeputies({
      itens: 513,
      emExercicio: emExercicio || undefined,
    });

    // 🔹 Normaliza para o formato do FRONT
    const normalizados = deputados.map((d: any) => ({
      id: d.id,
      name: d.nome,
      party: d.siglaPartido,
      state: d.siglaUf,
      role: "Deputado Federal",
      image: d.urlFoto,
    }));

    const res = NextResponse.json({ dados: normalizados });
    res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res;
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "Falha ao buscar deputados",
        detail: String(e?.message ?? e),
      },
      { status: 500 }
    );
  }
}
