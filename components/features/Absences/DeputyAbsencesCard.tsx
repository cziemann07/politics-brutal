"use client";

import { useState, useEffect } from "react";
import {
  Vote,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

interface AbsenceData {
  id: string;
  deputado_id: number;
  deputado_nome: string;
  evento_tipo: string;
  evento_titulo?: string;
  evento_data: string;
  evento_orgao?: string;
  votacao_id?: string;
  votacao_descricao?: string;
  justificada: boolean;
  justificativa?: string;
}

interface EstatisticasPresenca {
  totalVotacoes: number;
  presencas: number;
  ausencias: number;
  percentualPresenca: number;
}

interface DeputyAbsencesCardProps {
  deputadoId: number;
  deputadoNome: string;
}

export default function DeputyAbsencesCard({
  deputadoId,
  deputadoNome,
}: DeputyAbsencesCardProps) {
  const [faltas, setFaltas] = useState<AbsenceData[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasPresenca | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingFresh, setLoadingFresh] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega dados de faltas
  async function loadAbsences(fresh = false) {
    if (fresh) {
      setLoadingFresh(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const url = `/api/absences/${deputadoId}?days=90${fresh ? "&fresh=true" : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const data = await response.json();
      setFaltas(data.faltas || []);
      setEstatisticas(data.estatisticas);
    } catch (err) {
      setError(String(err));
      console.error("Erro ao carregar faltas:", err);
    } finally {
      setLoading(false);
      setLoadingFresh(false);
    }
  }

  useEffect(() => {
    loadAbsences();
  }, [deputadoId]);

  // Formata data
  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Determina cor baseada no percentual de presença
  function getPresencaColor(percentual: number): string {
    if (percentual >= 90) return "text-green-600";
    if (percentual >= 70) return "text-yellow-600";
    if (percentual >= 50) return "text-orange-500";
    return "text-red-500";
  }

  if (loading) {
    return (
      <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-brutal bg-white dark:bg-brutal-dark-surface p-6">
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-2" />
          <p className="text-gray-600 dark:text-brutal-dark-muted">
            Erro ao carregar dados de presença
          </p>
          <button
            onClick={() => loadAbsences()}
            className="mt-4 text-sm text-brutal-blue hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const percentual = estatisticas?.percentualPresenca ?? 100;
  const totalFaltas = faltas.length;

  return (
    <div className="card-brutal bg-white dark:bg-brutal-dark-surface">
      {/* Header */}
      <div className="p-6 border-b-3 border-black dark:border-brutal-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-card flex items-center gap-2 dark:text-brutal-dark-text">
            <Vote className="w-5 h-5" />
            Presença em Votações
          </h3>
          <button
            onClick={() => loadAbsences(true)}
            disabled={loadingFresh}
            className="text-sm text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1"
            title="Atualizar dados (busca da API)"
          >
            <RefreshCw size={14} className={loadingFresh ? "animate-spin" : ""} />
            {loadingFresh ? "Atualizando..." : "Atualizar"}
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border">
            <span className={`text-3xl font-black ${getPresencaColor(percentual)}`}>
              {percentual}%
            </span>
            <span className="block text-xs uppercase text-gray-500 mt-1">
              Presença
            </span>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border">
            <span className="text-3xl font-black dark:text-brutal-dark-text">
              {estatisticas?.totalVotacoes ?? "-"}
            </span>
            <span className="block text-xs uppercase text-gray-500 mt-1">
              Votações
            </span>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border">
            <span className="text-3xl font-black text-red-500">{totalFaltas}</span>
            <span className="block text-xs uppercase text-gray-500 mt-1">
              Faltas
            </span>
          </div>
        </div>

        {/* Alerta se muitas faltas */}
        {totalFaltas > 10 && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border-2 border-red-500 flex items-start gap-2">
            <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-700 dark:text-red-400 text-sm">
                Alto número de faltas
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Este deputado teve {totalFaltas} faltas nos últimos 90 dias.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Faltas */}
      {totalFaltas > 0 && (
        <div className="p-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-sm font-bold dark:text-brutal-dark-text"
          >
            <span>Últimas Faltas ({Math.min(faltas.length, 10)})</span>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {expanded && (
            <div className="mt-4 space-y-3">
              {faltas.slice(0, 10).map((falta) => (
                <div
                  key={falta.id}
                  className="p-3 border-2 border-gray-200 dark:border-brutal-dark-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                      <Vote size={16} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm dark:text-brutal-dark-text truncate">
                        {falta.votacao_descricao || falta.evento_titulo || "Votação"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-brutal-dark-muted">
                          {formatDate(falta.evento_data)}
                        </span>
                        {falta.evento_orgao && (
                          <span className="text-xs bg-gray-100 dark:bg-brutal-dark-bg px-2 py-0.5 dark:text-brutal-dark-muted">
                            {falta.evento_orgao}
                          </span>
                        )}
                      </div>
                      {falta.justificada && falta.justificativa && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Justificativa: {falta.justificativa}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {faltas.length > 10 && (
                <p className="text-center text-sm text-gray-500 dark:text-brutal-dark-muted">
                  E mais {faltas.length - 10} faltas...
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sem faltas */}
      {totalFaltas === 0 && (
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3">
            <Vote size={24} className="text-green-600" />
          </div>
          <p className="font-bold dark:text-brutal-dark-text">Nenhuma falta registrada</p>
          <p className="text-sm text-gray-500 dark:text-brutal-dark-muted">
            Este deputado compareceu a todas as votações recentes
          </p>
        </div>
      )}
    </div>
  );
}

