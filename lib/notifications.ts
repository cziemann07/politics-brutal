import { supabase, isSupabaseConfigured } from "./supabase";

// ========== TIPOS ==========

export type NotificationType =
  | "absence"
  | "expense_above_limit"
  | "suspicious_expense"
  | "vote_against_values"
  | "scandal"
  | "weekly_digest"
  | "system";

export type NotificationChannel = "email" | "whatsapp" | "push" | "in_app";

export type NotificationStatus = "pending" | "sent" | "failed" | "read";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  deputado_id?: number;
  deputado_nome?: string;
  status: NotificationStatus;
  channel: NotificationChannel;
  scheduled_for: string;
  sent_at?: string;
  read_at?: string;
  error_message?: string;
  created_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  email_enabled: boolean;
  email_address?: string;
  whatsapp_enabled: boolean;
  whatsapp_number?: string;
  push_enabled: boolean;
  notify_absences: boolean;
  notify_expenses_above_limit: boolean;
  notify_suspicious_expenses: boolean;
  notify_votes_against_values: boolean;
  notify_scandals: boolean;
  notify_weekly_digest: boolean;
  notification_frequency: "realtime" | "daily" | "weekly";
  preferred_time: string;
  timezone: string;
}

export interface FollowedDeputy {
  id: string;
  user_id: string;
  deputado_id: number;
  deputado_nome: string;
  deputado_partido?: string;
  deputado_uf?: string;
  deputado_foto_url?: string;
  notify_enabled: boolean;
  created_at: string;
}

export interface DeputyAbsence {
  id: string;
  deputado_id: number;
  deputado_nome: string;
  evento_id?: number;
  evento_tipo: string;
  evento_titulo?: string;
  evento_data: string;
  evento_orgao?: string;
  justificada: boolean;
  justificativa?: string;
  votacao_id?: string;
  votacao_descricao?: string;
  created_at: string;
}

// ========== FUNÇÕES DE CONFIGURAÇÃO ==========

/**
 * Busca configurações de notificação do usuário
 */
export async function getNotificationSettings(userId: string): Promise<NotificationSettings | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from("user_notification_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    console.error("Erro ao buscar configurações:", error);
    return null;
  }

  return data;
}

/**
 * Cria ou atualiza configurações de notificação
 */
export async function upsertNotificationSettings(
  userId: string,
  settings: Partial<NotificationSettings>
): Promise<NotificationSettings | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from("user_notification_settings")
    .upsert(
      {
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar configurações:", error);
    return null;
  }

  return data;
}

// ========== FUNÇÕES DE DEPUTADOS SEGUIDOS ==========

/**
 * Lista deputados seguidos pelo usuário
 */
export async function getFollowedDeputies(userId: string): Promise<FollowedDeputy[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from("user_followed_deputies")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar deputados seguidos:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Segue um deputado
 */
export async function followDeputy(
  userId: string,
  deputy: {
    id: number;
    nome: string;
    partido?: string;
    uf?: string;
    urlFoto?: string;
  }
): Promise<FollowedDeputy | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from("user_followed_deputies")
    .upsert(
      {
        user_id: userId,
        deputado_id: deputy.id,
        deputado_nome: deputy.nome,
        deputado_partido: deputy.partido,
        deputado_uf: deputy.uf,
        deputado_foto_url: deputy.urlFoto,
        notify_enabled: true,
      },
      { onConflict: "user_id,deputado_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Erro ao seguir deputado:", error);
    return null;
  }

  return data;
}

/**
 * Deixa de seguir um deputado
 */
export async function unfollowDeputy(userId: string, deputadoId: number): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const { error } = await supabase
    .from("user_followed_deputies")
    .delete()
    .eq("user_id", userId)
    .eq("deputado_id", deputadoId);

  if (error) {
    console.error("Erro ao deixar de seguir deputado:", error);
    return false;
  }

  return true;
}

/**
 * Busca usuários que seguem um deputado específico
 */
export async function getUsersFollowingDeputy(deputadoId: number): Promise<
  Array<{
    user_id: string;
    email: string;
    notify_absences: boolean;
    notify_expenses_above_limit: boolean;
    email_enabled: boolean;
  }>
> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase.rpc("get_users_following_deputy", {
    p_deputado_id: deputadoId,
  });

  if (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }

  return data ?? [];
}

// ========== FUNÇÕES DE FALTAS ==========

/**
 * Registra uma falta de deputado
 */
export async function registerAbsence(absence: {
  deputado_id: number;
  deputado_nome: string;
  evento_id?: number;
  evento_tipo: string;
  evento_titulo?: string;
  evento_data: string;
  evento_orgao?: string;
  votacao_id?: string;
  votacao_descricao?: string;
}): Promise<DeputyAbsence | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from("deputy_absences")
    .upsert(
      {
        deputado_id: absence.deputado_id,
        deputado_nome: absence.deputado_nome,
        evento_id: absence.evento_id,
        evento_tipo: absence.evento_tipo,
        evento_titulo: absence.evento_titulo,
        evento_data: absence.evento_data,
        evento_orgao: absence.evento_orgao,
        votacao_id: absence.votacao_id,
        votacao_descricao: absence.votacao_descricao,
      },
      { onConflict: "deputado_id,evento_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Erro ao registrar falta:", error);
    return null;
  }

  return data;
}

