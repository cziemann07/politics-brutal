import Link from "next/link";
import {
  BolsaFamiliaBarbaridade,
  TaxacaoBlusinha,
  BandidolatriaBrasil,
  GastosJanja,
} from "@/components/features";
import { SectionHeader } from "@/components/ui";
import { ArrowLeft, TrendingDown, Users, Plane, Shield } from "lucide-react";

export default function AnalisesPage() {
  return (
    <main className="min-h-screen bg-brutal-bg">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-brutal-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold mb-brutal-sm hover:text-brutal-blue transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para home
        </Link>

        <h1 className="heading-hero mb-brutal-sm">
          Análises
          <span className="block mt-4">
            <span className="inline-block bg-brutal-red px-6 border-3 border-black shadow-hard transform rotate-1 text-white">
              Políticas
            </span>
          </span>
        </h1>

        <p className="heading-subtitle max-w-3xl text-gray-800">
          Dados, fatos e contradições sobre políticas públicas no Brasil.
        </p>
      </section>

      {/* Grid de Análises */}
      <section className="max-w-7xl mx-auto px-4 py-brutal-xl">
        <SectionHeader
          title="Análises Disponíveis"
          subtitle="Cada análise apresenta dados oficiais e contexto sobre políticas controversas"
        />

        {/* Grid de Cards Preview */}
        <div className="grid md:grid-cols-2 gap-brutal-md mb-brutal-xl">
          {/* Preview 1: Taxação Blusinha */}
          <div className="card-brutal bg-white p-8 hover:shadow-hard-hover transition-all">
            <div className="flex items-start gap-4 mb-brutal-sm">
              <div className="p-3 bg-brutal-red border-2 border-black">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="heading-card mb-2">Taxação das Blusinhas</h2>
                <p className="text-small text-gray-600">
                  A contradição entre combater importação e arrecadar bilhões
                </p>
              </div>
            </div>
            <p className="text-body text-gray-700 mb-brutal-sm">
              Compare os R$ 27.5 bilhões arrecadados com importação de "blusinhas" versus os R$
              500 milhões economizados ao proibir parcelamento sem juros.
            </p>
            <div className="flex gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-brutal-red text-white border-2 border-black">
                ECONOMIA
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-gray-200 border-2 border-black">
                ARRECADAÇÃO
              </span>
            </div>
          </div>

          {/* Preview 2: Bolsa Família */}
          <div className="card-brutal bg-white p-8 hover:shadow-hard-hover transition-all">
            <div className="flex items-start gap-4 mb-brutal-sm">
              <div className="p-3 bg-black border-2 border-black">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="heading-card mb-2">Bolsa Família: Expansão Desigual</h2>
                <p className="text-small text-gray-600">
                  Crescimento regionalizado e disparidades questionáveis
                </p>
              </div>
            </div>
            <p className="text-body text-gray-700 mb-brutal-sm">
              Analise como Alagoas teve crescimento de 39% no Bolsa Família enquanto Santa Catarina
              recuou 26%, e o que isso revela sobre gestão do programa.
            </p>
            <div className="flex gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-green-400 border-2 border-black">
                SOCIAL
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-gray-200 border-2 border-black">
                REGIONAL
              </span>
            </div>
          </div>

          {/* Preview 3: Gastos Janja */}
          <div className="card-brutal bg-white p-8 hover:shadow-hard-hover transition-all">
            <div className="flex items-start gap-4 mb-brutal-sm">
              <div className="p-3 bg-brutal-blue border-2 border-black">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="heading-card mb-2">Gastos com Primeira-Dama</h2>
                <p className="text-small text-gray-600">Viagens internacionais e custos operacionais</p>
              </div>
            </div>
            <p className="text-body text-gray-700 mb-brutal-sm">
              R$ 11,1 milhões gastos pela equipe da primeira-dama em viagens, incluindo combustível
              de avião e hotel de luxo. Compare função real vs. custos.
            </p>
            <div className="flex gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-brutal-blue text-white border-2 border-black">
                GASTOS
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-gray-200 border-2 border-black">
                TRANSPARÊNCIA
              </span>
            </div>
          </div>

          {/* Preview 4: Bandidolatria */}
          <div className="card-brutal bg-white p-8 hover:shadow-hard-hover transition-all">
            <div className="flex items-start gap-4 mb-brutal-sm">
              <div className="p-3 bg-orange-500 border-2 border-black">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="heading-card mb-2">Bandidolatria no Brasil</h2>
                <p className="text-small text-gray-600">
                  Inversão de valores na segurança pública
                </p>
              </div>
            </div>
            <p className="text-body text-gray-700 mb-brutal-sm">
              Analise casos onde criminosos são tratados como vítimas e policiais como vilões.
              Dados sobre violência policial vs. violência criminal.
            </p>
            <div className="flex gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-orange-500 text-white border-2 border-black">
                SEGURANÇA
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-gray-200 border-2 border-black">
                CULTURA
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Análises Completas */}
      <section className="max-w-7xl mx-auto px-4 py-brutal-xl">
        <SectionHeader title="Análises Completas" />

        <div className="space-y-brutal-xl">
          <TaxacaoBlusinha />
          <BolsaFamiliaBarbaridade />
          <GastosJanja />
          <BandidolatriaBrasil />
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 py-brutal-xl">
        <div className="bg-black text-white border-3 border-black shadow-hard p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-brutal-sm">
            Quer Ver Mais Dados?
          </h2>
          <p className="heading-subtitle mb-brutal-md max-w-2xl mx-auto">
            Explore votações, investigações e o histórico completo da bancada federal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bancada" className="btn-brutal bg-brutal-yellow text-black text-lg px-8 py-4">
              Ver Bancada
            </Link>
            <Link
              href="/investigacoes"
              className="btn-brutal bg-brutal-red text-white text-lg px-8 py-4"
            >
              Ver Investigações
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-brutal-lg border-t-3 border-black font-mono text-xs uppercase max-w-7xl mx-auto px-4">
        <p>Projeto Open Source • Transparência Radical</p>
      </footer>
    </main>
  );
}
