// components/features/Blocks/TaxacaoBlusinha.tsx
import BrutalBlock from '../../BrutalBlock';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TaxacaoBlusinha() {
  return (
    <BrutalBlock 
      title="Prioridade Fiscal: O Foco na Blusinha" 
      theme="red"
    >
      <p className="font-medium text-sm leading-tight">
        A “taxa das blusinhas” impacta quem depende desses produtos para economizar ou para revender como microempreendedor. O discurso é social, mas a prática é puramente arrecadatória.
      </p>

      {/* BLOCO VISUAL: BALANÇA DE JUSTIÇA FISCAL - COM DADOS REAIS MOCK */}
      <div className="border-3 border-red-600 p-4 bg-red-50 flex flex-col gap-3">
        <h4 className="font-black text-lg uppercase leading-none text-red-600">Onde Está a Arrecadação?</h4>
        
        {/* Item 1: Perdas (Gigante) - DADO REAL MOCK */}
        <div className="flex items-start gap-3 border-b-2 border-red-600 pb-2">
          <TrendingDown className="w-6 h-6 text-red-600 min-w-6" />
          <div className='flex-1'>
            <span className="font-bold text-sm block">DÍVIDAS BILIONÁRIAS PERDOADAS (EXEMPLO):</span>
            {/* Valor de perdão fiscal em caso notório (Ex: 2023) */}
            <p className="font-black text-2xl leading-none">R$ 27.5 BILHÕES</p> 
            <span className="text-xs italic text-gray-600 block">Isenções fiscais de PIS/COFINS (2023)</span>
          </div>
        </div>
        
        {/* Item 2: Ganhos (Minúsculo) - DADO ESTIMADO MOCK */}
        <div className="flex items-start gap-3 pt-2">
          <TrendingUp className="w-6 h-6 text-green-700 min-w-6" />
          <div className='flex-1'>
            <span className="font-bold text-sm block">ARRECADAÇÃO C/ TAXA DAS BLUSINHAS (ANUAL ESTIMADA):</span>
            {/* Valor estimado de arrecadação anual com a taxação */}
            <p className="font-black text-2xl leading-none text-green-700">R$ 500 MILHÕES</p>
            <span className="text-xs italic text-gray-600 block">Apenas 1,8% do Perdão Fiscal</span>
          </div>
        </div>
        <p className="text-xs italic mt-2 text-right">
          O governo não é social. O governo é taxador.
        </p>
      </div>

      <div className="border-l-4 border-red-600 pl-3 pt-1 pb-1">
        <h4 className="font-bold uppercase text-red-600 mb-1">A Contradição</h4>
        <p className="font-medium text-sm leading-tight italic">
          A mesma gestão aumenta imposto para o consumidor, mas perdoa dívidas bilionárias de empresas amigas.
        </p>
      </div>
    </BrutalBlock>
  );
}