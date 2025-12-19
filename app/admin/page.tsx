"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  Crown,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface UserData {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_premium: boolean;
  subscription_plan: "gratuito" | "basico" | "pro";
  subscription_expires_at: string | null;
  created_at: string;
}

interface Metrics {
  totalUsers: number;
  premiumUsers: number;
  basicUsers: number;
  proUsers: number;
  adminUsers: number;
  revenueMonthly: number;
  newUsersThisMonth: number;
}

const PLAN_PRICES = {
  gratuito: 0,
  basico: 0.99,
  pro: 3.99,
};

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "payments">("overview");

  // Verifica se é admin
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Carrega dados
  useEffect(() => {
    if (user?.isAdmin) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);

    if (!isSupabaseConfigured()) {
      // Dados mock para desenvolvimento
      setUsers([
        {
          id: "1",
          email: "admin@example.com",
          display_name: "Admin User",
          avatar_url: null,
          is_admin: true,
          is_premium: true,
          subscription_plan: "pro",
          subscription_expires_at: null,
          created_at: new Date().toISOString(),
        },
      ]);
      setMetrics({
        totalUsers: 1,
        premiumUsers: 1,
        basicUsers: 0,
        proUsers: 1,
        adminUsers: 1,
        revenueMonthly: 0,
        newUsersThisMonth: 1,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Busca usuários
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;

      const typedUsers = (usersData || []) as UserData[];
      setUsers(typedUsers);

      // Calcula métricas
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const totalUsers = typedUsers.length;
      const adminUsers = typedUsers.filter((u) => u.is_admin).length;
      const basicUsers = typedUsers.filter((u) => u.subscription_plan === "basico").length;
      const proUsers = typedUsers.filter((u) => u.subscription_plan === "pro").length;
      const premiumUsers = basicUsers + proUsers;
      const newUsersThisMonth = typedUsers.filter(
        (u) => new Date(u.created_at) >= startOfMonth
      ).length;

      // Receita mensal estimada
      const revenueMonthly = basicUsers * PLAN_PRICES.basico + proUsers * PLAN_PRICES.pro;

      setMetrics({
        totalUsers,
        premiumUsers,
        basicUsers,
        proUsers,
        adminUsers,
        revenueMonthly,
        newUsersThisMonth,
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<UserData>) => {
    if (!isSupabaseConfigured()) {
      alert("Supabase não configurado");
      return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

      if (error) throw error;

      // Atualiza lista local
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
      );

      alert("Usuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário");
    }
  };

  const toggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    if (userId === user?.id) {
      alert("Você não pode remover seu próprio acesso admin!");
      return;
    }
    await updateUser(userId, { is_admin: !currentIsAdmin });
  };

  const changePlan = async (userId: string, newPlan: "gratuito" | "basico" | "pro") => {
    const expiresAt =
      newPlan === "gratuito"
        ? null
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 dias

    await updateUser(userId, {
      subscription_plan: newPlan,
      subscription_expires_at: expiresAt,
      is_premium: newPlan !== "gratuito",
    });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading ou não autorizado
  if (authLoading || !user?.isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brutal-bg dark:bg-brutal-dark-bg">
        <div className="text-center">
          <Shield size={48} className="mx-auto mb-4 text-brutal-red" />
          <h1 className="text-2xl font-black mb-2 dark:text-brutal-dark-text">
            Acesso Restrito
          </h1>
          <p className="text-gray-600 dark:text-brutal-dark-muted mb-4">
            Esta página é apenas para administradores.
          </p>
          <Link href="/" className="btn-brutal bg-black text-white">
            Voltar ao Início
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brutal-bg dark:bg-brutal-dark-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-brutal-dark-muted hover:text-black dark:hover:text-white mb-4"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-brutal-red p-2 border-2 border-black">
                  <Shield size={28} className="text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black uppercase dark:text-brutal-dark-text">
                  Painel Admin
                </h1>
              </div>
              <p className="text-gray-600 dark:text-brutal-dark-muted">
                Gerencie usuários e visualize métricas do sistema
              </p>
            </div>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="btn-brutal bg-white dark:bg-brutal-dark-surface flex items-center gap-2"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
              Atualizar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "overview" as const, label: "Visão Geral", icon: BarChart3 },
            { id: "users" as const, label: "Usuários", icon: Users },
            { id: "payments" as const, label: "Pagamentos", icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm uppercase border-3 transition-all ${
                  activeTab === tab.id
                    ? "bg-brutal-red text-white border-brutal-red"
                    : "bg-white dark:bg-brutal-dark-surface text-black dark:text-brutal-dark-text border-black dark:border-brutal-dark-border hover:bg-gray-100 dark:hover:bg-brutal-dark-bg"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && metrics && (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={20} className="text-brutal-blue" />
                    <span className="text-sm font-bold uppercase text-gray-600 dark:text-brutal-dark-muted">
                      Total Usuários
                    </span>
                  </div>
                  <p className="text-3xl font-black dark:text-brutal-dark-text">
                    {metrics.totalUsers}
                  </p>
                </div>

                <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown size={20} className="text-brutal-yellow" />
                    <span className="text-sm font-bold uppercase text-gray-600 dark:text-brutal-dark-muted">
                      Assinantes
                    </span>
                  </div>
                  <p className="text-3xl font-black dark:text-brutal-dark-text">
                    {metrics.premiumUsers}
                  </p>
                  <p className="text-xs text-gray-500">
                    {metrics.basicUsers} básico · {metrics.proUsers} pro
                  </p>
                </div>

                <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign size={20} className="text-green-500" />
                    <span className="text-sm font-bold uppercase text-gray-600 dark:text-brutal-dark-muted">
                      Receita/Mês
                    </span>
                  </div>
                  <p className="text-3xl font-black text-green-600">
                    R$ {metrics.revenueMonthly.toFixed(2).replace(".", ",")}
                  </p>
                </div>

                <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp size={20} className="text-purple-500" />
                    <span className="text-sm font-bold uppercase text-gray-600 dark:text-brutal-dark-muted">
                      Novos (Mês)
                    </span>
                  </div>
                  <p className="text-3xl font-black dark:text-brutal-dark-text">
                    {metrics.newUsersThisMonth}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card-brutal bg-black text-white p-6">
                <h3 className="font-black text-xl mb-4">Distribuição de Planos</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border-2 border-white/20">
                    <p className="text-3xl font-black text-gray-400">
                      {metrics.totalUsers - metrics.premiumUsers}
                    </p>
                    <p className="text-sm font-bold uppercase">Gratuito</p>
                  </div>
                  <div className="text-center p-4 border-2 border-brutal-blue">
                    <p className="text-3xl font-black text-brutal-blue">
                      {metrics.basicUsers}
                    </p>
                    <p className="text-sm font-bold uppercase">Vigilante (R$0,99)</p>
                  </div>
                  <div className="text-center p-4 border-2 border-brutal-yellow">
                    <p className="text-3xl font-black text-brutal-yellow">
                      {metrics.proUsers}
                    </p>
                    <p className="text-sm font-bold uppercase">PRO (R$3,99)</p>
                  </div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-6">
                <h3 className="font-black text-xl mb-4 dark:text-brutal-dark-text">
                  Últimos Usuários Cadastrados
                </h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3 border-2 border-black dark:border-brutal-dark-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-brutal-dark-bg rounded-full overflow-hidden flex items-center justify-center">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Users size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold dark:text-brutal-dark-text">
                            {u.display_name || "Sem nome"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">
                            {u.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {u.is_admin && (
                          <span className="px-2 py-1 bg-brutal-red text-white text-xs font-bold">
                            ADMIN
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-bold ${
                            u.subscription_plan === "pro"
                              ? "bg-brutal-yellow text-black"
                              : u.subscription_plan === "basico"
                                ? "bg-brutal-blue text-white"
                                : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {u.subscription_plan.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <>
              {/* Search */}
              <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-4">
                <div className="flex items-center gap-3">
                  <Search size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por email ou nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none font-bold dark:text-brutal-dark-text"
                  />
                </div>
              </div>

              {/* Users List */}
              <div className="card-brutal bg-white dark:bg-brutal-dark-surface overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-black uppercase">
                          Usuário
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-black uppercase">
                          Plano
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-black uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-black uppercase">
                          Cadastro
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-black uppercase">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-brutal-dark-border">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-brutal-dark-bg">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 dark:bg-brutal-dark-bg rounded-full overflow-hidden flex items-center justify-center">
                                {u.avatar_url ? (
                                  <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Users size={16} className="text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-sm dark:text-brutal-dark-text">
                                  {u.display_name || "Sem nome"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">
                                  {u.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={u.subscription_plan}
                              onChange={(e) =>
                                changePlan(u.id, e.target.value as "gratuito" | "basico" | "pro")
                              }
                              className={`px-2 py-1 text-xs font-bold border-2 border-black cursor-pointer ${
                                u.subscription_plan === "pro"
                                  ? "bg-brutal-yellow text-black"
                                  : u.subscription_plan === "basico"
                                    ? "bg-brutal-blue text-white"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <option value="gratuito">Gratuito</option>
                              <option value="basico">Vigilante</option>
                              <option value="pro">PRO</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {u.is_admin && (
                                <span className="px-2 py-1 bg-brutal-red text-white text-xs font-bold">
                                  ADMIN
                                </span>
                              )}
                              {u.subscription_expires_at && (
                                <span className="text-xs text-gray-500 dark:text-brutal-dark-muted">
                                  Expira:{" "}
                                  {new Date(u.subscription_expires_at).toLocaleDateString("pt-BR")}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-brutal-dark-muted">
                            {new Date(u.created_at).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleAdmin(u.id, u.is_admin)}
                                className={`p-2 border-2 transition-colors ${
                                  u.is_admin
                                    ? "border-brutal-red text-brutal-red hover:bg-brutal-red hover:text-white"
                                    : "border-gray-300 text-gray-400 hover:border-brutal-red hover:text-brutal-red"
                                }`}
                                title={u.is_admin ? "Remover admin" : "Tornar admin"}
                              >
                                <Shield size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 dark:text-brutal-dark-muted">
                      Nenhum usuário encontrado
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-6">
              <div className="text-center py-12">
                <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-black text-xl mb-2 dark:text-brutal-dark-text">
                  Em Desenvolvimento
                </h3>
                <p className="text-gray-500 dark:text-brutal-dark-muted">
                  O histórico de pagamentos estará disponível em breve.
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  Quando integrado com gateway de pagamento, mostrará todas as transações PIX.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-brutal-dark-muted">
          <p>
            Painel de Administração · Politics Brutal · Apenas para administradores autorizados
          </p>
        </div>
      </div>
    </main>
  );
}
