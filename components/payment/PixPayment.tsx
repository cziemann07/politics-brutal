"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Clock, AlertCircle, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PixPaymentProps {
  planId: "basico" | "pro";
  planName: string;
  price: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Dados do recebedor PIX - ATUALIZE COM SEUS DADOS REAIS
const PIX_CONFIG = {
  chavePix: "45998393963", // Sua chave PIX (email, telefone, CPF ou aleatória)
  nomeRecebedor: "Carlos Eduardo Ziemann da Silva",
  cidade: "Foz do Iguaçu",
};

// Gera código PIX no formato EMV (copia e cola)
function gerarCodigoPix(valor: number, txid: string): string {
  const formatField = (id: string, value: string) => {
    const len = value.length.toString().padStart(2, "0");
    return `${id}${len}${value}`;
  };

  // Merchant Account Information (chave PIX)
  const gui = formatField("00", "br.gov.bcb.pix");
  const chave = formatField("01", PIX_CONFIG.chavePix);
  const merchantAccount = formatField("26", gui + chave);

  // Campos principais
  const payloadFormat = formatField("00", "01");
  const merchantCategoryCode = formatField("52", "0000");
  const transactionCurrency = formatField("53", "986"); // BRL
  const transactionAmount = formatField("54", valor.toFixed(2));
  const countryCode = formatField("58", "BR");
  const merchantName = formatField("59", PIX_CONFIG.nomeRecebedor.substring(0, 25));
  const merchantCity = formatField("60", PIX_CONFIG.cidade.substring(0, 15));

  // Additional Data Field (txid)
  const txidField = formatField("05", txid.substring(0, 25));
  const additionalData = formatField("62", txidField);

  // Monta payload sem CRC
  let payload =
    payloadFormat +
    merchantAccount +
    merchantCategoryCode +
    transactionCurrency +
    transactionAmount +
    countryCode +
    merchantName +
    merchantCity +
    additionalData +
    "6304"; // CRC placeholder

  // Calcula CRC16 (CCITT-FALSE)
  const crc = calcularCRC16(payload);

  return payload + crc;
}

// CRC16 CCITT-FALSE
function calcularCRC16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

// Gera ID único para a transação
function gerarTxId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `PB${timestamp}${random}`.toUpperCase().substring(0, 25);
}

export default function PixPayment({
  planId,
  planName,
  price,
  onSuccess,
  onCancel,
}: PixPaymentProps) {
  const [txId] = useState(() => gerarTxId());
  const [codigoPix, setCodigoPix] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos
  const [status, setStatus] = useState<"pending" | "checking" | "success" | "expired">("pending");

  // Gera o código PIX
  useEffect(() => {
    const codigo = gerarCodigoPix(price, txId);
    setCodigoPix(codigo);
  }, [price, txId]);

  // Timer de expiração
  useEffect(() => {
    if (status !== "pending") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  // Formata tempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Copiar código PIX
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codigoPix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  // Verifica o pagamento via API
  const handleVerificarPagamento = async () => {
    setStatus("checking");

    try {
      const response = await fetch(`/api/payments?txId=${txId}`);
      const data = await response.json();

      if (data.status === "confirmed") {
        setStatus("success");
        onSuccess?.();
      } else {
        setStatus("pending");
        alert(data.message || "Pagamento ainda não confirmado. Tente novamente em alguns segundos.");
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      setStatus("pending");
      alert("Erro ao verificar pagamento. Tente novamente.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
          <Check size={40} className="text-white" />
        </div>
        <h3 className="text-2xl font-black mb-2 dark:text-brutal-dark-text">
          Pagamento Confirmado!
        </h3>
        <p className="text-gray-600 dark:text-brutal-dark-muted mb-4">
          Seu plano {planName} foi ativado com sucesso.
        </p>
        <p className="text-sm text-gray-500 dark:text-brutal-dark-muted">
          ID da transação: {txId}
        </p>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-brutal-red rounded-full flex items-center justify-center">
          <AlertCircle size={40} className="text-white" />
        </div>
        <h3 className="text-2xl font-black mb-2 dark:text-brutal-dark-text">
          Pagamento Expirado
        </h3>
        <p className="text-gray-600 dark:text-brutal-dark-muted mb-4">
          O tempo para pagamento se esgotou.
        </p>
        <button
          onClick={onCancel}
          className="btn-brutal bg-black text-white dark:bg-brutal-dark-accent"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-black uppercase mb-1 dark:text-brutal-dark-text">
          Pagamento via PIX
        </h3>
        <p className="text-gray-600 dark:text-brutal-dark-muted">
          {planName} - <span className="font-bold text-green-600">R$ {price.toFixed(2).replace(".", ",")}</span>/mês
        </p>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 text-sm font-bold">
        <Clock size={16} className="text-gray-500" />
        <span className={timeLeft < 60 ? "text-brutal-red" : "text-gray-600 dark:text-brutal-dark-muted"}>
          Expira em: {formatTime(timeLeft)}
        </span>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="p-4 border-3 border-black dark:border-brutal-dark-border bg-white">
          {codigoPix ? (
            <QRCodeSVG
              value={codigoPix}
              size={180}
              level="M"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          ) : (
            <div className="w-[180px] h-[180px] flex items-center justify-center">
              <Loader2 size={40} className="animate-spin text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-gray-100 dark:bg-brutal-dark-bg p-4 border-2 border-black dark:border-brutal-dark-border">
        <p className="font-bold text-sm mb-2 dark:text-brutal-dark-text">Como pagar:</p>
        <ol className="text-sm text-gray-600 dark:text-brutal-dark-muted space-y-1">
          <li>1. Abra o app do seu banco</li>
          <li>2. Escolha pagar com PIX</li>
          <li>3. Escaneie o QR Code ou copie o código abaixo</li>
          <li>4. Confirme o pagamento</li>
        </ol>
      </div>

      {/* Código PIX Copia e Cola */}
      <div>
        <label className="block text-sm font-bold uppercase mb-2 dark:text-brutal-dark-text">
          PIX Copia e Cola
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={codigoPix}
            readOnly
            className="flex-1 p-3 border-3 border-black dark:border-brutal-dark-border bg-gray-50 dark:bg-brutal-dark-bg text-xs font-mono dark:text-brutal-dark-text truncate"
          />
          <button
            onClick={handleCopy}
            className={`px-4 border-3 border-black dark:border-brutal-dark-border font-bold transition-colors ${
              copied
                ? "bg-green-500 text-white"
                : "bg-white dark:bg-brutal-dark-surface hover:bg-black hover:text-white dark:hover:bg-brutal-dark-accent"
            }`}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 border-3 border-black dark:border-brutal-dark-border font-bold bg-white dark:bg-brutal-dark-surface dark:text-brutal-dark-text hover:bg-gray-100 dark:hover:bg-brutal-dark-bg transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleVerificarPagamento}
          disabled={status === "checking"}
          className="flex-1 py-3 border-3 border-black dark:border-brutal-dark-accent font-bold bg-brutal-yellow dark:bg-brutal-dark-accent text-black dark:text-white disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === "checking" ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Verificando...
            </>
          ) : (
            "Já paguei"
          )}
        </button>
      </div>

      {/* Info */}
      <p className="text-xs text-center text-gray-500 dark:text-brutal-dark-muted">
        ID: {txId} | Após o pagamento, seu plano será ativado automaticamente.
      </p>
    </div>
  );
}
