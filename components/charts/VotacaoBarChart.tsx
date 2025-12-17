"use client";

import React, { useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, BarChart3 } from "lucide-react";

interface VotoPartido {
  partido: string;
  sim: number;
  nao: number;
  total: number;
}

interface VotacaoBarChartProps {
  dados: VotoPartido[];
  titulo: string;
  descricao?: string;
  aprovado: boolean;
}

export default function VotacaoBarChart({
  dados,
  titulo,
  descricao,
  aprovado,
}: VotacaoBarChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Top 10 partidos por total de votos
  const dadosTop = [...dados]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const handleShare = async () => {
    if (ref.current === null) return;
    setLoading(true);

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        skipFonts: true,
      });
      const filename = `psf-votacao-partidos-${new Date().toISOString().split("T")[0]}.png`;
      download(dataUrl, filename);
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-black p-3 shadow-hard">
          <p className="font-black text-lg">{label}</p>
          <p className="text-green-600 font-bold">SIM: {payload[0]?.value || 0}</p>
          <p className="text-red-600 font-bold">NAO: {payload[1]?.value || 0}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 border-2 border-black ${aprovado ? "bg-green-500" : "bg-brutal-red"}`}>
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase">Votos por Partido</h3>
            <span className={`text-xs font-bold uppercase ${aprovado ? "text-green-600" : "text-red-600"}`}>
              {aprovado ? "APROVADO" : "REJEITADO"}
            </span>
          </div>
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
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosTop}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis type="number" stroke="#000" fontWeight="bold" />
              <YAxis
                type="category"
                dataKey="partido"
                stroke="#000"
                fontWeight="bold"
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sim" fill="#22C55E" stackId="stack" name="SIM">
                <LabelList dataKey="sim" position="center" fill="#fff" fontWeight="bold" />
              </Bar>
              <Bar dataKey="nao" fill="#EF4444" stackId="stack" name="NAO">
                <LabelList dataKey="nao" position="center" fill="#fff" fontWeight="bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda */}
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t-2 border-black dark:border-brutal-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 border border-black" />
            <span className="font-bold text-sm">SIM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 border border-black" />
            <span className="font-bold text-sm">NAO</span>
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
          className="bg-white flex flex-col font-sans text-black box-border relative overflow-hidden"
          style={{
            width: "1080px",
            height: "1350px",
          }}
        >
          {/* HEADER */}
          <div className={`${aprovado ? "bg-green-600" : "bg-brutal-red"} text-white p-8 pb-10`}>
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
              <BarChart3 size={36} strokeWidth={2.5} />
              <span className="font-black text-2xl uppercase tracking-wider">
                VOTACAO {aprovado ? "APROVADA" : "REJEITADA"}
              </span>
            </div>
          </div>

          {/* TITULO */}
          <div className="px-10 pt-8 pb-6 border-b-[6px] border-black">
            <h1 className="text-3xl font-black uppercase leading-[1.2] tracking-tight">
              {titulo.length > 150 ? titulo.slice(0, 150) + "..." : titulo}
            </h1>
            {descricao && (
              <p className="text-lg font-bold text-gray-600 mt-3">
                {descricao.length > 100 ? descricao.slice(0, 100) + "..." : descricao}
              </p>
            )}
          </div>

          {/* GRAFICO */}
          <div className="flex-1 p-8">
            <h2 className="font-black text-xl uppercase mb-4 text-center">
              COMO CADA PARTIDO VOTOU
            </h2>
            <div style={{ width: "100%", height: "550px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosTop}
                  layout="vertical"
                  margin={{ top: 5, right: 50, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis type="number" stroke="#000" fontWeight="bold" fontSize={14} />
                  <YAxis
                    type="category"
                    dataKey="partido"
                    stroke="#000"
                    fontWeight="bold"
                    width={70}
                    fontSize={16}
                  />
                  <Bar dataKey="sim" fill="#22C55E" stackId="stack">
                    <LabelList dataKey="sim" position="center" fill="#fff" fontWeight="bold" fontSize={14} />
                  </Bar>
                  <Bar dataKey="nao" fill="#EF4444" stackId="stack">
                    <LabelList dataKey="nao" position="center" fill="#fff" fontWeight="bold" fontSize={14} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LEGENDA */}
          <div className="px-10 pb-4">
            <div className="flex justify-center gap-8 mb-4">
              <div className="flex items-center gap-3 border-2 border-black p-3 bg-green-100">
                <div className="w-8 h-8 bg-green-500 border-2 border-black" />
                <span className="font-black text-lg">VOTOU SIM</span>
              </div>
              <div className="flex items-center gap-3 border-2 border-black p-3 bg-red-100">
                <div className="w-8 h-8 bg-red-500 border-2 border-black" />
                <span className="font-black text-lg">VOTOU NAO</span>
              </div>
            </div>
          </div>

          {/* FONTE */}
          <div className="px-10 pb-4">
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
              Seu deputado votou como esperado?
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
