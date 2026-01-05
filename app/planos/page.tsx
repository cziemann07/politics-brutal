"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Crown,
  Users,
  Bell,
  Mail,
  MessageCircle,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    id: "gratuito",
    name: "Gratuito",
    price: 0,
    priceLabel: "R$ 0",
    period: "",
    description: "Para quem quer começar a fiscalizar",
    deputies: 1,
    features: [
      { text: "Acompanhar 1 deputado", included: true },
      { text: "Alertas in-app", included: true },
      { text: "Histórico de votações", included: true },
      { text: "Gastos públicos (CEAP)", included: true },
      { text: "Notificações por email", included: false },
      { text: "Personalização de alertas", included: false },
      { text: "Notificações WhatsApp", included: false },
    ],
    cta: "Começar grátis",
    popular: false,
  },
  {
    id: "basico",
    name: "Básico",
    price: 0.99,
    priceLabel: "R$ 0,99",
    period: "/mês",
    description: "Para cidadãos engajados",
    deputies: 3,
    features: [
      { text: "Acompanhar 3 deputados", included: true },
      { text: "Alertas in-app", included: true },
      { text: "Histórico de votações", included: true },
      { text: "Gastos públicos (CEAP)", included: true },
      { text: "Notificações por email", included: true },
      { text: "Personalização de alertas", included: false },
      { text: "Notificações WhatsApp", included: false },
    ],
    cta: "Assinar Básico",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 3.99,
    priceLabel: "R$ 3,99",
    period: "/mês",
    description: "Para fiscalizadores sérios",
    deputies: 15,
    features: [
      { text: "Acompanhar 15 deputados", included: true },
      { text: "Alertas in-app", included: true },
      { text: "Histórico de votações", included: true },
      { text: "Gastos públicos (CEAP)", included: true },
      { text: "Notificações por email", included: true },
      { text: "Personalização de alertas", included: true },
      { text: "Notificações WhatsApp (em breve)", included: true },
    ],
    cta: "Assinar Pro",
    popular: false,
  },
];

const faqs = [
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim! Você pode cancelar sua assinatura quando quiser. O acesso continua até o fim do período pago.",
  },
  {
    question: "Como funciona o pagamento?",
    answer: "Aceitamos pagamento via PIX. Após a confirmação, seu plano é ativado automaticamente.",
  },
  {
    question: "O que acontece se eu não renovar?",
    answer: "Seu plano volta para o gratuito e você mantém o acompanhamento de 1 deputado.",
  },
  {
    question: "Os dados são reais?",
    answer: "Sim! Todos os dados vêm da API oficial da Câmara dos Deputados e são atualizados frequentemente.",
  },
];

