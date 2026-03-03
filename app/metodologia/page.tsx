import {
  Database,
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle,
  Globe,
  Clock,
  FileText,
} from "lucide-react";

export default function MetodologiaPage() {
  return (
    <main className="min-h-screen bg-brutal-bg dark:bg-brutal-dark-bg p-4 md:p-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="mb-8 border-b-3 border-black dark:border-brutal-dark-border pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black p-3 border-2 border-black">
            <BarChart3 size={32} className="text-white" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-brutal-dark-muted">
              Transparência Total
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none dark:text-brutal-dark-text">
              Metodologia
            </h1>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-700 dark:text-brutal-dark-muted max-w-3xl">
          Como coletamos, processamos e classificamos os dados. Sem caixa preta, sem manipulação.
        </p>
      </div>

      {/* FONTES DE DADOS */}
      <section className="mb-10">
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 dark:text-brutal-dark-text">
          <Database size={24} className="text-brutal-red" />
          Fontes de Dados
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card-brutal">
            <div className="flex items-center gap-3 mb-3">
              <Globe size={20} className="text-brutal-red" />
              <h3 className="font-black uppercase dark:text-brutal-dark-text">API da Câmara dos Deputados</h3>
            </div>
            <p className="font-medium text-gray-700 dark:text-brutal-dark-muted mb-3">
              Fonte primária e oficial. Dados abertos mantidos pela Câmara.
            </p>
            <ul className="space-y-2 text-sm font-bold text-gray-600 dark:text-brutal-dark-muted">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                Lista de deputados em exercício
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                Gastos da Cota Parlamentar (CEAP)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                Histórico de votações e presenças
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                Proposições e projetos de lei
              </li>
            </ul>
          </div>

          <div className="card-brutal">
            <div className="flex items-center gap-3 mb-3">
              <Shield size={20} className="text-blue-600" />
              <h3 className="font-black uppercase dark:text-brutal-dark-text">Portal da Transparência</h3>
            </div>
            <p className="font-medium text-gray-700 dark:text-brutal-dark-muted mb-3">
              Dados complementares sobre contratos e convênios federais.
            </p>
            <ul className="space-y-2 text-sm font-bold text-gray-600 dark:text-brutal-dark-muted">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                Contratos e licitações
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                Convênios e repasses
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CLASSIFICAÇÃO CEAP */}
      <section className="mb-10">
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 dark:text-brutal-dark-text">
          <FileText size={24} className="text-brutal-red" />
          Classificação CEAP
        </h2>

        <div className="card-brutal mb-4">
          <h3 className="font-black text-lg uppercase mb-3 dark:text-brutal-dark-text">O que é a CEAP?</h3>
          <p className="font-medium text-gray-700 dark:text-brutal-dark-muted">
            A Cota para o Exercício da Atividade Parlamentar (CEAP) é um valor mensal que cada
            deputado federal pode usar para custear despesas relacionadas ao mandato: passagens
            aéreas, combustível, alimentação, hospedagem, consultorias, divulgação, entre outros.
            Cada estado tem um teto diferente, definido pela distância de Brasília.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border-3 border-green-600 p-4 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={20} className="text-green-600" />
              <h3 className="font-black uppercase text-green-800 dark:text-green-400">Regular</h3>
            </div>
            <p className="font-medium text-gray-700 dark:text-brutal-dark-muted">
              Total mensal da CEAP está <strong>dentro do teto</strong> permitido para a UF do deputado.
            </p>
          </div>

          <div className="border-3 border-brutal-red p-4 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={20} className="text-brutal-red" />
              <h3 className="font-black uppercase text-red-800 dark:text-red-400">Irregular</h3>
            </div>
            <p className="font-medium text-gray-700 dark:text-brutal-dark-muted">
              Total mensal da CEAP <strong>ultrapassou o teto</strong> permitido para a UF do deputado.
            </p>
          </div>
        </div>
      </section>

      {/* ATUALIZAÇÃO */}
      <section className="mb-10">
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 dark:text-brutal-dark-text">
          <Clock size={24} className="text-brutal-red" />
          Frequência de Atualização
        </h2>

        <div className="card-brutal">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-black shrink-0">1</div>
              <div>
                <p className="font-black dark:text-brutal-dark-text">Lista de deputados</p>
                <p className="font-medium text-gray-600 dark:text-brutal-dark-muted text-sm">
                  Atualizada via script. Muda raramente (suplentes, cassações).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-black shrink-0">2</div>
              <div>
                <p className="font-black dark:text-brutal-dark-text">Gastos CEAP</p>
                <p className="font-medium text-gray-600 dark:text-brutal-dark-muted text-sm">
                  Cache de 1 hora. A API da Câmara tem delay de ~30 dias para publicar despesas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-black shrink-0">3</div>
              <div>
                <p className="font-black dark:text-brutal-dark-text">Votações</p>
                <p className="font-medium text-gray-600 dark:text-brutal-dark-muted text-sm">
                  Cache de 30 minutos. Votações plenárias são atualizadas em tempo quase real.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-black shrink-0">4</div>
              <div>
                <p className="font-black dark:text-brutal-dark-text">Presenças e faltas</p>
                <p className="font-medium text-gray-600 dark:text-brutal-dark-muted text-sm">
                  Verificadas via cron job. Notificações enviadas automaticamente aos seguidores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <div className="bg-brutal-bg dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border p-6 md:p-8">
        <div className="flex items-start gap-4">
          <Shield size={28} className="shrink-0 mt-1 text-gray-600 dark:text-brutal-dark-muted" />
          <div>
            <h3 className="font-black uppercase mb-2 dark:text-brutal-dark-text">Aviso de Isenção</h3>
            <p className="font-medium text-gray-700 dark:text-brutal-dark-muted">
              Este projeto não emite juízo de valor político, moral ou jurídico. A classificação é
              objetiva, matemática e baseada exclusivamente em dados oficiais e públicos. Os conteúdos
              editoriais na seção de Escândalos representam análises baseadas em fatos documentados
              e fontes verificáveis.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
