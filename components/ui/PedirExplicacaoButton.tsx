"use client";

import { useState } from "react";
import { MessageCircle, Twitter, Instagram, Copy, Check, X } from "lucide-react";

interface PedirExplicacaoButtonProps {
  deputadoNome: string;
  deputadoPartido: string;
  deputadoEstado: string;
  gastoValor?: number;
  gastoTipo?: string;
  gastoPeriodo?: string;
}

export default function PedirExplicacaoButton({
  deputadoNome,
  deputadoPartido,
  deputadoEstado,
  gastoValor,
  gastoTipo = "CEAP",
  gastoPeriodo = "no ultimo mes",
}: PedirExplicacaoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Gerar handle do Twitter baseado no nome (simplificado)
  const twitterHandle = deputadoNome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .slice(0, 15);

  // Mensagem para Twitter
  const mensagemTwitter = gastoValor
    ? `@${twitterHandle} Deputado(a) ${deputadoNome} (${deputadoPartido}-${deputadoEstado}), gostaria de entender melhor o gasto de R$ ${gastoValor.toLocaleString(
        "pt-BR",
        { minimumFractionDigits: 2 }
      )} registrado ${gastoPeriodo} na cota parlamentar. Poderia explicar a necessidade desse valor? #Transparencia #PoliticaSemFiltro`
    : `@${twitterHandle} Deputado(a) ${deputadoNome} (${deputadoPartido}-${deputadoEstado}), como cidadão/cidadã, gostaria de acompanhar seu trabalho e entender melhor seus gastos parlamentares. A transparência fortalece a democracia! #Transparencia #PoliticaSemFiltro`;

  // Mensagem para Instagram
  const mensagemInstagram = gastoValor
    ? `Deputado(a) ${deputadoNome} (${deputadoPartido}-${deputadoEstado}),

Como cidadão/cidadã brasileiro(a), gostaria de entender melhor o gasto de R$ ${gastoValor.toLocaleString(
        "pt-BR",
        { minimumFractionDigits: 2 }
      )} registrado ${gastoPeriodo} na sua cota parlamentar (${gastoTipo}).

Poderia explicar publicamente a necessidade desse valor?

A transparência é fundamental para a democracia.

#Transparencia #PoliticaSemFiltro #Cidadania #Accountability`
    : `Deputado(a) ${deputadoNome} (${deputadoPartido}-${deputadoEstado}),

Como cidadão/cidadã brasileiro(a), gostaria de acompanhar de perto seu mandato e entender melhor como são utilizados os recursos públicos.

A transparência fortalece nossa democracia!

#Transparencia #PoliticaSemFiltro #Cidadania`;

  const abrirTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(mensagemTwitter)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const copiarParaClipboard = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-brutal bg-brutal-blue text-white flex items-center gap-2"
      >
        <MessageCircle size={18} />
        Pedir Explicacao
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-brutal-dark-surface border-4 border-black dark:border-brutal-dark-border shadow-hard dark:shadow-none max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-brutal-blue text-white p-4 flex justify-between items-center">
              <h3 className="font-black text-lg uppercase">Pedir Explicacao</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-brutal-dark-muted mb-4">
                Escolha a rede social para enviar sua mensagem para{" "}
                <strong className="dark:text-brutal-dark-text">{deputadoNome}</strong>:
              </p>

              {/* Twitter/X */}
              <div className="mb-4 border-3 border-black dark:border-brutal-dark-border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Twitter className="w-5 h-5" />
                  <span className="font-black dark:text-brutal-dark-text">Twitter / X</span>
                </div>
                <div className="bg-gray-100 dark:bg-brutal-dark-bg p-3 text-sm mb-3 max-h-32 overflow-y-auto dark:text-brutal-dark-text">
                  {mensagemTwitter}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={abrirTwitter}
                    className="flex-1 btn-brutal bg-black text-white text-sm flex items-center justify-center gap-2"
                  >
                    <Twitter size={16} />
                    Postar no X
                  </button>
                  <button
                    onClick={() => copiarParaClipboard(mensagemTwitter)}
                    className="btn-brutal bg-white dark:bg-brutal-dark-surface text-black dark:text-brutal-dark-text text-sm flex items-center gap-1"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Instagram */}
              <div className="border-3 border-black dark:border-brutal-dark-border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Instagram className="w-5 h-5" />
                  <span className="font-black dark:text-brutal-dark-text">Instagram</span>
                </div>
                <div className="bg-gray-100 dark:bg-brutal-dark-bg p-3 text-sm mb-3 max-h-32 overflow-y-auto dark:text-brutal-dark-text whitespace-pre-line">
                  {mensagemInstagram}
                </div>
                <button
                  onClick={() => copiarParaClipboard(mensagemInstagram)}
                  className="w-full btn-brutal bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  Copiar Mensagem
                </button>
                <p className="text-xs text-gray-500 dark:text-brutal-dark-muted mt-2 text-center">
                  Cole nos comentarios ou DM do Instagram do deputado
                </p>
              </div>

              {/* Dica */}
              <div className="mt-4 p-3 bg-brutal-yellow/20 dark:bg-brutal-dark-accent/20 border-2 border-brutal-yellow dark:border-brutal-dark-accent text-sm">
                <p className="font-bold dark:text-brutal-dark-text">Dica:</p>
                <p className="text-gray-700 dark:text-brutal-dark-muted">
                  Mensagens educadas e objetivas têm mais chances de serem respondidas.
                  Cobrar transparência é um direito do cidadão!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
