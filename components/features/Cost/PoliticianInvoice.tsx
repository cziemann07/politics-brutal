"use client";
import { useState } from "react";
import { User, DollarSign, Users } from "lucide-react";

interface InvoiceProps {
  politicianData?: {
    name: string;
    expenses: number;
    advisors: number;
    cabinet_budget: number;
  };
}

export default function PoliticianInvoice({ politicianData }: InvoiceProps) {
  const [mode, setMode] = useState<"MEDIA" | "REAL">(politicianData ? "REAL" : "MEDIA");

  const AVERAGE = { cota: 45000, gabinete: 111675.59, assessores: 25 };

  const REAL = politicianData
    ? {
        cota: politicianData.expenses,
        gabinete: politicianData.cabinet_budget,
        assessores: politicianData.advisors,
      }
    : AVERAGE;

  const currentData = mode === "MEDIA" ? AVERAGE : REAL;
  const total = 44008.52 + currentData.cota + currentData.gabinete + 4253;

  return (
    <div className="card-brutal border-4 border-black p-0 bg-yellow-50 max-w-2xl mx-auto w-full relative transition-all">
      <div className="bg-black text-white p-4 text-center border-b-4 border-black border-dashed">
        <h2 className="text-3xl font-black uppercase">QUANTO CUSTA O SHOW?</h2>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setMode("MEDIA")}
            className={`px-4 py-1 font-bold text-xs uppercase border-2 border-white transition-all ${mode === "MEDIA" ? "bg-white text-black" : "bg-transparent text-gray-500 hover:text-white"}`}
          >
            Média Geral
          </button>
          {politicianData && (
            <button
              onClick={() => setMode("REAL")}
              className={`px-4 py-1 font-bold text-xs uppercase border-2 border-white transition-all flex items-center gap-2 ${mode === "REAL" ? "bg-brutal-red text-white border-brutal-red" : "bg-transparent text-gray-500 hover:text-white"}`}
            >
              {politicianData.name}{" "}
              <span className="bg-white text-red-600 text-[9px] px-1 rounded">REAL</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-6 font-mono text-sm space-y-4 relative">
        {mode === "MEDIA" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="text-8xl font-black rotate-12">SIMULAÇÃO</span>
          </div>
        )}

        <div className="flex justify-between items-center border-b border-gray-400 pb-2 border-dashed">
          <div className="flex items-center gap-2">
            <User size={18} />
            <span className="font-bold">Salário Base</span>
          </div>
          <span className="font-bold">R$ 44.008,52</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-400 pb-2 border-dashed">
          <div className="flex items-center gap-2 text-brutal-blue">
            <DollarSign size={18} />
            <div className="flex flex-col">
              <span className="font-bold uppercase">Cota Parlamentar</span>
            </div>
          </div>
          <span className="font-bold text-brutal-blue">
            R$ {currentData.cota.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-400 pb-2 border-dashed">
          <div className="flex items-center gap-2 text-brutal-red">
            <Users size={18} />
            <div className="flex flex-col">
              <span className="font-bold uppercase">Verba de Gabinete</span>
            </div>
          </div>
          <span className="font-bold text-brutal-red">
            R$ {currentData.gabinete.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="pt-4 flex flex-col items-end gap-1">
          <span className="text-xs font-bold uppercase">Custo mensal:</span>
          <div
            className={`text-4xl font-black px-2 py-1 transform -rotate-2 shadow-hard border-2 border-black ${mode === "REAL" ? "bg-brutal-red text-white" : "bg-black text-white"}`}
          >
            R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}
