"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, BarChart3, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface PartidoData {
  partido: string;
  quantidade: number;
  [key: string]: string | number;
}

interface PartidoDistribuicaoChartProps {
  dados: PartidoData[];
  titulo?: string;
}

// Cores dos principais partidos brasileiros
const CORES_PARTIDOS: Record<string, string> = {
  PT: "#E31B23",
  PL: "#1E3A8A",
  UNIÃO: "#00A651",
  PP: "#0066CC",
  MDB: "#00AA00",
  PSD: "#FF6600",
  REPUBLICANOS: "#003399",
  PDT: "#FF0000",
  PSDB: "#0047AB",
  PODE: "#6B21A8",
  PSB: "#FFCC00",
  PSOL: "#FFD700",
  AVANTE: "#FF6B00",
  CIDADANIA: "#E91E63",
  PCdoB: "#CC0000",
  SOLIDARIEDADE: "#FF8C00",
  PV: "#00FF00",
  REDE: "#00BCD4",
  NOVO: "#FF4500",
  PROS: "#800080",
};

const CORES_FALLBACK = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
];

export default function PartidoDistribuicaoChart({
  dados,
  titulo = "Distribuição por Partido",
}: PartidoDistribuicaoChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [hiddenPartidos, setHiddenPartidos] = useState<Set<string>>(new Set());
  const { isDark } = useTheme();

  // Agrupa e ordena os dados
  const dadosProcessados = useMemo(() => {
    const agrupado = dados.reduce((acc, item) => {
      const key = item.partido;
      if (!acc[key]) {
        acc[key] = { partido: key, quantidade: 0 };
      }
      acc[key].quantidade += item.quantidade;
      return acc;
    }, {} as Record<string, PartidoData>);

    return Object.values(agrupado)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 15);
  }, [dados]);

  // Dados filtrados (exclui partidos ocultos)
  const dadosFiltrados = useMemo(() => {
    return dadosProcessados.filter(d => !hiddenPartidos.has(d.partido));
  }, [dadosProcessados, hiddenPartidos]);

  const total = useMemo(() => {
    return dadosProcessados.reduce((sum, d) => sum + d.quantidade, 0);
  }, [dadosProcessados]);

  const totalVisivel = useMemo(() => {
    return dadosFiltrados.reduce((sum, d) => sum + d.quantidade, 0);
  }, [dadosFiltrados]);

  const getCor = (partido: string, index: number) => {
    return CORES_PARTIDOS[partido] || CORES_FALLBACK[index % CORES_FALLBACK.length];
  };

  const togglePartido = (partido: string) => {
    setHiddenPartidos(prev => {
      const next = new Set(prev);
      if (next.has(partido)) {
        next.delete(partido);
      } else {
        next.add(partido);
      }
      return next;
    });
  };

  const resetFiltros = () => {
    setHiddenPartidos(new Set());
  };

  const handleShare = async () => {
    if (ref.current === null) return;
    setLoading(true);

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        skipFonts: true,
      });
      const filename = `politics-brutal-bancada-${new Date().toISOString().split("T")[0]}.png`;
      download(dataUrl, filename);
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentual = ((data.quantidade / totalVisivel) * 100).toFixed(1);
      return (
        <div className={`${isDark ? 'bg-brutal-dark-surface border-brutal-dark-border' : 'bg-white border-black'} border-2 p-3 shadow-lg`}>
          <p className={`font-black text-lg ${isDark ? 'text-brutal-dark-text' : ''}`}>{data.partido}</p>
          <p className={`font-bold ${isDark ? 'text-brutal-dark-muted' : ''}`}>
            {data.quantidade} deputados ({percentual}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Cores baseadas no tema
  const colors = isDark ? {
    bg: "#0f0f0f",
    surface: "#1a1a1a",
    text: "#f5f5f5",
    textMuted: "#a0a0a0",
    border: "#333333",
    grid: "#333333",
    accent: "#facc15",
  } : {
    bg: "#ffffff",
    surface: "#f5f5f5",
    text: "#000000",
    textMuted: "#666666",
    border: "#000000",
    grid: "#e5e5e5",
    accent: "#facc15",
  };

  return (
    <div className="w-full">
      {/* Header com titulo e acoes */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 border-2 border-black dark:border-brutal-dark-border rounded-lg shadow-lg">
            <BarChart3 size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase dark:text-brutal-dark-text">{titulo}</h3>
            <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">
              Clique nos partidos para filtrar
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {hiddenPartidos.size > 0 && (
            <button
              onClick={resetFiltros}
              className="flex items-center gap-1.5 bg-gray-200 dark:bg-brutal-dark-bg text-gray-700 dark:text-brutal-dark-text px-3 py-2 font-bold text-xs border-2 border-black dark:border-brutal-dark-border hover:bg-gray-300 dark:hover:bg-brutal-dark-surface transition-all active:translate-y-0.5 rounded"
            >
              <RotateCcw size={14} />
              Resetar
            </button>
          )}
          <button
            onClick={handleShare}
            disabled={loading}
            title="Baixar gráfico"
            className="flex items-center gap-2 bg-black dark:bg-brutal-dark-accent text-white px-3 py-2 font-bold uppercase text-xs border-2 border-black dark:border-brutal-dark-border hover:bg-gray-800 dark:hover:bg-brutal-dark-surface transition-all active:translate-y-0.5 rounded"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{loading ? "Gerando..." : "Compartilhar"}</span>
          </button>
        </div>
      </div>

      {/* Legenda interativa */}
      <div className="card-brutal p-4 mb-4 bg-white dark:bg-brutal-dark-surface">
        <div className="flex flex-wrap gap-2">
          {dadosProcessados.map((item, index) => {
            const isHidden = hiddenPartidos.has(item.partido);
            const percentual = ((item.quantidade / total) * 100).toFixed(1);
            return (
              <button
                key={item.partido}
                onClick={() => togglePartido(item.partido)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 border-2 font-bold text-sm transition-all
                  ${isHidden
                    ? 'bg-gray-100 dark:bg-brutal-dark-bg border-gray-300 dark:border-brutal-dark-border opacity-50'
                    : 'border-black dark:border-brutal-dark-border hover:scale-105 active:scale-95'
                  }
                  rounded cursor-pointer
                `}
                style={{
                  backgroundColor: isHidden ? undefined : `${getCor(item.partido, index)}20`,
                }}
              >
                <div
                  className={`w-4 h-4 rounded-sm border-2 ${isHidden ? 'border-gray-400' : 'border-black dark:border-white'}`}
                  style={{ backgroundColor: isHidden ? '#ccc' : getCor(item.partido, index) }}
                />
                <span className={`${isHidden ? 'text-gray-400 line-through' : 'dark:text-brutal-dark-text'}`}>
                  {item.partido}
                </span>
                <span className={`text-xs ${isHidden ? 'text-gray-400' : 'text-gray-500 dark:text-brutal-dark-muted'}`}>
                  ({item.quantidade} • {percentual}%)
                </span>
                {isHidden ? (
                  <EyeOff size={14} className="text-gray-400" />
                ) : (
                  <Eye size={14} className="text-gray-500 dark:text-brutal-dark-muted" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grafico */}
      <div className="card-brutal p-4 bg-white dark:bg-brutal-dark-surface">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosFiltrados}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke={colors.grid}
              />
              <XAxis
                type="number"
                tick={{ fill: colors.text, fontWeight: 700, fontSize: 12 }}
                axisLine={{ stroke: colors.border, strokeWidth: 2 }}
              />
              <YAxis
                type="category"
                dataKey="partido"
                tick={{ fill: colors.text, fontWeight: 900, fontSize: 13 }}
                axisLine={{ stroke: colors.border, strokeWidth: 2 }}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
              <Bar
                dataKey="quantidade"
                radius={[0, 4, 4, 0]}
                animationDuration={500}
              >
                {dadosFiltrados.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.partido}`}
                    fill={getCor(entry.partido, dadosProcessados.findIndex(d => d.partido === entry.partido))}
                    stroke={colors.border}
                    strokeWidth={2}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estatísticas */}
        <div className="mt-4 pt-4 border-t-2 border-black dark:border-brutal-dark-border grid grid-cols-3 gap-4">
          <div className="text-center">
            <span className="block text-2xl font-black dark:text-brutal-dark-text">{totalVisivel}</span>
            <span className="text-xs font-bold text-gray-500 dark:text-brutal-dark-muted uppercase">
              Visíveis
            </span>
          </div>
          <div className="text-center border-x-2 border-black dark:border-brutal-dark-border">
            <span className="block text-2xl font-black dark:text-brutal-dark-text">{dadosFiltrados.length}</span>
            <span className="text-xs font-bold text-gray-500 dark:text-brutal-dark-muted uppercase">
              Partidos
            </span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-black dark:text-brutal-dark-text">{total}</span>
            <span className="text-xs font-bold text-gray-500 dark:text-brutal-dark-muted uppercase">
              Total
            </span>
          </div>
        </div>
      </div>

      {/* LAYOUT OCULTO PARA COMPARTILHAMENTO */}
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
            display: "flex",
            flexDirection: "column",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: colors.text,
          }}
        >
          {/* HEADER */}
          <div style={{
            backgroundColor: isDark ? "#1a1a1a" : "#000",
            color: "white",
            padding: "32px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  backgroundColor: colors.accent,
                  color: "#000",
                  padding: "8px 16px",
                  fontWeight: 900,
                  fontSize: "24px",
                }}>
                  PB
                </div>
                <span style={{ fontWeight: 700, fontSize: "18px", opacity: 0.8 }}>POLITICS BRUTAL</span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: "18px", opacity: 0.7 }}>
                {new Date().toLocaleDateString("pt-BR")}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <BarChart3 size={36} strokeWidth={2.5} />
              <span style={{ fontWeight: 900, fontSize: "24px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                BANCADA FEDERAL
              </span>
            </div>
          </div>

          {/* TITULO */}
          <div style={{
            padding: "32px 40px",
            borderBottom: `6px solid ${colors.border}`,
          }}>
            <h1 style={{
              fontSize: "36px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}>
              {titulo}
            </h1>
            <p style={{ fontSize: "20px", fontWeight: 700, color: colors.textMuted, marginTop: "8px" }}>
              Câmara dos Deputados - 57ª Legislatura
            </p>
          </div>

          {/* GRAFICO */}
          <div style={{ flex: 1, padding: "32px" }}>
            <div style={{ width: "100%", height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosFiltrados}
                  layout="vertical"
                  margin={{ top: 5, right: 50, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={colors.grid} />
                  <XAxis type="number" tick={{ fill: colors.text, fontWeight: 700, fontSize: 16 }} />
                  <YAxis
                    type="category"
                    dataKey="partido"
                    tick={{ fill: colors.text, fontWeight: 900, fontSize: 18 }}
                    width={90}
                  />
                  <Bar dataKey="quantidade" radius={[0, 4, 4, 0]}>
                    {dadosFiltrados.map((entry, index) => (
                      <Cell
                        key={`cell-share-${entry.partido}`}
                        fill={getCor(entry.partido, dadosProcessados.findIndex(d => d.partido === entry.partido))}
                        stroke={colors.border}
                        strokeWidth={3}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LEGENDA */}
          <div style={{ padding: "0 40px 24px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "12px",
            }}>
              {dadosFiltrados.slice(0, 10).map((item, index) => (
                <div
                  key={item.partido}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: `2px solid ${colors.border}`,
                    padding: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: getCor(item.partido, dadosProcessados.findIndex(d => d.partido === item.partido)),
                      border: `2px solid ${colors.border}`,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: 900 }}>
                    {item.partido}: {item.quantidade}
                  </span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div style={{
              backgroundColor: isDark ? "#1a1a1a" : "#000",
              color: "white",
              padding: "16px",
              textAlign: "center",
              marginTop: "24px",
            }}>
              <span style={{ fontWeight: 900, fontSize: "32px" }}>{total}</span>
              <span style={{ fontWeight: 700, fontSize: "20px", marginLeft: "12px" }}>DEPUTADOS FEDERAIS</span>
            </div>
          </div>

          {/* FOOTER */}
          <div style={{
            backgroundColor: isDark ? "#1a1a1a" : "#000",
            color: "white",
            padding: "24px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "14px", textTransform: "uppercase", color: "#999", marginBottom: "4px" }}>FONTE</p>
              <p style={{ fontWeight: 900, fontSize: "18px" }}>Câmara dos Deputados - Dados Abertos</p>
            </div>
            <div style={{
              backgroundColor: colors.accent,
              color: "#000",
              padding: "8px 16px",
              fontWeight: 900,
              fontSize: "18px",
            }}>
              politicsbrutal.com.br
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
