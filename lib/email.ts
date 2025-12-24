// Serviço de envio de e-mails
// Usa Resend para envio de e-mails transacionais

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "Política Sem Filtro <noreply@politicasemfiltro.com.br>";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Envia um e-mail usando Resend
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY não configurada. E-mail não enviado.");
    return { success: false, error: "API key não configurada" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Erro ao enviar e-mail:", error);
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return { success: false, error: String(error) };
  }
}

// ========== TEMPLATES DE E-MAIL ==========

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; background-color: white; }
  .header { background-color: #000; color: white; padding: 24px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
  .content { padding: 32px 24px; }
  .alert-box { border: 3px solid #000; padding: 20px; margin: 20px 0; }
  .alert-box.warning { background-color: #FEF3C7; border-color: #F59E0B; }
  .alert-box.danger { background-color: #FEE2E2; border-color: #EF4444; }
  .alert-box.info { background-color: #DBEAFE; border-color: #3B82F6; }
  .deputy-card { display: flex; align-items: center; gap: 16px; padding: 16px; border: 2px solid #000; margin: 16px 0; background: #f9f9f9; }
  .deputy-photo { width: 64px; height: 64px; border-radius: 50%; border: 2px solid #000; }
  .deputy-info h3 { margin: 0 0 4px 0; font-weight: 900; }
  .deputy-info p { margin: 0; color: #666; font-size: 14px; }
  .btn { display: inline-block; background-color: #FACC15; color: #000; padding: 12px 24px; text-decoration: none; font-weight: 700; text-transform: uppercase; border: 3px solid #000; margin-top: 16px; }
  .btn:hover { background-color: #000; color: #FACC15; }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
  .stat-box { text-align: center; padding: 16px; border: 2px solid #000; }
  .stat-box .value { font-size: 28px; font-weight: 900; display: block; }
  .stat-box .label { font-size: 11px; text-transform: uppercase; color: #666; }
  .footer { background-color: #f5f5f5; padding: 24px; text-align: center; font-size: 12px; color: #666; border-top: 2px solid #000; }
  .footer a { color: #000; }
`;

/**
 * Template de e-mail para notificação de falta
 */
export function getAbsenceEmailTemplate(data: {
  userName: string;
  deputadoNome: string;
  deputadoPartido: string;
  deputadoUf: string;
  deputadoFoto?: string;
  eventoTipo: string;
  eventoTitulo?: string;
  eventoData: string;
  votacaoDescricao?: string;
  totalFaltasRecentes?: number;
  linkPerfil: string;
}): { html: string; text: string } {
  const dataFormatada = new Date(data.eventoData).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const tipoEvento = data.eventoTipo === "votacao" ? "votação" : data.eventoTipo === "sessao" ? "sessão" : "evento";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta de Falta - Política Sem Filtro</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 Alerta de Falta</h1>
    </div>
    
    <div class="content">
      <p>Olá <strong>${data.userName}</strong>,</p>
      
      <div class="alert-box warning">
        <strong>O deputado que você segue faltou!</strong>
      </div>
      
      <div class="deputy-card">
        ${data.deputadoFoto ? `<img src="${data.deputadoFoto}" alt="${data.deputadoNome}" class="deputy-photo">` : ""}
        <div class="deputy-info">
          <h3>${data.deputadoNome}</h3>
          <p>${data.deputadoPartido} · ${data.deputadoUf}</p>
        </div>
      </div>
      
      <h2>Detalhes da Falta</h2>
      <ul>
        <li><strong>Tipo:</strong> ${tipoEvento.charAt(0).toUpperCase() + tipoEvento.slice(1)}</li>
        ${data.eventoTitulo ? `<li><strong>Evento:</strong> ${data.eventoTitulo}</li>` : ""}
        ${data.votacaoDescricao ? `<li><strong>Votação:</strong> ${data.votacaoDescricao}</li>` : ""}
        <li><strong>Data:</strong> ${dataFormatada}</li>
      </ul>
      
      ${
        data.totalFaltasRecentes
          ? `
      <div class="alert-box info">
        <strong>Atenção:</strong> Este deputado já teve <strong>${data.totalFaltasRecentes} faltas</strong> nos últimos 30 dias.
      </div>
      `
          : ""
      }
      
      <a href="${data.linkPerfil}" class="btn">Ver Perfil Completo</a>
    </div>
    
    <div class="footer">
      <p>Você está recebendo este e-mail porque segue este deputado no Política Sem Filtro.</p>
      <p><a href="https://politicasemfiltro.com.br/perfil#notificacoes">Gerenciar notificações</a></p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
ALERTA DE FALTA - POLÍTICA SEM FILTRO

Olá ${data.userName},

O deputado que você segue faltou!

DEPUTADO: ${data.deputadoNome} (${data.deputadoPartido} - ${data.deputadoUf})

DETALHES:
- Tipo: ${tipoEvento}
${data.eventoTitulo ? `- Evento: ${data.eventoTitulo}` : ""}
${data.votacaoDescricao ? `- Votação: ${data.votacaoDescricao}` : ""}
- Data: ${dataFormatada}

${data.totalFaltasRecentes ? `ATENÇÃO: Este deputado já teve ${data.totalFaltasRecentes} faltas nos últimos 30 dias.` : ""}

Ver perfil completo: ${data.linkPerfil}

---
Você está recebendo este e-mail porque segue este deputado no Política Sem Filtro.
Gerenciar notificações: https://politicasemfiltro.com.br/perfil#notificacoes
`;

  return { html, text };
}

/**
 * Template de e-mail para alerta de gastos
 */
export function getExpenseAlertEmailTemplate(data: {
  userName: string;
  deputadoNome: string;
  deputadoPartido: string;
  deputadoUf: string;
  deputadoFoto?: string;
  mes: number;
  ano: number;
  totalGasto: number;
  tetoCeap: number;
  percentualTeto: number;
  alertType: "above_limit" | "near_limit" | "spike";
  linkPerfil: string;
}): { html: string; text: string } {
  const mesNome = new Date(data.ano, data.mes - 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const alertClass = data.alertType === "above_limit" ? "danger" : "warning";
  const alertTitle =
    data.alertType === "above_limit"
      ? "⚠️ ACIMA DO TETO!"
      : data.alertType === "near_limit"
        ? "⚡ Próximo do Teto"
        : "📈 Aumento Significativo";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta de Gastos - Política Sem Filtro</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 Alerta de Gastos</h1>
    </div>
    
    <div class="content">
      <p>Olá <strong>${data.userName}</strong>,</p>
      
      <div class="alert-box ${alertClass}">
        <strong>${alertTitle}</strong>
        <p style="margin: 8px 0 0 0;">
          ${data.deputadoNome} gastou <strong>${data.percentualTeto.toFixed(0)}%</strong> do teto CEAP em ${mesNome}.
        </p>
      </div>
      
      <div class="deputy-card">
        ${data.deputadoFoto ? `<img src="${data.deputadoFoto}" alt="${data.deputadoNome}" class="deputy-photo">` : ""}
        <div class="deputy-info">
          <h3>${data.deputadoNome}</h3>
          <p>${data.deputadoPartido} · ${data.deputadoUf}</p>
        </div>
      </div>
      
      <div class="stats">
        <div class="stat-box" style="background: ${data.percentualTeto > 100 ? "#FEE2E2" : "#DBEAFE"};">
          <span class="value">${formatCurrency(data.totalGasto)}</span>
          <span class="label">Total Gasto</span>
        </div>
        <div class="stat-box">
          <span class="value">${formatCurrency(data.tetoCeap)}</span>
          <span class="label">Teto CEAP</span>
        </div>
        <div class="stat-box" style="background: ${data.percentualTeto > 100 ? "#FEE2E2" : data.percentualTeto > 90 ? "#FEF3C7" : "#D1FAE5"};">
          <span class="value">${data.percentualTeto.toFixed(0)}%</span>
          <span class="label">do Limite</span>
        </div>
      </div>
      
      <a href="${data.linkPerfil}" class="btn">Ver Detalhes dos Gastos</a>
    </div>
    
    <div class="footer">
      <p>Você está recebendo este e-mail porque segue este deputado no Política Sem Filtro.</p>
      <p><a href="https://politicasemfiltro.com.br/perfil#notificacoes">Gerenciar notificações</a></p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
ALERTA DE GASTOS - POLÍTICA SEM FILTRO

Olá ${data.userName},

${alertTitle}
${data.deputadoNome} gastou ${data.percentualTeto.toFixed(0)}% do teto CEAP em ${mesNome}.

DEPUTADO: ${data.deputadoNome} (${data.deputadoPartido} - ${data.deputadoUf})

VALORES:
- Total Gasto: ${formatCurrency(data.totalGasto)}
- Teto CEAP: ${formatCurrency(data.tetoCeap)}
- Percentual: ${data.percentualTeto.toFixed(0)}%

Ver detalhes: ${data.linkPerfil}

---
Você está recebendo este e-mail porque segue este deputado no Política Sem Filtro.
Gerenciar notificações: https://politicasemfiltro.com.br/perfil#notificacoes
`;

  return { html, text };
}

/**
 * Template de e-mail para resumo semanal
 */
export function getWeeklyDigestEmailTemplate(data: {
  userName: string;
  deputados: Array<{
    nome: string;
    partido: string;
    uf: string;
    foto?: string;
    faltas: number;
    gastoMes: number;
    percentualTeto: number;
  }>;
  periodo: { inicio: string; fim: string };
  linkPerfil: string;
}): { html: string; text: string } {
  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const deputadosHtml = data.deputados
    .map(
      (d) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${d.nome}</strong><br>
        <span style="color: #666; font-size: 12px;">${d.partido} · ${d.uf}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
        <span style="color: ${d.faltas > 0 ? "#EF4444" : "#10B981"}; font-weight: bold;">
          ${d.faltas}
        </span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        ${formatCurrency(d.gastoMes)}<br>
        <span style="font-size: 11px; color: ${d.percentualTeto > 100 ? "#EF4444" : d.percentualTeto > 90 ? "#F59E0B" : "#10B981"};">
          ${d.percentualTeto.toFixed(0)}% do teto
        </span>
      </td>
    </tr>
  `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resumo Semanal - Política Sem Filtro</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Resumo Semanal</h1>
    </div>
    
    <div class="content">
      <p>Olá <strong>${data.userName}</strong>,</p>
      
      <p>Aqui está o resumo da semana dos deputados que você acompanha:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #000;">Deputado</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #000;">Faltas</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #000;">Gastos (mês)</th>
          </tr>
        </thead>
        <tbody>
          ${deputadosHtml}
        </tbody>
      </table>
      
      <a href="${data.linkPerfil}" class="btn">Ver Todos os Detalhes</a>
    </div>
    
    <div class="footer">
      <p>Resumo do período: ${data.periodo.inicio} a ${data.periodo.fim}</p>
      <p><a href="https://politicasemfiltro.com.br/perfil#notificacoes">Gerenciar notificações</a></p>
    </div>
  </div>
</body>
</html>
`;

  const deputadosText = data.deputados
    .map(
      (d) =>
        `- ${d.nome} (${d.partido}-${d.uf}): ${d.faltas} faltas | ${formatCurrency(d.gastoMes)} (${d.percentualTeto.toFixed(0)}% do teto)`
    )
    .join("\n");

  const text = `
RESUMO SEMANAL - POLÍTICA SEM FILTRO

Olá ${data.userName},

Aqui está o resumo da semana dos deputados que você acompanha:

${deputadosText}

Ver todos os detalhes: ${data.linkPerfil}

---
Resumo do período: ${data.periodo.inicio} a ${data.periodo.fim}
Gerenciar notificações: https://politicasemfiltro.com.br/perfil#notificacoes
`;

  return { html, text };
}

