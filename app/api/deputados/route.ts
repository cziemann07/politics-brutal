import { NextResponse } from "next/server";
import deputadosJson from "@/lib/data/deputados.json";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uf = searchParams.get("uf");

  let deputados = deputadosJson;

  if (uf) {
    deputados = deputados.filter((d) => d.siglaUf === uf.toUpperCase());
  }

  const normalizados = deputados.map((d) => ({
    id: d.id,
    name: d.nome,
    party: d.siglaPartido,
    state: d.siglaUf,
    role: "Deputado Federal",
    image: d.urlFoto,
  }));

  const res = NextResponse.json({ dados: normalizados });
  res.headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  return res;
}
