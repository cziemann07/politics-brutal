"use client";

import { AlertCircle, Scale, FileText, TrendingDown } from "lucide-react";

// Placeholder - será substituído por dados reais
const mockInvestigacoes = [
  {
    id: 1,
    deputado: "João Silva",
    partido: "PT",
    estado: "SP",
    tipo: "Desvio de Verba",
    status: "Em Andamento",
    descricao: "Investigação sobre uso irregular da verba de gabinete",
    dataInicio: "2024-08-15",
  },
  {
    id: 2,
    deputado: "Maria Santos",
    partido: "PL",
    estado: "RJ",
    tipo: "Corrupção",
    status: "Arquivado",
    descricao: "Processo arquivado por falta de provas",
    dataInicio: "2024-07-10",
  },
];

export default function InvestigacoesPage() {
  return (
    <main className="min-h-screen bg-brutal-bg p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-black uppercase mb-2 flex items-center gap-3">
          <AlertCircle size={48} className="text-brutal-red" />
          Investigações em Andamento
        </h1>
        <p className="text-lg font-bold text-gray-700">
          Acompanhe investigações e processos envolvendo deputados
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card-brutal bg-brutal-red text-white text-center">
          <p className="text-3xl font-black mb-1">12</p>
          <p className="text-sm font-bold uppercase">Em Andamento</p>
        </div>
        <div className="card-brutal bg-yellow-400 text-center">
          <p className="text-3xl font-black mb-1">5</p>
          <p className="text-sm font-bold uppercase">Aguardando</p>
        </div>
        <div className="card-brutal bg-green-400 text-center">
          <p className="text-3xl font-black mb-1">8</p>
          <p className="text-sm font-bold uppercase">Arquivados</p>
        </div>
        <div className="card-brutal bg-black text-white text-center">
          <p className="text-3xl font-black mb-1">25</p>
          <p className="text-sm font-bold uppercase">Total</p>
        </div>
      </div>

      {/* Lista de Investigações */}
      <div className="space-y-4">
        {mockInvestigacoes.map((investigacao) => (
          <div key={investigacao.id} className="card-brutal">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-black text-xl uppercase">{investigacao.deputado}</h3>
                  <span className="text-sm font-bold bg-gray-200 px-2 py-1 border border-black">
                    {investigacao.partido} · {investigacao.estado}
                  </span>
                </div>
                <p className="font-bold text-brutal-red mb-2">{investigacao.tipo}</p>
                <p className="text-sm font-medium text-gray-700 mb-3">{investigacao.descricao}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    Iniciado em {new Date(investigacao.dataInicio).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <span
                  className={`px-3 py-2 font-black uppercase text-sm border-2 border-black ${
                    investigacao.status === "Em Andamento"
                      ? "bg-brutal-red text-white"
                      : investigacao.status === "Arquivado"
                        ? "bg-gray-300"
                        : "bg-yellow-400"
                  }`}
                >
                  {investigacao.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder */}
      <div className="mt-8 card-brutal bg-brutal-yellow">
        <p className="font-bold text-center">
          🔄 Em breve: Integração com dados de processos judiciais e investigações
        </p>
      </div>
    </main>
  );
}
