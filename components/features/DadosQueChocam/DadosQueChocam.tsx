"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, AlertCircle, Banknote, Loader2 } from "lucide-react";
import { StatCard } from "@/components/ui";

interface TopGastador {
  id: number;
  nome: string;
  partido: string;
  estado: string;
  urlFoto: string;
  gastos: number;
}

interface EstatisticasData {
  periodo: {
    mes: number;
    ano: number;
    label: string;
  };
  topGastador: TopGastador | null;
  estatisticas: {
    totalDeputados: number;
    mediaGastosCeap: number;
    totalGastosMes: number;
  };
  atualizadoEm: string;
}

export default function DadosQueChocam() {
  const [data, setData] = useState<EstatisticasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEstatisticas() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/estatisticas");
        if (!res.ok) throw new Error("Falha ao buscar estatísticas");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Não foi possível carregar os dados");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEstatisticas();
  }, []);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-brutal-md">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border shadow-hard dark:shadow-none p-6 flex items-center justify-center min-h-[200px]"
          >
            <Loader2 className="w-8 h-8 animate-spin text-brutal-blue" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-brutal-red text-white p-6 border-3 border-black text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p className="font-bold">{error || "Erro ao carregar dados"}</p>
      </div>
    );
  }

  const { topGastador, periodo, estatisticas } = data;

  return (
    <div className="grid md:grid-cols-3 gap-brutal-md">
      {/* Top Gastador */}
      {topGastador ? (
        <Link
          href={`/politico/${topGastador.id}`}
          className="bg-white dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border shadow-hard dark:shadow-none p-6 relative hover:shadow-hard-hover transition-all group"
        >
          <div className="absolute -top-3 -right-3 bg-brutal-red text-white text-xs font-black px-3 py-1 border-2 border-black rotate-3">
            #1 GASTADOR
          </div>
          <div className="flex items-center gap-brutal-sm mb-brutal-sm">
            <Trophy className="w-10 h-10 text-brutal-yellow dark:text-brutal-dark-accent" />
            <div>
              <h3 className="font-black text-lg uppercase dark:text-brutal-dark-text group-hover:text-brutal-blue dark:group-hover:text-brutal-dark-accent transition-colors">
                {topGastador.nome}
              </h3>
              <p className="text-xs font-bold text-gray-600 dark:text-brutal-dark-muted">
                {topGastador.partido} · {topGastador.estado}
              </p>
            </div>
          </div>
          <div className="border-t-2 border-black dark:border-brutal-dark-border pt-brutal-sm">
            <p className="text-label text-gray-600 dark:text-brutal-dark-muted mb-1">
              CEAP {periodo.label}
            </p>
            <p className="text-4xl font-black text-brutal-red">
              R$ {topGastador.gastos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </Link>
      ) : (
        <div className="bg-white dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border shadow-hard dark:shadow-none p-6">
          <div className="flex items-center gap-brutal-sm mb-brutal-sm">
            <Trophy className="w-10 h-10 text-brutal-yellow dark:text-brutal-dark-accent" />
            <div>
              <h3 className="font-black text-lg uppercase dark:text-brutal-dark-text">
                Carregando...
              </h3>
              <p className="text-xs font-bold text-gray-600 dark:text-brutal-dark-muted">
                Buscando dados
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Investigações */}
      <StatCard
        icon={AlertCircle}
        value="12"
        description="Investigações ativas contra políticos em exercício"
        variant="red"
      />

      {/* Fundão */}
      <StatCard
        icon={Banknote}
        label="Fundo Eleitoral 2024"
        value="R$ 4.9 BI"
        description="= 16.300 Ambulâncias que o Brasil precisa"
        variant="yellow"
      />
    </div>
  );
}
