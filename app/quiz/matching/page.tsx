"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  TrendingUp,
  Users,
  Leaf,
  Shield,
  Eye,
  ArrowLeft,
  ExternalLink,
  Heart,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { PoliticalValuesResult } from "@/components/quiz";
import type { UserPoliticalValue } from "@/types/database";

// Tipos para os deputados
type DeputadoMatch = {
  id: number;
  nome: string;
  partido: string;
  uf: string;
  urlFoto: string;
  matchScore: number;
  dimensionBreakdown: {
    dimension: string;
    userScore: number;
    politicianScore: number;
    difference: number;
  }[];
};

// Perfis simulados de políticos (baseados em posições públicas conhecidas)
// Em produção, isso viria do banco de dados baseado em votações reais
const SIMULATED_POLITICIAN_PROFILES: Record<
  number,
  { economia: number; social: number; ambiental: number; seguranca: number; transparencia: number }
> = {
  // Perfis de exemplo com scores de 0 (esquerda) a 100 (direita)
  204554: { economia: 75, social: 80, ambiental: 70, seguranca: 85, transparencia: 40 }, // Eduardo Bolsonaro
  178957: { economia: 25, social: 20, ambiental: 25, seguranca: 30, transparencia: 70 }, // Erika Kokay
  204379: { economia: 50, social: 45, ambiental: 60, seguranca: 50, transparencia: 60 }, // Kim Kataguiri
  160546: { economia: 20, social: 15, ambiental: 20, seguranca: 25, transparencia: 75 }, // Glauber Braga
  178835: { economia: 60, social: 55, ambiental: 40, seguranca: 65, transparencia: 55 }, // Arthur Lira
  204560: { economia: 30, social: 25, ambiental: 80, seguranca: 35, transparencia: 80 }, // Talíria Petrone
  204521: { economia: 85, social: 90, ambiental: 30, seguranca: 90, transparencia: 35 }, // Nikolas Ferreira
  141428: { economia: 35, social: 40, ambiental: 70, seguranca: 40, transparencia: 65 }, // Orlando Silva
  178873: { economia: 70, social: 75, ambiental: 45, seguranca: 80, transparencia: 45 }, // Marcos Pereira
  204534: { economia: 80, social: 85, ambiental: 35, seguranca: 85, transparencia: 40 }, // Carla Zambelli
};

// Dados simulados de deputados
const SIMULATED_DEPUTIES = [
  { id: 204554, nome: "Eduardo Bolsonaro", partido: "PL", uf: "SP", urlFoto: "" },
  { id: 178957, nome: "Erika Kokay", partido: "PT", uf: "DF", urlFoto: "" },
  { id: 204379, nome: "Kim Kataguiri", partido: "UNIÃO", uf: "SP", urlFoto: "" },
  { id: 160546, nome: "Glauber Braga", partido: "PSOL", uf: "RJ", urlFoto: "" },
  { id: 178835, nome: "Arthur Lira", partido: "PP", uf: "AL", urlFoto: "" },
  { id: 204560, nome: "Talíria Petrone", partido: "PSOL", uf: "RJ", urlFoto: "" },
  { id: 204521, nome: "Nikolas Ferreira", partido: "PL", uf: "MG", urlFoto: "" },
  { id: 141428, nome: "Orlando Silva", partido: "PCdoB", uf: "SP", urlFoto: "" },
  { id: 178873, nome: "Marcos Pereira", partido: "REPUBLICANOS", uf: "SP", urlFoto: "" },
  { id: 204534, nome: "Carla Zambelli", partido: "PL", uf: "SP", urlFoto: "" },
];

const DIMENSION_NAMES: Record<string, string> = {
  economia: "Economia",
  social: "Costumes",
  ambiental: "Meio Ambiente",
  seguranca: "Segurança",
  transparencia: "Transparência",
};

function calculateMatch(
  userValues: UserPoliticalValue[],
  politicianId: number
): DeputadoMatch | null {
  const profile = SIMULATED_POLITICIAN_PROFILES[politicianId];
  const deputy = SIMULATED_DEPUTIES.find((d) => d.id === politicianId);

  if (!profile || !deputy) return null;

  const breakdown: DeputadoMatch["dimensionBreakdown"] = [];
  let totalDifference = 0;
  let count = 0;

  for (const value of userValues) {
    const politicianScore = profile[value.dimension_id as keyof typeof profile];
    if (politicianScore !== undefined) {
      const difference = Math.abs(value.score - politicianScore);
      totalDifference += difference;
      count++;

      breakdown.push({
        dimension: value.dimension_id,
        userScore: value.score,
        politicianScore,
        difference,
      });
    }
  }

  // Score de match: 100 - média das diferenças
  const matchScore = count > 0 ? Math.round(100 - totalDifference / count) : 50;

  return {
    ...deputy,
    matchScore,
    dimensionBreakdown: breakdown,
  };
}

