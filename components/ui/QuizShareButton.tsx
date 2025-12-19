"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, TrendingUp, Users, Leaf, Shield, Eye, Building, Scale, Flag, BookOpen, Heart, Compass } from "lucide-react";
import type { UserPoliticalValue } from "@/types/database";
import { useTheme } from "@/contexts/ThemeContext";

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

// Dimensões padrão
const DEFAULT_DIMENSIONS: Record<string, { name: string; leftLabel: string; rightLabel: string; leftColor: string; rightColor: string }> = {
  economia: { name: "Economia", leftLabel: "Estatismo", rightLabel: "Livre Mercado", leftColor: "#ef4444", rightColor: "#3b82f6" },
  social: { name: "Costumes", leftLabel: "Progressista", rightLabel: "Conservador", leftColor: "#a855f7", rightColor: "#f97316" },
  ambiental: { name: "Meio Ambiente", leftLabel: "Preservação", rightLabel: "Desenvolvimento", leftColor: "#22c55e", rightColor: "#eab308" },
  seguranca: { name: "Segurança", leftLabel: "Garantismo", rightLabel: "Punitivismo", leftColor: "#06b6d4", rightColor: "#dc2626" },
  transparencia: { name: "Transparência", leftLabel: "Mais controle", rightLabel: "Menos burocracia", leftColor: "#8b5cf6", rightColor: "#64748b" },
  federalismo: { name: "Federalismo", leftLabel: "Centralização", rightLabel: "Descentralização", leftColor: "#f43f5e", rightColor: "#10b981" },
  liberdades: { name: "Liberdades", leftLabel: "Liberal", rightLabel: "Tradicional", leftColor: "#ec4899", rightColor: "#78716c" },
  autoridade: { name: "Autoridade", leftLabel: "Libertário", rightLabel: "Autoritário", leftColor: "#fbbf24", rightColor: "#1e293b" },
  nacionalismo: { name: "Identidade", leftLabel: "Globalista", rightLabel: "Nacionalista", leftColor: "#06b6d4", rightColor: "#15803d" },
  ideologia: { name: "Ideologia", leftLabel: "Esquerda", rightLabel: "Direita", leftColor: "#dc2626", rightColor: "#2563eb" },
};

function getOverallPosition(values: UserPoliticalValue[]): { label: string; color: string } {
  if (values.length === 0) return { label: "Indefinido", color: "#6b7280" };

  const avgScore = values.reduce((sum, v) => sum + v.score, 0) / values.length;

  if (avgScore <= 30) return { label: "Esquerda", color: "#dc2626" };
  if (avgScore <= 45) return { label: "Centro-Esquerda", color: "#f97316" };
  if (avgScore <= 55) return { label: "Centro", color: "#6b7280" };
  if (avgScore <= 70) return { label: "Centro-Direita", color: "#3b82f6" };
  return { label: "Direita", color: "#1e40af" };
}

interface QuizShareButtonProps {
  values: UserPoliticalValue[];
}

