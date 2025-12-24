"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Vote,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Check,
  CheckCheck,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  deputado_id?: number;
  deputado_nome?: string;
  status: string;
  created_at: string;
  read_at?: string;
}

const typeIcons: Record<string, typeof Bell> = {
  absence: Vote,
  expense_above_limit: TrendingUp,
  suspicious_expense: AlertTriangle,
  vote_against_values: Vote,
  scandal: AlertTriangle,
  weekly_digest: Calendar,
  system: Bell,
};

const typeColors: Record<string, string> = {
  absence: "text-red-500 bg-red-100 dark:bg-red-900/20",
  expense_above_limit: "text-orange-500 bg-orange-100 dark:bg-orange-900/20",
  suspicious_expense: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20",
  vote_against_values: "text-purple-500 bg-purple-100 dark:bg-purple-900/20",
  scandal: "text-brutal-red bg-red-100 dark:bg-red-900/20",
  weekly_digest: "text-brutal-blue bg-blue-100 dark:bg-blue-900/20",
  system: "text-gray-500 bg-gray-100 dark:bg-gray-900/20",
};

export default function NotificationsList() {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Carrega notificações
  useEffect(() => {
    async function loadNotifications() {
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/notifications?limit=50", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error("Erro ao carregar notificações:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [session?.access_token]);

  // Marca como lida
  async function markAsRead(notificationId: string) {
    if (!session?.access_token) return;

    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, status: "read", read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Erro ao marcar como lida:", err);
    }
  }

  // Marca todas como lidas
  async function markAllAsRead() {
    if (!session?.access_token) return;

    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ markAll: true }),
      });

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "read", read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
    }
  }

  // Formata data
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
        <p className="text-sm text-gray-500 mt-2">Carregando notificações...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-16 h-16 mx-auto text-gray-300 dark:text-brutal-dark-muted mb-4" />
        <h3 className="font-black text-xl mb-2 dark:text-brutal-dark-text">
          Nenhuma notificação
        </h3>
        <p className="text-gray-600 dark:text-brutal-dark-muted">
          Você receberá alertas aqui quando algo importante acontecer
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-lg dark:text-brutal-dark-text">
          Notificações
          {unreadCount > 0 && (
            <span className="ml-2 text-sm bg-brutal-red text-white px-2 py-0.5">
              {unreadCount} não lidas
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-brutal-blue hover:underline flex items-center gap-1"
          >
            <CheckCheck size={14} />
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {notifications.map((notification) => {
          const Icon = typeIcons[notification.type] || Bell;
          const colorClass = typeColors[notification.type] || typeColors.system;
          const isUnread = notification.status !== "read";

          return (
            <div
              key={notification.id}
              className={`p-4 border-2 transition-all ${
                isUnread
                  ? "border-black dark:border-brutal-dark-accent bg-white dark:bg-brutal-dark-surface"
                  : "border-gray-200 dark:border-brutal-dark-border bg-gray-50 dark:bg-brutal-dark-bg"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${colorClass}`}
                >
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`font-bold text-sm ${
                        isUnread
                          ? "dark:text-brutal-dark-text"
                          : "text-gray-600 dark:text-brutal-dark-muted"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>

                  <p
                    className={`text-sm mt-1 ${
                      isUnread
                        ? "text-gray-700 dark:text-brutal-dark-text"
                        : "text-gray-500 dark:text-brutal-dark-muted"
                    }`}
                  >
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    {notification.deputado_id && (
                      <Link
                        href={`/politico/${notification.deputado_id}`}
                        className="text-xs text-brutal-blue hover:underline flex items-center gap-1"
                      >
                        Ver perfil
                        <ExternalLink size={12} />
                      </Link>
                    )}

                    {isUnread && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1"
                      >
                        <Check size={12} />
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

