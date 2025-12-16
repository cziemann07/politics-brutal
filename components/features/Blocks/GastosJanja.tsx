// components/features/Blocks/GastosJanja.tsx
import { BrutalBlock } from "@/components/ui";
import { Plane, Hotel, Check, X, Banknote } from "lucide-react";

export default function GastosJanja() {
  return (
    <BrutalBlock title="O Custo do Cargo Não-Eleito" theme="blue">
      <p className="font-medium text-sm leading-tight">
        A primeira-dama não foi eleita para nada. Mesmo assim, desfila pelo mundo com estrutura de
        chefe de Estado: jatinhos, hotéis de luxo e logística milionária.
      </p>

      {/* NOVO BLOCO VISUAL: VALOR PAGO COM SELO QUESANOS */}
      <div className="border-3 border-brutal-blue p-4 bg-white relative overflow-hidden">
        {/* SELO QUESANOS (BADGE DE ALERTA) */}
        <div className="absolute top-0 right-0 bg-brutal-red text-white text-xs font-black px-3 py-1 border-l-3 border-b-3 border-black transform rotate-3 origin-top-right z-10">
          SELO DO QUESANOS
        </div>

        <h4 className="font-black text-lg uppercase leading-none text-black mb-3">
          GASTO TOTAL (ESTIMADO):
        </h4>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <Banknote size={40} className="text-brutal-blue stroke-[2.5px]" />
            <p className="font-black text-4xl text-brutal-blue leading-none">R$ 5.4 MI</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase">Em 12 meses de mandato</span>
            <p className="text-lg font-black leading-tight text-red-600">+28% Acima da Previsão</p>
          </div>
        </div>
      </div>

      {/* BLOCO VISUAL: CUSTO REAL X FUNÇÃO (MANTIDO) */}
      <div className="border-3 border-brutal-blue p-4 bg-blue-50 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 border-r-2 border-brutal-blue pr-4">
          <h4 className="font-black text-lg uppercase leading-none text-brutal-blue">
            O LUXO PAGO
          </h4>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Plane className="w-5 h-5" /> Jatinhos e Frotas
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Hotel className="w-5 h-5" /> Suítes Presidenciais
          </div>
        </div>

        <div className="flex flex-col gap-2 pl-2">
          <h4 className="font-black text-lg uppercase leading-none text-black">A FUNÇÃO REAL</h4>
          <div className="flex items-center gap-2 text-sm font-medium">
            <X className="w-5 h-5 text-brutal-red" /> Legisla?
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <X className="w-5 h-5 text-brutal-red" /> Comanda Ministério?
          </div>
        </div>
        <p className="col-span-2 text-xs italic mt-2 text-center border-t-2 border-brutal-blue pt-2">
          Enquanto o brasileiro se aperta, a "agenda oficial" é marketing político travestido de
          diplomacia.
        </p>
      </div>

      <p className="font-medium text-sm leading-tight">
        A conta sempre chega. E nunca é para quem gastou.
      </p>
    </BrutalBlock>
  );
}
