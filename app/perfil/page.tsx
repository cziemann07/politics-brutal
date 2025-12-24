"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Heart,
  Bell,
  Settings,
  Crown,
  Trash2,
  ExternalLink,
  Check,
  X,
  MessageCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Shield,
  BellRing,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PixPayment from "@/components/payment/PixPayment";
import { NotificationSettings, NotificationsList } from "@/components/notifications";

interface DeputadoFavorito {
  id: number;
  nome: string;
  partido: string;
  estado: string;
  urlFoto: string;
}

// Definição dos planos
type PlanType = "gratuito" | "basico" | "pro";

interface PlanInfo {
  id: PlanType;
  name: string;
  price: number;
  priceLabel: string;
  deputados: number;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  color: string;
}

const PLANOS: PlanInfo[] = [
  {
    id: "gratuito",
    name: "Gratuito",
    price: 0,
    priceLabel: "R$ 0",
    deputados: 1,
    features: [
      "Acesso a todos os dados públicos",
      "1 deputado favorito",
      "Visualização de gastos e votações",
    ],
    notIncluded: [
      "Notificações de gastos suspeitos",
      "Mensagens pré-montadas",
      "Mais deputados favoritos",
    ],
    color: "gray",
  },
  {
    id: "basico",
    name: "Vigilante",
    price: 0.99,
    priceLabel: "R$ 0,99",
    deputados: 3,
    features: [
      "Tudo do plano gratuito",
      "Até 3 deputados favoritos",
      "Alertas básicos de gastos",
      "Suporte da comunidade",
    ],
    color: "blue",
  },
  {
    id: "pro",
    name: "Vigilante PRO",
    price: 3.99,
    priceLabel: "R$ 3,99",
    deputados: 15,
    features: [
      "Tudo do plano Vigilante",
      "Até 15 deputados favoritos",
      "Notificações de gastos suspeitos",
      "Mensagens pré-montadas para redes",
      "Alertas em tempo real",
      "Suporte prioritário",
    ],
    popular: true,
    color: "yellow",
  },
];

