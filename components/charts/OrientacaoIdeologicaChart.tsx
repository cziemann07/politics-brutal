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
  Legend,
  PieChart,
  Pie,
} from "recharts";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, Compass, Users } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface PartidoData {
  partido: string;
  quantidade: number;
}

interface OrientacaoIdeologicaChartProps {
  dados: PartidoData[];
  titulo?: string;
}

// Classificação ideológica dos partidos brasileiros (baseada em posicionamento histórico e autodeclaração)
const CLASSIFICACAO_PARTIDOS: Record<string, "esquerda" | "centro" | "direita"> = {
  // ESQUERDA
  PT: "esquerda",
  PSOL: "esquerda",
  PCdoB: "esquerda",
  REDE: "esquerda",
  PV: "esquerda",
  PDT: "esquerda",
  PSB: "esquerda",

  // CENTRO
  MDB: "centro",
  PSD: "centro",
  PSDB: "centro",
  CIDADANIA: "centro",
  SOLIDARIEDADE: "centro",
  AVANTE: "centro",
  PROS: "centro",

  // DIREITA
  PL: "direita",
  PP: "direita",
  UNIÃO: "direita",
  REPUBLICANOS: "direita",
  PODE: "direita",
  NOVO: "direita",
  PATRIOTA: "direita",
  PSC: "direita",
  PTB: "direita",
  DC: "direita",
  PMB: "direita",
  PMN: "direita",
};

const CORES_ORIENTACAO = {
  esquerda: "#DC2626", // Vermelho
  centro: "#6B7280",   // Cinza
  direita: "#2563EB",  // Azul
};

const LABELS_ORIENTACAO = {
  esquerda: "Esquerda",
  centro: "Centro",
  direita: "Direita",
};

