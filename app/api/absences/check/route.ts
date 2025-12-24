import { NextRequest, NextResponse } from "next/server";
import {
  listVotacoes,
  getVotacaoVotos,
  listDeputies,
  type VotacaoBasic,
} from "@/lib/camara";
import {
  registerAbsence,
  getUsersFollowingDeputy,
  createNotification,
  generateAbsenceMessage,
} from "@/lib/notifications";
import { sendEmail, getAbsenceEmailTemplate } from "@/lib/email";

// Configuração
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * GET /api/absences/check
 * 
 * Verifica faltas em votações recentes e notifica usuários.
 * Deve ser chamado periodicamente via cron job.
 * 
 * Query params:
 * - days: número de dias para verificar (default: 1)
 * - notify: se deve enviar notificações (default: true)
 */
export async function GET(request: NextRequest) {
  // Verifica autenticação para cron jobs
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get("days") || "1", 10);
  const shouldNotify = searchParams.get("notify") !== "false";

  try {
    console.log(`[Absences Check] Verificando faltas dos últimos ${days} dias...`);

    // Calcula datas
    const dataFim = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - days);

    // Busca votações recentes
    const votacoes = await listVotacoes({
      dataInicio: dataInicio.toISOString().split("T")[0],
      dataFim: dataFim.toISOString().split("T")[0],
      itens: 50,
    });

    console.log(`[Absences Check] Encontradas ${votacoes.length} votações`);

    // Busca todos os deputados em exercício
    const todosDeputados = await listDeputies({ emExercicio: true });
    const deputadosMap = new Map(todosDeputados.map((d) => [d.id, d]));

    const results = {
      votacoesAnalisadas: 0,
      faltasRegistradas: 0,
      notificacoesEnviadas: 0,
      erros: [] as string[],
    };

    // Para cada votação, verifica quem faltou
    for (const votacao of votacoes) {
      try {
        results.votacoesAnalisadas++;

        // Busca votos desta votação
        const votos = await getVotacaoVotos(votacao.id);
        const idsQueVotaram = new Set(votos.map((v) => v.deputado_.id));

        // Identifica ausentes
        const ausentes = todosDeputados.filter((d) => !idsQueVotaram.has(d.id));

        console.log(
          `[Absences Check] Votação ${votacao.id}: ${ausentes.length} ausentes de ${todosDeputados.length} deputados`
        );

        // Registra cada falta e notifica
        for (const deputado of ausentes) {
          // Registra a falta no banco
          const absence = await registerAbsence({
            deputado_id: deputado.id,
            deputado_nome: deputado.nome,
            evento_id: parseInt(votacao.id),
            evento_tipo: "votacao",
            evento_titulo: `Votação ${votacao.siglaOrgao}`,
            evento_data: votacao.dataHoraRegistro,
            evento_orgao: votacao.siglaOrgao,
            votacao_id: votacao.id,
            votacao_descricao: votacao.descricao,
          });

          if (absence) {
            results.faltasRegistradas++;

            // Se deve notificar, busca usuários que seguem este deputado
            if (shouldNotify) {
              const seguidores = await getUsersFollowingDeputy(deputado.id);

              for (const seguidor of seguidores) {
                if (!seguidor.email_enabled || !seguidor.notify_absences) {
                  continue;
                }

                // Cria notificação no banco
                const { title, message } = generateAbsenceMessage({
                  deputado_nome: deputado.nome,
                  evento_tipo: "votacao",
                  evento_titulo: votacao.descricao,
                  evento_data: votacao.dataHoraRegistro,
                  votacao_descricao: votacao.descricao,
                });

                await createNotification({
                  user_id: seguidor.user_id,
                  type: "absence",
                  title,
                  message,
                  data: {
                    votacao_id: votacao.id,
                    votacao_descricao: votacao.descricao,
                  },
                  deputado_id: deputado.id,
                  deputado_nome: deputado.nome,
                });

                // Envia e-mail
                const { html, text } = getAbsenceEmailTemplate({
                  userName: seguidor.email.split("@")[0],
                  deputadoNome: deputado.nome,
                  deputadoPartido: deputado.siglaPartido,
                  deputadoUf: deputado.siglaUf,
                  deputadoFoto: deputado.urlFoto,
                  eventoTipo: "votacao",
                  eventoTitulo: votacao.descricao,
                  eventoData: votacao.dataHoraRegistro,
                  votacaoDescricao: votacao.descricao,
                  linkPerfil: `${BASE_URL}/politico/${deputado.id}`,
                });

                const emailResult = await sendEmail({
                  to: seguidor.email,
                  subject: title,
                  html,
                  text,
                });

                if (emailResult.success) {
                  results.notificacoesEnviadas++;
                }
              }
            }
          }
        }

        // Pequeno delay para não sobrecarregar a API
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Erro ao processar votação ${votacao.id}:`, error);
        results.erros.push(`Votação ${votacao.id}: ${String(error)}`);
      }
    }

    console.log(`[Absences Check] Concluído:`, results);

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error("[Absences Check] Erro geral:", error);
    return NextResponse.json(
      { error: "Erro ao verificar faltas", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/absences/check
 * 
 * Verifica faltas para um deputado específico.
 * Body: { deputadoId: number, days?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deputadoId, days = 30 } = body;

    if (!deputadoId) {
      return NextResponse.json(
        { error: "deputadoId é obrigatório" },
        { status: 400 }
      );
    }

    console.log(`[Absences Check] Verificando faltas do deputado ${deputadoId}...`);

    // Calcula datas
    const dataFim = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - days);

    // Busca votações recentes
    const votacoes = await listVotacoes({
      dataInicio: dataInicio.toISOString().split("T")[0],
      dataFim: dataFim.toISOString().split("T")[0],
      itens: 100,
    });

    const resultado: {
      votacao: VotacaoBasic;
      presente: boolean;
      tipoVoto: string | null;
    }[] = [];

    let faltasRegistradas = 0;

    for (const votacao of votacoes) {
      const votos = await getVotacaoVotos(votacao.id);
      const votoDeputado = votos.find((v) => v.deputado_.id === deputadoId);

      const presente = !!votoDeputado;
      resultado.push({
        votacao,
        presente,
        tipoVoto: votoDeputado?.tipoVoto ?? null,
      });

      // Se não estava presente, registra a falta
      if (!presente) {
        const deputados = await listDeputies({ emExercicio: true });
        const deputado = deputados.find((d) => d.id === deputadoId);

        if (deputado) {
          await registerAbsence({
            deputado_id: deputado.id,
            deputado_nome: deputado.nome,
            evento_id: parseInt(votacao.id),
            evento_tipo: "votacao",
            evento_titulo: votacao.descricao,
            evento_data: votacao.dataHoraRegistro,
            evento_orgao: votacao.siglaOrgao,
            votacao_id: votacao.id,
            votacao_descricao: votacao.descricao,
          });
          faltasRegistradas++;
        }
      }

      // Pequeno delay
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const presencas = resultado.filter((r) => r.presente).length;
    const ausencias = resultado.filter((r) => !r.presente).length;
    const percentualPresenca =
      resultado.length > 0
        ? Math.round((presencas / resultado.length) * 100)
        : 100;

    return NextResponse.json({
      success: true,
      deputadoId,
      periodo: {
        inicio: dataInicio.toISOString(),
        fim: dataFim.toISOString(),
      },
      estatisticas: {
        totalVotacoes: resultado.length,
        presencas,
        ausencias,
        percentualPresenca,
        faltasRegistradas,
      },
      votacoes: resultado.slice(0, 20), // Retorna apenas as 20 mais recentes
    });
  } catch (error) {
    console.error("[Absences Check] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao verificar faltas", details: String(error) },
      { status: 500 }
    );
  }
}

