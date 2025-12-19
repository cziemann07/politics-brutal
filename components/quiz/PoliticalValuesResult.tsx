"use client";

import type { UserPoliticalValue, PoliticalDimension } from "@/types/database";
import { TrendingUp, Users, Leaf, Shield, Eye, Building, Scale, Flag, BookOpen, Heart } from "lucide-react";

// Mapeamento de ícones
const DIMENSION_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  economia: TrendingUp,
  social: Users,
  ambiental: Leaf,
  seguranca: Shield,
  transparencia: Eye,
  federalismo: Building,
  liberdades: Heart,
  autoridade: Scale,
  nacionalismo: Flag,
  ideologia: BookOpen,
};

// Dimensões padrão (quando não vem do banco)
const DEFAULT_DIMENSIONS: Record<string, { name: string; leftLabel: string; rightLabel: string; leftColor: string; rightColor: string }> = {
  economia: { name: "Economia", leftLabel: "Estatismo", rightLabel: "Livre Mercado", leftColor: "#ef4444", rightColor: "#3b82f6" },
  social: { name: "Costumes", leftLabel: "Progressista", rightLabel: "Conservador", leftColor: "#a855f7", rightColor: "#f97316" },
  ambiental: { name: "Meio Ambiente", leftLabel: "Preservação", rightLabel: "Desenvolvimento", leftColor: "#22c55e", rightColor: "#eab308" },
  seguranca: { name: "Segurança", leftLabel: "Garantismo", rightLabel: "Punitivismo", leftColor: "#06b6d4", rightColor: "#dc2626" },
  transparencia: { name: "Transparência", leftLabel: "Mais controle", rightLabel: "Menos burocracia", leftColor: "#8b5cf6", rightColor: "#64748b" },
  federalismo: { name: "Federalismo", leftLabel: "Centralização", rightLabel: "Descentralização", leftColor: "#f43f5e", rightColor: "#10b981" },
  liberdades: { name: "Liberdades Individuais", leftLabel: "Liberal", rightLabel: "Tradicional", leftColor: "#ec4899", rightColor: "#78716c" },
  autoridade: { name: "Autoridade", leftLabel: "Libertário", rightLabel: "Autoritário", leftColor: "#fbbf24", rightColor: "#1e293b" },
  nacionalismo: { name: "Identidade Nacional", leftLabel: "Globalista", rightLabel: "Nacionalista", leftColor: "#06b6d4", rightColor: "#15803d" },
  ideologia: { name: "Posição Ideológica", leftLabel: "Esquerda", rightLabel: "Direita", leftColor: "#dc2626", rightColor: "#2563eb" },
};

type PoliticalValuesResultProps = {
  values: UserPoliticalValue[];
  dimensions?: PoliticalDimension[];
  showLabels?: boolean;
  compact?: boolean;
};

// Função para determinar o label baseado no score
function getPositionLabel(score: number, leftLabel: string, rightLabel: string): string {
  if (score <= 20) return `${leftLabel} Forte`;
  if (score <= 40) return `${leftLabel} Moderado`;
  if (score <= 60) return "Centro";
  if (score <= 80) return `${rightLabel} Moderado`;
  return `${rightLabel} Forte`;
}

