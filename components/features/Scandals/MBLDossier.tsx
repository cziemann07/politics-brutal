import React from "react";
import { AlertTriangle, TrendingUp, Users, DollarSign, XCircle, CheckCircle } from "lucide-react";
import { InstaShareButton } from "@/components/ui";

export default function MBLDossier() {
  return (
    <section className="flex flex-col gap-8">
      {/* HEADER DO DOSSIÊ */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b-3 border-black pb-4 gap-4">
        <div>
          <div className="bg-brutal-red text-white text-xs font-black px-2 py-1 inline-block mb-2 uppercase tracking-widest transform -rotate-1">
            Dossiê Exclusivo
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Missão{" "}
            <span className="text-brutal-red decoration-4 underline decoration-black">Mamata</span>
          </h2>
        </div>

        <div className="flex flex-col items-end gap-3">
          {/* --- BOTÃO DE COMPARTILHAR (CONFIGURADO PARA O MBL) --- */}
          <InstaShareButton
            data={{
              // Cabeçalho
              titleMain: "MISSÃO",
              titleHighlight: "MAMATA",
              source: "TSE",
              dataDate: "2025",

              // Seção Linha do Tempo (Adaptada para o 'Milagre das Assinaturas')
              timelineTitle: 'O "MILAGRE" DAS ASSINATURAS',
              timelineSubtitle:
                "Como o dinheiro público turbinou a criação do partido que prometeu não usar fundão.",
              timelineSteps: [
                {
                  id: 1,
                  date: "SEM FUNDÃO",
                  textPrefix: "Em 8 meses de trabalho orgânico, conseguiram apenas",
                  highlight: "32.000 assinaturas",
                  textSuffix: "válidas.",
                },
                {
                  id: 2,
                  date: "COM FUNDÃO",
                  textPrefix: "Em apenas 1 mês, injetando",
                  highlight: "R$ 400 Mil em anúncios",
                  textSuffix: "do Facebook/Instagram...",
                },
                {
                  id: 3,
                  date: "RESULTADO",
                  textPrefix: "O número saltou magicamente para",
                  highlight: "70.000+ assinaturas",
                  textSuffix: "em tempo recorde.",
                },
              ],

              // Seção Família
              familyTitle: "A ÁRVORE GENEALÓGICA",
              familySubtitle: "NEPOTISMO CRUZADO & CARGOS NO PARTIDO",
              familyCards: [
                {
                  name: "ALEXANDRE HENRIQUE",
                  roleBadge: "IRMÃOZÃO",
                  roleBadgeColor: "red",
                  description: "Irmão de Renan Santos",
                  detailLabel: "SALÁRIO ANUAL:",
                  detailValue: "R$ 86.000,00",
                },
                {
                  name: "SUELI LIPOR",
                  roleBadge: "MÃEZONA",
                  roleBadgeColor: "gray",
                  description: "Mãe de Renan Santos (Mora em SP)",
                  detailLabel: "SITUAÇÃO:",
                  detailValue: "Dirigente na Bahia morando em SP",
                },
                {
                  name: "MÁRIO JORGE",
                  roleBadge: "PAIZÃO",
                  roleBadgeColor: "gray",
                  description: "Pai de Renan Santos (Mora em SP)",
                  detailLabel: "SITUAÇÃO:",
                  detailValue: "Presidente no RN morando em SP",
                },
                {
                  name: "CLÃ-DO-VAL",
                  roleBadge: "FAMÍLIA",
                  roleBadgeColor: "gray",
                  description: "Gustavo (Irmão) e Manuel (Pai) de Arthur do Val",
                  detailLabel: "CARGOS:",
                  detailValue: "Controlam o partido em Minas Gerais",
                },
              ],

              // Seção Final (Hipocrisia)
              theoryQuote:
                'O DISCURSO (ANTES) "Não usarei fundão nem se for de 20 trilhões. A palavra de um homem basta." - Arthur do Val',
              realityTitle: "A REALIDADE (HOJE)",
              realityMainValue: "R$ 249.510,50",
              realitySubValue:
                "Com 22 assessores, o Deputado Guto Zacarias usou 95,70% do limite de vagas utilizadas.",
              realityScope: "Entenda como se tornaram aquilo que mais repudiavam.",
            }}
          />

          <div className="text-right">
            <p className="font-bold text-sm bg-black text-white px-3 py-1">
              FONTE: TSE / DADOS ABERTOS (MAR/2025)
            </p>
            <p className="font-mono text-xs mt-1 uppercase">Ref: Análise Nando Moura</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* COLUNA 1: A GRANDE CONTRADIÇÃO (4 colunas) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-white border-3 border-black shadow-hard p-6 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">
              <XCircle size={100} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 border-b-3 border-black pb-2">
              O Discurso (Antes)
            </h3>
            <blockquote className="font-medium italic text-gray-600 mb-2">
              "Não usarei fundão nem se for de 20 trilhões. A palavra de um homem basta.""
            </blockquote>
            <p className="text-xs font-bold text-right">- Arthur do Val</p>
          </div>

          <div className="bg-brutal-yellow border-3 border-black shadow-hard p-6 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">
              <CheckCircle size={100} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 border-b-3 border-black pb-2 flex items-center gap-2">
              A Realidade (2025)
              <AlertTriangle className="text-black" size={24} />
            </h3>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase">Total Recebido (Membros)</span>
              <span className="text-4xl font-black tracking-tighter">
                R$ 315.679<span className="text-lg">,66</span>
              </span>
            </div>
            <p className="text-xs font-bold mt-4 border-t-2 border-black pt-2">
              JUSTIFICATIVA: "O valor aumentou, então agora vale a pena pegar."
            </p>
          </div>
        </div>

        {/* COLUNA 2: ESTRUTURA FAMILIAR (8 colunas) */}
        <div className="md:col-span-8 bg-white border-3 border-black shadow-hard p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-brutal-blue stroke-[2.5px]" />
            <div>
              <h3 className="text-2xl md:text-3xl font-black uppercase leading-none">
                A Árvore Genealógica
              </h3>
              <p className="text-sm font-bold text-gray-500 uppercase">
                Nepotismo Cruzado & Cargos no Partido
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ITEM 1 */}
            <div className="border-2 border-black p-3 hover:bg-black hover:text-white transition-all group cursor-crosshair">
              <div className="flex justify-between items-start">
                <span className="font-black text-lg uppercase group-hover:text-brutal-yellow">
                  "Salsicha"
                </span>
                <span className="bg-brutal-red text-white text-xs px-1 font-bold">R$ 86k</span>
              </div>
              <p className="text-xs font-mono mt-1">Alexandre Henrique (Irmão Renan Santos)</p>
              <div className="mt-2 text-xs font-bold border-t border-dashed border-gray-400 group-hover:border-white pt-1">
                CARGO: Vice-Pres. (SP)
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="border-2 border-black p-3 hover:bg-black hover:text-white transition-all group cursor-crosshair">
              <div className="flex justify-between items-start">
                <span className="font-black text-lg uppercase group-hover:text-brutal-yellow">
                  Sueli Lipor
                </span>
                <span className="bg-gray-200 text-black text-xs px-1 font-bold group-hover:bg-gray-700 group-hover:text-white">
                  CARGO
                </span>
              </div>
              <p className="text-xs font-mono mt-1">Mãe de Renan Santos</p>
              <div className="mt-2 text-xs font-bold border-t border-dashed border-gray-400 group-hover:border-white pt-1">
                CARGO: Sec. Geral (BA){" "}
                <span className="block text-[10px] font-normal opacity-70">*Mora em SP</span>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="border-2 border-black p-3 hover:bg-black hover:text-white transition-all group cursor-crosshair">
              <div className="flex justify-between items-start">
                <span className="font-black text-lg uppercase group-hover:text-brutal-yellow">
                  Mário Jorge
                </span>
                <span className="bg-gray-200 text-black text-xs px-1 font-bold group-hover:bg-gray-700 group-hover:text-white">
                  CARGO
                </span>
              </div>
              <p className="text-xs font-mono mt-1">Pai de Renan Santos</p>
              <div className="mt-2 text-xs font-bold border-t border-dashed border-gray-400 group-hover:border-white pt-1">
                CARGO: Pres. (RN){" "}
                <span className="block text-[10px] font-normal opacity-70">*Mora em SP</span>
              </div>
            </div>

            {/* ITEM 4 */}
            <div className="border-2 border-black p-3 hover:bg-black hover:text-white transition-all group cursor-crosshair">
              <div className="flex justify-between items-start">
                <span className="font-black text-lg uppercase group-hover:text-brutal-yellow">
                  Família Do Val
                </span>
                <span className="bg-gray-200 text-black text-xs px-1 font-bold group-hover:bg-gray-700 group-hover:text-white">
                  CLÃ
                </span>
              </div>
              <p className="text-xs font-mono mt-1">Gustavo (Irmão) & Manuel (Pai)</p>
              <div className="mt-2 text-xs font-bold border-t border-dashed border-gray-400 group-hover:border-white pt-1">
                CARGOS: Membro & Pres. (MG)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCO INFERIOR: O MILAGRE DAS ASSINATURAS */}
      <div className="bg-brutal-bg border-3 border-black p-4 md:p-6 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
            <TrendingUp className="text-brutal-red" />O Milagre das Assinaturas
          </h3>
          <p className="font-medium text-sm mb-4">
            Como o dinheiro do fundão (que eles juraram não usar) acelerou a criação do partido em
            velocidade recorde.
          </p>
          <div className="flex gap-2">
            <div className="bg-white border-2 border-black p-2 flex-1 text-center">
              <span className="block text-xs font-bold text-gray-500">GASTO ADS (FB/INSTA)</span>
              <span className="font-black text-xl md:text-2xl">+R$ 400 Mil</span>
            </div>
            <div className="bg-white border-2 border-black p-2 flex-1 text-center">
              <span className="block text-xs font-bold text-gray-500">TEMPO RECORD</span>
              <span className="font-black text-xl md:text-2xl">1 Mês</span>
            </div>
          </div>
        </div>

        {/* GRÁFICO BARRAS */}
        <div className="flex flex-col gap-4 font-mono text-xs font-bold">
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span>SEM FUNDÃO (8 Meses)</span>
              <span>32.000 Assinaturas</span>
            </div>
            <div className="w-full bg-white border-2 border-black h-6">
              <div className="bg-gray-400 h-full w-[35%] border-r-2 border-black"></div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between mb-1 text-brutal-red">
              <span>COM FUNDÃO (1 Mês)</span>
              <span>70.000+ Assinaturas</span>
            </div>
            <div className="w-full bg-white border-2 border-black h-6 relative">
              {/* Pattern para o gráfico crescido */}
              <div className="bg-brutal-red h-full w-[85%] border-r-2 border-black flex items-center justify-end px-2 text-white">
                $$$
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
