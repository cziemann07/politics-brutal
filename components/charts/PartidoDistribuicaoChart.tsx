"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, PieChartIcon } from "lucide-react";

interface PartidoData {
  partido: string;
  quantidade: number;
  [key: string]: string | number; // Index signature para compatibilidade com Recharts
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
  titulo = "Distribuicao por Partido",
}: PartidoDistribuicaoChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

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
      .slice(0, 15); // Top 15 partidos
  }, [dados]);

  const total = useMemo(() => {
    return dadosProcessados.reduce((sum, d) => sum + d.quantidade, 0);
  }, [dadosProcessados]);

  const getCor = (partido: string, index: number) => {
    return CORES_PARTIDOS[partido] || CORES_FALLBACK[index % CORES_FALLBACK.length];
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
      const filename = `psf-distribuicao-partidos-${new Date().toISOString().split("T")[0]}.png`;
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
      return (
        <div className="bg-white border-2 border-black p-3 shadow-hard">
          <p className="font-black text-lg">{data.partido}</p>
          <p className="font-bold">
            {data.quantidade} deputados ({percentual}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Header com titulo e botao de compartilhar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-black p-2 border-2 border-black dark:bg-brutal-dark-surface dark:border-brutal-dark-border">
            <PieChartIcon size={20} className="text-white" />
          </div>
          <h3 className="font-black text-lg uppercase">{titulo}</h3>
        </div>
        <button
          onClick={handleShare}
          disabled={loading}
          title="Baixar grafico para Instagram"
          className="flex items-center gap-2 bg-black text-white px-3 py-2 font-bold uppercase text-xs border-2 border-black hover:bg-white hover:text-black transition-all active:translate-y-1 dark:bg-brutal-dark-surface dark:border-brutal-dark-border dark:hover:bg-brutal-dark-accent dark:hover:text-white"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span className="hidden sm:inline">{loading ? "Gerando..." : "Compartilhar"}</span>
        </button>
      </div>

      {/* Grafico visivel */}
      <div className="card-brutal p-4">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dadosProcessados}
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                dataKey="quantidade"
                nameKey="partido"
                label={(props: any) => `${props.name || ''}: ${props.value || 0}`}
                labelLine={true}
              >
                {dadosProcessados.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getCor(entry.partido, index)}
                    stroke="#000"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda customizada */}
        <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-2">
          {dadosProcessados.slice(0, 10).map((item, index) => (
            <div key={item.partido} className="flex items-center gap-2">
              <div
                className="w-4 h-4 border border-black shrink-0"
                style={{ backgroundColor: getCor(item.partido, index) }}
              />
              <span className="text-xs font-bold truncate">
                {item.partido} ({item.quantidade})
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t-2 border-black dark:border-brutal-dark-border text-center">
          <span className="font-black text-xl">{total}</span>
          <span className="font-bold text-gray-600 dark:text-brutal-dark-muted ml-2">
            deputados no total
          </span>
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
          className="bg-white flex flex-col font-sans text-black box-border relative overflow-hidden"
          style={{
            width: "1080px",
            height: "1350px",
          }}
        >
          {/* HEADER */}
          <div className="bg-black text-white p-8 pb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white text-black px-4 py-2 font-black text-2xl">
                  PSF
                </div>
                <span className="font-bold text-lg opacity-80">POLITICA SEM FILTRO</span>
              </div>
              <span className="font-mono text-lg opacity-70">
                {new Date().toLocaleDateString("pt-BR")}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <PieChartIcon size={36} strokeWidth={2.5} />
              <span className="font-black text-2xl uppercase tracking-wider">
                BANCADA FEDERAL
              </span>
            </div>
          </div>

          {/* TITULO */}
          <div className="px-10 pt-8 pb-6 border-b-[6px] border-black">
            <h1 className="text-4xl font-black uppercase leading-[1.2] tracking-tight">
              {titulo}
            </h1>
            <p className="text-xl font-bold text-gray-600 mt-3">
              Camara dos Deputados - 57a Legislatura
            </p>
          </div>

          {/* GRAFICO */}
          <div className="flex-1 p-8 flex items-center justify-center">
            <div style={{ width: "900px", height: "500px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosProcessados}
                    cx="50%"
                    cy="50%"
                    outerRadius={200}
                    innerRadius={100}
                    dataKey="quantidade"
                    nameKey="partido"
                    label={(props: any) => `${props.name || ''}: ${props.value || 0}`}
                    labelLine={true}
                  >
                    {dadosProcessados.map((entry, index) => (
                      <Cell
                        key={`cell-share-${index}`}
                        fill={getCor(entry.partido, index)}
                        stroke="#000"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LEGENDA */}
          <div className="px-10 pb-6">
            <div className="grid grid-cols-5 gap-3 mb-6">
              {dadosProcessados.slice(0, 10).map((item, index) => (
                <div key={item.partido} className="flex items-center gap-2 border-2 border-black p-2">
                  <div
                    className="w-6 h-6 border-2 border-black shrink-0"
                    style={{ backgroundColor: getCor(item.partido, index) }}
                  />
                  <span className="text-sm font-black">
                    {item.partido}: {item.quantidade}
                  </span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="bg-black text-white p-4 text-center">
              <span className="font-black text-3xl">{total}</span>
              <span className="font-bold text-xl ml-3">DEPUTADOS FEDERAIS</span>
            </div>
          </div>

          {/* FONTE */}
          <div className="px-10 pb-6">
            <div className="flex items-center justify-between pt-4 border-t-[4px] border-black">
              <div>
                <span className="text-sm font-bold uppercase text-gray-500 block mb-1">FONTE</span>
                <span className="text-xl font-black">Camara dos Deputados</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold uppercase text-gray-500 block mb-1">DADOS ABERTOS</span>
                <span className="text-lg font-bold text-gray-600">dadosabertos.camara.leg.br</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-black text-white p-6 flex items-center justify-between">
            <p className="font-bold text-lg uppercase tracking-wide">
              Quem realmente manda no Congresso?
            </p>
            <div className="bg-white text-black px-4 py-2 font-black text-xl">
              @PSF
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
