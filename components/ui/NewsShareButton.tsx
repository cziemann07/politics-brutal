"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Share2, Loader2, AlertTriangle, TrendingUp, Newspaper, Zap, Shield, X, Download, Check } from "lucide-react";

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
    label: "HIPOCRISIA EXPOSTA",
    icon: AlertTriangle,
  },
  corrupcao: {
    label: "CORRUPÇÃO",
    icon: Shield,
  },
  polarizacao: {
    label: "POLARIZAÇÃO",
    icon: TrendingUp,
  },
  alerta: {
    label: "ALERTA",
    icon: Zap,
  },
  fato: {
    label: "FATO POLÍTICO",
    icon: Newspaper,
  },
};

// Esquemas de cores para os 4 templates
const colorSchemes = [
  {
    name: "Clássico",
    preview: ["#DC2626", "#FFFFFF", "#0A0A0A"],
    headerBg: "#DC2626",
    headerText: "#FFFFFF",
    bodyBg: "#FFFFFF",
    bodyText: "#0A0A0A",
    subtitleText: "#404040",
    accentBg: "#DC2626",
    accentText: "#FFFFFF",
    contextBg: "#F3F4F6",
    contextBorder: "#0A0A0A",
    footerBg: "#0A0A0A",
    footerText: "#FFFFFF",
    tagBg: "#FACC15",
    tagText: "#0A0A0A",
  },
  {
    name: "Noturno",
    preview: ["#0A0A0A", "#18181B", "#FACC15"],
    headerBg: "#0A0A0A",
    headerText: "#FFFFFF",
    bodyBg: "#18181B",
    bodyText: "#FAFAFA",
    subtitleText: "#A1A1AA",
    accentBg: "#FACC15",
    accentText: "#0A0A0A",
    contextBg: "#27272A",
    contextBorder: "#FACC15",
    footerBg: "#FACC15",
    footerText: "#0A0A0A",
    tagBg: "#FACC15",
    tagText: "#0A0A0A",
  },
  {
    name: "Editorial",
    preview: ["#1F2937", "#FAFAFA", "#111827"],
    headerBg: "#1F2937",
    headerText: "#FFFFFF",
    bodyBg: "#FAFAFA",
    bodyText: "#111827",
    subtitleText: "#4B5563",
    accentBg: "#111827",
    accentText: "#FFFFFF",
    contextBg: "#E5E7EB",
    contextBorder: "#111827",
    footerBg: "#111827",
    footerText: "#FFFFFF",
    tagBg: "#FACC15",
    tagText: "#0A0A0A",
  },
  {
    name: "Impacto",
    preview: ["#7F1D1D", "#FEF2F2", "#DC2626"],
    headerBg: "#7F1D1D",
    headerText: "#FFFFFF",
    bodyBg: "#FEF2F2",
    bodyText: "#0A0A0A",
    subtitleText: "#374151",
    accentBg: "#DC2626",
    accentText: "#FFFFFF",
    contextBg: "#FECACA",
    contextBorder: "#DC2626",
    footerBg: "#0A0A0A",
    footerText: "#FFFFFF",
    tagBg: "#DC2626",
    tagText: "#FFFFFF",
  },
];

