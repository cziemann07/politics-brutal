"use client";

import { useState } from "react";
import { TrendingUp, BarChart3, Users, MapPin, Target } from "lucide-react";

// Placeholder - estrutura base para projeções eleitorais
const mockProjecoes = {
  presidencia: [
    { nome: "Candidato A", partido: "PT", projecao: 35, cor: "bg-red-500" },
    { nome: "Candidato B", partido: "PL", projecao: 28, cor: "bg-blue-500" },
    { nome: "Candidato C", partido: "PSDB", projecao: 15, cor: "bg-yellow-500" },
  ],
  governadores: [
    { estado: "SP", candidato: "João Silva", partido: "PT", projecao: 42 },
    { estado: "RJ", candidato: "Maria Santos", partido: "PL", projecao: 38 },
    { estado: "MG", candidato: "Pedro Costa", partido: "PSDB", projecao: 35 },
  ],
};

export default function Eleicoes2026Page() {
  const [aba, setAba] = useState<"presidencia" | "governadores" | "deputados">("presidencia");

  return (
    <main className="min-h-screen bg-brutal-bg p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-black uppercase mb-2 flex items-center gap-3">
          <TrendingUp size={48} className="text-brutal-red" />
          Projeções Eleições 2026
        </h1>
        <p className="text-lg font-bold text-gray-700">
          Análise de dados e projeções baseadas em pesquisas e histórico eleitoral
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b-3 border-black">
        {[
          { id: "presidencia" as const, label: "Presidência", icon: Target },
          { id: "governadores" as const, label: "Governadores", icon: MapPin },
          { id: "deputados" as const, label: "Deputados", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setAba(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-black uppercase border-2 border-b-0 border-black transition-all ${
                aba === tab.id ? "bg-black text-white" : "bg-white hover:bg-brutal-yellow"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo das Tabs */}
      {aba === "presidencia" && (
        <div className="space-y-6">
          <div className="card-brutal">
            <h2 className="font-black text-2xl uppercase mb-6">Projeções Presidenciais</h2>
            <div className="space-y-4">
              {mockProjecoes.presidencia.map((candidato, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 ${candidato.cor} border-2 border-black`}></div>
                      <span className="font-bold">{candidato.nome}</span>
                      <span className="text-sm font-bold bg-gray-200 px-2 py-1 border border-black">
                        {candidato.partido}
                      </span>
                    </div>
                    <span className="font-black text-xl">{candidato.projecao}%</span>
                  </div>
                  <div className="w-full bg-gray-200 border-2 border-black h-8 relative overflow-hidden">
                    <div
                      className={`${candidato.cor} h-full border-r-2 border-black`}
                      style={{ width: `${candidato.projecao}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-brutal bg-brutal-yellow">
            <h3 className="font-black uppercase mb-3">Metodologia</h3>
            <p className="text-sm font-medium">
              Projeções baseadas em análise de pesquisas eleitorais, histórico de votações, e
              tendências políticas. Atualizado regularmente conforme novas pesquisas são publicadas.
            </p>
          </div>
        </div>
      )}

      {aba === "governadores" && (
        <div className="card-brutal">
          <h2 className="font-black text-2xl uppercase mb-6">Projeções para Governadores</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {mockProjecoes.governadores.map((gov, idx) => (
              <div key={idx} className="border-2 border-black p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-lg">{gov.estado}</span>
                  <span className="font-black text-xl">{gov.projecao}%</span>
                </div>
                <p className="font-bold">{gov.candidato}</p>
                <p className="text-sm font-bold text-gray-600">{gov.partido}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {aba === "deputados" && (
        <div className="card-brutal">
          <h2 className="font-black text-2xl uppercase mb-6">Projeções para Deputados</h2>
          <div className="bg-brutal-yellow p-6 text-center">
            <BarChart3 size={48} className="mx-auto mb-4 text-black" />
            <p className="font-bold">
              Esta seção está em desenvolvimento. Em breve você poderá ver projeções detalhadas por
              estado, partido e candidato.
            </p>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-8 card-brutal bg-black text-white">
        <h3 className="font-black text-xl uppercase mb-3">🚧 Área em Desenvolvimento</h3>
        <p className="font-medium">
          Esta é uma das áreas prioritárias do projeto. Estamos trabalhando em:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 font-medium">
          <li>Integração com dados de pesquisas eleitorais</li>
          <li>Análise de histórico de votações e posicionamentos</li>
          <li>Projeções baseadas em machine learning</li>
          <li>Comparações com eleições anteriores</li>
        </ul>
      </div>
    </main>
  );
}
