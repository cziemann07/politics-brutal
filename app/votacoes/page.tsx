"use client";

import { useState } from "react";
import { FileText, Calendar, CheckCircle2, XCircle, Minus } from "lucide-react";

// Placeholder - será substituído por dados reais da API
const mockVotacoes = [
  {
    id: 1,
    titulo: "PL 1234/2024 - Reforma Tributária",
    data: "2024-09-15",
    status: "Aprovado",
    descricao: "Projeto que altera a estrutura tributária do país",
    votos: {
      sim: 320,
      nao: 150,
      abstencoes: 43,
    },
  },
  {
    id: 2,
    titulo: "PL 5678/2024 - Marco Legal da IA",
    data: "2024-09-10",
    status: "Rejeitado",
    descricao: "Regulamentação do uso de inteligência artificial",
    votos: {
      sim: 200,
      nao: 280,
      abstencoes: 33,
    },
  },
];

export default function VotacoesPage() {
  const [selectedVotacao, setSelectedVotacao] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-brutal-bg p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-black uppercase mb-2">Últimas Votações Relevantes</h1>
        <p className="text-lg font-bold text-gray-700">
          Acompanhe como os deputados votaram nos projetos mais importantes
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Lista de Votações */}
        <div className="md:col-span-2 space-y-4">
          {mockVotacoes.map((votacao) => (
            <div
              key={votacao.id}
              onClick={() => setSelectedVotacao(votacao.id)}
              className={`card-brutal cursor-pointer transition-all ${
                selectedVotacao === votacao.id
                  ? "bg-brutal-yellow border-4"
                  : "hover:shadow-hard-hover"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-black text-xl uppercase mb-2">{votacao.titulo}</h3>
                  <p className="text-sm font-medium text-gray-700 mb-3">{votacao.descricao}</p>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(votacao.data).toLocaleDateString("pt-BR")}
                    </span>
                    <span
                      className={`px-2 py-1 border-2 border-black ${
                        votacao.status === "Aprovado" ? "bg-green-400" : "bg-brutal-red text-white"
                      }`}
                    >
                      {votacao.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resultado da Votação */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-green-100 border-2 border-black p-2 text-center">
                  <CheckCircle2 size={16} className="mx-auto mb-1" />
                  <p className="text-xs font-bold">SIM</p>
                  <p className="text-lg font-black">{votacao.votos.sim}</p>
                </div>
                <div className="bg-red-100 border-2 border-black p-2 text-center">
                  <XCircle size={16} className="mx-auto mb-1" />
                  <p className="text-xs font-bold">NÃO</p>
                  <p className="text-lg font-black">{votacao.votos.nao}</p>
                </div>
                <div className="bg-gray-100 border-2 border-black p-2 text-center">
                  <Minus size={16} className="mx-auto mb-1" />
                  <p className="text-xs font-bold">ABST</p>
                  <p className="text-lg font-black">{votacao.votos.abstencoes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar - Detalhes */}
        <div className="space-y-4">
          <div className="card-brutal bg-brutal-yellow">
            <h3 className="font-black uppercase mb-3 flex items-center gap-2">
              <FileText size={20} />
              Como Funciona
            </h3>
            <p className="text-sm font-medium leading-relaxed">
              Esta seção mostra as votações mais relevantes da Câmara. Clique em uma votação para
              ver como cada deputado votou.
            </p>
          </div>

          <div className="card-brutal">
            <h3 className="font-black uppercase mb-3">Próximas Votações</h3>
            <p className="text-sm text-gray-600 italic">
              Em breve: integração com API da Câmara para votações em tempo real
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