export function PoliticalValuesResult({
  values,
  dimensions,
  showLabels = true,
  compact = false,
}: PoliticalValuesResultProps) {
  // Ordena valores por dimensão seguindo ordem específica
  const dimensionOrder = ["economia", "social", "liberdades", "autoridade", "seguranca", "ambiental", "nacionalismo", "transparencia", "ideologia", "federalismo"];

  const sortedValues = [...values].sort((a, b) => {
    const orderA = dimensionOrder.indexOf(a.dimension_id);
    const orderB = dimensionOrder.indexOf(b.dimension_id);
    return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
  });

  const getDimensionInfo = (dimensionId: string) => {
    const dim = dimensions?.find((d) => d.id === dimensionId);
    if (dim) {
      return {
        name: dim.name,
        leftLabel: dim.left_label,
        rightLabel: dim.right_label,
        leftColor: "#3b82f6",
        rightColor: "#ef4444",
      };
    }
    return DEFAULT_DIMENSIONS[dimensionId] || {
      name: dimensionId,
      leftLabel: "Esquerda",
      rightLabel: "Direita",
      leftColor: "#3b82f6",
      rightColor: "#ef4444",
    };
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {sortedValues.map((value) => {
        const Icon = DIMENSION_ICONS[value.dimension_id] || TrendingUp;
        const info = getDimensionInfo(value.dimension_id);

        // Determina a posição do indicador (0-100)
        const position = Math.max(0, Math.min(100, value.score));

        // Determina o label de posição
        const positionLabel = getPositionLabel(position, info.leftLabel, info.rightLabel);

        // Cor do indicador baseada na posição
        const indicatorColor = position <= 40
          ? info.leftColor
          : position >= 60
            ? info.rightColor
            : "#6b7280";

        return (
          <div key={value.dimension_id} className={compact ? "space-y-1" : "space-y-2"}>
            {/* Header com nome e posição */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 flex items-center justify-center rounded border-2 border-black dark:border-brutal-dark-border"
                  style={{ backgroundColor: indicatorColor }}
                >
                  <Icon size={14} className="text-white" />
                </div>
                <span className="font-bold dark:text-brutal-dark-text text-sm">{info.name}</span>
              </div>
              <span
                className="text-xs font-bold px-2 py-1 rounded border border-current"
                style={{ color: indicatorColor }}
              >
                {positionLabel}
              </span>
            </div>

            {/* Barra de progresso */}
            <div className="relative">
              {/* Labels das extremidades */}
              {showLabels && (
                <div className="flex justify-between text-[10px] font-medium mb-1">
                  <span style={{ color: info.leftColor }}>{info.leftLabel}</span>
                  <span className="text-gray-400">|</span>
                  <span style={{ color: info.rightColor }}>{info.rightLabel}</span>
                </div>
              )}

              {/* Barra principal */}
              <div className="relative h-4 bg-gray-200 dark:bg-gray-700 border-2 border-black dark:border-brutal-dark-border rounded overflow-hidden">
                {/* Gradiente de fundo */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, ${info.leftColor}40, transparent 30%, transparent 70%, ${info.rightColor}40)`,
                  }}
                />

                {/* Marcadores de 25%, 50%, 75% */}
                <div className="absolute top-0 bottom-0 left-1/4 w-px bg-black/20 dark:bg-white/20" />
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/40 dark:bg-white/40" />
                <div className="absolute top-0 bottom-0 left-3/4 w-px bg-black/20 dark:bg-white/20" />

                {/* Barra de preenchimento até a posição */}
                <div
                  className="absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out"
                  style={{
                    width: `${position}%`,
                    background: `linear-gradient(to right, ${info.leftColor}, ${position > 50 ? info.rightColor : info.leftColor})`,
                    opacity: 0.8,
                  }}
                />

                {/* Indicador do usuário (bolinha) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all duration-700 ease-out"
                  style={{
                    left: `calc(${position}% - 10px)`,
                    backgroundColor: indicatorColor,
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                    {Math.round(position)}
                  </span>
                </div>
              </div>

              {/* Legenda de escala */}
              {!compact && (
                <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Legenda geral */}
      {!compact && values.length > 0 && (
        <div className="mt-6 pt-4 border-t-2 border-gray-200 dark:border-brutal-dark-border">
          <p className="text-xs text-gray-500 dark:text-brutal-dark-muted text-center">
            <strong>Como interpretar:</strong> 0-40 = inclinação à esquerda/liberal •
            40-60 = centro • 60-100 = inclinação à direita/conservador
          </p>
        </div>
      )}
    </div>
  );
}
