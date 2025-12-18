"use client";

import React, { useRef, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, DollarSign, AlertTriangle } from "lucide-react";

interface GastoDeputado {
  id: number;
  nome: string;
  partido: string;
  estado: string;
  gastos: number;
  teto: number;
  status: "Regular" | "Irregular";
}

interface GastosCeapChartProps {
  dados: GastoDeputado[];
  titulo?: string;
  periodo?: string;
}

export default function GastosCeapChart({
  dados,
  titulo = "Top Gastadores CEAP",
  periodo = "09/2024",
}: GastosCeapChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Top 10 gastadores
  const topGastadores = useMemo(() => {
    return [...dados]
      .filter((d) => d.gastos > 0)
      .sort((a, b) => b.gastos - a.gastos)
      .slice(0, 10)
      .map((d) => ({
        ...d,
        nomeAbrev: d.nome.split(" ").slice(0, 2).join(" "),
        gastosFormatado: d.gastos / 1000, // Em milhares
      }));
  }, [dados]);

  // Estatisticas
  const stats = useMemo(() => {
    const gastosValidos = dados.filter((d) => d.gastos > 0);
    const total = gastosValidos.reduce((sum, d) => sum + d.gastos, 0);
    const irregulares = dados.filter((d) => d.status === "Irregular").length;
    const media = gastosValidos.length > 0 ? total / gastosValidos.length : 0;

    return { total, irregulares, media, count: gastosValidos.length };
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
      const filename = `psf-gastos-ceap-${periodo.replace(/\//g, "-")}.png`;
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
      return (
        <div className="bg-white border-2 border-black p-3 shadow-hard">
          <p className="font-black text-lg">{data.nome}</p>
          <p className="font-bold text-sm text-gray-600">
            {data.partido} - {data.estado}
          </p>
          <p className="font-black text-xl text-brutal-red mt-2">
            R$ {data.gastos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500">
            Teto: R$ {data.teto.toLocaleString("pt-BR")}
          </p>
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs font-bold ${
              data.status === "Regular" ? "bg-green-400" : "bg-brutal-red text-white"
            }`}
          >
            {data.status}
          </span>
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
          <div className="bg-brutal-red p-2 border-2 border-black">
            <DollarSign size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase">{titulo}</h3>
            <span className="text-xs font-bold uppercase text-gray-500">
              Periodo: {periodo}
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

      {/* Stats resumo */}
      {stats.irregulares > 0 && (
        <div className="card-brutal bg-brutal-red text-white mb-4 flex items-center gap-3">
          <AlertTriangle size={24} />
          <p className="font-bold">
            {stats.irregulares} deputado{stats.irregulares > 1 ? "s" : ""} ultrapassaram o teto CEAP neste periodo!
          </p>
        </div>
      )}

      {/* Grafico visivel */}
      <div className="card-brutal p-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topGastadores}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis
                type="number"
                stroke="#000"
                fontWeight="bold"
                tickFormatter={(v) => `R$ ${v}k`}
              />
              <YAxis
                type="category"
                dataKey="nomeAbrev"
                stroke="#000"
                fontWeight="bold"
                width={90}
                fontSize={11}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="gastosFormatado" name="Gastos (R$ mil)">
                {topGastadores.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.status === "Irregular" ? "#FF4444" : "#4A90E2"}
                    stroke="#000"
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda */}
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t-2 border-black dark:border-brutal-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-brutal-blue border border-black" />
            <span className="font-bold text-sm">Regular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-brutal-red border border-black" />
            <span className="font-bold text-sm">Irregular (acima do teto)</span>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 border-2 border-black dark:border-brutal-dark-border">
            <p className="text-xs font-bold text-gray-500 dark:text-brutal-dark-muted uppercase">Total Gasto</p>
            <p className="font-black text-lg text-brutal-red">
              R$ {(stats.total / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="text-center p-3 border-2 border-black dark:border-brutal-dark-border">
            <p className="text-xs font-bold text-gray-500 dark:text-brutal-dark-muted uppercase">Media/Deputado</p>
            <p className="font-black text-lg">
              R$ {(stats.media / 1000).toFixed(1)}k
            </p>
          </div>
          <div className="text-center p-3 border-2 border-black dark:border-brutal-dark-border">
            <p className="text-xs font-bold text-gray-500 dark:text-brutal-dark-muted uppercase">Irregulares</p>
            <p className="font-black text-lg text-brutal-red">{stats.irregulares}</p>
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
          <div className="bg-brutal-red text-white p-8 pb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white text-black px-4 py-2 font-black text-2xl">
                  PSF
                </div>
                <span className="font-bold text-lg opacity-80">POLITICA SEM FILTRO</span>
              </div>
              <span className="font-mono text-lg opacity-70">{periodo}</span>
            </div>

            <div className="flex items-center gap-4">
              <DollarSign size={36} strokeWidth={2.5} />
              <span className="font-black text-2xl uppercase tracking-wider">
                GASTOS CEAP
              </span>
            </div>
          </div>

          {/* TITULO */}
          <div className="px-10 pt-8 pb-6 border-b-[6px] border-black">
            <h1 className="text-4xl font-black uppercase leading-[1.2] tracking-tight">
              {titulo}
            </h1>
            <p className="text-xl font-bold text-gray-600 mt-3">
              Cota para Exercicio da Atividade Parlamentar
            </p>
          </div>

          {/* STATS */}
          <div className="px-10 py-6 grid grid-cols-3 gap-4 border-b-4 border-black">
            <div className="text-center p-4 border-3 border-black bg-gray-100">
              <p className="text-sm font-bold text-gray-500 uppercase mb-1">Total Gasto</p>
              <p className="font-black text-2xl text-brutal-red">
                R$ {(stats.total / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-center p-4 border-3 border-black bg-gray-100">
              <p className="text-sm font-bold text-gray-500 uppercase mb-1">Media</p>
              <p className="font-black text-2xl">
                R$ {(stats.media / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="text-center p-4 border-3 border-black bg-brutal-red text-white">
              <p className="text-sm font-bold uppercase mb-1">Irregulares</p>
              <p className="font-black text-2xl">{stats.irregulares}</p>
            </div>
          </div>

          {/* GRAFICO */}
          <div className="flex-1 p-8">
            <h2 className="font-black text-xl uppercase mb-4 text-center">
              TOP 10 GASTADORES
            </h2>
            <div style={{ width: "100%", height: "480px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topGastadores}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 140, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis
                    type="number"
                    stroke="#000"
                    fontWeight="bold"
                    fontSize={14}
                    tickFormatter={(v) => `R$ ${v}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="nomeAbrev"
                    stroke="#000"
                    fontWeight="bold"
                    width={130}
                    fontSize={14}
                  />
                  <Bar dataKey="gastosFormatado">
                    {topGastadores.map((entry, index) => (
                      <Cell
                        key={`cell-share-${index}`}
                        fill={entry.status === "Irregular" ? "#FF4444" : "#4A90E2"}
                        stroke="#000"
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LEGENDA */}
          <div className="px-10 pb-4">
            <div className="flex justify-center gap-8">
              <div className="flex items-center gap-3 border-2 border-black p-3">
                <div className="w-8 h-8 bg-brutal-blue border-2 border-black" />
                <span className="font-black text-lg">REGULAR</span>
              </div>
              <div className="flex items-center gap-3 border-2 border-black p-3 bg-red-100">
                <div className="w-8 h-8 bg-brutal-red border-2 border-black" />
                <span className="font-black text-lg">ACIMA DO TETO</span>
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
              Seu dinheiro. Seus impostos. Cobre transparência.
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
