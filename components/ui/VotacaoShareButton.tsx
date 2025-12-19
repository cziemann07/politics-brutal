"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, CheckCircle, XCircle, Vote } from "lucide-react";

export interface VotacaoShareData {
  descricao: string;
  data: string;
  aprovado: boolean;
  votos: {
    sim: number;
    nao: number;
    total: number;
  };
  partidosMaioria?: Array<{
    partido: string;
    voto: "sim" | "nao";
    quantidade: number;
  }>;
}

export default function VotacaoShareButton({ data }: { data: VotacaoShareData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const percentualSim = Math.round((data.votos.sim / data.votos.total) * 100);
  const percentualNao = Math.round((data.votos.nao / data.votos.total) * 100);

  const handleShare = async () => {
    if (ref.current === null) return;
    setLoading(true);

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        skipFonts: true,
      });
      const filename = `psf-votacao-${data.data.replace(/\//g, "-")}.png`;
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
          <div className={`${data.aprovado ? "bg-green-600" : "bg-brutal-red"} text-white p-8 pb-12`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-brutal-yellow text-black px-4 py-2 font-black text-2xl">
                  PB
                </div>
                <span className="font-bold text-lg opacity-80">POLITICS BRUTAL</span>
              </div>
              <span className="font-mono text-lg opacity-70">{data.data}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Vote size={40} strokeWidth={2.5} />
              <span className="font-black text-2xl uppercase tracking-wider">
                VOTAÇÃO {data.aprovado ? "APROVADA" : "REJEITADA"}
              </span>
            </div>
          </div>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex-1 p-10 flex flex-col">
            {/* DESCRIÇÃO */}
            <h1 className="text-3xl font-black uppercase leading-[1.3] tracking-tight mb-8 border-b-[6px] border-black pb-8 break-words">
              {data.descricao.length > 250 ? data.descricao.slice(0, 250) + "..." : data.descricao}
            </h1>

            {/* RESULTADO VISUAL */}
            <div className="mb-10">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle size={32} className="text-green-600" />
                    <span className="text-3xl font-black">SIM: {data.votos.sim}</span>
                    <span className="text-2xl font-bold text-gray-500">({percentualSim}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 border-[3px] border-black h-12">
                    <div
                      className="bg-green-500 h-full border-r-[3px] border-black"
                      style={{ width: `${percentualSim}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle size={32} className="text-red-600" />
                    <span className="text-3xl font-black">NÃO: {data.votos.nao}</span>
                    <span className="text-2xl font-bold text-gray-500">({percentualNao}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 border-[3px] border-black h-12">
                    <div
                      className="bg-red-500 h-full border-r-[3px] border-black"
                      style={{ width: `${percentualNao}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TOTAL */}
            <div className="bg-gray-100 border-[3px] border-black p-6 mb-8">
              <p className="text-2xl font-medium text-center">
                <span className="font-black">{data.votos.total}</span> deputados votaram
              </p>
            </div>

            {/* PARTIDOS (se disponível) */}
            {data.partidosMaioria && data.partidosMaioria.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">
                  Principais Partidos:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.partidosMaioria.slice(0, 6).map((p, idx) => (
                    <div
                      key={idx}
                      className={`p-4 border-[3px] border-black ${
                        p.voto === "sim" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <span className="font-black text-xl">{p.partido}</span>
                      <span className="block text-lg font-bold">
                        {p.quantidade}x {p.voto.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SPACER */}
            <div className="flex-1" />

            {/* FONTE */}
            <div className="flex items-center justify-between pt-6 border-t-[4px] border-black">
              <div>
                <span className="text-sm font-bold uppercase text-gray-500 block mb-1">FONTE</span>
                <span className="text-2xl font-black">Câmara dos Deputados</span>
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
              Acompanhe como seu deputado vota.
            </p>
            <div className="bg-brutal-yellow text-black px-4 py-2 font-black text-xl">
              politicsbrutal.com.br
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
