import { NextResponse } from "next/server";
import { getVotacaoCompleta } from "@/lib";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID da votação é obrigatório" },
        { status: 400 }
      );
    }

    const votacao = await getVotacaoCompleta(id);

    if (!votacao) {
      return NextResponse.json(
        { error: "Votação não encontrada" },
        { status: 404 }
      );
    }

    // Normaliza votos por partido
    const votosPorPartido: Record<string, { sim: number; nao: number; abstencao: number; obstrucao: number; total: number }> = {};

    for (const voto of votacao.votos) {
      const partido = voto.deputado_.siglaPartido;
      if (!votosPorPartido[partido]) {
        votosPorPartido[partido] = { sim: 0, nao: 0, abstencao: 0, obstrucao: 0, total: 0 };
      }

      votosPorPartido[partido].total++;

      switch (voto.tipoVoto) {
        case "Sim":
          votosPorPartido[partido].sim++;
          break;
        case "Não":
          votosPorPartido[partido].nao++;
          break;
        case "Abstenção":
          votosPorPartido[partido].abstencao++;
          break;
        case "Obstrução":
          votosPorPartido[partido].obstrucao++;
          break;
      }
    }

    // Ordena partidos por total de votos
    const partidosOrdenados = Object.entries(votosPorPartido)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([partido, votos]) => ({ partido, ...votos }));

    const res = NextResponse.json({
      dados: {
        id: votacao.id,
        data: votacao.data,
        dataHoraRegistro: votacao.dataHoraRegistro,
        orgao: votacao.siglaOrgao,
        proposicao: votacao.proposicaoObjeto,
        descricao: votacao.descricao,
        aprovado: votacao.aprovacao === 1,
        resumo: votacao.resumo,
        votosPorPartido: partidosOrdenados,
        votosIndividuais: votacao.votos.map(v => ({
          tipoVoto: v.tipoVoto,
          deputado: {
            id: v.deputado_.id,
            nome: v.deputado_.nome,
            partido: v.deputado_.siglaPartido,
            uf: v.deputado_.siglaUf,
            foto: v.deputado_.urlFoto,
          }
        })),
      }
    });

    res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res;
  } catch (e: any) {
    console.error("Erro ao buscar detalhes da votação:", e);
    return NextResponse.json(
      {
        error: "Falha ao buscar detalhes da votação",
        detail: String(e?.message ?? e),
      },
      { status: 500 }
    );
  }
}
