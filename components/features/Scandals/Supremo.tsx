import React from 'react';
import { AlertTriangle, TrendingUp, Users, DollarSign, XCircle, CheckCircle } from 'lucide-react';
import InstaShareButton from '../../ui/InstaShareButton';

export default function Supremo() {
  return (
    <section className="flex flex-col gap-8">
    {/* HEADER DO DOSSIÊ */}
    <div className="flex flex-col md:flex-row justify-between items-end border-b-3 border-black pb-4 gap-4">
        <div>
            <div className="bg-brutal-red text-white text-xs font-black px-2 py-1 inline-block mb-2 uppercase tracking-widest transform -rotate-1">
                Dossiê Exclusivo
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Os <span className="text-brutal-red decoration-4 underline decoration-black">Imperadores de Toga</span>
            </h2>
        </div>
        
        <div className="flex flex-col items-end gap-3">
            {/* A NOVA CHAMADA GIGANTE */}
            <InstaShareButton data={{
                // Cabeçalho
                titleMain: "OS",
                titleHighlight: "IMPERADORES",
                source: "COMPLIANCE 0 / PF",
                dataDate: "DEZ/2025",

                // Seção Linha do Tempo
                timelineTitle: 'O "JOGO DE CADEIRAS" NO STF',
                timelineSubtitle: "Como o processo bilionário foi parar nas mãos de um ministro que viajou com advogado da defesa?",
                timelineSteps: [
                    {
                        id: 1,
                        date: "28 NOV",
                        textPrefix: "Dias Toffoli é",
                        highlight: "sorteado relator",
                        textSuffix: "do recurso do Banco Master no STF."
                    },
                    {
                        id: 2,
                        date: "29 NOV",
                        textPrefix: "Viaja ao Peru em jatinho com",
                        highlight: "Augusto Arruda Botelho",
                        textSuffix: ", advogado de diretor do Master."
                    },
                    {
                        id: 3,
                        date: "03 DEZ",
                        textPrefix: "Botelho entra com recurso. No mesmo dia, Toffoli coloca caso em",
                        highlight: "sigilo máximo",
                        textSuffix: "e traz para o STF."
                    }
                ],

                // Seção Família (Tem que ter 4 itens para ficar igual o desenho)
                familyTitle: "O ESCRITÓRIO DE FAMÍLIA",
                familySubtitle: "",
                familyCards: [
                    {
                        name: "VIVIANE BARCI DE MORAES",
                        roleBadge: "PROPRIETÁRIA",
                        roleBadgeColor: "red",
                        description: "Esposa do Ministro Alexandre de Moraes",
                        detailLabel: "CONTRATO MASTER:",
                        detailValue: "R$ 3,6 Mi/mês"
                    },
                    {
                        name: "ALEXANDRE B. DE MORAES",
                        roleBadge: "SÓCIO",
                        roleBadgeColor: "gray",
                        description: "Filho do Ministro Alexandre de Moraes",
                        detailLabel: "ATUAÇÃO:",
                        detailValue: "Assina ações pelo Master"
                    },
                    {
                        name: "GIULIANA BARCI DE MORAES",
                        roleBadge: "SÓCIA",
                        roleBadgeColor: "gray",
                        description: "Filha do Ministro Alexandre de Moraes",
                        detailLabel: "ATUAÇÃO:",
                        detailValue: "Assina ações pelo Master"
                    },
                    {
                        name: "DANIEL VORCARO (DONO DO MASTER)",
                        roleBadge: "ORDEM",
                        roleBadgeColor: "gray",
                        description: "",
                        detailLabel: "ORDEM DADA:",
                        detailValue: "Prioridade MÁXIMA nos pagamentos"
                    }
                ],

                // Seção Final
                theoryQuote: 'ÉTICA JUDICIAL "O magistrado deve evitar situações que possam comprometer a sua imparcialidade ou gerar conflito de interesses."',
                realityTitle: "A REALIDADE (CASO MASTER)",
                realityMainValue: "R$ 129 MILHÕES",
                realitySubValue: "R$ 3,6 Mi/mês por 36 meses",
                realityScope: 'Representar o banco "onde for necessário", sem causa específica.'
            }} />
            
            <div className="text-right">
                <p className="font-bold text-sm bg-black text-white px-3 py-1">FONTE: OPERAÇÃO COMPLIANCE ZERO / PF</p>
                <p className="font-mono text-xs mt-1 uppercase">Dados: Dez/2025</p>
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
            <h3 className="text-xl font-black uppercase mb-4 border-b-3 border-black pb-2">Ética Judicial (Teoria)</h3>
            <blockquote className="font-medium italic text-gray-600 mb-2">
            "O magistrado deve evitar situações que possam comprometer a sua imparcialidade ou gerar conflito de interesses."
            </blockquote>
            <p className="text-xs font-bold text-right">- Código de Ética da Magistratura</p>
        </div>

        <div className="bg-brutal-yellow border-3 border-black shadow-hard p-6 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">
            <CheckCircle size={100} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 border-b-3 border-black pb-2 flex items-center gap-2">
            A Realidade (Caso Master)
            <AlertTriangle className="text-black" size={24} />
            </h3>
            <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase">Contrato Escritório da Esposa</span>
                <span className="text-4xl font-black tracking-tighter">R$ 129<span className="text-lg"> MILHÕES</span></span>
                <span className="text-xs font-mono">(R$ 3,6 Mi/mês por 36 meses)</span>
            </div>
            <p className="text-xs font-bold mt-4 border-t-2 border-black pt-2">
            ESCOPO: Representar o banco "onde for necessário", sem causa específica.
            </p>
        </div>
        </div>

        {/* COLUNA 2: A REDE FAMILIAR (8 colunas) */}
        <div className="md:col-span-8 bg-white border-3 border-black shadow-hard p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-brutal-blue stroke-[2.5px]" />
            <div>
            <h3 className="text-2xl md:text-3xl font-black uppercase leading-none">O Escritório de Família</h3>
            <p className="text-sm font-bold text-gray-500 uppercase">Contratos Bilionários & Proximidade com o STF</p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ITEM 1 */}
            <div className="border-2 border-black p-3 hover:bg-black hover:text-white transition-all group cursor-crosshair">
            <div className="flex justify-between items-start">
                <span className="font-black text-lg uppercase group-hover:text-brutal-yellow">Viviane Barci de Moraes</span>
                <span className="bg-brutal-red text-white text-xs px-1 font-bold">PROPRIETÁRIA</span>
            </div>
            <p className="text-xs font-mono mt-1">Esposa do Ministro Alexandre de Moraes</p>
            <div className="mt-2 text-xs font-bold border-t border-dashed border-gray-400 group-hover:border-white pt-1">
                CONTRATO MASTER: R$ 3,6 Mi/mês
            </div>
            </div>

            {/* ITEM 2 */}
            <div className="border-2 border-black p-3 hover:bg-black hover:text-white transition-all group cursor-crosshair">
            <div className="flex justify-between items-start">
                <span className="font-black text-lg uppercase group-hover:text-brutal-yellow">Alexandre B. de Moraes</span>
                <span className="bg-gray-200 text-black text-xs px-1 font-bold group-hover:bg-gray-700 group-hover:text-white">SÓCIO/FILHO</span>
            </div>
            <p className="text-xs font-mono mt-1">Filho do Ministro Alexandre de Moraes</p>
            <div className="mt-2 text-xs font-bold border-t border-dashed border-gray-400 group-hover:border-white pt-1">
                ATUAÇÃO: Assina ações pelo Master
            </div>
            </div>

            {/* ITEM 3 */}
            <div className="border-2 border-black p-3 hover:bg-black hover:text-white transition-all group cursor-crosshair">
            <div className="flex justify-between items-start">
                <span className="font-black text-lg uppercase group-hover:text-brutal-yellow">Giuliana Barci de Moraes</span>
                <span className="bg-gray-200 text-black text-xs px-1 font-bold group-hover:bg-gray-700 group-hover:text-white">SÓCIA/FILHA</span>
            </div>
            <p className="text-xs font-mono mt-1">Filha do Ministro Alexandre de Moraes</p>
            <div className="mt-2 text-xs font-bold border-t border-dashed border-gray-400 group-hover:border-white pt-1">
                ATUAÇÃO: Assina ações pelo Master
            </div>
            </div>

            {/* ITEM 4 */}
            <div className="border-2 border-black p-3 hover:bg-black hover:text-white transition-all group cursor-crosshair">
            <div className="flex justify-between items-start">
                <span className="font-black text-lg uppercase group-hover:text-brutal-yellow">Prioridade Máxima</span>
                <span className="bg-gray-200 text-black text-xs px-1 font-bold group-hover:bg-gray-700 group-hover:text-white">ORDEM DO BANQUEIRO</span>
            </div>
            <p className="text-xs font-mono mt-1">Daniel Vorcaro (Dono do Master)</p>
            <div className="mt-2 text-xs font-bold border-t border-dashed border-gray-400 group-hover:border-white pt-1">
                "Pagamentos NÃO PODEM DEIXAR de ser feitos em hipótese alguma"
            </div>
            </div>
        </div>
        </div>
    </div>

    {/* BLOCO INFERIOR 1: O JUÍZO CRUZADO */}
    <div className="bg-white border-3 border-black shadow-hard p-6 grid md:grid-cols-2 gap-8">
        <div>
            <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
            <TrendingUp className="text-brutal-red" />
            O "Jogo de Cadeiras" no STF
            </h3>
            <p className="font-medium text-sm mb-4">
            Como o processo bilionário foi parar nas mãos de um ministro que viajou com advogado da defesa.
            </p>

            <div className="space-y-4 font-mono text-sm">
            <div className="flex items-center gap-3">
                <div className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                <span className="font-bold">28 NOV:</span> Dias Toffoli é <span className="text-brutal-red font-bold">sorteado relator</span> do recurso do Banco Master no STF.
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                <span className="font-bold">29 NOV:</span> Viaja ao Peru em jatinho com <span className="font-bold">Augusto Arruda Botelho</span>, advogado de diretor do Master.
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                <span className="font-bold">03 DEZ:</span> Botelho entra com recurso no STF por seu cliente. <span className="text-brutal-red font-bold">No mesmo dia</span>, Toffoli coloca caso em <span className="font-bold">sigilo máximo</span> e traz para o STF.
                </div>
            </div>
            </div>
        </div>

        {/* CARDS DE RELACIONAMENTO */}
        <div className="flex flex-col gap-4">
            <div className="border-2 border-black p-4">
            <h4 className="font-black uppercase mb-2">A Viagem "Casual"</h4>
            <div className="text-xs space-y-1">
                <p><span className="font-bold">Jatinho de:</span> Luiz Oswaldo Pastore (ex-senador, 75 anos)</p>
                <p><span className="font-bold">Passageiros:</span> Toffoli + Adv. Augusto Botelho (defensor de Luiz Antônio Bull, diretor do Master)</p>
                <p><span className="font-bold">Evento:</span> Final da Libertadores (Flamengo x Palmeiras)</p>
                <p className="mt-2 italic">"Não conversaram sobre o processo" - segundo Toffoli</p>
            </div>
            </div>

            <div className="border-2 border-black p-4 bg-brutal-bg">
            <h4 className="font-black uppercase mb-2">A Decisão Estratégica</h4>
            <div className="text-xs">
                <p className="font-bold">Toffoli, já como relator:</p>
                <ul className="list-disc pl-4 mt-1">
                <li>Retirou o caso da 1ª instância (que decretou prisões)</li>
                <li>Colocou todo o inquérito sob <span className="font-bold">sigilo absoluto</span></li>
                <li>Justificativa oficial: "envolve questões econômicas que podem ter impacto no mercado"</li>
                </ul>
            </div>
            </div>
        </div>
    </div>

    {/* BLOCO INFERIOR 2: A DIMENSÃO DO ESCÂNDALO */}
    <div className="bg-brutal-bg border-3 border-black p-6 grid md:grid-cols-2 gap-8 items-start">
        <div>
            <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
            <DollarSign className="text-brutal-red" />
            O Rombo Bilionário (Pano de Fundo)
            </h3>
            <p className="font-medium text-sm mb-6">
            O contrato milionário da família Moraes era com um banco envolvido em uma das maiores fraudes do sistema financeiro.
            </p>

            <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-black p-3 text-center">
                <span className="block text-xs font-bold text-gray-500">FRAUDE COM CDBs FALSOS</span>
                <span className="font-black text-xl md:text-2xl">R$ 12 Bi</span>
                <span className="block text-[10px]">Investigado pela PF</span>
            </div>
            <div className="bg-white border-2 border-black p-3 text-center">
                <span className="block text-xs font-bold text-gray-500">INJEÇÕES DO BRB</span>
                <span className="font-black text-xl md:text-2xl">R$ 16,7 Bi</span>
                <span className="block text-[10px]">Entre 2024-2025</span>
            </div>
            </div>
            <p className="text-xs font-mono mt-4 p-2 bg-black text-white">
            CONTEXTO: Banco Master emitiu R$ 50 bi em CDBs sem lastro. "Desapareceu" com cerca de R$ 40 bilhões.
            </p>
        </div>

        {/* LINHA DO TEMPO DAS "COINCIDÊNCIAS" */}
        <div>
            <h4 className="font-black text-xl uppercase mb-4 border-b-2 border-black pb-2">Linha do Tempo das "Coincidências"</h4>
            <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
                <div className="bg-brutal-red text-white text-xs font-bold px-2 py-1 shrink-0">2024</div>
                <div>
                <p className="font-bold">Início do Contrato Familiar</p>
                <p className="text-xs">Escritório da família Moraes inicia contrato de R$ 3,6 Mi/mês com o Master.</p>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <div className="bg-black text-white text-xs font-bold px-2 py-1 shrink-0">NOV 2025</div>
                <div>
                <p className="font-bold">Operação & Sorteio</p>
                <p className="text-xs">PF prende Vorcaro (Compliance Zero). Toffoli é sorteado relator do caso no STF.</p>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <div className="bg-black text-white text-xs font-bold px-2 py-1 shrink-0">29 NOV</div>
                <div>
                <p className="font-bold">Viagem em Jatinho</p>
                <p className="text-xs">Toffoli viaja com advogado da defesa do Master para final da Libertadores.</p>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <div className="bg-brutal-red text-white text-xs font-bold px-2 py-1 shrink-0">DEZ 2025</div>
                <div>
                <p className="font-bold">Sigilo & Centralização</p>
                <p className="text-xs">Toffoli decreta sigilo máximo e traz caso para o STF, sob sua relatoria.</p>
                </div>
            </div>
            </div>
        </div>
    </div>

    {/* RODAPÉ / LEGALIDADES */}
    <div className="border-t-3 border-black pt-4 text-center">
        <p className="text-xs font-mono uppercase">
        NOTA CONTEXTUAL: O STF já definiu que ministros <span className="font-bold">podem julgar processos</span> mesmo quando envolvem escritórios de familiares. O interesse de partes em contratar escritórios com proximidade ao STF é amplamente documentado.
        </p>
    </div>



    </section>
  );
}