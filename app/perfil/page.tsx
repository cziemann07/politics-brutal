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
  Twitter,
  Instagram,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

interface DeputadoFavorito {
  id: number;
  nome: string;
  partido: string;
  estado: string;
  urlFoto: string;
}

export default function PerfilPage() {
  const [favoritos, setFavoritos] = useState<DeputadoFavorito[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [activeTab, setActiveTab] = useState("favoritos");

  // Carregar favoritos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("deputados-favoritos");
    if (saved) {
      try {
        setFavoritos(JSON.parse(saved));
      } catch {
        setFavoritos([]);
      }
    }

    const premiumStatus = localStorage.getItem("vigilante-premium");
    setIsPremium(premiumStatus === "true");

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

  const limiteFavoritos = isPremium ? 5 : 1;
  const podeAdicionar = favoritos.length < limiteFavoritos;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase mb-2 dark:text-brutal-dark-text">
          Meu Perfil
        </h1>
        <p className="text-sm font-bold bg-black dark:bg-brutal-dark-accent text-white px-3 py-1 inline-block">
          {isPremium ? "VIGILANTE PRO" : "PLANO GRATUITO"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "favoritos", label: "Meus Deputados", icon: Heart },
          { id: "notificacoes", label: "Notificações", icon: Bell },
          { id: "configuracoes", label: "Configurações", icon: Settings },
          { id: "premium", label: "Upgrade", icon: Crown },
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

            {!podeAdicionar && !isPremium && (
              <div className="mt-6 p-4 bg-brutal-yellow dark:bg-brutal-dark-accent border-3 border-black dark:border-brutal-dark-accent">
                <div className="flex items-start gap-3">
                  <Crown className="w-6 h-6 text-black dark:text-white flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-black dark:text-white">
                      Quer acompanhar mais deputados?
                    </h4>
                    <p className="text-sm text-black/70 dark:text-white/70 mb-3">
                      Com o Vigilante PRO você pode acompanhar até 5 deputados e receber
                      notificações sobre gastos suspeitos.
                    </p>
                    <button
                      onClick={() => setActiveTab("premium")}
                      className="btn-brutal bg-black text-white text-sm"
                    >
                      Ver plano PRO
                    </button>
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

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-3 border-black dark:border-brutal-dark-border">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-gray-600 dark:text-brutal-dark-muted" />
                  <div>
                    <h3 className="font-bold dark:text-brutal-dark-text">Alertas de Gastos</h3>
                    <p className="text-sm text-gray-600 dark:text-brutal-dark-muted">
                      Receba alertas sobre gastos suspeitos
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleNotificacoes}
                  className={`w-16 h-8 border-2 border-black dark:border-brutal-dark-border transition-colors relative flex items-center ${
                    notificacoesAtivas
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-brutal-dark-bg"
                  }`}
                >
                  <span
                    className={`w-6 h-6 bg-white dark:bg-brutal-dark-surface border-2 border-black dark:border-brutal-dark-border transition-all ${
                      notificacoesAtivas ? "ml-auto mr-0.5" : "ml-0.5"
                    }`}
                  />
                </button>
              </div>

              {!isPremium && (
                <div className="p-4 bg-gray-100 dark:bg-brutal-dark-bg border-2 border-dashed border-gray-300 dark:border-brutal-dark-border">
                  <p className="text-sm text-gray-600 dark:text-brutal-dark-muted">
                    <Crown className="w-4 h-4 inline mr-1" />
                    <strong>Recurso PRO:</strong> Notificações por e-mail e push estarão
                    disponíveis no plano Vigilante PRO.
                  </p>
                </div>
              )}

              <div className="mt-8">
                <h3 className="font-black text-lg mb-4 dark:text-brutal-dark-text">
                  Histórico de Alertas
                </h3>
                <div className="text-center py-8 text-gray-500 dark:text-brutal-dark-muted">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum alerta recente</p>
                </div>
              </div>
            </div>
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
                      setIsPremium(false);
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

        {/* Premium */}
        {activeTab === "premium" && (
          <div>
            <h2 className="text-2xl font-black uppercase mb-6 dark:text-brutal-dark-text">
              Vigilante PRO
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Plano Gratuito */}
              <div className="p-6 border-3 border-black dark:border-brutal-dark-border">
                <h3 className="font-black text-xl mb-2 dark:text-brutal-dark-text">Gratuito</h3>
                <p className="text-4xl font-black mb-4 dark:text-brutal-dark-text">R$ 0</p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Acesso a todos os dados públicos",
                    "1 deputado favorito",
                    "Visualização de gastos e votações",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm dark:text-brutal-dark-text">
                      <Check size={16} className="text-green-500" />
                      {item}
                    </li>
                  ))}
                  {[
                    "Notificações de gastos suspeitos",
                    "Mensagens pré-montadas",
                    "Até 5 deputados favoritos",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <X size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full btn-brutal bg-gray-200 dark:bg-brutal-dark-bg text-gray-600 dark:text-brutal-dark-muted cursor-not-allowed">
                  Plano Atual
                </button>
              </div>

              {/* Plano PRO */}
              <div className="p-6 border-3 border-brutal-yellow dark:border-brutal-dark-accent bg-brutal-yellow/10 dark:bg-brutal-dark-accent/10 relative">
                <div className="absolute -top-3 -right-3 bg-brutal-red text-white text-xs font-black px-3 py-1 border-2 border-black rotate-3">
                  POPULAR
                </div>
                <h3 className="font-black text-xl mb-2 dark:text-brutal-dark-text">Vigilante PRO</h3>
                <p className="text-4xl font-black mb-1 dark:text-brutal-dark-text">
                  R$ 19,99
                  <span className="text-base font-bold text-gray-500">/mes</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-brutal-dark-muted mb-4">
                  Cancele quando quiser
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Tudo do plano gratuito",
                    "Até 5 deputados favoritos",
                    "Notificações de gastos suspeitos",
                    "Mensagens pré-montadas para Twitter/X",
                    "Mensagens pré-montadas para Instagram",
                    "Alertas em tempo real",
                    "Suporte prioritário",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm dark:text-brutal-dark-text">
                      <Check size={16} className="text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    // Simulando ativacao do premium (em producao seria pagamento real)
                    localStorage.setItem("vigilante-premium", "true");
                    setIsPremium(true);
                    alert("Obrigado! Voce agora e um Vigilante PRO!");
                  }}
                  className="w-full btn-brutal bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white"
                >
                  <Crown className="inline mr-2" size={18} />
                  Assinar Agora
                </button>
              </div>
            </div>

            {/* Features do PRO */}
            <div className="mt-8 p-6 bg-black text-white border-3 border-black">
              <h3 className="font-black text-xl mb-4">Como funciona a pressão política?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-brutal-yellow rounded-full flex items-center justify-center">
                    <AlertCircle size={24} className="text-black" />
                  </div>
                  <h4 className="font-bold mb-1">1. Detectamos</h4>
                  <p className="text-sm opacity-80">
                    Nosso sistema identifica gastos suspeitos do seu deputado
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-brutal-blue rounded-full flex items-center justify-center">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <h4 className="font-bold mb-1">2. Geramos</h4>
                  <p className="text-sm opacity-80">
                    Criamos uma mensagem educada cobrando explicacoes
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-full flex items-center justify-center">
                    <Twitter size={24} className="text-black" />
                  </div>
                  <h4 className="font-bold mb-1">3. Voce envia</h4>
                  <p className="text-sm opacity-80">
                    Com um click, poste no Twitter/X ou Instagram marcando o politico
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
