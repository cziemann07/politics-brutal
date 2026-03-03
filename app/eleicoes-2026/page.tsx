import {
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function Eleicoes2026Page() {
  return (
    <main className="min-h-screen bg-brutal-bg dark:bg-brutal-dark-bg p-4 md:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-8 border-b-3 border-black dark:border-brutal-dark-border pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-brutal-red p-2 border-2 border-black dark:border-brutal-red">
            <TrendingUp size={32} className="text-white" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-brutal-red">
              Em Construção
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none dark:text-brutal-dark-text">
              Eleições 2026
            </h1>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-700 dark:text-brutal-dark-muted max-w-3xl">
          Acompanhe candidatos, patrimônio declarado, doações e histórico político.
          Tudo com dados oficiais do TSE para você votar com consciência.
        </p>
      </div>

      {/* AVISO */}
      <div className="card-brutal bg-black text-white mb-8">
        <div className="flex items-start gap-4">
          <AlertTriangle size={32} className="shrink-0 mt-1 text-brutal-red" />
          <div>
            <p className="font-black text-xl uppercase mb-2">
              Módulo em desenvolvimento
            </p>
            <p className="font-medium text-lg opacity-90">
              Estamos preparando uma plataforma completa para as eleições de 2026.
              Enquanto isso, confira nossas{" "}
              <Link href="/escandalos" className="underline text-brutal-red hover:text-red-300 transition-colors">
                denúncias e escândalos
              </Link>{" "}
              para não esquecer o histórico de quem pede seu voto.
            </p>
          </div>
        </div>
      </div>

      {/* O QUE VEM POR AÍ */}
      <h2 className="text-2xl font-black uppercase mb-6 dark:text-brutal-dark-text">
        O que vem por aí
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-brutal">
          <div className="bg-brutal-red p-3 border-2 border-black dark:border-brutal-red w-fit mb-4">
            <Users size={28} className="text-white" />
          </div>
          <h3 className="font-black text-lg uppercase mb-2 dark:text-brutal-dark-text">Candidatos</h3>
          <p className="font-medium text-gray-600 dark:text-brutal-dark-muted">
            Perfil completo de cada candidato com histórico de mandatos, processos e votações anteriores.
          </p>
        </div>

        <div className="card-brutal">
          <div className="bg-black p-3 border-2 border-black w-fit mb-4">
            <DollarSign size={28} className="text-white" />
          </div>
          <h3 className="font-black text-lg uppercase mb-2 dark:text-brutal-dark-text">Patrimônio Declarado</h3>
          <p className="font-medium text-gray-600 dark:text-brutal-dark-muted">
            Evolução patrimonial dos candidatos ao longo dos mandatos. Quanto tinham antes e quanto têm agora.
          </p>
        </div>

        <div className="card-brutal">
          <div className="bg-green-600 p-3 border-2 border-black dark:border-green-600 w-fit mb-4">
            <FileText size={28} className="text-white" />
          </div>
          <h3 className="font-black text-lg uppercase mb-2 dark:text-brutal-dark-text">Doações de Campanha</h3>
          <p className="font-medium text-gray-600 dark:text-brutal-dark-muted">
            Quem financiou cada candidato. Empresas, pessoas físicas e uso do Fundo Eleitoral.
          </p>
        </div>

        <div className="card-brutal">
          <div className="bg-blue-600 p-3 border-2 border-black dark:border-blue-600 w-fit mb-4">
            <Calendar size={28} className="text-white" />
          </div>
          <h3 className="font-black text-lg uppercase mb-2 dark:text-brutal-dark-text">Calendário Eleitoral</h3>
          <p className="font-medium text-gray-600 dark:text-brutal-dark-muted">
            Datas importantes: registro de candidatura, debates, votação e apuração.
          </p>
        </div>

        <div className="card-brutal sm:col-span-2 lg:col-span-2">
          <div className="bg-gray-800 p-3 border-2 border-black w-fit mb-4">
            <TrendingUp size={28} className="text-white" />
          </div>
          <h3 className="font-black text-lg uppercase mb-2 dark:text-brutal-dark-text">Comparador de Candidatos</h3>
          <p className="font-medium text-gray-600 dark:text-brutal-dark-muted">
            Compare lado a lado: gastos, presença, votações e propostas. Sem viés ideológico, só dados.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 bg-brutal-bg dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border p-6 md:p-8 text-center">
        <h3 className="text-2xl font-black uppercase mb-4 dark:text-brutal-dark-text">
          Não Espere 2026 Para Se Informar
        </h3>
        <p className="font-medium text-lg max-w-2xl mx-auto mb-6 dark:text-brutal-dark-muted">
          Acompanhe agora mesmo o que seus deputados estão fazendo com o seu dinheiro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/bancada"
            className="bg-black text-white px-6 py-3 font-black uppercase text-sm border-2 border-black hover:bg-gray-800 transition-colors"
          >
            Ver Bancada Federal
          </Link>
          <Link
            href="/votacoes"
            className="bg-white dark:bg-brutal-dark-surface text-black dark:text-brutal-dark-text px-6 py-3 font-black uppercase text-sm border-2 border-black dark:border-brutal-dark-border hover:bg-black hover:text-white dark:hover:bg-brutal-dark-accent transition-colors"
          >
            Ver Votações
          </Link>
        </div>
      </div>
    </main>
  );
}
