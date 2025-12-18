"use client";

import { useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Scale,
  Skull,
  DollarSign,
  XCircle,
  CheckCircle,
  Target,
  ShieldAlert,
} from "lucide-react";
import MBLDossier from "@/components/features/Scandals/MBLDossier";

export default function Eleicoes2026Page() {
  const [abaAtiva, setAbaAtiva] = useState<"polarizacao" | "mbl" | "alerta">("polarizacao");

  return (
    <main className="min-h-screen bg-brutal-bg dark:bg-brutal-dark-bg p-4 md:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-8 border-b-3 border-black dark:border-brutal-dark-border pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-brutal-red p-2 border-2 border-black dark:border-brutal-red">
            <ShieldAlert size={32} className="text-white" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-brutal-red">
              Alerta Democrático
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none dark:text-brutal-dark-text">
              Eleições 2026
            </h1>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-700 dark:text-brutal-dark-muted max-w-3xl">
          A democracia brasileira está em risco. Não por ameaças externas, mas pela doença interna
          da polarização extrema que transforma cidadãos em fanáticos e políticos em ídolos intocáveis.
        </p>
      </div>

      {/* TABS DE NAVEGAÇÃO */}
      <div className="flex flex-wrap gap-2 mb-8 border-b-3 border-black dark:border-brutal-dark-border">
        {[
          { id: "polarizacao" as const, label: "O Câncer da Polarização", icon: Skull },
          { id: "mbl" as const, label: "Caso MBL: Hipocrisia em Pessoa", icon: DollarSign },
          { id: "alerta" as const, label: "Cuidado com Falsos Profetas", icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setAbaAtiva(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 font-black uppercase text-sm border-2 border-b-0 border-black dark:border-brutal-dark-border transition-all ${
                abaAtiva === tab.id ? "bg-black text-white dark:bg-brutal-dark-accent" : "bg-white dark:bg-brutal-dark-surface dark:text-brutal-dark-text hover:bg-black hover:text-white dark:hover:bg-brutal-dark-accent"
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTEÚDO: POLARIZAÇÃO */}
      {abaAtiva === "polarizacao" && (
        <div className="space-y-8">
          {/* BLOCO PRINCIPAL */}
          <div className="card-brutal bg-brutal-red text-white">
            <div className="flex items-center gap-3 mb-4">
              <Skull size={40} />
              <h2 className="text-2xl md:text-3xl font-black uppercase">
                A Polarização Está Matando o Brasil
              </h2>
            </div>
            <p className="font-medium text-lg leading-relaxed mb-4">
              O brasileiro médio foi transformado em soldado de guerra ideológica. Esquerda contra
              direita. PT contra Bolsonaro. Lula contra Mito. E enquanto você briga com seu vizinho
              no grupo da família, os políticos dos DOIS lados enchem os bolsos com o seu dinheiro.
            </p>
            <div className="bg-black/30 p-4 border-2 border-white">
              <p className="font-black text-xl">
                A verdade incômoda: SEU POLÍTICO FAVORITO TAMBÉM É CORRUPTO.
              </p>
            </div>
          </div>

          {/* GRID DE PROBLEMAS */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-brutal">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-500 p-2 border-2 border-black dark:border-red-500">
                  <XCircle size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-black uppercase dark:text-brutal-dark-text">O Problema da Esquerda</h3>
              </div>
              <ul className="space-y-3 font-medium dark:text-brutal-dark-muted">
                <li className="flex items-start gap-2">
                  <span className="text-brutal-red font-black">•</span>
                  <span>Idolatria cega a Lula, ignorando escândalos como Mensalão e Petrolão</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-red font-black">•</span>
                  <span>Defesa de regimes autoritários "porque são de esquerda"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-red font-black">•</span>
                  <span>Cancelamento de qualquer crítica como "fascismo"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-red font-black">•</span>
                  <span>Gastos públicos irresponsáveis em nome do "social"</span>
                </li>
              </ul>
            </div>

            <div className="card-brutal">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-500 p-2 border-2 border-black dark:border-blue-500">
                  <XCircle size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-black uppercase dark:text-brutal-dark-text">O Problema da Direita</h3>
              </div>
              <ul className="space-y-3 font-medium dark:text-brutal-dark-muted">
                <li className="flex items-start gap-2">
                  <span className="text-brutal-red font-black">•</span>
                  <span>Culto de personalidade a Bolsonaro, ignorando suas falhas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-red font-black">•</span>
                  <span>Negacionismo científico e anti-intelectualismo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-red font-black">•</span>
                  <span>Defesa cega das Forças Armadas como "salvadoras"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-red font-black">•</span>
                  <span>Orçamento secreto e rachadinha "porque os outros também fazem"</span>
                </li>
              </ul>
            </div>
          </div>

          {/* BLOCO DE ALERTA */}
          <div className="card-brutal bg-black text-white">
            <div className="flex items-center gap-3 mb-4">
              <Scale size={32} />
              <h3 className="text-xl font-black uppercase">A Única Posição Honesta</h3>
            </div>
            <p className="font-medium text-lg mb-4">
              Ser crítico de TODOS os políticos. Cobrar transparência de TODOS os partidos.
              Não aceitar justificativas de corrupção "porque o outro lado também faz".
              O Brasil só melhora quando pararmos de tratar política como futebol.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 p-4 text-center border border-white/30">
                <span className="block text-3xl font-black">594</span>
                <span className="text-sm font-bold">Deputados recebendo fundão</span>
              </div>
              <div className="bg-white/10 p-4 text-center border border-white/30">
                <span className="block text-3xl font-black">R$ 4.9 Bi</span>
                <span className="text-sm font-bold">Fundo Eleitoral 2024</span>
              </div>
              <div className="bg-white/10 p-4 text-center border border-white/30">
                <span className="block text-3xl font-black">81</span>
                <span className="text-sm font-bold">Senadores com foro privilegiado</span>
              </div>
            </div>
          </div>

          {/* CITAÇÃO FINAL */}
          <div className="bg-brutal-bg dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border p-6 md:p-8 text-center">
            <blockquote className="text-xl md:text-2xl font-black italic mb-4 dark:text-brutal-dark-text">
              "Quando você defende um político como se fosse seu time de futebol,
              você deixou de ser cidadão e virou torcedor."
            </blockquote>
            <p className="font-bold text-gray-600 dark:text-brutal-dark-muted">
              Pare de defender políticos. Comece a cobrar todos eles.
            </p>
          </div>
        </div>
      )}

      {/* CONTEÚDO: DOSSIÊ MBL */}
      {abaAtiva === "mbl" && (
        <div className="space-y-8">
          {/* INTRO */}
          <div className="card-brutal bg-black text-white">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign size={32} className="text-brutal-red" />
              <h2 className="text-2xl md:text-3xl font-black uppercase">
                O Caso Emblemático do MBL
              </h2>
            </div>
            <p className="font-medium text-lg leading-relaxed">
              O Movimento Brasil Livre é o exemplo perfeito de como movimentos "anti-sistema"
              rapidamente se tornam aquilo que criticavam. Prometeram nunca usar fundão.
              Prometeram transparência. Prometeram ser diferentes. E onde estão agora?
            </p>
          </div>

          {/* DOSSIÊ COMPLETO */}
          <MBLDossier />

          {/* CONCLUSÃO */}
          <div className="card-brutal border-brutal-red border-3">
            <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2 dark:text-brutal-dark-text">
              <Target size={24} className="text-brutal-red" />
              A Lição que Você Deve Aprender
            </h3>
            <p className="font-medium text-lg mb-4 dark:text-brutal-dark-muted">
              O MBL não é pior nem melhor que PT, PSDB, MDB ou qualquer outro partido.
              Eles são IGUAIS. Todos prometem mundos e fundos na oposição, todos viram
              a casaca quando chegam ao poder. A diferença é que o MBL construiu sua
              base exatamente criticando isso — e agora faz o mesmo.
            </p>
            <div className="bg-brutal-bg dark:bg-brutal-dark-bg p-4 border-2 border-black dark:border-brutal-dark-border">
              <p className="font-black text-center dark:text-brutal-dark-text">
                DESCONFIE DE TODO POLÍTICO. INCLUSIVE DESSE.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO: ALERTA PARA 2026 */}
      {abaAtiva === "alerta" && (
        <div className="space-y-8">
          {/* ALERTA PRINCIPAL */}
          <div className="card-brutal bg-brutal-red text-white">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={40} />
              <h2 className="text-2xl md:text-3xl font-black uppercase">
                Alerta Para 2026: Não Seja Trouxa de Novo
              </h2>
            </div>
            <p className="font-medium text-lg leading-relaxed">
              Em 2026, você vai ser bombardeado com propagandas emocionais, promessas mirabolantes
              e candidatos "diferentes de tudo que está aí". Antes de votar, lembre-se:
              TODO político quer seu voto. NENHUM deles quer seu bem-estar.
            </p>
          </div>

          {/* PSEUDO-CANDIDATOS */}
          <div className="card-brutal">
            <h3 className="text-xl font-black uppercase mb-6 border-b-3 border-black dark:border-brutal-dark-border pb-3 dark:text-brutal-dark-text">
              Os Tipos de Candidatos que Você VAI Encontrar
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4 items-start p-4 bg-brutal-bg dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border">
                <div className="bg-brutal-red text-white p-2 border-2 border-black dark:border-brutal-red shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-black text-lg uppercase mb-2 dark:text-brutal-dark-text">O "Outsider" de YouTube</h4>
                  <p className="font-medium text-gray-700 dark:text-brutal-dark-muted">
                    Faz vídeos criticando políticos, vira político, e faz tudo igual.
                    Exemplo clássico: MBL, Mamãe Falei, e dezenas de influencers que
                    entraram na política "para mudar" e só mudaram de endereço.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-brutal-bg dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border">
                <div className="bg-blue-500 text-white p-2 border-2 border-black dark:border-blue-500 shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-black text-lg uppercase mb-2 dark:text-brutal-dark-text">O "Técnico Apolítico"</h4>
                  <p className="font-medium text-gray-700 dark:text-brutal-dark-muted">
                    Diz que "não é de esquerda nem de direita", mas financia campanha
                    com fundão e se alia com qualquer um para ter poder. Geralmente
                    vem do mercado financeiro ou empresariado.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-brutal-bg dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border">
                <div className="bg-green-500 text-white p-2 border-2 border-black dark:border-green-500 shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-black text-lg uppercase mb-2 dark:text-brutal-dark-text">O "Salvador da Pátria"</h4>
                  <p className="font-medium text-gray-700 dark:text-brutal-dark-muted">
                    Usa linguagem messiânica, fala em "salvar o Brasil", e cria culto
                    de personalidade. Pode ser de esquerda ou direita — o padrão é o
                    mesmo: ele é o escolhido, você é o fiel.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CHECKLIST */}
          <div className="card-brutal bg-black text-white">
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
              <CheckCircle size={24} className="text-green-400" />
              Antes de Votar em 2026, Pergunte:
            </h3>
            <ul className="space-y-4 font-medium">
              <li className="flex items-start gap-3">
                <div className="bg-green-400 text-black p-1 shrink-0 mt-1">
                  <CheckCircle size={16} />
                </div>
                <span>Esse candidato usa ou já usou Fundo Partidário/Eleitoral?</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-400 text-black p-1 shrink-0 mt-1">
                  <CheckCircle size={16} />
                </div>
                <span>Ele emprega parentes em cargos políticos?</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-400 text-black p-1 shrink-0 mt-1">
                  <CheckCircle size={16} />
                </div>
                <span>Qual o histórico de votações dele no Congresso?</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-400 text-black p-1 shrink-0 mt-1">
                  <CheckCircle size={16} />
                </div>
                <span>Ele muda de partido com frequência?</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-400 text-black p-1 shrink-0 mt-1">
                  <CheckCircle size={16} />
                </div>
                <span>As promessas dele são vagas ("mudar o Brasil") ou específicas e verificáveis?</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-400 text-black p-1 shrink-0 mt-1">
                  <CheckCircle size={16} />
                </div>
                <span>Ele aceita críticas ou ataca quem questiona?</span>
              </li>
            </ul>
          </div>

          {/* MENSAGEM FINAL */}
          <div className="bg-brutal-bg dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border p-6 md:p-8">
            <h3 className="text-2xl font-black uppercase mb-4 text-center dark:text-brutal-dark-text">
              O Voto Consciente
            </h3>
            <p className="font-medium text-lg text-center max-w-2xl mx-auto mb-6 dark:text-brutal-dark-muted">
              Não existe político perfeito. Mas existem políticos menos piores.
              Pesquise, compare, cobre. E lembre-se: seu voto é uma ferramenta,
              não uma declaração de amor.
            </p>
            <div className="bg-black text-white p-4 text-center">
              <p className="font-black text-lg uppercase">
                Em 2026, vote com a cabeça. Não com o coração.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
