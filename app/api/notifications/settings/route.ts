import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getNotificationSettings,
  upsertNotificationSettings,
} from "@/lib/notifications";

// Cliente Supabase para verificar autenticação
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * GET /api/notifications/settings
 * 
 * Busca configurações de notificação do usuário autenticado.
 */
export async function GET(request: NextRequest) {
  try {
    // Verifica autenticação
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Busca configurações
    const settings = await getNotificationSettings(user.id);

    // Se não existir, retorna defaults
    if (!settings) {
      return NextResponse.json({
        success: true,
        settings: {
          user_id: user.id,
          email_enabled: true,
          email_address: user.email,
          whatsapp_enabled: false,
          whatsapp_number: null,
          push_enabled: false,
          notify_absences: true,
          notify_expenses_above_limit: true,
          notify_suspicious_expenses: true,
          notify_votes_against_values: true,
          notify_scandals: true,
          notify_weekly_digest: true,
          notification_frequency: "realtime",
          preferred_time: "09:00:00",
          timezone: "America/Sao_Paulo",
        },
        isDefault: true,
      });
    }

    return NextResponse.json({
      success: true,
      settings,
      isDefault: false,
    });
  } catch (error) {
    console.error("[Notifications Settings] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications/settings
 * 
 * Atualiza configurações de notificação do usuário.
 */
export async function PUT(request: NextRequest) {
  try {
    // Verifica autenticação
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Pega body da requisição
    const body = await request.json();

    // Campos permitidos para atualização
    const allowedFields = [
      "email_enabled",
      "email_address",
      "whatsapp_enabled",
      "whatsapp_number",
      "push_enabled",
      "notify_absences",
      "notify_expenses_above_limit",
      "notify_suspicious_expenses",
      "notify_votes_against_values",
      "notify_scandals",
      "notify_weekly_digest",
      "notification_frequency",
      "preferred_time",
      "timezone",
    ];

    // Filtra apenas campos permitidos
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    // Salva configurações
    const settings = await upsertNotificationSettings(user.id, updateData);

    if (!settings) {
      return NextResponse.json(
        { error: "Erro ao salvar configurações" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("[Notifications Settings] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao salvar configurações", details: String(error) },
      { status: 500 }
    );
  }
}

