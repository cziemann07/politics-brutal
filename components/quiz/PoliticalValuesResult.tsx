"use client";

import type { UserPoliticalValue, PoliticalDimension } from "@/types/database";
import { TrendingUp, Users, Leaf, Shield, Eye, Building } from "lucide-react";

// Mapeamento de ícones
const DIMENSION_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  economia: TrendingUp,
  social: Users,
  ambiental: Leaf,
  seguranca: Shield,
  transparencia: Eye,
  federalismo: Building,
};

// Dimensões padrão (quando não vem do banco)
const DEFAULT_DIMENSIONS: Record<string, { name: string; leftLabel: string; rightLabel: string }> = {
  economia: { name: "Economia", leftLabel: "Intervenção estatal", rightLabel: "Livre mercado" },
  social: { name: "Costumes", leftLabel: "Progressista", rightLabel: "Conservador" },
  ambiental: { name: "Meio Ambiente", leftLabel: "Preservação", rightLabel: "Desenvolvimento" },
  seguranca: { name: "Segurança", leftLabel: "Garantismo", rightLabel: "Punitivismo" },
  transparencia: { name: "Transparência", leftLabel: "Mais controle", rightLabel: "Menos burocracia" },
  federalismo: { name: "Federalismo", leftLabel: "Centralização", rightLabel: "Descentralização" },
};

type PoliticalValuesResultProps = {
  values: UserPoliticalValue[];
  dimensions?: PoliticalDimension[];
  showLabels?: boolean;
};

export function PoliticalValuesResult({
  values,
  dimensions,
  showLabels = true,
}: PoliticalValuesResultProps) {
  // Ordena valores por dimensão
  const sortedValues = [...values].sort((a, b) => {
    const dimA = dimensions?.find((d) => d.id === a.dimension_id);
    const dimB = dimensions?.find((d) => d.id === b.dimension_id);
    return (dimA?.sort_order || 0) - (dimB?.sort_order || 0);
  });

  const getDimensionInfo = (dimensionId: string) => {
    const dim = dimensions?.find((d) => d.id === dimensionId);
    if (dim) {
      return {
        name: dim.name,
        leftLabel: dim.left_label,
        rightLabel: dim.right_label,
      };
    }
    return DEFAULT_DIMENSIONS[dimensionId] || { name: dimensionId, leftLabel: "Esquerda", rightLabel: "Direita" };
  };

  return (
    <div className="space-y-6">
      {sortedValues.map((value) => {
        const Icon = DIMENSION_ICONS[value.dimension_id] || TrendingUp;
        const info = getDimensionInfo(value.dimension_id);

        // Determina a posição do indicador
        const position = Math.max(0, Math.min(100, value.score));

        // Determina a cor baseada na confiança
        const confidenceOpacity = 0.3 + value.confidence * 0.7;

        return (
          <div key={value.dimension_id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon size={18} className="text-gray-600 dark:text-brutal-dark-muted" />
                <span className="font-bold dark:text-brutal-dark-text">{info.name}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-brutal-dark-muted">
                {Math.round(value.confidence * 100)}% confiança
              </span>
            </div>

            {showLabels && (
              <div className="flex justify-between text-xs text-gray-500 dark:text-brutal-dark-muted">
                <span>{info.leftLabel}</span>
                <span>{info.rightLabel}</span>
              </div>
            )}

            <div className="relative h-6 bg-gradient-to-r from-blue-500 via-gray-300 to-red-500 border-2 border-black dark:border-brutal-dark-border">
              {/* Marcador central */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/30" />

              {/* Indicador do usuário */}
              <div
                className="absolute top-0 bottom-0 w-3 bg-black dark:bg-white border-2 border-white dark:border-black transition-all duration-500"
                style={{
                  left: `calc(${position}% - 6px)`,
                  opacity: confidenceOpacity,
                }}
              />
            </div>

            {/* Score numérico */}
            <div className="text-center">
              <span
                className={`text-sm font-bold px-2 py-0.5 ${
                  position < 40
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                    : position > 60
                      ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                }`}
              >
                {Math.round(value.score)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