export default function NewsShareButton({ data }: { data: NewsShareData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(0);

  const config = categoriaConfig[data.categoria];
  const Icon = config.icon;
  const colors = colorSchemes[selectedScheme];

  // Fecha modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDownload = useCallback(async () => {
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
  }, [data.titulo]);

  // Calcula densidade de conteúdo para ajustar tamanhos dinamicamente
  const totalChars = 
    data.titulo.length + 
    data.subtitulo.length + 
    (data.destaque?.length || 0) + 
    (data.contexto?.length || 0);

  // 4 níveis de densidade — só comprime pra textos realmente longos
  const density: "ultra-compact" | "compact" | "normal" | "spacious" = 
    totalChars > 900 ? "ultra-compact" :
    totalChars > 650 ? "compact" : 
    totalChars > 400 ? "normal" : "spacious";

  // Limites altíssimos: só trunca em casos extremos
  const limites = {
    "ultra-compact": { titulo: 200, subtitulo: 350, destaque: 250, contexto: 350 },
    compact:         { titulo: 250, subtitulo: 450, destaque: 300, contexto: 400 },
    normal:          { titulo: 300, subtitulo: 500, destaque: 350, contexto: 500 },
    spacious:        { titulo: 300, subtitulo: 500, destaque: 350, contexto: 500 },
  }[density];

  // Font sizes dinâmicos (px) para o card de 1080x1350
  const fontSizes = {
    "ultra-compact": { titulo: 30, subtitulo: 19, destaque: 19, contexto: 17 },
    compact:         { titulo: 34, subtitulo: 21, destaque: 21, contexto: 18 },
    normal:          { titulo: 42, subtitulo: 25, destaque: 24, contexto: 20 },
    spacious:        { titulo: 50, subtitulo: 28, destaque: 27, contexto: 23 },
  }[density];

  // Padding/spacing dinâmico
  const spacing = {
    "ultra-compact": { bodyPad: 32, gap: 12, headerPad: "28px 36px 32px 36px" },
    compact:         { bodyPad: 36, gap: 14, headerPad: "30px 40px 36px 40px" },
    normal:          { bodyPad: 42, gap: 20, headerPad: "36px 44px 44px 44px" },
    spacious:        { bodyPad: 48, gap: 26, headerPad: "40px 48px 52px 48px" },
  }[density];

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max - 3) + "..." : text;

  const tituloTruncado = truncate(data.titulo, limites.titulo);
  const subtituloTruncado = truncate(data.subtitulo, limites.subtitulo);
  const destaqueTruncado = data.destaque ? truncate(data.destaque, limites.destaque) : undefined;
  const contextoTruncado = data.contexto ? truncate(data.contexto, limites.contexto) : undefined;

  return (
    <>
      {/* BOTÃO DE COMPARTILHAR */}
      <button
        onClick={() => setIsOpen(true)}
        title="Compartilhar como card"
        className="flex items-center gap-2 bg-black text-white px-3 py-2 font-bold uppercase text-xs border-2 border-black hover:bg-white hover:text-black transition-all active:translate-y-1 dark:bg-brutal-dark-accent dark:border-brutal-dark-accent dark:hover:bg-brutal-dark-bg dark:hover:text-brutal-dark-text"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Compartilhar</span>
      </button>

      {/* MODAL */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div 
            className="relative bg-white dark:bg-brutal-dark-surface border-4 border-black dark:border-brutal-dark-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-black text-white p-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-black text-lg uppercase tracking-tight">Compartilhar</h2>
                <p className="text-xs opacity-70">Escolha o estilo do card</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview do Card (miniatura) */}
            <div className="p-6 bg-gray-100 dark:bg-brutal-dark-bg">
              <div 
                className="mx-auto shadow-lg transition-all duration-300"
                style={{
                  width: "100%",
                  maxWidth: "280px",
                  aspectRatio: "1080/1350",
                  backgroundColor: colors.bodyBg,
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                {/* Mini Header */}
                <div style={{ 
                  backgroundColor: colors.headerBg, 
                  padding: "12px",
                  height: "20%",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <div style={{ 
                      backgroundColor: colors.tagBg, 
                      color: colors.tagText,
                      padding: "2px 6px",
                      fontSize: "8px",
                      fontWeight: 900,
                    }}>
                      PSF
                    </div>
                    <span style={{ color: colors.headerText, fontSize: "6px", opacity: 0.8 }}>
                      POLÍTICA SEM FILTRO
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Icon size={10} color={colors.headerText} />
                    <span style={{ 
                      color: colors.headerText, 
                      fontSize: "6px", 
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}>
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Mini Body */}
                <div style={{ padding: "12px", height: "65%", overflow: "hidden" }}>
                  <p style={{ 
                    color: colors.bodyText, 
                    fontSize: "8px", 
                    fontWeight: 900,
                    textTransform: "uppercase",
                    lineHeight: 1.2,
                    marginBottom: "6px",
                    borderBottom: `2px solid ${colors.bodyText}`,
                    paddingBottom: "6px",
                  }}>
                    {tituloTruncado.slice(0, 90)}
                  </p>
                  <p style={{ 
                    color: colors.subtitleText, 
                    fontSize: "5.5px",
                    lineHeight: 1.4,
                    marginBottom: "6px",
                  }}>
                    {subtituloTruncado.slice(0, 140)}
                  </p>
                  {destaqueTruncado && (
                    <div style={{
                      backgroundColor: colors.accentBg,
                      padding: "4px 6px",
                      marginBottom: "4px",
                      borderLeft: `3px solid ${colors.bodyText}`,
                    }}>
                      <p style={{ color: colors.accentText, fontSize: "5.5px", fontWeight: 700, lineHeight: 1.3 }}>
                        {destaqueTruncado.slice(0, 100)}
                      </p>
                    </div>
                  )}
                  {contextoTruncado && (
                    <div style={{
                      backgroundColor: colors.contextBg,
                      padding: "4px 6px",
                      borderLeft: `2px solid ${colors.contextBorder}`,
                    }}>
                      <p style={{ color: colors.subtitleText, fontSize: "5px", lineHeight: 1.3 }}>
                        {contextoTruncado.slice(0, 90)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Mini Footer */}
                <div style={{ 
                  backgroundColor: colors.footerBg, 
                  padding: "8px 12px",
                  height: "15%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <span style={{ color: colors.footerText, fontSize: "5px", fontWeight: 600 }}>
                    {data.fonte}
                  </span>
                  <div style={{ 
                    backgroundColor: colors.tagBg, 
                    color: colors.tagText,
                    padding: "2px 6px",
                    fontSize: "4px",
                    fontWeight: 900,
                  }}>
                    politicsbrutal.com.br
                  </div>
                </div>
              </div>
            </div>

            {/* Seletor de Cores */}
            <div className="p-6 border-t-2 border-gray-200 dark:border-brutal-dark-border">
              <p className="font-bold text-sm uppercase mb-4 text-gray-600 dark:text-brutal-dark-muted">
                Escolha o estilo
              </p>
              <div className="grid grid-cols-4 gap-3">
                {colorSchemes.map((scheme, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedScheme(index)}
                    className={`relative p-1 rounded transition-all ${
                      selectedScheme === index 
                        ? "ring-2 ring-black dark:ring-white ring-offset-2" 
                        : "hover:scale-105"
                    }`}
                  >
                    {/* Preview das cores */}
                    <div className="flex flex-col overflow-hidden rounded" style={{ aspectRatio: "1/1.25" }}>
                      <div style={{ backgroundColor: scheme.preview[0], flex: 1 }} />
                      <div style={{ backgroundColor: scheme.preview[1], flex: 2 }} />
                      <div style={{ backgroundColor: scheme.preview[2], flex: 0.5 }} />
                    </div>
                    {/* Nome */}
                    <p className="text-[10px] font-bold mt-1 text-center dark:text-brutal-dark-text">
                      {scheme.name}
                    </p>
                    {/* Check de selecionado */}
                    {selectedScheme === index && (
                      <div className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black rounded-full p-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão de Download */}
            <div className="p-6 pt-0">
              <button
                onClick={handleDownload}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black py-4 font-black uppercase text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando imagem...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Baixar Card
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-500 dark:text-brutal-dark-muted mt-3">
                Formato: 1080×1350px (ideal para Instagram)
              </p>
            </div>
          </div>
        </div>
      )}

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
          style={{
            width: "1080px",
            height: "1350px",
            backgroundColor: colors.bodyBg,
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* HEADER COM CATEGORIA */}
          <div
            style={{
              backgroundColor: colors.headerBg,
              color: colors.headerText,
              padding: spacing.headerPad,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "32px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    backgroundColor: colors.tagBg,
                    color: colors.tagText,
                    padding: "10px 20px",
                    fontWeight: 900,
                    fontSize: "28px",
                    letterSpacing: "-1px",
                  }}
                >
                  PSF
                </div>
                <span style={{ fontWeight: 700, fontSize: "18px", opacity: 0.85 }}>
                  POLÍTICA SEM FILTRO
                </span>
              </div>
              <span style={{ fontWeight: 600, fontSize: "20px", opacity: 0.75 }}>
                {data.data}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <Icon size={36} strokeWidth={2.5} />
              <span
                style={{
                  fontWeight: 900,
                  fontSize: "24px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                {config.label}
              </span>
            </div>
          </div>

          {/* CONTEÚDO PRINCIPAL */}
          <div
            style={{
              flex: 1,
              padding: `${spacing.bodyPad}px`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1
              style={{
                fontSize: `${fontSizes.titulo}px`,
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 1.12,
                letterSpacing: "-1px",
                color: colors.bodyText,
                marginBottom: `${spacing.gap}px`,
                paddingBottom: `${spacing.gap}px`,
                borderBottom: `6px solid ${colors.bodyText}`,
                wordBreak: "break-word",
              }}
            >
              {tituloTruncado}
            </h1>

            <p
              style={{
                fontSize: `${fontSizes.subtitulo}px`,
                fontWeight: 500,
                lineHeight: 1.45,
                color: colors.subtitleText,
                marginBottom: `${spacing.gap}px`,
                wordBreak: "break-word",
              }}
            >
              {subtituloTruncado}
            </p>

            {destaqueTruncado && (
              <div
                style={{
                  backgroundColor: colors.accentBg,
                  color: colors.accentText,
                  padding: `${spacing.gap}px ${spacing.gap + 4}px`,
                  marginBottom: `${spacing.gap - 4}px`,
                  borderLeft: `8px solid ${colors.bodyText}`,
                }}
              >
                <p
                  style={{
                    fontSize: `${fontSizes.destaque}px`,
                    fontWeight: 800,
                    lineHeight: 1.35,
                    margin: 0,
                    wordBreak: "break-word",
                  }}
                >
                  {destaqueTruncado}
                </p>
              </div>
            )}

            {contextoTruncado && (
              <div
                style={{
                  backgroundColor: colors.contextBg,
                  padding: `${spacing.gap - 4}px ${spacing.gap}px`,
                  marginBottom: `${spacing.gap - 4}px`,
                  borderLeft: `6px solid ${colors.contextBorder}`,
                }}
              >
                <p
                  style={{
                    fontSize: `${fontSizes.contexto}px`,
                    fontWeight: 500,
                    lineHeight: 1.45,
                    color: colors.subtitleText,
                    margin: 0,
                    wordBreak: "break-word",
                  }}
                >
                  {contextoTruncado}
                </p>
              </div>
            )}

            <div style={{ flex: 1 }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingTop: "24px",
                borderTop: `4px solid ${colors.bodyText}`,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: colors.subtitleText,
                    display: "block",
                    marginBottom: "6px",
                    letterSpacing: "1px",
                  }}
                >
                  FONTE
                </span>
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: colors.bodyText,
                  }}
                >
                  {data.fonte}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: colors.subtitleText,
                    display: "block",
                    marginBottom: "6px",
                    letterSpacing: "1px",
                  }}
                >
                  VERIFIQUE
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: colors.subtitleText,
                  }}
                >
                  Não confie. Pesquise.
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div
            style={{
              backgroundColor: colors.footerBg,
              color: colors.footerText,
              padding: "28px 48px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: "18px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              Desconfie de todo político. Inclusive do seu favorito.
            </p>
            <div
              style={{
                backgroundColor: colors.tagBg,
                color: colors.tagText,
                padding: "12px 24px",
                fontWeight: 900,
                fontSize: "18px",
              }}
            >
              politicsbrutal.com.br
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
