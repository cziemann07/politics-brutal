"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, AlertTriangle, TrendingUp, Newspaper } from "lucide-react";

export interface NewsShareData {
  titulo: string;
  subtitulo: string;
  fonte: string;
  data: string;
  categoria: "hipocrisia" | "corrupcao" | "polarizacao" | "alerta" | "fato";
  destaque?: string;
  contexto?: string;
}

const categoriaConfig = {
  hipocrisia: {
    bg: "bg-brutal-red",
    label: "HIPOCRISIA EXPOSTA",
    icon: AlertTriangle,
  },
  corrupcao: {
    bg: "bg-black",
    label: "CORRUPÇÃO",
    icon: AlertTriangle,
  },
  polarizacao: {
    bg: "bg-gray-800",
    label: "POLARIZAÇÃO",
    icon: TrendingUp,
  },
  alerta: {
    bg: "bg-brutal-red",
    label: "ALERTA DEMOCRÁTICO",
    icon: AlertTriangle,
  },
  fato: {
    bg: "bg-black",
    label: "FATO POLÍTICO",
    icon: Newspaper,
  },
};

export default function NewsShareButton({ data }: { data: NewsShareData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const config = categoriaConfig[data.categoria];
  const Icon = config.icon;

  const handleShare = async () => {
    if (ref.current === null) return;
    setLoading(true);

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        skipFonts: true,
      });
      const filename = `psf-${data.titulo.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30)}.png`;
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
          {/* HEADER COM CATEGORIA */}
          <div className={`${config.bg} text-white p-8 pb-12`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white text-black px-4 py-2 font-black text-2xl">
                  PSF
                </div>
                <span className="font-bold text-lg opacity-80">POLÍTICA SEM FILTRO</span>
              </div>
              <span className="font-mono text-lg opacity-70">{data.data}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Icon size={40} strokeWidth={2.5} />
              <span className="font-black text-2xl uppercase tracking-wider">
                {config.label}
              </span>
            </div>
          </div>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex-1 p-10 flex flex-col">
            {/* TÍTULO */}
            <h1 className="text-6xl font-black uppercase leading-[1.1] tracking-tight mb-8 border-b-[6px] border-black pb-8">
              {data.titulo}
            </h1>

            {/* SUBTÍTULO */}
            <p className="text-3xl font-medium leading-snug text-gray-700 mb-10">
              {data.subtitulo}
            </p>

            {/* DESTAQUE (se houver) */}
            {data.destaque && (
              <div className="bg-brutal-red text-white p-8 mb-8 border-[4px] border-black">
                <p className="text-3xl font-black leading-tight">
                  {data.destaque}
                </p>
              </div>
            )}

            {/* CONTEXTO (se houver) */}
            {data.contexto && (
              <div className="bg-gray-100 border-[3px] border-black p-6 mb-8">
                <p className="text-2xl font-medium leading-relaxed text-gray-800">
                  {data.contexto}
                </p>
              </div>
            )}

            {/* SPACER */}
            <div className="flex-1" />

            {/* FONTE */}
            <div className="flex items-center justify-between pt-6 border-t-[4px] border-black">
              <div>
                <span className="text-sm font-bold uppercase text-gray-500 block mb-1">FONTE</span>
                <span className="text-2xl font-black">{data.fonte}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold uppercase text-gray-500 block mb-1">VERIFIQUE</span>
                <span className="text-xl font-bold text-gray-600">Não confie. Pesquise.</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-black text-white p-6 flex items-center justify-between">
            <p className="font-bold text-lg uppercase tracking-wide">
              Desconfie de todo político. Inclusive do seu favorito.
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
