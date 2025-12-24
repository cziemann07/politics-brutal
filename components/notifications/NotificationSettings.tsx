"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  MessageCircle,
  AlertTriangle,
  TrendingUp,
  Vote,
  Calendar,
  Clock,
  Save,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NotificationSettingsData {
  email_enabled: boolean;
  email_address?: string;
  whatsapp_enabled: boolean;
  whatsapp_number?: string;
  notify_absences: boolean;
  notify_expenses_above_limit: boolean;
  notify_suspicious_expenses: boolean;
  notify_votes_against_values: boolean;
  notify_scandals: boolean;
  notify_weekly_digest: boolean;
  notification_frequency: "realtime" | "daily" | "weekly";
  preferred_time: string;
}

const defaultSettings: NotificationSettingsData = {
  email_enabled: true,
  notify_absences: true,
  notify_expenses_above_limit: true,
  notify_suspicious_expenses: true,
  notify_votes_against_values: true,
  notify_scandals: true,
  notify_weekly_digest: true,
  notification_frequency: "realtime",
  preferred_time: "09:00",
  whatsapp_enabled: false,
};

export default function NotificationSettings() {
  const { user, session } = useAuth();
  const [settings, setSettings] = useState<NotificationSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega configurações
  useEffect(() => {
    async function loadSettings() {
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/notifications/settings", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings({
              ...defaultSettings,
              ...data.settings,
              email_address: data.settings.email_address || user?.email || "",
            });
          }
        }
      } catch (err) {
        console.error("Erro ao carregar configurações:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [session?.access_token, user?.email]);

  // Salva configurações
  async function handleSave() {
    if (!session?.access_token) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/notifications/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao salvar");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  // Toggle helper
  function toggle(key: keyof NotificationSettingsData) {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 dark:text-brutal-dark-muted">
          Faça login para configurar notificações
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
        <p className="text-sm text-gray-500 mt-2">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Canais de Notificação */}
      <div>
        <h3 className="font-black text-lg mb-4 flex items-center gap-2 dark:text-brutal-dark-text">
          <Mail size={20} />
          Canais de Notificação
        </h3>

        <div className="space-y-4">
          {/* E-mail */}
          <div className="p-4 border-3 border-black dark:border-brutal-dark-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brutal-blue" />
                <div>
                  <h4 className="font-bold dark:text-brutal-dark-text">E-mail</h4>
                  <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">
                    Receba alertas por e-mail
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggle("email_enabled")}
                className={`w-14 h-7 border-2 border-black dark:border-brutal-dark-border transition-colors relative flex items-center ${
                  settings.email_enabled
                    ? "bg-green-500"
                    : "bg-gray-200 dark:bg-brutal-dark-bg"
                }`}
              >
                <span
                  className={`w-5 h-5 bg-white border-2 border-black dark:border-brutal-dark-border transition-all ${
                    settings.email_enabled ? "ml-auto mr-0.5" : "ml-0.5"
                  }`}
                />
              </button>
            </div>

            {settings.email_enabled && (
              <input
                type="email"
                value={settings.email_address || ""}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, email_address: e.target.value }))
                }
                placeholder="seu@email.com"
                className="w-full p-2 border-2 border-black dark:border-brutal-dark-border dark:bg-brutal-dark-bg dark:text-brutal-dark-text"
              />
            )}
          </div>

          {/* WhatsApp (em breve) */}
          <div className="p-4 border-3 border-black dark:border-brutal-dark-border opacity-60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div>
                  <h4 className="font-bold dark:text-brutal-dark-text">
                    WhatsApp
                    <span className="ml-2 text-xs bg-brutal-yellow px-2 py-0.5 text-black">
                      EM BREVE
                    </span>
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">
                    Receba alertas pelo WhatsApp
                  </p>
                </div>
              </div>
              <button
                disabled
                className="w-14 h-7 border-2 border-gray-300 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de Notificação */}
      <div>
        <h3 className="font-black text-lg mb-4 flex items-center gap-2 dark:text-brutal-dark-text">
          <Bell size={20} />
          Tipos de Alerta
        </h3>

        <div className="space-y-3">
          {[
            {
              key: "notify_absences" as const,
              icon: Vote,
              label: "Faltas em Votações",
              desc: "Quando o deputado não comparecer a uma votação",
              color: "text-red-500",
            },
            {
              key: "notify_expenses_above_limit" as const,
              icon: TrendingUp,
              label: "Gastos Acima do Teto",
              desc: "Quando o deputado gastar mais que o teto CEAP",
              color: "text-orange-500",
            },
            {
              key: "notify_suspicious_expenses" as const,
              icon: AlertTriangle,
              label: "Gastos Suspeitos",
              desc: "Padrões de gasto incomuns ou suspeitos",
              color: "text-yellow-600",
            },
            {
              key: "notify_votes_against_values" as const,
              icon: Vote,
              label: "Votos Contra Seus Valores",
              desc: "Quando o deputado votar contra seu perfil político",
              color: "text-purple-500",
            },
            {
              key: "notify_scandals" as const,
              icon: AlertTriangle,
              label: "Escândalos e Investigações",
              desc: "Envolvimento em escândalos ou investigações",
              color: "text-brutal-red",
            },
            {
              key: "notify_weekly_digest" as const,
              icon: Calendar,
              label: "Resumo Semanal",
              desc: "Relatório semanal com atividades dos deputados",
              color: "text-brutal-blue",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 border-2 border-black dark:border-brutal-dark-border"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <div>
                    <h4 className="font-bold text-sm dark:text-brutal-dark-text">
                      {item.label}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(item.key)}
                  className={`w-12 h-6 border-2 border-black dark:border-brutal-dark-border transition-colors relative flex items-center ${
                    settings[item.key]
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-brutal-dark-bg"
                  }`}
                >
                  <span
                    className={`w-4 h-4 bg-white border border-black dark:border-brutal-dark-border transition-all ${
                      settings[item.key] ? "ml-auto mr-0.5" : "ml-0.5"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frequência */}
      <div>
        <h3 className="font-black text-lg mb-4 flex items-center gap-2 dark:text-brutal-dark-text">
          <Clock size={20} />
          Frequência
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "realtime" as const, label: "Tempo Real" },
            { value: "daily" as const, label: "Diário" },
            { value: "weekly" as const, label: "Semanal" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  notification_frequency: option.value,
                }))
              }
              className={`p-3 border-2 font-bold text-sm transition-all ${
                settings.notification_frequency === option.value
                  ? "bg-black dark:bg-brutal-dark-accent text-white border-black dark:border-brutal-dark-accent"
                  : "bg-white dark:bg-brutal-dark-surface text-black dark:text-brutal-dark-text border-black dark:border-brutal-dark-border hover:bg-gray-100 dark:hover:bg-brutal-dark-bg"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {settings.notification_frequency !== "realtime" && (
          <div className="mt-3">
            <label className="block text-sm font-bold mb-1 dark:text-brutal-dark-text">
              Horário preferido
            </label>
            <input
              type="time"
              value={settings.preferred_time}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, preferred_time: e.target.value }))
              }
              className="p-2 border-2 border-black dark:border-brutal-dark-border dark:bg-brutal-dark-bg dark:text-brutal-dark-text"
            />
          </div>
        )}
      </div>

      {/* Botão Salvar */}
      <div className="pt-4 border-t-3 border-black dark:border-brutal-dark-border">
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className={`btn-brutal w-full flex items-center justify-center gap-2 ${
            saved
              ? "bg-green-500 text-white"
              : "bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white"
          }`}
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Salvando...
            </>
          ) : saved ? (
            <>
              <CheckCircle size={18} />
              Salvo!
            </>
          ) : (
            <>
              <Save size={18} />
              Salvar Configurações
            </>
          )}
        </button>
      </div>
    </div>
  );
}