export default function MatchingPage() {
  const [userValues, setUserValues] = useState<UserPoliticalValue[]>([]);
  const [matches, setMatches] = useState<DeputadoMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDeputy, setExpandedDeputy] = useState<number | null>(null);

  useEffect(() => {
    // Carregar valores do localStorage
    const saved = localStorage.getItem("political-values");
    if (saved) {
      try {
        const values = JSON.parse(saved) as UserPoliticalValue[];
        setUserValues(values);

        // Calcular matches
        const calculatedMatches = SIMULATED_DEPUTIES.map((deputy) => calculateMatch(values, deputy.id)).filter(
          (m): m is DeputadoMatch => m !== null
        );

        // Ordenar por score de match (maior primeiro)
        calculatedMatches.sort((a, b) => b.matchScore - a.matchScore);

        setMatches(calculatedMatches);
      } catch {
        // Ignora erros de parse
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-brutal-dark-muted">Calculando compatibilidade...</p>
        </div>
      </main>
    );
  }

  if (userValues.length === 0) {
    return (
      <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
        <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-8 text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-black mb-2 dark:text-brutal-dark-text">
            Perfil Político Não Encontrado
          </h1>
          <p className="text-gray-600 dark:text-brutal-dark-muted mb-6">
            Você precisa completar o quiz de valores primeiro para ver os deputados mais alinhados
            com você.
          </p>
          <Link href="/quiz" className="btn-brutal bg-brutal-yellow dark:bg-brutal-dark-accent">
            Fazer Quiz de Valores
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/quiz"
          className="text-sm text-gray-500 hover:text-black dark:hover:text-white mb-2 inline-flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Voltar ao Quiz
        </Link>
        <h1 className="text-3xl md:text-4xl font-black uppercase dark:text-brutal-dark-text">
          Deputados Alinhados
        </h1>
        <p className="text-gray-600 dark:text-brutal-dark-muted">
          Baseado no seu perfil político, encontramos os deputados mais compatíveis com seus valores
        </p>
      </div>

      {/* Seu perfil resumido */}
      <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-4 mb-6">
        <h2 className="font-black text-sm uppercase mb-3 dark:text-brutal-dark-text">Seu Perfil</h2>
        <div className="flex flex-wrap gap-2">
          {userValues.map((value) => (
            <span
              key={value.dimension_id}
              className={`px-3 py-1 text-sm font-bold border-2 border-black ${
                value.score < 40
                  ? "bg-blue-100 text-blue-800"
                  : value.score > 60
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {DIMENSION_NAMES[value.dimension_id] || value.dimension_id}: {Math.round(value.score)}
            </span>
          ))}
        </div>
      </div>

      {/* Lista de matches */}
      <div className="space-y-4">
        {matches.map((match, index) => (
          <div
            key={match.id}
            className="card-brutal bg-white dark:bg-brutal-dark-surface overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedDeputy(expandedDeputy === match.id ? null : match.id)}
            >
              <div className="flex items-center gap-4">
                {/* Ranking */}
                <div
                  className={`w-10 h-10 flex items-center justify-center font-black text-lg border-2 border-black ${
                    index === 0
                      ? "bg-brutal-yellow"
                      : index === 1
                        ? "bg-gray-300"
                        : index === 2
                          ? "bg-orange-300"
                          : "bg-white dark:bg-brutal-dark-bg"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Foto */}
                <div className="w-14 h-14 bg-gray-200 dark:bg-brutal-dark-bg rounded-full overflow-hidden flex-shrink-0 border-2 border-black">
                  {match.urlFoto ? (
                    <img src={match.urlFoto} alt={match.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={28} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg truncate dark:text-brutal-dark-text">{match.nome}</h3>
                  <p className="text-sm text-gray-600 dark:text-brutal-dark-muted">
                    {match.partido} · {match.uf}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div
                    className={`text-2xl font-black ${
                      match.matchScore >= 70
                        ? "text-green-600"
                        : match.matchScore >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {match.matchScore}%
                  </div>
                  <p className="text-xs text-gray-500">compatível</p>
                </div>
              </div>
            </div>

            {/* Detalhes expandidos */}
            {expandedDeputy === match.id && (
              <div className="border-t-2 border-black dark:border-brutal-dark-border p-4 bg-gray-50 dark:bg-brutal-dark-bg">
                <h4 className="font-bold text-sm mb-3 dark:text-brutal-dark-text">
                  Comparação por Dimensão
                </h4>
                <div className="space-y-3">
                  {match.dimensionBreakdown.map((dim) => (
                    <div key={dim.dimension} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold dark:text-brutal-dark-text">
                          {DIMENSION_NAMES[dim.dimension] || dim.dimension}
                        </span>
                        <span
                          className={`font-bold ${
                            dim.difference < 20
                              ? "text-green-600"
                              : dim.difference < 40
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {dim.difference < 20 ? "Muito próximo" : dim.difference < 40 ? "Próximo" : "Distante"}
                        </span>
                      </div>
                      <div className="relative h-4 bg-gray-200 dark:bg-brutal-dark-surface border border-black dark:border-brutal-dark-border">
                        {/* Sua posição */}
                        <div
                          className="absolute top-0 bottom-0 w-2 bg-blue-500 border border-blue-700"
                          style={{ left: `calc(${dim.userScore}% - 4px)` }}
                          title={`Você: ${Math.round(dim.userScore)}`}
                        />
                        {/* Posição do político */}
                        <div
                          className="absolute top-0 bottom-0 w-2 bg-red-500 border border-red-700"
                          style={{ left: `calc(${dim.politicianScore}% - 4px)` }}
                          title={`${match.nome}: ${Math.round(dim.politicianScore)}`}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Você: {Math.round(dim.userScore)}</span>
                        <span>
                          {match.nome.split(" ")[0]}: {Math.round(dim.politicianScore)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ações */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-brutal-dark-border">
                  <Link
                    href={`/politico/${match.id}`}
                    className="btn-brutal bg-black dark:bg-brutal-dark-accent text-white text-sm flex-1 flex items-center justify-center gap-2"
                  >
                    Ver Perfil
                    <ExternalLink size={14} />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Adicionar aos favoritos
                      alert("Funcionalidade de favoritos em breve!");
                    }}
                    className="btn-brutal bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white text-sm px-4"
                  >
                    <Heart size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Aviso sobre dados simulados */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 text-sm">
        <p className="text-yellow-800 dark:text-yellow-200">
          <strong>Nota:</strong> Os perfis políticos dos deputados são simulados para demonstração.
          Em breve, calcularemos automaticamente baseado em votações reais da Câmara.
        </p>
      </div>
    </main>
  );
}
