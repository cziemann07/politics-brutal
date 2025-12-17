"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, BarChart3 } from "lucide-react";

export interface ChartShareData {
  titulo: string;
  subtitulo?: string;
  data: string;
  tipo: "pizza" | "barras" | "distribuicao";
  fonte?: string;
}

interface ChartShareButtonProps {
  data: ChartShareData;
  children: React.ReactNode; // O gráfico renderizado
}

export default function ChartShareButton({ data, children }: ChartShareButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (ref.current === null) return;
    setLoading(true);

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        skipFonts: true,
      });
      const filename = `psf-grafico-${data.titulo.replace(/\s+/g, "-").toLowerCase()}-${data.data.replace(/\//g, "-")}.png`;
      download(dataUrl, filename);
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={loading}
        title="Baixar gráfico para Instagram"
        className="flex items-center gap-2 bg-black text-white px-3 py-2 font-bold uppercase text-xs border-2 border-black hover:bg-white hover:text-black transition-all active:translate-y-1 dark:bg-brutal-dark-surface dark:border-brutal-dark-border dark:hover:bg-brutal-dark-accent dark:hover:text-white"
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        <span className="hidden sm:inline">{loading ? "Gerando..." : "Compartilhar"}</span>
      </button>

      {/* LAYOUT OCULTO PARA GERAR IMAGEM - Formato Instagram (1080x1350) */}
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
              <span className="font-mono text-lg opacity-70">{data.data}</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <BarChart3 size={36} strokeWidth={2.5} />
              <span className="font-black text-2xl uppercase tracking-wider">
                DADOS & GRAFICOS
              </span>
            </div>
          </div>

          {/* TITULO */}
          <div className="px-10 pt-8 pb-6 border-b-[6px] border-black">
            <h1 className="text-4xl font-black uppercase leading-[1.2] tracking-tight">
              {data.titulo}
            </h1>
            {data.subtitulo && (
              <p className="text-xl font-bold text-gray-600 mt-3">{data.subtitulo}</p>
            )}
          </div>

          {/* GRAFICO */}
          <div className="flex-1 p-10 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              {children}
            </div>
          </div>

          {/* FONTE */}
          <div className="px-10 pb-6">
            <div className="flex items-center justify-between pt-6 border-t-[4px] border-black">
              <div>
                <span className="text-sm font-bold uppercase text-gray-500 block mb-1">FONTE</span>
                <span className="text-2xl font-black">{data.fonte || "Camara dos Deputados"}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold uppercase text-gray-500 block mb-1">DADOS ABERTOS</span>
                <span className="text-xl font-bold text-gray-600">dadosabertos.camara.leg.br</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-black text-white p-6 flex items-center justify-between">
            <p className="font-bold text-lg uppercase tracking-wide">
              Dados crus. Sem filtro. Sem idolatria.
            </p>
            <div className="bg-white text-black px-4 py-2 font-black text-xl">
              @PSF
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
