import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Inicializa Supabase com service role para operações admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// POST - Registra um novo pagamento pendente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId, txId, amount } = body;

    if (!userId || !planId || !txId || !amount) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // Verifica se Supabase está configurado
    if (!supabaseUrl || !supabaseServiceKey) {
      // Em desenvolvimento, simula sucesso
      return NextResponse.json({
        success: true,
        payment: {
          id: txId,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Registra o pagamento
    const { data, error } = await supabase
      .from("payments")
      .insert({
        user_id: userId,
        tx_id: txId,
        plan_id: planId,
        amount: amount,
        status: "pending",
        payment_method: "pix",
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao registrar pagamento:", error);
      return NextResponse.json(
        { error: "Erro ao registrar pagamento" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: data,
    });
  } catch (error) {
    console.error("Erro na API de pagamentos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Verifica status de um pagamento
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txId = searchParams.get("txId");

    if (!txId) {
      return NextResponse.json(
        { error: "txId não fornecido" },
        { status: 400 }
      );
    }

    // Verifica se Supabase está configurado
    if (!supabaseUrl || !supabaseServiceKey) {
      // Em desenvolvimento, simula verificação
      // 30% de chance de estar pago (para testes)
      const isPaid = Math.random() < 0.3;
      return NextResponse.json({
        txId,
        status: isPaid ? "confirmed" : "pending",
        message: isPaid ? "Pagamento confirmado!" : "Aguardando pagamento...",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Busca o pagamento
    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("tx_id", txId)
      .single();

    if (error || !payment) {
      return NextResponse.json({
        txId,
        status: "not_found",
        message: "Pagamento não encontrado",
      });
    }

    // Se estiver confirmado, ativa o plano do usuário
    if (payment.status === "confirmed" && payment.user_id) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

      await supabase
        .from("users")
        .update({
          subscription_plan: payment.plan_id,
          subscription_expires_at: expiresAt.toISOString(),
          subscription_pix_id: payment.tx_id,
          is_premium: true,
        })
        .eq("id", payment.user_id);
    }

    return NextResponse.json({
      txId,
      status: payment.status,
      planId: payment.plan_id,
      amount: payment.amount,
      confirmedAt: payment.confirmed_at,
      message:
        payment.status === "confirmed"
          ? "Pagamento confirmado!"
          : "Aguardando pagamento...",
    });
  } catch (error) {
    console.error("Erro na verificação de pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PATCH - Atualiza status de um pagamento (webhook ou admin)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { txId, status, adminKey } = body;

    // Validação básica de admin (em produção, use autenticação real)
    const expectedAdminKey = process.env.ADMIN_API_KEY || "admin-secret-key";
    if (adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    if (!txId || !status) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // Verifica se Supabase está configurado
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: true,
        message: "Status atualizado (simulação)",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Atualiza o pagamento
    const { data: payment, error } = await supabase
      .from("payments")
      .update({
        status,
        confirmed_at: status === "confirmed" ? new Date().toISOString() : null,
      })
      .eq("tx_id", txId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar pagamento:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar pagamento" },
        { status: 500 }
      );
    }

    // Se confirmado, ativa o plano do usuário
    if (status === "confirmed" && payment.user_id) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await supabase
        .from("users")
        .update({
          subscription_plan: payment.plan_id,
          subscription_expires_at: expiresAt.toISOString(),
          subscription_pix_id: payment.tx_id,
          is_premium: true,
        })
        .eq("id", payment.user_id);
    }

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Erro ao atualizar pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
