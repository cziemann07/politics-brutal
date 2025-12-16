// components/features/Blocks/BolsaFamiliaBarbaridade.tsx
import { BrutalBlock } from "@/components/ui";
import { Users, Briefcase, ChevronUp, ChevronDown } from "lucide-react";

export default function BolsaFamiliaBarbaridade() {
  return (
    <BrutalBlock title="A Armadilha da Dependência" theme="black">
      <p className="font-medium text-sm leading-tight">
        O Bolsa Família nasceu como um programa emergencial e temporário. Contudo, hoje, mais de{" "}
        <strong>56 milhões</strong> de pessoas dependem diretamente dele. Não é política pública de
        inclusão — é **manutenção de dependência**.
      </p>

      {/* BLOCO VISUAL: COMPARATIVO DE DEPENDÊNCIA (MANTIDO) */}
      <div className="border-3 border-black p-4 bg-gray-50 flex flex-col gap-3">
        <h4 className="font-black text-lg uppercase leading-none">Crescimento (últimos 5 anos)</h4>

        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-brutal-red" />
          <span className="font-bold text-sm min-w-[120px]">DEPENDENTES (BF)</span>
          <div className="flex-1 h-5 bg-brutal-red relative">
            <span className="absolute right-0 top-0 bottom-0 px-2 text-white text-xs font-black flex items-center">
              +30%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-green-700" />
          <span className="font-bold text-sm min-w-[120px]">EMPREGO FORMAL</span>
          <div className="flex-1 h-5 bg-green-700 relative w-[50%]" style={{ maxWidth: "60%" }}>
            <span className="absolute right-0 top-0 bottom-0 px-2 text-white text-xs font-black flex items-center">
              +6%
            </span>
          </div>
        </div>
        <p className="text-xs italic mt-2 text-right">O Estado deveria libertar, não aprisionar.</p>
      </div>

      {/* NOVO BLOCO: COMPARAÇÃO DE ESTADOS */}
      <div className="border-3 border-black p-4 bg-yellow-50 flex flex-col gap-3">
        <h4 className="font-black text-lg uppercase leading-none text-black">
          O ABSURDO REGIONAL (2024)
        </h4>

        <div className="grid grid-cols-3 text-xs font-bold uppercase border-b-2 border-black pb-1">
          <span>Estado</span>
          <span className="text-center">Beneficiados/Pop.</span>
          <span className="text-right">Formal/Benef.</span>
        </div>

        {/* Estado com alto absurdo */}
        <div className="grid grid-cols-3 text-sm items-center py-1">
          <span className="font-bold">MAIS DEPENDENTE (AL)</span>
          <span className="text-center font-black text-brutal-red">
            48% <ChevronUp className="w-4 h-4 inline ml-1" />
          </span>
          <span className="text-right font-black">1.5 : 1</span>
        </div>

        {/* Estado com baixo absurdo */}
        <div className="grid grid-cols-3 text-sm items-center py-1 border-t border-gray-300">
          <span className="font-bold">MENOS DEPENDENTE (SC)</span>
          <span className="text-center font-black text-green-700">
            18% <ChevronDown className="w-4 h-4 inline ml-1" />
          </span>
          <span className="text-right font-black">4.1 : 1</span>
        </div>
      </div>

      <div className="border-l-4 border-black pl-3 pt-1 pb-1">
        <h4 className="font-bold uppercase text-black mb-1">O Voto Garantido</h4>
        <p className="font-medium text-sm leading-tight italic">
          Governos adoram inflar o número de beneficiados, porque quanto mais gente depender do
          Estado para sobreviver, maior o controle emocional e político.
        </p>
      </div>
    </BrutalBlock>
  );
}
