"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Bell,
  TrendingUp,
  AlertCircle,
  Clock,
  ChevronRight,
  Crown,
  Lock,
  Search,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock data - será substituído por dados do Supabase
const mockFollowedDeputies = [
  {
    id: 204554,
    nome: "Nikolas Ferreira",
    partido: "PL",
    uf: "MG",
    foto: "https://www.camara.leg.br/internet/deputado/bandep/204554.jpg",
    ultimaAtividade: "Votou SIM no PL 1234/2025",
    ultimaAtividadeData: "2026-01-03",
  },
];

const mockRecentActivity = [
  {
    id: 1,
    type: "vote",
    deputado: "Nikolas Ferreira",
    action: "votou SIM",
    subject: "PL 1234/2025 - Reforma Tributária",
    date: "2026-01-03T14:30:00",
  },
  {
    id: 2,
    type: "expense",
    deputado: "Nikolas Ferreira",
    action: "gastou R$ 8.500",
    subject: "em combustível (CEAP)",
    date: "2026-01-02T10:00:00",
  },
  {
    id: 3,
    type: "absence",
    deputado: "Nikolas Ferreira",
    action: "faltou",
    subject: "à sessão deliberativa",
    date: "2026-01-01T09:00:00",
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "Agora há pouco";
  if (hours < 24) return `Há ${hours}h`;
  if (hours < 48) return "Ontem";

  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
}

function getActivityIcon(type: string) {
  switch (type) {
    case "vote":
      return <TrendingUp size={16} className="text-radar-info" />;
    case "expense":
      return <AlertCircle size={16} className="text-radar-warning" />;
    case "absence":
      return <Clock size={16} className="text-radar-error" />;
    default:
      return <Bell size={16} className="text-radar-muted" />;
  }
}

export default function FiscalizePage() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isPremium = user?.isPremium || false;

  // Limites por plano
  const planLimits = {
    gratuito: 1,
    basico: 3,
    pro: 15,
  };

  const currentPlan = user?.subscriptionPlan || "gratuito";
  const maxDeputies = planLimits[currentPlan as keyof typeof planLimits] || 1;
  const followedCount = mockFollowedDeputies.length;

  return (
    <div className="min-h-screen bg-radar-bg dark:bg-radar-dark-bg">
      <div className="container-main py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-headline-lg text-radar-text dark:text-radar-dark-text mb-2">
              Fiscalize
            </h1>
            <p className="text-body-md text-radar-muted dark:text-radar-dark-muted">
              Acompanhe seus deputados e receba alertas sobre suas atividades
            </p>
          </div>

          {isLoggedIn && (
            <div className="flex items-center gap-3">
              <span className="text-body-sm text-radar-muted">
                {followedCount}/{maxDeputies} parlamentares
              </span>
              {currentPlan !== "pro" && (
                <Link href="/planos" className="badge-accent flex items-center gap-1">
                  <Crown size={14} />
                  Upgrade
                </Link>
              )}
            </div>
          )}
        </div>

        {!isLoggedIn ? (
          /* Estado deslogado */
          <div className="card p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-radar-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-radar-secondary" />
            </div>
            <h2 className="text-headline-md text-radar-text dark:text-radar-dark-text mb-4">
              Crie sua conta para começar
            </h2>
            <p className="text-body-md text-radar-muted dark:text-radar-dark-muted max-w-lg mx-auto mb-6">
              Com uma conta gratuita você pode acompanhar 1 deputado e receber alertas
              sobre votações, gastos e ausências.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth" className="btn-primary px-8">
                Criar conta grátis
              </Link>
              <Link href="/fiscalize/deputados" className="btn-secondary px-8">
                Explorar deputados
              </Link>
            </div>
          </div>
        ) : (
          /* Estado logado */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Coluna principal - Deputados seguidos */}
            <div className="lg:col-span-2 space-y-6">
              {/* Seus Parlamentares */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-headline-sm text-radar-text dark:text-radar-dark-text">
                    Seus Parlamentares
                  </h2>
                  {followedCount < maxDeputies && (
                    <Link
                      href="/fiscalize/deputados"
                      className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
                    >
                      <Plus size={16} />
                      Adicionar
                    </Link>
                  )}
                </div>

                {mockFollowedDeputies.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-radar-bg dark:bg-radar-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users size={32} className="text-radar-muted" />
                    </div>
                    <p className="text-radar-muted dark:text-radar-dark-muted mb-4">
                      Você ainda não está acompanhando nenhum deputado
                    </p>
                    <Link href="/fiscalize/deputados" className="btn-outline px-6">
                      Escolher deputado
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockFollowedDeputies.map((dep) => (
                      <Link
                        key={dep.id}
                        href={`/fiscalize/deputado/${dep.id}`}
                        className="flex items-center gap-4 p-4 bg-radar-bg dark:bg-radar-dark-bg rounded-lg hover:bg-radar-border dark:hover:bg-radar-dark-border transition-colors"
                      >
                        <img
                          src={dep.foto}
                          alt={dep.nome}
                          className="w-14 h-14 rounded-full object-cover border-2 border-radar-border dark:border-radar-dark-border"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-radar-text dark:text-radar-dark-text">
                            {dep.nome}
                          </h3>
                          <p className="text-body-sm text-radar-muted">
                            {dep.partido} - {dep.uf}
                          </p>
                          <p className="text-caption mt-1">
                            {dep.ultimaAtividade}
                          </p>
                        </div>
                        <ChevronRight size={20} className="text-radar-muted" />
                      </Link>
                    ))}

                    {/* Slots vazios (se houver) */}
                    {followedCount < maxDeputies && (
                      <Link
                        href="/fiscalize/deputados"
                        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-radar-border dark:border-radar-dark-border rounded-lg text-radar-muted hover:text-radar-secondary hover:border-radar-secondary transition-colors"
                      >
                        <Plus size={20} />
                        <span className="font-medium">Adicionar deputado</span>
                      </Link>
                    )}

                    {/* Slots bloqueados (se atingiu o limite do plano) */}
                    {currentPlan !== "pro" && followedCount >= maxDeputies && (
                      <div className="flex items-center justify-between p-4 bg-radar-accent/5 border border-radar-accent/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Lock size={20} className="text-radar-accent" />
                          <span className="text-body-sm text-radar-text dark:text-radar-dark-text">
                            Quer acompanhar mais deputados?
                          </span>
                        </div>
                        <Link href="/planos" className="badge-accent">
                          Ver planos
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Atividade Recente */}
              <div className="card p-6">
                <h2 className="text-headline-sm text-radar-text dark:text-radar-dark-text mb-6">
                  Atividade Recente
                </h2>

                {mockRecentActivity.length === 0 ? (
                  <p className="text-center text-radar-muted py-8">
                    Nenhuma atividade recente
                  </p>
                ) : (
                  <div className="space-y-4">
                    {mockRecentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-radar-bg dark:hover:bg-radar-dark-bg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-radar-bg dark:bg-radar-dark-bg flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-body-sm text-radar-text dark:text-radar-dark-text">
                            <span className="font-semibold">{activity.deputado}</span>{" "}
                            {activity.action}{" "}
                            <span className="text-radar-muted">{activity.subject}</span>
                          </p>
                          <span className="text-caption">
                            {formatDate(activity.date)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Seu Plano */}
              <div className="card p-6">
                <h3 className="text-headline-sm text-radar-text dark:text-radar-dark-text mb-4">
                  Seu Plano
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    currentPlan === "pro"
                      ? "bg-radar-accent/10"
                      : currentPlan === "basico"
                        ? "bg-radar-success/10"
                        : "bg-radar-muted/10"
                  }`}>
                    <Crown size={20} className={
                      currentPlan === "pro"
                        ? "text-radar-accent"
                        : currentPlan === "basico"
                          ? "text-radar-success"
                          : "text-radar-muted"
                    } />
                  </div>
                  <div>
                    <p className="font-semibold text-radar-text dark:text-radar-dark-text capitalize">
                      {currentPlan === "gratuito" ? "Gratuito" : currentPlan === "basico" ? "Básico" : "Pro"}
                    </p>
                    <p className="text-caption">
                      {maxDeputies} {maxDeputies === 1 ? "deputado" : "deputados"}
                    </p>
                  </div>
                </div>

                {currentPlan !== "pro" && (
                  <Link href="/planos" className="btn-outline w-full justify-center">
                    Fazer upgrade
                  </Link>
                )}
              </div>

              {/* Links Rápidos */}
              <div className="card p-6">
                <h3 className="text-headline-sm text-radar-text dark:text-radar-dark-text mb-4">
                  Explorar
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/fiscalize/deputados"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-radar-bg dark:hover:bg-radar-dark-bg transition-colors"
                  >
                    <Users size={18} className="text-radar-secondary" />
                    <span className="text-body-sm font-medium">Todos os Deputados</span>
                  </Link>
                  <Link
                    href="/fiscalize/votacoes"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-radar-bg dark:hover:bg-radar-dark-bg transition-colors"
                  >
                    <TrendingUp size={18} className="text-radar-accent" />
                    <span className="text-body-sm font-medium">Votações Recentes</span>
                  </Link>
                  <Link
                    href="/investigacoes"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-radar-bg dark:hover:bg-radar-dark-bg transition-colors"
                  >
                    <AlertCircle size={18} className="text-radar-warning" />
                    <span className="text-body-sm font-medium">Dossiês</span>
                  </Link>
                </div>
              </div>

              {/* Notificações */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-headline-sm text-radar-text dark:text-radar-dark-text">
                    Notificações
                  </h3>
                  <Link href="/perfil#notificacoes" className="link text-body-sm">
                    Configurar
                  </Link>
                </div>
                <div className="flex items-center gap-3 p-3 bg-radar-bg dark:bg-radar-dark-bg rounded-lg">
                  <Bell size={18} className="text-radar-muted" />
                  <span className="text-body-sm text-radar-muted">
                    {isPremium ? "Notificações ativas" : "Disponível no plano Básico"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