/**
 * Busca faltas de um deputado
 */
export async function getDeputyAbsences(
  deputadoId: number,
  limit = 50
): Promise<DeputyAbsence[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from("deputy_absences")
    .select("*")
    .eq("deputado_id", deputadoId)
    .order("evento_data", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Erro ao buscar faltas:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Busca faltas recentes de deputados seguidos por um usuário
 */
export async function getRecentAbsencesForUser(userId: string, days = 7): Promise<DeputyAbsence[]> {
  if (!isSupabaseConfigured()) return [];

  // Primeiro, busca os IDs dos deputados seguidos
  const followed = await getFollowedDeputies(userId);
  if (followed.length === 0) return [];

  const deputadoIds = followed.map((f) => f.deputado_id);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("deputy_absences")
    .select("*")
    .in("deputado_id", deputadoIds)
    .gte("evento_data", startDate.toISOString())
    .order("evento_data", { ascending: false });

  if (error) {
    console.error("Erro ao buscar faltas recentes:", error);
    return [];
  }

  return data ?? [];
}

// ========== FUNÇÕES DE NOTIFICAÇÕES ==========

/**
 * Cria uma notificação
 */
export async function createNotification(notification: {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  deputado_id?: number;
  deputado_nome?: string;
  channel?: NotificationChannel;
  scheduled_for?: string;
}): Promise<Notification | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      deputado_id: notification.deputado_id,
      deputado_nome: notification.deputado_nome,
      channel: notification.channel ?? "email",
      scheduled_for: notification.scheduled_for ?? new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar notificação:", error);
    return null;
  }

  // Adiciona à fila
  if (data) {
    await supabase.from("notification_queue").insert({
      notification_id: data.id,
    });
  }

  return data;
}

/**
 * Busca notificações do usuário
 */
export async function getUserNotifications(
  userId: string,
  options?: {
    status?: NotificationStatus;
    limit?: number;
    offset?: number;
  }
): Promise<Notification[]> {
  if (!isSupabaseConfigured()) return [];

  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit ?? 20) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar notificações:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Marca notificação como lida
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const { error } = await supabase
    .from("notifications")
    .update({
      status: "read",
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId);

  if (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return false;
  }

  return true;
}

/**
 * Marca todas as notificações do usuário como lidas
 */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const { error } = await supabase
    .from("notifications")
    .update({
      status: "read",
      read_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("status", "sent");

  if (error) {
    console.error("Erro ao marcar notificações como lidas:", error);
    return false;
  }

  return true;
}

/**
 * Conta notificações não lidas
 */
export async function countUnreadNotifications(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("status", ["sent", "pending"]);

  if (error) {
    console.error("Erro ao contar notificações:", error);
    return 0;
  }

  return count ?? 0;
}

// ========== HELPERS ==========

/**
 * Gera mensagem de notificação para falta
 */
export function generateAbsenceMessage(absence: {
  deputado_nome: string;
  evento_tipo: string;
  evento_titulo?: string;
  evento_data: string;
  votacao_descricao?: string;
}): { title: string; message: string } {
  const dataFormatada = new Date(absence.evento_data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let title = `${absence.deputado_nome} faltou`;
  let message = "";

  if (absence.evento_tipo === "votacao") {
    title = `${absence.deputado_nome} faltou em votação`;
    message = `O deputado ${absence.deputado_nome} não compareceu à votação`;
    if (absence.votacao_descricao) {
      message += ` sobre "${absence.votacao_descricao}"`;
    }
    message += ` em ${dataFormatada}.`;
  } else if (absence.evento_tipo === "sessao") {
    title = `${absence.deputado_nome} faltou em sessão`;
    message = `O deputado ${absence.deputado_nome} não compareceu à sessão`;
    if (absence.evento_titulo) {
      message += ` "${absence.evento_titulo}"`;
    }
    message += ` em ${dataFormatada}.`;
  } else {
    message = `O deputado ${absence.deputado_nome} não compareceu ao evento`;
    if (absence.evento_titulo) {
      message += ` "${absence.evento_titulo}"`;
    }
    message += ` em ${dataFormatada}.`;
  }

  return { title, message };
}

/**
 * Gera mensagem de notificação para gasto acima do teto
 */
export function generateExpenseAlertMessage(data: {
  deputado_nome: string;
  mes: number;
  ano: number;
  total_gasto: number;
  teto: number;
  percentual: number;
}): { title: string; message: string } {
  const mesNome = new Date(data.ano, data.mes - 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const title = `${data.deputado_nome} gastou ${data.percentual.toFixed(0)}% do teto CEAP`;
  const message = `Em ${mesNome}, o deputado ${data.deputado_nome} gastou ${formatCurrency(data.total_gasto)} (teto: ${formatCurrency(data.teto)}). Isso representa ${data.percentual.toFixed(1)}% do limite permitido.`;

  return { title, message };
}

