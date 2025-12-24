import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  countUnreadNotifications,
} from "@/lib/notifications";

// Cliente Supabase para verificar autenticação
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * GET /api/notifications
 * 
 * Lista notificações do usuário autenticado.
 * 
 * Query params:
 * - status: filtrar por status (pending, sent, read)
 * - limit: número máximo de resultados (default: 20)
 * - offset: offset para paginação
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

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as "pending" | "sent" | "read" | null;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Busca notificações
    const notifications = await getUserNotifications(user.id, {
      status: status || undefined,
      limit,
      offset,
    });

    // Conta não lidas
    const unreadCount = await countUnreadNotifications(user.id);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        limit,
        offset,
        hasMore: notifications.length === limit,
      },
    });
  } catch (error) {
    console.error("[Notifications] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar notificações", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications
 * 
 * Marca notificações como lidas.
 * 
 * Body:
 * - notificationId: ID da notificação (opcional)
 * - markAll: se true, marca todas como lidas
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

    const body = await request.json();
    const { notificationId, markAll } = body;

    let success = false;

    if (markAll) {
      success = await markAllNotificationsAsRead(user.id);
    } else if (notificationId) {
      success = await markNotificationAsRead(notificationId);
    } else {
      return NextResponse.json(
        { error: "notificationId ou markAll é obrigatório" },
        { status: 400 }
      );
    }

    if (!success) {
      return NextResponse.json(
        { error: "Erro ao atualizar notificação" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Notifications] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar notificação", details: String(error) },
      { status: 500 }
    );
  }
}

