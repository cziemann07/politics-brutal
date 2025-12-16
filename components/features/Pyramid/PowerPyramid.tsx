"use client";
import React, { useState } from "react";

const powerLevels = [
  {
    id: "topo",
    label: "PRESIDÊNCIA",
    description: "Chefe de Estado e Governo. Define a direção macro do país.",
    color: "#FFE600",
    path: "M150 20 L220 120 L80 120 Z",
  },
  {
    id: "meio",
    label: "MINISTÉRIOS & STF",
    description: "Executivo (Mãos) e Judiciário (Árbitro). O STF aplica a regra, não joga.",
    color: "#FFFFFF",
    path: "M80 120 L220 120 L260 220 L40 220 Z",
  },
  {
    id: "base",
    label: "CONGRESSO NACIONAL",
    description: "Câmara e Senado. Criam as leis e fiscalizam o Presidente. A base de tudo.",
    color: "#FFFFFF",
    path: "M40 220 L260 220 L300 320 L0 320 Z",
  },
];

export default function PowerPyramid() {
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-8">
      <div className="relative w-full max-w-[300px] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <svg viewBox="0 0 300 320" className="w-full h-auto cursor-pointer">
          {powerLevels.map((level) => (
            <path
              key={level.id}
              d={level.path}
              fill={activeLevel === level.id ? "#4A90E2" : level.color}
              stroke="black"
              strokeWidth="3"
              className="transition-all duration-200 hover:fill-brutal-blue"
              onClick={() => setActiveLevel(level.id)}
            />
          ))}
          <text
            x="150"
            y="90"
            textAnchor="middle"
            className="font-bold text-xs pointer-events-none"
          >
            TOPO
          </text>
          <text
            x="150"
            y="180"
            textAnchor="middle"
            className="font-bold text-xs pointer-events-none"
          >
            MEIO
          </text>
          <text
            x="150"
            y="280"
            textAnchor="middle"
            className="font-bold text-xs pointer-events-none"
          >
            BASE
          </text>
        </svg>
      </div>

      <div className="card-brutal w-full max-w-md min-h-[150px]">
        <h3 className="text-xl font-bold uppercase border-b-3 border-black pb-2 mb-2">
          {activeLevel ? powerLevels.find((p) => p.id === activeLevel)?.label : "COMO FUNCIONA?"}
        </h3>
        <p className="text-lg leading-relaxed">
          {activeLevel
            ? powerLevels.find((p) => p.id === activeLevel)?.description
            : "Clique em uma fatia da pirâmide para entender quem manda em quê. Spoiler: O povo deveria estar no topo."}
        </p>
      </div>
    </div>
  );
}
