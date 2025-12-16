"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, Users, AlertTriangle, XCircle, TrendingUp } from "lucide-react";

// --- INTERFACES (INTACTAS) ---
interface TimelineStep {
  id: number;
  date: string;
  textPrefix: string;
  highlight: string;
  textSuffix: string;
}

interface FamilyCardData {
  name: string;
  roleBadge: string;
  roleBadgeColor: "red" | "gray";
  description: string;
  detailLabel: string;
  detailValue: string;
}

interface InstaShareComplexProps {
  titleMain: string;
  titleHighlight: string;
  source: string;
  dataDate: string;
  timelineTitle: string;
  timelineSubtitle: string;
  timelineSteps: TimelineStep[];
  familyTitle: string;
  familySubtitle: string;
  familyCards: FamilyCardData[];
  theoryQuote: string;
  realityTitle: string;
  realityMainValue: string;
  realitySubValue: string;
  realityScope: string;
}

export default function InstaShareButton({ data }: { data: InstaShareComplexProps }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // MANTIVE SUA LÓGICA DE ALTURA
  const calculateDynamicHeight = () => {
    if (!ref.current) return "auto";
    const contentHeight = ref.current.scrollHeight;
    // Adiciona 50px de margem de segurança
    return `${contentHeight}px`;
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
      const filename = `dossie-${data.titleHighlight.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`;
      download(dataUrl, filename);
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={loading}
        className="group flex items-center gap-2 bg-black text-white px-4 py-2 font-bold uppercase text-xs md:text-sm border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all active:translate-y-1 shadow-hard"
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        {loading ? "Gerando..." : "Baixar Dossiê"}
      </button>

      {/* --- LAYOUT OCULTO --- */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          height: "auto",
        }}
      >
        <div
          ref={ref}
          className="bg-white p-10 flex flex-col font-sans text-black box-border relative"
          style={{
            width: "1080px",
            height: calculateDynamicHeight(), // Sua função
          }}
        >
          {/* === CABEÇALHO === */}
          <div className="mb-8 w-full">
            <span className="bg-brutal-red text-white text-sm font-black px-3 py-1 uppercase tracking-widest mb-2 inline-block transform -rotate-1">
              Dossiê Exclusivo
            </span>

            <h1 className="flex flex-row items-baseline gap-4 text-8xl font-black uppercase leading-none tracking-tighter border-b-[6px] border-black pb-4 mb-0 whitespace-nowrap w-full">
              <span>{data.titleMain}</span>
              <span className="text-brutal-red">{data.titleHighlight}</span>
            </h1>

            <div className="flex justify-end items-center mt-0">
              <div className="bg-black text-white px-6 py-2 flex gap-8">
                <p className="font-bold text-lg uppercase">FONTE:{data.source}</p>
                <p className="font-mono text-lg uppercase opacity-80"> {data.dataDate}</p>
              </div>
            </div>
          </div>

          {/* === SEÇÃO 1: LINHA DO TEMPO === */}
          <section className="mb-12 w-full">
            <h2 className="text-4xl font-black uppercase flex items-center gap-3 mb-4 whitespace-nowrap">
              <TrendingUp className="text-brutal-red shrink-0" size={40} strokeWidth={3} />
              {data.timelineTitle}
            </h2>
            <p className="font-medium mb-8 text-2xl max-w-5xl leading-snug text-gray-700 block">
              {data.timelineSubtitle}
            </p>

            <div className="space-y-6 pl-2">
              {data.timelineSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-5 relative">
                  <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shrink-0 z-10">
                    {step.id}
                  </div>
                  {step.id !== data.timelineSteps.length && (
                    <div className="absolute left-[22px] top-12 w-[4px] h-[calc(100%+8px)] bg-black -z-0"></div>
                  )}
                  <div className="text-2xl leading-tight pt-1">
                    <span className="font-black mr-2">{step.date}:</span>
                    {step.textPrefix}{" "}
                    <span className="text-brutal-red font-black">{step.highlight}</span>{" "}
                    {step.textSuffix}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* === SEÇÃO 2: FAMÍLIA (AQUI ESTAVA O PROBLEMA DE VISUAL) === */}
          <section className="mt-8 mb-10 w-full">
            <div className="flex items-center gap-5 mb-8 border-b-[5px] border-black pb-4 w-full">
              <Users className="text-brutal-blue shrink-0" size={60} strokeWidth={2.5} />
              <div className="flex flex-col">
                <h2 className="text-5xl font-black uppercase mb-2 leading-none whitespace-nowrap">
                  {data.familyTitle}
                </h2>
                <p className="font-bold text-gray-500 uppercase text-1xl tracking-wide leading-tight">
                  {data.familySubtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {data.familyCards.map((card, index) => (
                <div
                  key={index}
                  className="border-[3px] border-black p-6 bg-white shadow-hard flex flex-col justify-between h-full"
                >
                  <div>
                    {/* CORREÇÃO DE ALINHAMENTO:
                                1. Adicionei 'gap-4' para separar nome do badge.
                                2. Removi 'max-w-[80%]' e coloquei 'flex-1' para o nome ocupar o espaço real.
                                3. Mudei 'leading-[0.9]' para 'leading-none' (evita sobreposição se quebrar linha).
                            */}
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="font-black text-3xl uppercase leading-none flex-1">
                        {card.name}
                      </h3>
                      <span
                        className={`text-xs font-black px-2 py-1 uppercase border border-black shrink-0 ${card.roleBadgeColor === "red" ? "bg-brutal-red text-white" : "bg-gray-200 text-black"}`}
                      >
                        {card.roleBadge}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-6 italic leading-tight mt-2">
                      {card.description}
                    </p>
                  </div>

                  <div className="border-t-2 border-dashed border-gray-400 pt-4 mt-auto">
                    {" "}
                    {/* Aumentei de pt-3 para pt-4 (mais ar no topo) */}
                    <span className="text-xs md:text-sm font-bold block uppercase text-gray-500 mb-2">
                      {" "}
                      {/* Adicionei mb-2 para desgrudar do valor */}
                      {card.detailLabel}
                    </span>
                    <span className="font-black text-2xl md:text-3xl block leading-none">
                      {" "}
                      {/* Adicionei block e leading-none para cravar o alinhamento */}
                      {card.detailValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* === SEÇÃO 3: CONTRASTE === */}
          <section className="grid grid-cols-2 gap-8 mt-auto h-[350px]">
            <div className="border-[4px] border-black p-8 relative flex items-center justify-center bg-brutal-yellow shadow-hard">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <XCircle size={250} />
              </div>
              <div className="relative z-10 text-center w-full">
                <h3 className="text-3xl font-black uppercase mb-4 border-b-2 border-black inline-block pb-1 whitespace-nowrap">
                  {data.theoryQuote.split('"')[0]}
                </h3>
                <blockquote className="font-serif italic text-2xl leading-relaxed text-gray-800">
                  "{data.theoryQuote.split('"')[1]}"
                </blockquote>
                <p className="text-sm font-bold mt-4 text-right block w-full">
                  - Código de Ética / Autor
                </p>
              </div>
            </div>

            <div className="border-[4px] border-black p-8 relative bg-brutal-red shadow-hard flex flex-col justify-between overflow-hidden">
              <div className="absolute top-4 right-4 opacity-50">
                <AlertTriangle size={80} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase mb-6 max-w-[85%] leading-tight">
                  {data.realityTitle}
                </h3>
                {/*<p className="font-bold text-sm uppercase mb-1">DADOS:</p> */}
                <div className="mb-2">
                  {/* Diminuí levemente o tamanho da fonte de 8xl para 6xl para caber números grandes como R$ 249.510,50 sem quebrar */}
                  <span className="text-6xl font-black leading-none tracking-tighter block mb-2 text-white drop-shadow-sm whitespace-nowrap">
                    {data.realityMainValue}
                  </span>
                  <span className="font-mono text-xl font-bold block bg-black text-white inline-block px-2">
                    ({data.realitySubValue})
                  </span>
                </div>
              </div>
              <div className="border-t-[3px] border-black pt-3 mt-4">
                <p className="font-bold text-lg leading-tight">
                  <span className="font-black"></span> {data.realityScope}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