export default function PerfilPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [favoritos, setFavoritos] = useState<DeputadoFavorito[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PlanType>("gratuito");
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [activeTab, setActiveTab] = useState("favoritos");
  const [notificacoesView, setNotificacoesView] = useState<"alertas" | "config">("alertas");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PlanInfo | null>(null);

  // Determina se o usuário é admin (tem acesso total)
  const isAdmin = user?.isAdmin || false;

  // Determina se o usuário é premium e qual plano
  // Admin sempre é premium
  const effectivePlan = isAdmin ? "pro" : (user?.subscriptionPlan || currentPlan);
  const isPremium = isAdmin || effectivePlan !== "gratuito";
  const currentPlanInfo = PLANOS.find(p => p.id === effectivePlan) || PLANOS[0];

  // Carregar favoritos e configurações
  useEffect(() => {
    const saved = localStorage.getItem("deputados-favoritos");
    if (saved) {
      try {
        setFavoritos(JSON.parse(saved));
      } catch {
        setFavoritos([]);
      }
    }

    // Carregar plano salvo
    const savedPlan = localStorage.getItem("vigilante-plan") as PlanType | null;
    if (savedPlan && ["gratuito", "basico", "pro"].includes(savedPlan)) {
      setCurrentPlan(savedPlan);
    } else {
      // Compatibilidade com versão antiga
      const premiumStatus = localStorage.getItem("vigilante-premium");
      if (premiumStatus === "true") {
        setCurrentPlan("pro");
      }
    }

    const notifStatus = localStorage.getItem("notificacoes-ativas");
    setNotificacoesAtivas(notifStatus !== "false");

    // Verificar hash para scroll
    if (window.location.hash) {
      const tab = window.location.hash.replace("#", "");
      if (["favoritos", "notificacoes", "configuracoes", "premium"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  const removerFavorito = (id: number) => {
    const novosFavoritos = favoritos.filter((f) => f.id !== id);
    setFavoritos(novosFavoritos);
    localStorage.setItem("deputados-favoritos", JSON.stringify(novosFavoritos));
  };

  const toggleNotificacoes = () => {
    const novoStatus = !notificacoesAtivas;
    setNotificacoesAtivas(novoStatus);
    localStorage.setItem("notificacoes-ativas", String(novoStatus));
  };

  const limiteFavoritos = currentPlanInfo.deputados;
  const podeAdicionar = favoritos.length < limiteFavoritos;

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === "gratuito") return;

    // Admin não precisa pagar
    if (isAdmin) {
      setCurrentPlan(planId);
      localStorage.setItem("vigilante-plan", planId);
      alert("Plano ativado (Admin)!");
      return;
    }

    // Abre modal de pagamento PIX
    const plano = PLANOS.find(p => p.id === planId);
    if (plano) {
      setSelectedPlanForPayment(plano);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedPlanForPayment) {
      localStorage.setItem("vigilante-plan", selectedPlanForPayment.id);
      localStorage.setItem("vigilante-premium", "true");
      setCurrentPlan(selectedPlanForPayment.id);
      setShowPaymentModal(false);
      setSelectedPlanForPayment(null);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedPlanForPayment(null);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* Modal de Pagamento PIX */}
      {showPaymentModal && selectedPlanForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <PixPayment
              planId={selectedPlanForPayment.id as "basico" | "pro"}
              planName={selectedPlanForPayment.name}
              price={selectedPlanForPayment.price}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase mb-2 dark:text-brutal-dark-text">
          Meu Perfil
        </h1>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <p className="text-sm font-bold px-3 py-1 inline-flex items-center gap-1 bg-brutal-red text-white">
              <Shield size={14} />
              ADMIN
            </p>
          )}
          <p className={`text-sm font-bold px-3 py-1 inline-block ${
            effectivePlan === "pro"
              ? "bg-brutal-yellow text-black"
              : effectivePlan === "basico"
                ? "bg-brutal-blue text-white"
                : "bg-black dark:bg-brutal-dark-accent text-white"
          }`}>
            {currentPlanInfo.name.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "favoritos", label: "Meus Deputados", icon: Heart },
          { id: "notificacoes", label: "Notificações", icon: Bell },
          { id: "configuracoes", label: "Configurações", icon: Settings },
          { id: "premium", label: isAdmin ? "Admin" : (isPremium ? "Meu Plano" : "Assinar"), icon: isAdmin ? Shield : Crown },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-sm uppercase border-3 transition-all ${
                activeTab === tab.id
                  ? "bg-black dark:bg-brutal-dark-accent text-white border-black dark:border-brutal-dark-accent"
                  : "bg-white dark:bg-brutal-dark-surface text-black dark:text-brutal-dark-text border-black dark:border-brutal-dark-border hover:bg-gray-100 dark:hover:bg-brutal-dark-bg"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-6">
        {/* Meus Deputados */}
        {activeTab === "favoritos" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black uppercase dark:text-brutal-dark-text">
                Meus Deputados
              </h2>
              <span className="text-sm font-bold text-gray-600 dark:text-brutal-dark-muted">
                {favoritos.length}/{limiteFavoritos}
              </span>
            </div>

            {favoritos.length === 0 ? (
              <div className="text-center py-12 border-3 border-dashed border-gray-300 dark:border-brutal-dark-border">
                <Heart className="w-16 h-16 mx-auto text-gray-300 dark:text-brutal-dark-muted mb-4" />
                <h3 className="font-black text-xl mb-2 dark:text-brutal-dark-text">
                  Nenhum deputado favoritado
                </h3>
                <p className="text-gray-600 dark:text-brutal-dark-muted mb-4">
                  Vá até a <strong>Bancada</strong> e favorite seu deputado para acompanhá-lo
                </p>
                <Link
                  href="/bancada"
                  className="btn-brutal bg-brutal-yellow dark:bg-brutal-dark-accent dark:text-white inline-flex items-center gap-2"
                >
                  Ir para Bancada
                  <ExternalLink size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {favoritos.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex items-center gap-4 p-4 border-3 border-black dark:border-brutal-dark-border bg-gray-50 dark:bg-brutal-dark-bg"
                  >
                    <div className="w-16 h-16 bg-gray-200 dark:bg-brutal-dark-surface rounded-full overflow-hidden flex-shrink-0">
                      {dep.urlFoto ? (
                        <img
                          src={dep.urlFoto}
                          alt={dep.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-black text-lg dark:text-brutal-dark-text">{dep.nome}</h3>
                      <p className="text-sm text-gray-600 dark:text-brutal-dark-muted">
                        {dep.partido} · {dep.estado}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/politico/${dep.id}`}
                        className="p-2 border-2 border-black dark:border-brutal-dark-border hover:bg-black hover:text-white dark:hover:bg-brutal-dark-accent transition-colors"
                        title="Ver perfil"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button
                        onClick={() => removerFavorito(dep.id)}
                        className="p-2 border-2 border-brutal-red text-brutal-red hover:bg-brutal-red hover:text-white transition-colors"
                        title="Remover dos favoritos"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!podeAdicionar && (
              <div className="mt-6 p-4 bg-brutal-yellow dark:bg-brutal-dark-accent border-3 border-black dark:border-brutal-dark-accent">
                <div className="flex items-start gap-3">
                  <Crown className="w-6 h-6 text-black dark:text-white flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-black dark:text-white">
                      Quer acompanhar mais deputados?
                    </h4>
                    <p className="text-sm text-black/70 dark:text-white/70 mb-3">
                      {currentPlan === "gratuito"
                        ? "A partir de R$ 0,99/mês você pode acompanhar até 3 deputados!"
                        : currentPlan === "basico"
                          ? "Faça upgrade para o PRO e acompanhe até 15 deputados por R$ 3,99/mês!"
                          : "Você atingiu o limite de deputados do seu plano."}
                    </p>
                    {currentPlan !== "pro" && (
                      <button
                        onClick={() => setActiveTab("premium")}
                        className="btn-brutal bg-black text-white text-sm"
                      >
                        Ver planos
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notificacoes */}
        {activeTab === "notificacoes" && (
          <div>
            <h2 className="text-2xl font-black uppercase mb-6 dark:text-brutal-dark-text">
              Notificações
            </h2>

            {/* Toggle entre Alertas e Configurações */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setNotificacoesView("alertas")}
                className={`px-4 py-2 font-bold text-sm border-2 transition-all ${
                  notificacoesView === "alertas"
                    ? "bg-black dark:bg-brutal-dark-accent text-white border-black dark:border-brutal-dark-accent"
                    : "bg-white dark:bg-brutal-dark-surface text-black dark:text-brutal-dark-text border-black dark:border-brutal-dark-border"
                }`}
              >
                <BellRing size={16} className="inline mr-2" />
                Alertas
              </button>
              <button
                onClick={() => setNotificacoesView("config")}
                className={`px-4 py-2 font-bold text-sm border-2 transition-all ${
                  notificacoesView === "config"
                    ? "bg-black dark:bg-brutal-dark-accent text-white border-black dark:border-brutal-dark-accent"
                    : "bg-white dark:bg-brutal-dark-surface text-black dark:text-brutal-dark-text border-black dark:border-brutal-dark-border"
                }`}
              >
                <Settings size={16} className="inline mr-2" />
                Configurações
              </button>
            </div>

            {!isPremium && (
              <div className="p-4 mb-6 bg-brutal-yellow/20 dark:bg-brutal-dark-accent/20 border-2 border-brutal-yellow dark:border-brutal-dark-accent">
                <p className="text-sm dark:text-brutal-dark-text">
                  <Crown className="w-4 h-4 inline mr-1" />
                  <strong>Recurso Premium:</strong> Notificações por e-mail estão disponíveis
                  nos planos Vigilante. <button onClick={() => setActiveTab("premium")} className="underline font-bold">Assine agora</button>
                </p>
              </div>
            )}

            {notificacoesView === "alertas" ? (
              <NotificationsList />
            ) : (
              <NotificationSettings />
            )}
          </div>
        )}

        {/* Configuracoes */}
        {activeTab === "configuracoes" && (
          <div>
            <h2 className="text-2xl font-black uppercase mb-6 dark:text-brutal-dark-text">
              Configurações
            </h2>

            <div className="space-y-4">
              <div className="p-4 border-3 border-black dark:border-brutal-dark-border">
                <h3 className="font-bold mb-2 dark:text-brutal-dark-text">Dados Armazenados</h3>
                <p className="text-sm text-gray-600 dark:text-brutal-dark-muted mb-4">
                  Seus dados são armazenados localmente no seu navegador. Nenhuma informação
                  é enviada para servidores externos.
                </p>
                <button
                  onClick={() => {
                    if (confirm("Tem certeza? Isso removera todos os seus favoritos e configuracoes.")) {
                      localStorage.clear();
                      setFavoritos([]);
                      setCurrentPlan("gratuito");
                      setNotificacoesAtivas(true);
                    }
                  }}
                  className="btn-brutal bg-brutal-red text-white text-sm"
                >
                  Limpar Todos os Dados
                </button>
              </div>

              <div className="p-4 border-3 border-black dark:border-brutal-dark-border">
                <h3 className="font-bold mb-2 dark:text-brutal-dark-text">Sobre o Projeto</h3>
                <p className="text-sm text-gray-600 dark:text-brutal-dark-muted">
                  Política Sem Filtro é um projeto open source que usa dados públicos da
                  API da Câmara dos Deputados para promover transparência política.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Premium / Planos */}
        {activeTab === "premium" && (
          <div>
            {/* Se é admin, mostra status especial */}
            {isAdmin ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-brutal-red">
                    <Shield size={40} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-black uppercase mb-2 dark:text-brutal-dark-text">
                    Administrador
                  </h2>
                  <p className="text-gray-600 dark:text-brutal-dark-muted">
                    Você tem acesso total ao sistema.
                  </p>
                </div>

                {/* Benefícios admin */}
                <div className="p-6 border-3 border-brutal-red bg-brutal-red/10 mb-6">
                  <h3 className="font-black text-lg mb-4 flex items-center gap-2 dark:text-brutal-dark-text">
                    <Sparkles size={20} className="text-brutal-red" />
                    Privilégios de Administrador
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {[
                      "Acesso ilimitado a todos os recursos",
                      "Deputados favoritos ilimitados",
                      "Todas as notificações ativas",
                      "Painel de administração",
                      "Gerenciamento de usuários",
                      "Acesso a logs e métricas",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm dark:text-brutal-dark-text">
                        <Check size={16} className="text-brutal-red flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : isPremium && effectivePlan !== "gratuito" ? (
              <>
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full ${
                    effectivePlan === "pro" ? "bg-brutal-yellow" : "bg-brutal-blue"
                  }`}>
                    <Crown size={40} className={effectivePlan === "pro" ? "text-black" : "text-white"} />
                  </div>
                  <h2 className="text-3xl font-black uppercase mb-2 dark:text-brutal-dark-text">
                    {currentPlanInfo.name}
                  </h2>
                  <p className="text-gray-600 dark:text-brutal-dark-muted">
                    Obrigado por apoiar a transparência política!
                  </p>
                </div>

                {/* Benefícios do plano atual */}
                <div className="p-6 border-3 border-green-500 bg-green-50 dark:bg-green-900/20 mb-6">
                  <h3 className="font-black text-lg mb-4 flex items-center gap-2 dark:text-brutal-dark-text">
                    <Sparkles size={20} className="text-green-500" />
                    Seus benefícios ativos
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {currentPlanInfo.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm dark:text-brutal-dark-text">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Se está no básico, mostra upgrade para PRO */}
                {currentPlan === "basico" && (
                  <div className="p-6 border-3 border-brutal-yellow bg-brutal-yellow/10 dark:bg-brutal-yellow/5">
                    <div className="flex items-start gap-4">
                      <Zap size={24} className="text-brutal-yellow flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-black text-lg mb-1 dark:text-brutal-dark-text">
                          Quer mais poder?
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-brutal-dark-muted mb-3">
                          Faça upgrade para o Vigilante PRO e acompanhe até 15 deputados com alertas em tempo real!
                        </p>
                        <button
                          onClick={() => handleSelectPlan("pro")}
                          className="btn-brutal bg-brutal-yellow text-black"
                        >
                          Upgrade por R$ 3,99/mês
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info de cancelamento */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-brutal-dark-muted">
                    Plano ativo. Você pode cancelar a qualquer momento nas configurações.
                  </p>
                </div>
              </>
            ) : (
              /* Se não é assinante, mostra opções de planos */
              <>
                <h2 className="text-2xl font-black uppercase mb-2 dark:text-brutal-dark-text">
                  Escolha seu plano
                </h2>
                <p className="text-gray-600 dark:text-brutal-dark-muted mb-6">
                  Apoie a transparência política e tenha acesso a recursos exclusivos
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  {PLANOS.map((plano) => {
                    const isCurrentPlan = plano.id === currentPlan;
                    const canUpgrade = PLANOS.findIndex(p => p.id === plano.id) > PLANOS.findIndex(p => p.id === currentPlan);

                    return (
                      <div
                        key={plano.id}
                        className={`p-5 border-3 relative ${
                          plano.popular
                            ? "border-brutal-yellow bg-brutal-yellow/10 dark:bg-brutal-yellow/5"
                            : plano.id === "basico"
                              ? "border-brutal-blue bg-brutal-blue/5 dark:bg-brutal-blue/5"
                              : "border-black dark:border-brutal-dark-border"
                        }`}
                      >
                        {plano.popular && (
                          <div className="absolute -top-3 -right-3 bg-brutal-red text-white text-xs font-black px-2 py-1 border-2 border-black rotate-3">
                            MELHOR
                          </div>
                        )}

                        <h3 className="font-black text-lg mb-1 dark:text-brutal-dark-text">
                          {plano.name}
                        </h3>

                        <div className="mb-3">
                          <span className="text-3xl font-black dark:text-brutal-dark-text">
                            {plano.priceLabel}
                          </span>
                          {plano.price > 0 && (
                            <span className="text-sm font-bold text-gray-500">/mês</span>
                          )}
                        </div>

                        <div className="text-sm font-bold text-gray-600 dark:text-brutal-dark-muted mb-4 pb-4 border-b border-gray-200 dark:border-brutal-dark-border">
                          {plano.deputados === 1 ? "1 deputado" : `${plano.deputados} deputados`}
                        </div>

                        <ul className="space-y-2 mb-5">
                          {plano.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm dark:text-brutal-dark-text">
                              <Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {plano.notIncluded?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                              <X size={14} className="flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        {isCurrentPlan ? (
                          <button
                            disabled
                            className="w-full py-3 font-bold text-sm uppercase bg-gray-200 dark:bg-brutal-dark-bg text-gray-500 dark:text-brutal-dark-muted cursor-not-allowed border-2 border-gray-300 dark:border-brutal-dark-border"
                          >
                            Plano Atual
                          </button>
                        ) : canUpgrade ? (
                          <button
                            onClick={() => handleSelectPlan(plano.id)}
                            className={`w-full py-3 font-bold text-sm uppercase border-2 border-black dark:border-brutal-dark-accent transition-all hover:scale-[1.02] ${
                              plano.popular
                                ? "bg-brutal-yellow text-black"
                                : "bg-brutal-blue text-white"
                            }`}
                          >
                            <Crown className="inline mr-2" size={16} />
                            Assinar
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full py-3 font-bold text-sm uppercase bg-gray-100 dark:bg-brutal-dark-bg text-gray-400 cursor-not-allowed border-2 border-gray-200 dark:border-brutal-dark-border"
                          >
                            —
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Features do PRO */}
                <div className="mt-8 p-6 bg-black text-white border-3 border-black">
                  <h3 className="font-black text-xl mb-4">Por que assinar?</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 mx-auto mb-3 bg-brutal-yellow rounded-full flex items-center justify-center">
                        <AlertCircle size={24} className="text-black" />
                      </div>
                      <h4 className="font-bold mb-1">Fiscalize mais</h4>
                      <p className="text-sm opacity-80">
                        Acompanhe vários deputados e receba alertas de gastos suspeitos
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 mx-auto mb-3 bg-brutal-blue rounded-full flex items-center justify-center">
                        <MessageCircle size={24} className="text-white" />
                      </div>
                      <h4 className="font-bold mb-1">Cobre explicações</h4>
                      <p className="text-sm opacity-80">
                        Mensagens prontas para cobrar seus representantes nas redes sociais
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-full flex items-center justify-center">
                        <Heart size={24} className="text-brutal-red" />
                      </div>
                      <h4 className="font-bold mb-1">Apoie o projeto</h4>
                      <p className="text-sm opacity-80">
                        Sua assinatura mantém o projeto vivo e independente
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
