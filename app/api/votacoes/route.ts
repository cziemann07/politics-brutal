import { NextResponse } from "next/server";
import { listVotacoes } from "@/lib";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dataInicio = searchParams.get("dataInicio") || undefined;
    const dataFim = searchParams.get("dataFim") || undefined;
    const itens = searchParams.get("itens") ? parseInt(searchParams.get("itens")!) : 30;
    const pagina = searchParams.get("pagina") ? parseInt(searchParams.get("pagina")!) : undefined;

    const votacoes = await listVotacoes({
      dataInicio,
      dataFim,
      itens,
      pagina,
      ordem: "DESC",
    });

    // Normaliza para o formato do FRONT, filtrando apenas votações do Plenário
    const normalizadas = votacoes
      .filter((v) => v.siglaOrgao === "PLEN") // Apenas votações do plenário
      .map((v) => ({
        id: v.id,
        data: v.data,
        dataHoraRegistro: v.dataHoraRegistro,
        orgao: v.siglaOrgao,
        proposicao: v.proposicaoObjeto,
        descricao: v.descricao,
        aprovado: v.aprovacao === 1,
        // Extrai números de votos da descrição se disponível
        votos: extrairVotosDaDescricao(v.descricao),
      }));

    const res = NextResponse.json({ dados: normalizadas });
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res;
  } catch (e: any) {
    console.error("Erro ao buscar votações:", e);
    return NextResponse.json(
      {
        error: "Falha ao buscar votações",
        detail: String(e?.message ?? e),
      },
      { status: 500 }
    );
  }
}

// Helper para extrair votos da descrição
function extrairVotosDaDescricao(descricao: string): { sim: number; nao: number; total: number } | null {
  // Padrão: "Sim: 330; Não: 104; Total: 434"
  const simMatch = descricao.match(/Sim:\s*(\d+)/i);
  const naoMatch = descricao.match(/Não:\s*(\d+)/i);
  const totalMatch = descricao.match(/Total:\s*(\d+)/i);

  if (simMatch && naoMatch) {
    return {
      sim: parseInt(simMatch[1]),
      nao: parseInt(naoMatch[1]),
      total: totalMatch ? parseInt(totalMatch[1]) : parseInt(simMatch[1]) + parseInt(naoMatch[1]),
    };
  }

  return null;
}
