import Link from "next/link";
import { PowerPyramid, LegalDistinction, Supremo, DadosQueChocam } from "@/components/features";
import { FeatureCard, SectionHeader } from "@/components/ui";
import {
  Users,
  FileText,
  AlertCircle,
  TrendingUp,
  Shield,
  ChevronDown,
  Database,
  RefreshCw,
  Github,
  Scale,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ========== 1. HERO SECTION ========== */}
      <section className="relative min-h-[75vh] flex flex-col justify-center items-center text-center px-4 py-brutal-xl">
        {/* Badge Open Source */}
        <div className="inline-flex items-center gap-2 bg-white dark:bg-brutal-dark-surface border-2 border-black dark:border-brutal-dark-border px-4 py-2 mb-brutal-sm z-10">
          <Shield className="w-4 h-4 dark:text-brutal-dark-text" />
          <span className="font-bold text-xs uppercase dark:text-brutal-dark-text">Projeto Open Source</span>
        </div>

        {/* Título Principal */}
        <h1 className="heading-hero mb-brutal-sm z-10 max-w-6xl dark:text-brutal-dark-text">
          Política
          <span className="block mt-4">
            <span className="inline-block highlight-brutal px-6 transform -rotate-1">
              Sem Filtro
            </span>
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="heading-subtitle max-w-3xl mb-brutal-md text-gray-800 dark:text-brutal-dark-text z-10">
          Transparência política radical para formar cidadãos conscientes.
        </p>

        {/* Value Proposition */}
        <p className="text-body max-w-2xl mb-brutal-lg text-gray-600 dark:text-brutal-dark-muted z-10">
          Combata a desinformação com dados oficiais. Entenda gastos, votações e escândalos
          antes de formar opinião.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-brutal-md z-10">
          <Link href="/bancada" className="btn-brutal bg-brutal-yellow text-lg px-8 py-4">
            Ver Bancada Completa
          </Link>
          <Link href="/metodologia" className="btn-brutal bg-white text-lg px-8 py-4">
            Como Funciona
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 animate-bounce opacity-30">
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </div>
      </section>

      {/* ========== 2. TRUST INDICATORS ========== */}
      <section className="max-w-7xl mx-auto px-4 py-brutal-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-brutal-md">
          <div className="card-brutal text-center bg-white">
            <Database className="w-8 h-8 mx-auto mb-brutal-xs text-brutal-blue" />
            <h3 className="font-black text-sm uppercase mb-1">Dados Oficiais</h3>
            <p className="text-xs text-gray-600">API Câmara dos Deputados</p>
          </div>

          <div className="card-brutal text-center bg-white">
            <RefreshCw className="w-8 h-8 mx-auto mb-brutal-xs text-green-600" />
            <h3 className="font-black text-sm uppercase mb-1">Sempre Atualizado</h3>
            <p className="text-xs text-gray-600">Última: Dez/2025</p>
          </div>

          <div className="card-brutal text-center bg-white">
            <Github className="w-8 h-8 mx-auto mb-brutal-xs text-black" />
            <h3 className="font-black text-sm uppercase mb-1">100% Open Source</h3>
            <p className="text-xs text-gray-600">Código aberto no GitHub</p>
          </div>

          <div className="card-brutal text-center bg-white">
            <Scale className="w-8 h-8 mx-auto mb-brutal-xs text-brutal-yellow" />
            <h3 className="font-black text-sm uppercase mb-1">Apartidário</h3>
            <p className="text-xs text-gray-600">Apenas dados, sem opinião</p>
          </div>
        </div>
      </section>

      {/* ========== 3. FUNCIONALIDADES PRINCIPAIS ========== */}
      <section className="max-w-7xl mx-auto px-4 py-brutal-xl">
        <SectionHeader
          title="Explore os Dados"
          subtitle="Acesse informações completas sobre a atividade parlamentar"
        />

        <div className="grid md:grid-cols-2 gap-brutal-md">
          <FeatureCard
            href="/bancada"
            icon={Users}
            iconColor="text-brutal-blue"
            title="Bancada Federal"
            subtitle="513 deputados em exercício"
            description="Veja todos os deputados federais, seus gastos mensais (CEAP), status de regularidade e histórico completo."
            ctaText="Ver bancada completa"
          />

          <FeatureCard
            href="/votacoes"
            icon={FileText}
            iconColor="text-brutal-red"
            title="Votações"
            subtitle="Projetos em andamento"
            description="Acompanhe como cada deputado votou nas últimas propostas. Descubra quem apoia ou rejeita cada projeto."
            ctaText="Ver votações recentes"
          />

          <FeatureCard
            href="/investigacoes"
            icon={AlertCircle}
            iconColor="text-orange-600"
            title="Investigações"
            subtitle="12 casos ativos"
            description="Processos em andamento, escândalos documentados e casos sob investigação. Transparência total."
            ctaText="Ver investigações"
          />

          <FeatureCard
            href="/eleicoes-2026"
            icon={TrendingUp}
            iconColor="text-green-600"
            title="Eleições 2026"
            subtitle="Projeções e análises"
            description="Entenda o cenário eleitoral, candidatos prováveis e como o histórico influencia as próximas eleições."
            ctaText="Ver projeções"
          />
        </div>
      </section>

      {/* ========== 4. DADOS IMPACTANTES ========== */}
      <section className="max-w-7xl mx-auto px-4 py-brutal-xl">
        <div className="bg-brutal-bg dark:bg-brutal-dark-bg border-3 border-black dark:border-brutal-dark-border p-8 md:p-12">
          <SectionHeader title="Dados que Chocam" centered />

          <DadosQueChocam />
        </div>
      </section>

      {/* ========== 5. DOSSIÊS EM DESTAQUE ========== */}
      <section className="max-w-7xl mx-auto px-4 py-brutal-xl">
        <SectionHeader title="Dossiês Exclusivos" linkHref="/investigacoes" linkText="Ver Todos" />

        {/* Dossiê Principal */}
        <div className="mb-brutal-lg">
          <Supremo />
        </div>

        {/* Prévias */}
        <div className="grid md:grid-cols-2 gap-brutal-md">
          <Link
            href="/investigacoes#mbl"
            className="card-brutal hover:shadow-hard-hover transition-all bg-white p-6 group"
          >
            <div className="flex items-start gap-brutal-sm">
              <AlertCircle className="w-8 h-8 text-brutal-red shrink-0" />
              <div>
                <h3 className="heading-card mb-2 group-hover:text-brutal-red transition-colors">
                  Missão Mamata
                </h3>
                <p className="text-small leading-relaxed mb-brutal-xs text-gray-700">
                  Como o MBL passou de "não vou usar fundão nem se for 20 trilhões" para R$ 315
                  mil em verbas públicas.
                </p>
                <span className="text-xs font-bold text-brutal-blue">Ler dossiê completo →</span>
              </div>
            </div>
          </Link>

          <Link
            href="/investigacoes"
            className="card-brutal hover:shadow-hard-hover transition-all bg-white p-6 group"
          >
            <div className="flex items-start gap-brutal-sm">
              <FileText className="w-8 h-8 text-brutal-blue shrink-0" />
              <div>
                <h3 className="heading-card mb-2 group-hover:text-brutal-blue transition-colors">
                  Mais Investigações
                </h3>
                <p className="text-small leading-relaxed mb-brutal-xs text-gray-700">
                  Explore outros casos, escândalos documentados e processos em andamento.
                </p>
                <span className="text-xs font-bold text-brutal-blue">Ver todos →</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ========== 6. COMPONENTES EDUCACIONAIS ========== */}
      <section className="max-w-7xl mx-auto px-4 py-brutal-xl">
        <SectionHeader
          title="Entenda a Estrutura"
          subtitle="Ferramentas para compreender como o sistema político funciona"
        />

        <div className="grid md:grid-cols-2 gap-brutal-lg">
          {/* Pirâmide de Poder */}
          <div className="card-brutal bg-white">
            <h3 className="heading-card mb-brutal-sm border-b-3 border-black pb-brutal-sm">
              A Hierarquia do Poder
            </h3>
            <PowerPyramid />
          </div>

          {/* Dicionário */}
          <div className="card-brutal bg-white">
            <h3 className="heading-card mb-brutal-sm border-b-3 border-black pb-brutal-sm">
              Dicionário de Termos
            </h3>
            <p className="text-small mb-brutal-sm text-gray-600">
              Entenda a diferença entre absolvição por mérito e processo anulado.
            </p>
            <LegalDistinction />
          </div>
        </div>
      </section>

      {/* ========== 7. CTA FINAL ========== */}
      <section className="max-w-7xl mx-auto px-4 py-brutal-xl">
        <div className="bg-black text-white border-3 border-black shadow-hard p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-brutal-sm">
            Seja um Cidadão Informado
          </h2>
          <p className="heading-subtitle mb-brutal-md max-w-2xl mx-auto">
            Não acredite em nós. Acredite nos dados oficiais. Explore, questione e forme sua
            própria opinião.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bancada" className="btn-brutal bg-brutal-yellow text-black text-lg px-8 py-4">
              Começar Agora
            </Link>
            <Link href="/metodologia" className="btn-brutal bg-white text-black text-lg px-8 py-4">
              Entender a Metodologia
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="text-center py-brutal-lg border-t-3 border-black dark:border-brutal-dark-border font-mono text-xs uppercase max-w-7xl mx-auto px-4 dark:text-brutal-dark-muted">
        <p>Projeto Open Source • Transparência Radical</p>
      </footer>
    </main>
  );
}
