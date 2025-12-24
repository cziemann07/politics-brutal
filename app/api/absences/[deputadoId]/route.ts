import { NextRequest, NextResponse } from "next/server";
import { getDeputyAbsences } from "@/lib/notifications";
import { getEstatisticasPresenca, listDeputies } from "@/lib/camara";

/**
 * GET /api/absences/[deputadoId]
 * 
 * Busca histórico de faltas de um deputado específico.
 * 
 * Query params:
 * - limit: número máximo de faltas (default: 50)
 * - days: período em dias para estatísticas (default: 90)
 * - fresh: se true, busca dados frescos da API (default: false)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deputadoId: string }> }
) {
  const { deputadoId: deputadoIdStr } = await params;
  const deputadoId = parseInt(deputadoIdStr, 10);

  if (isNaN(deputadoId)) {
    return NextResponse.json(
      { error: "deputadoId inválido" },
      { status: 400 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const days = parseInt(searchParams.get("days") || "90", 10);
  const fresh = searchParams.get("fresh") === "true";

  try {
    // Busca dados do deputado
    const deputados = await listDeputies({ emExercicio: true });
    const deputado = deputados.find((d) => d.id === deputadoId);

    if (!deputado) {
      return NextResponse.json(
        { error: "Deputado não encontrado" },
        { status: 404 }
      );
    }

    // Busca faltas do banco de dados
    const faltasSalvas = await getDeputyAbsences(deputadoId, limit);

    // Calcula datas para estatísticas
    const dataFim = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - days);

    let estatisticas = null;

    // Se solicitado dados frescos ou não há dados salvos, busca da API
    if (fresh || faltasSalvas.length === 0) {
      estatisticas = await getEstatisticasPresenca({
        deputadoId,
        dataInicio: dataInicio.toISOString().split("T")[0],
        dataFim: dataFim.toISOString().split("T")[0],
      });
    } else {
      // Calcula estatísticas a partir dos dados salvos
      const faltasNoPeriodo = faltasSalvas.filter((f) => {
        const dataFalta = new Date(f.evento_data);
        return dataFalta >= dataInicio && dataFalta <= dataFim;
      });

      estatisticas = {
        totalVotacoes: faltasNoPeriodo.length, // Aproximado
        presencas: 0, // Não temos essa info nos dados salvos
        ausencias: faltasNoPeriodo.length,
        percentualPresenca: 0, // Será calculado no frontend
        ultimasVotacoes: [],
      };
    }

    return NextResponse.json({
      success: true,
      deputado: {
        id: deputado.id,
        nome: deputado.nome,
        partido: deputado.siglaPartido,
        uf: deputado.siglaUf,
        foto: deputado.urlFoto,
      },
      periodo: {
        inicio: dataInicio.toISOString(),
        fim: dataFim.toISOString(),
        dias: days,
      },
      estatisticas,
      faltas: faltasSalvas,
    });
  } catch (error) {
    console.error(`[Absences] Erro ao buscar faltas do deputado ${deputadoId}:`, error);
    return NextResponse.json(
      { error: "Erro ao buscar faltas", details: String(error) },
      { status: 500 }
    );
  }
}

