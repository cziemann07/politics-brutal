"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, AlertTriangle, Scale, DollarSign } from "lucide-react";

export interface EscandaloShareData {
  nome: string;
  periodo: string;
  valorDesviado: string;
  valorRecuperado?: string;
  condenados: number;
  destaque: string;
  frase?: string;
}

export default function EscandaloShareButton({ data }: { data: EscandaloShareData }) {
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
      const filename = `psf-${data.nome.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`;
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
        title="Baixar card para Instagram"
        className="flex items-center gap-2 bg-black text-white px-3 py-2 font-bold uppercase text-xs border-2 border-black hover:bg-white hover:text-black transition-all active:translate-y-1"
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
          <div className="bg-brutal-red text-white p-8 pb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white text-black px-4 py-2 font-black text-2xl">
                  PSF
                </div>
                <span className="font-bold text-lg opacity-80">POLÍTICA SEM FILTRO</span>
              </div>
              <span className="font-mono text-lg opacity-70">{data.periodo}</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <AlertTriangle size={40} strokeWidth={2.5} />
              <span className="font-black text-2xl uppercase tracking-wider">
                REFRESCANDO SUA MEMÓRIA
              </span>
            </div>
          </div>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex-1 p-10 flex flex-col">
            {/* NOME DO ESCÂNDALO */}
            <h1 className="text-7xl font-black uppercase leading-[1] tracking-tight mb-8 border-b-[6px] border-black pb-8">
              {data.nome}
            </h1>

            {/* DESTAQUE */}
            <p className="text-3xl font-bold leading-snug text-gray-700 mb-10">
              {data.destaque}
            </p>

            {/* NÚMEROS */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-brutal-red text-white p-8 border-[4px] border-black">
                <DollarSign size={40} className="mb-4" />
                <span className="block text-sm font-bold uppercase mb-2">Valor Desviado</span>
                <span className="block text-5xl font-black">{data.valorDesviado}</span>
              </div>
              <div className="bg-black text-white p-8 border-[4px] border-black">
                <Scale size={40} className="mb-4" />
                <span className="block text-sm font-bold uppercase mb-2">Condenados</span>
                <span className="block text-5xl font-black">{data.condenados}</span>
                <span className="block text-lg font-bold mt-2">pessoas</span>
              </div>
            </div>

            {data.valorRecuperado && (
              <div className="bg-green-100 border-[3px] border-black p-6 mb-8">
                <p className="text-2xl font-medium">
                  <span className="font-black">Recuperado:</span> {data.valorRecuperado}
                </p>
              </div>
            )}

            {/* FRASE */}
            {data.frase && (
              <div className="bg-gray-100 border-[3px] border-black p-6 mb-8">
                <p className="text-2xl font-black italic text-center">
                  "{data.frase}"
                </p>
              </div>
            )}

            {/* SPACER */}
            <div className="flex-1" />

            {/* FONTE */}
            <div className="flex items-center justify-between pt-6 border-t-[4px] border-black">
              <div>
                <span className="text-sm font-bold uppercase text-gray-500 block mb-1">FONTES</span>
                <span className="text-xl font-black">MPF / TCU / STF</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold uppercase text-gray-500 block mb-1">NUNCA ESQUEÇA</span>
                <span className="text-xl font-bold text-gray-600">A história se repete</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-black text-white p-6 flex items-center justify-between">
            <p className="font-bold text-lg uppercase tracking-wide">
              Eles querem que você esqueça. Não deixe.
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
