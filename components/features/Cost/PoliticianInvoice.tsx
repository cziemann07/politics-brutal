import { User, DollarSign, Calculator, Users } from 'lucide-react';

export default function PoliticianInvoice() {
  return (
    <div className="card-brutal border-4 border-black p-0 bg-yellow-50 max-w-2xl mx-auto w-full relative">
      
      {/* HEADER TIPO RECIBO */}
      <div className="bg-black text-white p-4 text-center border-b-4 border-black border-dashed">
        <h2 className="text-3xl font-black uppercase">QUANTO CUSTA O SHOW?</h2>
        <p className="text-xs font-mono mt-1">SIMULAÇÃO DE CUSTO MENSAL (MÉDIA)</p>
      </div>

      {/* CONTROLES (FILTRO) */}
      <div className="p-4 bg-white border-b-4 border-black flex flex-col gap-4">
        <div className="flex gap-2 justify-center">
            <button className="btn-brutal bg-brutal-yellow text-sm px-4 py-2 hover:translate-x-0 hover:translate-y-0 shadow-[2px_2px_0px_0px_#000]">DEPUTADO</button>
            <button className="btn-brutal bg-white text-gray-400 text-sm px-4 py-2 hover:translate-x-0 hover:translate-y-0 shadow-[2px_2px_0px_0px_#000]">SENADOR</button>
        </div>
        
        {/* INPUT DE PESQUISA (VISUAL) */}
        <div className="relative">
            <input 
                type="text" 
                placeholder="Pesquisar político específico (Em breve...)" 
                disabled
                className="w-full border-3 border-black p-3 font-mono bg-gray-100 cursor-not-allowed opacity-60"
            />
            <span className="absolute right-4 top-4 font-bold text-xs text-red-600">BLOQUEADO NO MVP</span>
        </div>
      </div>

      {/* A LISTA DE GASTOS (NOTA FISCAL) */}
      <div className="p-6 font-mono text-sm space-y-4">
        
        {/* ITEM 1: SALÁRIO */}
        <div className="flex justify-between items-center border-b border-gray-400 pb-2 border-dashed">
            <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-bold">Salário Base (Subsídio)</span>
            </div>
            <span className="font-bold">R$ 44.008,52</span>
        </div>

        {/* ITEM 2: COTA (EXPLICAÇÃO TOOLTIP NA UI) */}
        <div className="flex justify-between items-center border-b border-gray-400 pb-2 border-dashed">
            <div className="flex items-center gap-2 text-brutal-blue">
                <DollarSign size={18} />
                <div className="flex flex-col">
                    <span className="font-bold uppercase">Cota Parlamentar*</span>
                    <span className="text-[10px] text-gray-600 leading-tight w-48">
                        *Passagens, gasolina, divulgação, aluguel de escritório, comida...
                    </span>
                </div>
            </div>
            <span className="font-bold text-brutal-blue">~ R$ 45.000,00</span>
        </div>

        {/* ITEM 3: OS ASSESSORES (GABINETE) */}
        <div className="flex justify-between items-center border-b border-gray-400 pb-2 border-dashed">
            <div className="flex items-center gap-2 text-brutal-red">
                <Users size={18} />
                <div className="flex flex-col">
                    <span className="font-bold uppercase">Verba de Gabinete</span>
                    <span className="text-[10px] text-gray-600 leading-tight w-48">
                        Para pagar até <span className="font-black text-black bg-yellow-200 px-1">25 assessores</span> (Onde mora o Gabinete do Ódio).
                    </span>
                </div>
            </div>
            <span className="font-bold text-brutal-red">R$ 111.675,59</span>
        </div>

        {/* ITEM 4: AUXÍLIOS EXTRAS */}
        <div className="flex justify-between items-center border-b border-gray-400 pb-2 border-dashed">
            <div className="flex items-center gap-2">
                <span className="font-bold">Auxílio Moradia + Paletó</span>
            </div>
            <span className="font-bold">~ R$ 4.253,00</span>
        </div>

        {/* TOTALIZADOR */}
        <div className="pt-4 flex flex-col items-end gap-1">
            <span className="text-xs font-bold uppercase">Custo mensal aproximado:</span>
            <div className="text-4xl font-black bg-black text-white px-2 py-1 transform -rotate-2">
                R$ 204.937,11
            </div>
            <span className="text-[10px] font-bold text-red-600 uppercase">Por UM ÚNICO deputado</span>
        </div>

      </div>

      {/* RODAPÉ DO RECIBO */}
      <div className="bg-gray-200 p-2 text-center text-[10px] font-mono border-t-4 border-black">
        OBRIGADO PELA PREFERÊNCIA (VOCÊ NÃO TEVE ESCOLHA)
      </div>

    </div>
  );
}