export default function PlanosPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const currentPlan = user?.subscriptionPlan || "gratuito";

  return (
    <div className="min-h-screen bg-radar-bg dark:bg-radar-dark-bg">
      {/* Hero */}
      <section className="container-main py-12 md:py-16 text-center">
        <span className="badge-accent mb-4">Planos</span>
        <h1 className="text-headline-xl text-radar-text dark:text-radar-dark-text mb-4">
          Escolha como quer fiscalizar
        </h1>
        <p className="text-body-lg text-radar-muted dark:text-radar-dark-muted max-w-2xl mx-auto">
          Quanto mais deputados você acompanha, mais informado você fica.
          Comece grátis e faça upgrade quando quiser.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container-main pb-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card p-6 flex flex-col relative ${
                plan.popular
                  ? "border-2 border-radar-accent ring-2 ring-radar-accent/20"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge-accent px-4 py-1">Mais popular</span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-headline-sm text-radar-text dark:text-radar-dark-text mb-1">
                  {plan.name}
                </h3>
                <p className="text-body-sm text-radar-muted dark:text-radar-dark-muted">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-headline-xl text-radar-text dark:text-radar-dark-text">
                  {plan.priceLabel}
                </span>
                <span className="text-body-sm text-radar-muted">{plan.period}</span>
              </div>

              <div className="flex items-center gap-2 mb-6 p-3 bg-radar-bg dark:bg-radar-dark-bg rounded-lg">
                <Users size={18} className="text-radar-secondary" />
                <span className="text-body-sm font-medium text-radar-text dark:text-radar-dark-text">
                  {plan.deputies} {plan.deputies === 1 ? "deputado" : "deputados"}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check size={18} className="text-radar-success shrink-0 mt-0.5" />
                    ) : (
                      <X size={18} className="text-radar-muted shrink-0 mt-0.5" />
                    )}
                    <span className={`text-body-sm ${
                      feature.included
                        ? "text-radar-text dark:text-radar-dark-text"
                        : "text-radar-muted line-through"
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {currentPlan === plan.id ? (
                <button
                  disabled
                  className="w-full py-3 px-6 bg-radar-success/10 text-radar-success font-semibold rounded-lg"
                >
                  Plano atual
                </button>
              ) : plan.id === "gratuito" ? (
                <Link
                  href="/auth"
                  className={`w-full py-3 px-6 font-semibold rounded-lg text-center transition-colors ${
                    plan.popular
                      ? "bg-radar-accent text-white hover:bg-radar-accent/90"
                      : "bg-radar-surface dark:bg-radar-dark-surface border border-radar-border dark:border-radar-dark-border hover:bg-radar-bg dark:hover:bg-radar-dark-bg"
                  }`}
                >
                  {plan.cta}
                </Link>
              ) : (
                <Link
                  href={`/perfil?upgrade=${plan.id}`}
                  className={`w-full py-3 px-6 font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-radar-accent text-white hover:bg-radar-accent/90"
                      : "bg-radar-surface dark:bg-radar-dark-surface border border-radar-border dark:border-radar-dark-border hover:bg-radar-bg dark:hover:bg-radar-dark-bg text-radar-text dark:text-radar-dark-text"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-main py-12 border-t border-radar-border dark:border-radar-dark-border">
        <h2 className="text-headline-md text-radar-text dark:text-radar-dark-text text-center mb-8">
          O que você ganha
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-radar-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-radar-secondary" />
            </div>
            <h3 className="font-semibold text-radar-text dark:text-radar-dark-text mb-2">
              Alertas em tempo real
            </h3>
            <p className="text-body-sm text-radar-muted">
              Saiba imediatamente quando seu deputado vota, falta ou gasta
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-radar-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap size={24} className="text-radar-accent" />
            </div>
            <h3 className="font-semibold text-radar-text dark:text-radar-dark-text mb-2">
              Dados oficiais
            </h3>
            <p className="text-body-sm text-radar-muted">
              Informações direto da API da Câmara dos Deputados
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-radar-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-radar-success" />
            </div>
            <h3 className="font-semibold text-radar-text dark:text-radar-dark-text mb-2">
              Apartidário
            </h3>
            <p className="text-body-sm text-radar-muted">
              Fiscalizamos todos igualmente, sem viés ideológico
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-radar-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-radar-warning" />
            </div>
            <h3 className="font-semibold text-radar-text dark:text-radar-dark-text mb-2">
              Notificações personalizadas
            </h3>
            <p className="text-body-sm text-radar-muted">
              Escolha o que quer receber e como quer receber
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container-main py-12">
        <h2 className="text-headline-md text-radar-text dark:text-radar-dark-text text-center mb-8">
          Perguntas frequentes
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card p-6">
              <h3 className="font-semibold text-radar-text dark:text-radar-dark-text mb-2">
                {faq.question}
              </h3>
              <p className="text-body-sm text-radar-muted dark:text-radar-dark-muted">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="container-main py-12">
        <div className="card bg-radar-primary dark:bg-radar-dark-surface p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-headline-lg text-white mb-4">
            Pronto para fiscalizar?
          </h2>
          <p className="text-body-lg text-white/80 mb-6">
            Comece gratuitamente e faça upgrade quando quiser.
            Transparência política começa com você.
          </p>
          <Link href="/auth" className="btn-primary px-8 text-lg">
            Criar conta grátis
          </Link>
        </div>
      </section>
    </div>
  );
}