export default function OrientacaoIdeologicaChart({
  dados,
  titulo = "Orientação Ideológica da Câmara",
}: OrientacaoIdeologicaChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"pizza" | "barras">("pizza");
  const { isDark } = useTheme();

  // Agrupa deputados por orientação ideológica
  const dadosPorOrientacao = useMemo(() => {
    const agrupado = {
      esquerda: { orientacao: "esquerda", quantidade: 0, partidos: [] as string[] },
      centro: { orientacao: "centro", quantidade: 0, partidos: [] as string[] },
      direita: { orientacao: "direita", quantidade: 0, partidos: [] as string[] },
    };

    dados.forEach(item => {
      const orientacao = CLASSIFICACAO_PARTIDOS[item.partido] || "centro";
      agrupado[orientacao].quantidade += item.quantidade;
      if (!agrupado[orientacao].partidos.includes(item.partido)) {
        agrupado[orientacao].partidos.push(item.partido);
      }
    });

    return [agrupado.esquerda, agrupado.centro, agrupado.direita];
  }, [dados]);

  // Detalhes por partido agrupado por orientação
  const detalhesPorPartido = useMemo(() => {
    const detalhes: Record<string, PartidoData[]> = {
      esquerda: [],
      centro: [],
      direita: [],
    };

    dados.forEach(item => {
      const orientacao = CLASSIFICACAO_PARTIDOS[item.partido] || "centro";
      detalhes[orientacao].push(item);
    });

    // Ordena cada grupo por quantidade
    Object.keys(detalhes).forEach(key => {
      detalhes[key].sort((a, b) => b.quantidade - a.quantidade);
    });

    return detalhes;
  }, [dados]);

  const total = useMemo(() => {
    return dados.reduce((sum, d) => sum + d.quantidade, 0);
  }, [dados]);

  const handleShare = async () => {
    if (ref.current === null) return;
    setLoading(true);

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        skipFonts: true,
      });
      const filename = `politics-brutal-ideologia-${new Date().toISOString().split("T")[0]}.png`;
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
      const percentual = ((data.quantidade / total) * 100).toFixed(1);
      const orientacao = data.orientacao as keyof typeof LABELS_ORIENTACAO;
      return (
        <div className={`${isDark ? 'bg-brutal-dark-surface border-brutal-dark-border' : 'bg-white border-black'} border-2 p-3 shadow-lg`}>
          <p className={`font-black text-lg ${isDark ? 'text-brutal-dark-text' : ''}`}
             style={{ color: CORES_ORIENTACAO[orientacao] }}>
            {LABELS_ORIENTACAO[orientacao]}
          </p>
          <p className={`font-bold ${isDark ? 'text-brutal-dark-muted' : ''}`}>
            {data.quantidade} deputados ({percentual}%)
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-brutal-dark-muted' : 'text-gray-500'}`}>
            Partidos: {data.partidos?.join(", ")}
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

  // Dados para o gráfico de pizza
  const pieData = dadosPorOrientacao.map(d => ({
    ...d,
    name: LABELS_ORIENTACAO[d.orientacao as keyof typeof LABELS_ORIENTACAO],
    fill: CORES_ORIENTACAO[d.orientacao as keyof typeof CORES_ORIENTACAO],
  }));

  return (
    <div className="w-full">
      {/* Header com titulo e acoes */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-500 via-gray-500 to-blue-500 p-2.5 border-2 border-black dark:border-brutal-dark-border rounded-lg shadow-lg">
            <Compass size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase dark:text-brutal-dark-text">{titulo}</h3>
            <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">
              Baseado na autodeclaração e posicionamento histórico
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Toggle de visualização */}
          <div className="flex border-2 border-black dark:border-brutal-dark-border rounded overflow-hidden">
            <button
              onClick={() => setViewMode("pizza")}
              className={`px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === "pizza"
                  ? "bg-black dark:bg-brutal-dark-accent text-white"
                  : "bg-white dark:bg-brutal-dark-bg text-black dark:text-brutal-dark-text hover:bg-gray-100 dark:hover:bg-brutal-dark-surface"
              }`}
            >
              Pizza
            </button>
            <button
              onClick={() => setViewMode("barras")}
              className={`px-3 py-1.5 text-xs font-bold transition-all border-l-2 border-black dark:border-brutal-dark-border ${
                viewMode === "barras"
                  ? "bg-black dark:bg-brutal-dark-accent text-white"
                  : "bg-white dark:bg-brutal-dark-bg text-black dark:text-brutal-dark-text hover:bg-gray-100 dark:hover:bg-brutal-dark-surface"
              }`}
            >
              Barras
            </button>
          </div>
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

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {dadosPorOrientacao.map((item) => {
          const orientacao = item.orientacao as keyof typeof LABELS_ORIENTACAO;
          const percentual = ((item.quantidade / total) * 100).toFixed(1);
          return (
            <div
              key={orientacao}
              className="card-brutal p-4 text-center"
              style={{
                backgroundColor: isDark ? colors.surface : `${CORES_ORIENTACAO[orientacao]}15`,
                borderColor: CORES_ORIENTACAO[orientacao],
              }}
            >
              <span
                className="block text-3xl font-black"
                style={{ color: CORES_ORIENTACAO[orientacao] }}
              >
                {item.quantidade}
              </span>
              <span
                className="block text-sm font-bold uppercase"
                style={{ color: CORES_ORIENTACAO[orientacao] }}
              >
                {LABELS_ORIENTACAO[orientacao]}
              </span>
              <span className="block text-xs text-gray-500 dark:text-brutal-dark-muted mt-1">
                {percentual}% da Câmara
              </span>
            </div>
          );
        })}
      </div>

      {/* Grafico */}
      <div className="card-brutal p-4 bg-white dark:bg-brutal-dark-surface">
        <div className="h-[350px]">
          {viewMode === "pizza" ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  innerRadius={60}
                  dataKey="quantidade"
                  nameKey="name"
                  label={(props: any) => {
                    const percent = ((props.value / total) * 100).toFixed(0);
                    return `${props.name}: ${percent}%`;
                  }}
                  labelLine={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke={colors.border}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosPorOrientacao.map(d => ({
                  ...d,
                  name: LABELS_ORIENTACAO[d.orientacao as keyof typeof LABELS_ORIENTACAO],
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: colors.text, fontWeight: 900, fontSize: 14 }}
                  axisLine={{ stroke: colors.border, strokeWidth: 2 }}
                />
                <YAxis
                  tick={{ fill: colors.text, fontWeight: 700, fontSize: 12 }}
                  axisLine={{ stroke: colors.border, strokeWidth: 2 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                  {dadosPorOrientacao.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CORES_ORIENTACAO[entry.orientacao as keyof typeof CORES_ORIENTACAO]}
                      stroke={colors.border}
                      strokeWidth={2}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Detalhes por partido */}
        <div className="mt-4 pt-4 border-t-2 border-black dark:border-brutal-dark-border">
          <h4 className="font-black text-sm uppercase mb-3 dark:text-brutal-dark-text flex items-center gap-2">
            <Users size={16} />
            Detalhes por Partido
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            {(["esquerda", "centro", "direita"] as const).map((orientacao) => (
              <div key={orientacao}>
                <h5
                  className="font-black text-sm uppercase mb-2 pb-1 border-b-2"
                  style={{
                    color: CORES_ORIENTACAO[orientacao],
                    borderColor: CORES_ORIENTACAO[orientacao],
                  }}
                >
                  {LABELS_ORIENTACAO[orientacao]}
                </h5>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {detalhesPorPartido[orientacao].map((partido) => (
                    <div
                      key={partido.partido}
                      className="flex justify-between text-sm"
                    >
                      <span className="font-bold dark:text-brutal-dark-text">{partido.partido}</span>
                      <span className="font-black" style={{ color: CORES_ORIENTACAO[orientacao] }}>
                        {partido.quantidade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aviso */}
      <div className="mt-3 p-3 bg-gray-100 dark:bg-brutal-dark-bg border-2 border-dashed border-gray-400 dark:border-brutal-dark-border">
        <p className="text-xs text-gray-600 dark:text-brutal-dark-muted">
          <strong className="dark:text-brutal-dark-text">Nota:</strong> A classificação ideológica é baseada em posicionamentos
          históricos e autodeclaração dos partidos. Pode haver divergências individuais entre parlamentares de um mesmo partido.
        </p>
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
            background: `linear-gradient(to right, ${CORES_ORIENTACAO.esquerda}, ${CORES_ORIENTACAO.centro}, ${CORES_ORIENTACAO.direita})`,
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
                <span style={{ fontWeight: 700, fontSize: "18px", opacity: 0.9 }}>POLITICS BRUTAL</span>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: "18px", opacity: 0.8 }}>
                {new Date().toLocaleDateString("pt-BR")}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Compass size={36} strokeWidth={2.5} />
              <span style={{ fontWeight: 900, fontSize: "24px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ESPECTRO POLÍTICO
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
            <p style={{ fontSize: "18px", fontWeight: 700, color: colors.textMuted, marginTop: "8px" }}>
              Câmara dos Deputados - 57ª Legislatura
            </p>
          </div>

          {/* CARDS RESUMO */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            padding: "32px 40px",
          }}>
            {dadosPorOrientacao.map((item) => {
              const orientacao = item.orientacao as keyof typeof LABELS_ORIENTACAO;
              const percentual = ((item.quantidade / total) * 100).toFixed(1);
              return (
                <div
                  key={orientacao}
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    border: `4px solid ${CORES_ORIENTACAO[orientacao]}`,
                    backgroundColor: isDark ? colors.surface : `${CORES_ORIENTACAO[orientacao]}10`,
                  }}
                >
                  <span style={{
                    display: "block",
                    fontSize: "64px",
                    fontWeight: 900,
                    color: CORES_ORIENTACAO[orientacao],
                    lineHeight: 1,
                  }}>
                    {item.quantidade}
                  </span>
                  <span style={{
                    display: "block",
                    fontSize: "24px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: CORES_ORIENTACAO[orientacao],
                    marginTop: "8px",
                  }}>
                    {LABELS_ORIENTACAO[orientacao]}
                  </span>
                  <span style={{
                    display: "block",
                    fontSize: "18px",
                    color: colors.textMuted,
                    marginTop: "4px",
                  }}>
                    {percentual}% da Câmara
                  </span>
                </div>
              );
            })}
          </div>

          {/* GRAFICO */}
          <div style={{ flex: 1, padding: "0 40px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={180}
                  innerRadius={80}
                  dataKey="quantidade"
                  label={(props: any) => {
                    const percent = ((props.value / total) * 100).toFixed(0);
                    return `${props.name}: ${percent}%`;
                  }}
                  labelLine={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-share-${index}`}
                      fill={entry.fill}
                      stroke={colors.border}
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* TOTAL */}
          <div style={{
            padding: "24px 40px",
            backgroundColor: isDark ? "#1a1a1a" : "#000",
            color: "white",
            textAlign: "center",
          }}>
            <span style={{ fontWeight: 900, fontSize: "32px" }}>{total}</span>
            <span style={{ fontWeight: 700, fontSize: "20px", marginLeft: "12px" }}>DEPUTADOS FEDERAIS</span>
          </div>

          {/* FOOTER */}
          <div style={{
            backgroundColor: isDark ? "#1a1a1a" : "#000",
            color: "white",
            padding: "24px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `2px solid ${colors.border}`,
          }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "12px", textTransform: "uppercase", color: "#999", marginBottom: "4px" }}>
                BASEADO EM POSICIONAMENTO HISTÓRICO
              </p>
              <p style={{ fontWeight: 900, fontSize: "16px" }}>Pode haver divergências individuais</p>
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