export default function QuizShareButton({ values }: QuizShareButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const handleShare = async () => {
    if (ref.current === null) return;
    setLoading(true);

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        skipFonts: true,
      });
      const filename = `meu-perfil-politico-${Date.now()}.png`;
      download(dataUrl, filename);
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      setLoading(false);
    }
  };

  const overallPosition = getOverallPosition(values);

  // Ordena por ordem de importância
  const dimensionOrder = ["economia", "social", "liberdades", "autoridade", "seguranca", "ambiental", "nacionalismo"];
  const sortedValues = [...values]
    .filter(v => dimensionOrder.includes(v.dimension_id))
    .sort((a, b) => {
      const orderA = dimensionOrder.indexOf(a.dimension_id);
      const orderB = dimensionOrder.indexOf(b.dimension_id);
      return orderA - orderB;
    })
    .slice(0, 6);

  // Cores baseadas no tema
  const colors = isDark ? {
    bg: "#0f0f0f",
    surface: "#1a1a1a",
    text: "#f5f5f5",
    textMuted: "#a0a0a0",
    border: "#333333",
    barBg: "#2a2a2a",
    accent: "#facc15",
  } : {
    bg: "#ffffff",
    surface: "#f5f5f5",
    text: "#000000",
    textMuted: "#666666",
    border: "#000000",
    barBg: "#e5e5e5",
    accent: "#facc15",
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={loading}
        className="group flex items-center justify-center gap-2 bg-black dark:bg-brutal-dark-accent text-white px-4 py-2 font-bold uppercase text-sm border-2 border-transparent hover:bg-white hover:text-black hover:border-black dark:hover:bg-white dark:hover:text-black transition-all active:translate-y-1 shadow-hard w-full"
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        {loading ? "Gerando..." : "Compartilhar"}
      </button>

      {/* Layout oculto para gerar a imagem */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
        }}
      >
        <div
          ref={ref}
          style={{
            width: "1080px",
            height: "1350px",
            backgroundColor: colors.bg,
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: colors.text,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "16px"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                backgroundColor: colors.accent,
                border: `4px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Compass size={36} strokeWidth={2.5} color={colors.border} />
              </div>
            </div>
            <h1 style={{
              fontSize: "48px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              marginBottom: "8px",
              color: colors.text,
            }}>
              Meu Perfil Político
            </h1>
            <p style={{
              fontSize: "20px",
              color: colors.textMuted,
              fontWeight: 500,
            }}>
              Descubra o seu em politicsbrutal.com.br
            </p>
          </div>

          {/* Posição Geral */}
          <div style={{
            textAlign: "center",
            padding: "24px 32px",
            marginBottom: "32px",
            border: `4px solid ${colors.border}`,
            backgroundColor: overallPosition.color,
          }}>
            <p style={{
              color: "white",
              fontSize: "18px",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              Posição Geral
            </p>
            <h2 style={{
              color: "white",
              fontSize: "48px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}>
              {overallPosition.label}
            </h2>
          </div>

          {/* Dimensões */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
            {sortedValues.map((value) => {
              const info = DEFAULT_DIMENSIONS[value.dimension_id] || {
                name: value.dimension_id,
                leftLabel: "Esquerda",
                rightLabel: "Direita",
                leftColor: "#3b82f6",
                rightColor: "#ef4444",
              };
              const Icon = DIMENSION_ICONS[value.dimension_id] || TrendingUp;
              const position = Math.max(0, Math.min(100, value.score));
              const indicatorColor = position <= 40 ? info.leftColor : position >= 60 ? info.rightColor : "#6b7280";

              return (
                <div key={value.dimension_id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {/* Nome da dimensão */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: indicatorColor,
                        border: `3px solid ${colors.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <span style={{ color: "white", display: "flex" }}><Icon size={20} /></span>
                      </div>
                      <span style={{
                        fontWeight: 900,
                        fontSize: "24px",
                        textTransform: "uppercase",
                        color: colors.text,
                      }}>
                        {info.name}
                      </span>
                    </div>
                    <span style={{
                      fontSize: "20px",
                      fontWeight: 900,
                      padding: "4px 12px",
                      border: `2px solid ${indicatorColor}`,
                      color: indicatorColor,
                    }}>
                      {Math.round(position)}
                    </span>
                  </div>

                  {/* Labels */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 700, padding: "0 4px" }}>
                    <span style={{ color: info.leftColor }}>{info.leftLabel}</span>
                    <span style={{ color: info.rightColor }}>{info.rightLabel}</span>
                  </div>

                  {/* Barra */}
                  <div style={{
                    position: "relative",
                    height: "32px",
                    backgroundColor: colors.barBg,
                    border: `3px solid ${colors.border}`,
                    overflow: "hidden",
                  }}>
                    {/* Gradiente de fundo */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to right, ${info.leftColor}30, transparent 30%, transparent 70%, ${info.rightColor}30)`,
                    }} />

                    {/* Marcador central */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: "50%",
                      width: "2px",
                      backgroundColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                    }} />

                    {/* Barra de preenchimento */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: `${position}%`,
                      background: `linear-gradient(to right, ${info.leftColor}, ${position > 50 ? info.rightColor : info.leftColor})`,
                      opacity: 0.85,
                    }} />

                    {/* Indicador */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: `calc(${position}% - 14px)`,
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: indicatorColor,
                      border: "3px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: `4px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                backgroundColor: colors.accent,
                border: `3px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontWeight: 900, fontSize: "20px", color: colors.border }}>PB</span>
              </div>
              <div>
                <p style={{ fontWeight: 900, fontSize: "20px", textTransform: "uppercase", color: colors.text }}>
                  Politics Brutal
                </p>
                <p style={{ color: colors.textMuted, fontWeight: 500 }}>
                  politicsbrutal.com.br
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "14px", color: colors.textMuted }}>
                {new Date().toLocaleDateString("pt-BR")}
              </p>
              <p style={{ fontSize: "12px", color: colors.textMuted, marginTop: "4px" }}>
                {isDark ? "Modo Escuro" : "Modo Claro"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
