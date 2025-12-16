// components/features/Blocks/BandidolatriaBrasil.tsx
import { BrutalBlock } from "@/components/ui";
import { Shield, Skull } from "lucide-react";

export default function BandidolatriaBrasil() {
  return (
    <BrutalBlock title="A Inversão Moral e a Bandidolatria" theme="orange">
      <p className="font-medium text-sm leading-tight">
        Criminosos armados dominam territórios enquanto o Estado negocia ou finge que não vê. Quando
        a polícia age, é atacada. Quando não age, é cúmplice por omissão.
      </p>

      {/* NOVO BLOCO VISUAL: INVERSÃO DE VALORES */}
      <div className="grid grid-cols-2 gap-3 border-3 border-orange-600 p-4 bg-orange-100">
        {/* Coluna 1: O "Vilão" */}
        <div className="flex flex-col items-center p-2 border-r-2 border-orange-600">
          <Shield className="w-8 h-8 text-orange-600 mb-1" />
          <h4 className="font-black text-lg uppercase leading-none">O VILÃO</h4>
          <p className="text-xs text-center font-medium mt-1">
            Policial é condenado e tratado como opressor.
          </p>
        </div>

        {/* Coluna 2: A "Vítima" */}
        <div className="flex flex-col items-center p-2">
          <Skull className="w-8 h-8 text-brutal-red mb-1" />
          <h4 className="font-black text-lg uppercase leading-none text-brutal-red">A VÍTIMA</h4>
          <p className="text-xs text-center font-medium mt-1">
            Criminoso é romantizado como vítima do sistema.
          </p>
        </div>

        <p className="col-span-2 text-xs italic mt-2 text-center border-t-2 border-orange-600 pt-2">
          A frase “o traficante é vítima do usuário” resume a ideologia que governa parte do país.
        </p>
      </div>

      <p className="font-medium text-sm leading-tight">
        Uma inversão moral onde o errado é tratado como certo — e o certo, como inimigo.
      </p>
    </BrutalBlock>
  );
}
