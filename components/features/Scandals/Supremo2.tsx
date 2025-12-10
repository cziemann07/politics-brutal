import React from 'react';
import { AlertTriangle, TrendingUp, Users, DollarSign, XCircle, CheckCircle } from 'lucide-react';

export default function Supremo2() {
  return (
    <section className="flex flex-col gap-8">
    {/* HEADER DO DOSSIÊ */}
    <div className="flex flex-col md:flex-row justify-between items-end border-b-3 border-black pb-4">
        <div>
        <div className="bg-brutal-red text-white text-xs font-black px-2 py-1 inline-block mb-2 uppercase tracking-widest transform -rotate-1">
            Dossiê Analítico
        </div>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            IMPERADORES DE TOGA<span className="text-brutal-red">:</span> A Anatomia da Captura do Estado
        </h2>
        </div>
        <div className="text-right mt-4 md:mt-0">
        <p className="font-bold text-sm bg-black text-white px-3 py-1">FONTE: OPERAÇÃO COMPLIANCE ZERO (PF) & V. PÚBLICAS</p>
        <p className="font-mono text-xs mt-1 uppercase">CLASSIFICAÇÃO: RISCO SISTÊMICO DE INTEGRIDADE</p>
        </div>
    </div>

    {/* CAIXA SUMÁRIO EXECUTIVO */}
    <div className="bg-white border-3 border-black shadow-hard p-5 md:p-7">
        <h3 className="text-2xl font-black uppercase mb-4 border-b-2 border-black pb-2">Sumário Executivo: O Colapso da Fronteira</h3>
        <p className="font-medium mb-4">
        Este relatório dissecará a convergência de interesses entre o sistema financeiro fraudulento — representado pelo colapso do Banco Master — e a elite jurídica que detém a última palavra sobre a constitucionalidade no país.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-2 border-brutal-red p-3">
            <span className="block text-xs font-bold text-gray-500">1. O CONTRATO</span>
            <span className="font-black text-lg">R$ 129 Mi para a família Moraes</span>
        </div>
        <div className="border-2 border-brutal-red p-3">
            <span className="block text-xs font-bold text-gray-500">2. O VAZIO ÉTICO</span>
            <span className="font-black text-lg">ADI 5953: Legalização do Conflito</span>
        </div>
        <div className="border-2 border-brutal-red p-3">
            <span className="block text-xs font-bold text-gray-500">3. A BLINDAGEM</span>
            <span className="font-black text-lg">Toffoli e o Voo de Lima</span>
        </div>
        </div>
    </div>

    <div className="grid md:grid-cols-12 gap-6">
        {/* COLUNA 1: A CONTRADIÇÃO (4 colunas) */}
        <div className="md:col-span-4 flex flex-col gap-6">
        <div className="bg-white border-3 border-black shadow-hard p-6">
            <h3 className="text-xl font-black uppercase mb-4 border-b-3 border-black pb-2 flex items-center gap-2">
            A Contradição Teórica
            <XCircle className="text-brutal-red" size={20} />
            </h3>
            <blockquote className="font-medium italic text-gray-600 mb-2 text-sm">
            "O juiz está impedido de atuar em processos em que a parte seja cliente do escritório de seu cônjuge." <span className="font-bold not-italic">- CPC 2015, Art. 144, VIII</span>
            </blockquote>
        </div>

        <div className="bg-brutal-yellow border-3 border-black shadow-hard p-6">
            <h3 className="text-xl font-black uppercase mb-4 border-b-3 border-black pb-2 flex items-center gap-2">
            A Realidade Pós-ADI 5953
            <CheckCircle className="text-black" size={20} />
            </h3>
            <div className="space-y-3">
            <div>
                <span className="block text-xs font-bold uppercase">CONTRASTE:</span>
                <span className="text-2xl font-black tracking-tighter">IMUNIDADE FAMILIAR</span>
            </div>
            <div className="text-xs font-mono p-2 bg-black text-white">
                A VOTAÇÃO DO STF RETIROU O IMPEDIMENTO. AGORA, A PARTE DEVE PROVAR A SUSPEIÇÃO.
            </div>
            <p className="text-xs font-bold mt-4 border-t-2 border-black pt-2">
                RESULTADO: A compra de "consultoria" de familiares tornou-se uma blindagem legal.
            </p>
            </div>
        </div>
        </div>

        {/* COLUNA 2: O CONTRATO (8 colunas) */}
        <div className="md:col-span-8 bg-white border-3 border-black shadow-hard p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-brutal-blue stroke-[2.5px]" />
            <div>
            <h3 className="text-2xl md:text-3xl font-black uppercase leading-none">O Contrato de R$ 129 Milhões</h3>
            <p className="text-sm font-bold text-gray-500 uppercase">Anatomia do Vínculo Financeiro</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="border-2 border-black p-4 bg-brutal-bg">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase text-gray-500">Valor Total</span>
                <span className="bg-brutal-red text-white text-xs px-2 py-1 font-bold">BILLIONS</span>
            </div>
            <span className="font-black text-3xl">R$ 129 Mi</span>
            <p className="text-xs mt-1">Vigência de 36 meses (Início 2024)</p>
            </div>

            <div className="border-2 border-black p-4 bg-brutal-bg">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase text-gray-500">Fluxo Mensal</span>
                <span className="bg-black text-white text-xs px-2 py-1 font-bold">FIXO</span>
            </div>
            <span className="font-black text-3xl">R$ 3,6 Mi</span>
            <p className="text-xs mt-1">(Retainer sem escopo específico)</p>
            </div>

            <div className="border-2 border-black p-4 bg-brutal-bg">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase text-gray-500">Escopo</span>
                <span className="bg-brutal-blue text-white text-xs px-2 py-1 font-bold">GENÉRICO</span>
            </div>
            <span className="font-black text-xl">"Onde for necessário"</span>
            <p className="text-xs mt-1 italic">Representação sem delimitação de causa</p>
            </div>
        </div>

        <div className="border-2 border-brutal-red p-4">
            <h4 className="font-black uppercase mb-2 flex items-center gap-2">
            <AlertTriangle size={18} />
            Prioridade Máxima em meio à Insolvência
            </h4>
            <p className="text-sm font-medium">
            Investigação da PF constatou: enquanto o banco quebrava, a ordem de Vorcaro era que os pagamentos ao escritório <span className="font-bold underline">"não podiam deixar de ser feitos em hipótese alguma".</span>
            </p>
            <p className="text-xs font-mono mt-2 p-2 bg-black text-white">
            HIPÓTESE: O contrato era tratado não como despesa, mas como "ativo estratégico de sobrevivência".
            </p>
        </div>
        </div>
    </div>

    {/* SEÇÃO A: O ABISMO FINANCEIRO */}
    <div className="bg-white border-3 border-black shadow-hard p-6">
        <h3 className="text-2xl font-black uppercase mb-2">O Abismo Financeiro do Banco Master</h3>
        <p className="font-medium text-sm mb-6 text-gray-700">Um banco que funcionava como uma máquina de fabricar balanços fictícios.</p>

        <div className="grid md:grid-cols-2 gap-8">
        <div>
            <h4 className="font-black uppercase mb-4 border-b-2 border-black pb-2">A Dimensão do Rombo</h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border-2 border-black p-4 text-center">
                <span className="block text-xs font-bold text-gray-500">PASSIVO A DESCOBERTO</span>
                <span className="font-black text-2xl md:text-3xl">R$ 12 Bi</span>
                <span className="block text-[10px]">(Identificado pelo BC)</span>
            </div>
            <div className="border-2 border-black p-4 text-center">
                <span className="block text-xs font-bold text-gray-500">IMPACTO REAL</span>
                <span className="font-black text-2xl md:text-3xl">~R$ 40 Bi</span>
                <span className="block text-[10px]">(Projeção investigativa)</span>
            </div>
            </div>
            <div className="text-xs p-3 bg-brutal-bg border-2 border-black">
            <span className="font-bold block mb-1">MODUS OPERANDI:</span>
            Maquiagem de ativos "podres", venda de créditos inadimplentes para o BRB ("lixeira"), envolvimento em privatização da Sabesp.
            </div>
        </div>

        <div>
            <h4 className="font-black uppercase mb-4 border-b-2 border-black pb-2">A Recuperação: Uma Gota no Oceano</h4>
            <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="bg-brutal-red text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">$</div>
                <div>
                <p className="font-bold">Bens Apreendidos pela PF:</p>
                <p className="text-sm">R$ 230 Mi em imóveis, jatinhos, R$ 1,6 Mi em espécie.</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">%</div>
                <div>
                <p className="font-bold">Percentual Recuperado:</p>
                <p className="text-sm text-2xl font-black text-brutal-red">~0,6%</p>
                <p className="text-xs">do rombo de R$ 40 bilhões.</p>
                </div>
            </div>
            </div>
            <p className="text-xs font-mono mt-4 p-2 bg-black text-white">
            PARA ONDE FOI O DINHEIRO? Parte da resposta está em contratos de advocacia como o de R$ 129 Mi.
            </p>
        </div>
        </div>
    </div>

    {/* SEÇÃO B: O VOO DA IMPUNIDADE */}
    <div className="bg-brutal-bg border-3 border-black p-6 grid md:grid-cols-2 gap-8">
        <div>
        <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
            <TrendingUp className="text-brutal-red" />
            A Conexão Lima: O Voo da Impunidade
        </h3>
        <p className="font-medium text-sm mb-4">O vínculo social que antecedeu a blindagem processual.</p>

        <div className="space-y-4 mb-6">
            <div className="border-2 border-black p-4 bg-white">
            <h4 className="font-black uppercase mb-2">O Voo da Alegria (28-30 Nov)</h4>
            <div className="text-xs space-y-1">
                <p><span className="font-bold">Jatinho de:</span> Luiz Oswaldo Pastore (ex-senador)</p>
                <p><span className="font-bold">Passageiros:</span> Ministro Dias Toffoli + Advogado Augusto Botelho</p>
                <p><span className="font-bold">Relação:</span> Botelho defende Luiz Antônio Bull, investigado do Banco Master.</p>
            </div>
            </div>

            <div className="border-2 border-brutal-red p-4">
            <h4 className="font-black uppercase mb-2">A Cronologia da Captura</h4>
            <div className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                <div className="bg-black text-white text-xs font-bold px-2 py-1 shrink-0">1</div>
                <div><span className="font-bold">Nov 28:</span> Toffoli é sorteado relator do recurso do Banco Master no STF.</div>
                </div>
                <div className="flex items-start gap-2">
                <div className="bg-black text-white text-xs font-bold px-2 py-1 shrink-0">2</div>
                <div><span className="font-bold">Nov 28-30:</span> Viagem a Lima com o advogado Augusto Botelho.</div>
                </div>
                <div className="flex items-start gap-2">
                <div className="bg-black text-white text-xs font-bold px-2 py-1 shrink-0">3</div>
                <div><span className="font-bold">Dez:</span> Toffoli, como relator, acata tese frágil (envelope com nome de deputado) e <span className="font-bold text-brutal-red">avoca o caso</span>.</div>
                </div>
            </div>
            </div>
        </div>
        </div>

        <div>
        <h4 className="font-black uppercase mb-4 border-b-2 border-black pb-2">A Engenharia da Blindagem Processual</h4>
        <div className="space-y-4">
            <div className="border-2 border-black p-3 bg-white">
            <div className="flex justify-between items-start mb-1">
                <span className="font-black text-lg uppercase">O "Milagre" do Envelope</span>
                <span className="bg-gray-200 text-black text-xs px-1 font-bold">PRETEXTO</span>
            </div>
            <p className="text-xs">PF achou envelope com nome do Deputado Bacelar, <span className="font-bold">concluiu ser negócio imobiliário antigo</span>. Toffoli usou para atrair caso ao STF.</p>
            </div>

            <div className="border-2 border-brutal-red p-3 bg-white">
            <div className="flex justify-between items-start mb-1">
                <span className="font-black text-lg uppercase">O "Elevador Processual"</span>
                <span className="bg-brutal-red text-white text-xs px-1 font-bold">3 AÇÕES</span>
            </div>
            <ul className="text-xs list-disc pl-4 mt-1 space-y-1">
                <li><span className="font-bold">Avocou</span> todos os autos para seu gabinete.</li>
                <li><span className="font-bold">Paralisou</span> investigações da PF e da 1ª Instância.</li>
                <li><span className="font-bold">Centralizou</span> poder: novas diligências precisam de sua autorização.</li>
            </ul>
            </div>

            <div className="border-2 border-black p-3 bg-black text-white">
            <div className="flex justify-between items-start mb-1">
                <span className="font-black text-lg uppercase">O Manto do Sigilo</span>
                <span className="bg-white text-black text-xs px-1 font-bold">CAIXA PRETA</span>
            </div>
            <p className="text-xs mt-1">Imposição de <span className="font-bold">sigilo absoluto</span>. Impede análise pública das decisões, esconde arbitrariedades e nomes de beneficiários.</p>
            </div>
        </div>
        <p className="text-xs font-mono mt-4 p-2 bg-black text-white">
            SENADOR ALESSANDRO VIEIRA (CPI): Classificou como "escândalo" que exige um Código de Ética real para a corte.
        </p>
        </div>
    </div>

    {/* CONCLUSÃO: SÍNTESE DOS RISCOS */}
    <div className="bg-white border-3 border-black shadow-hard p-6">
        <h3 className="text-2xl font-black uppercase mb-4">Risco Sistêmico: A República dos Compadres</h3>
        <div className="grid md:grid-cols-3 gap-6">
        <div className="border-2 border-black p-4">
            <h4 className="font-black uppercase mb-2 border-b border-black pb-1">O Ciclo da Impunidade Financeira</h4>
            <p className="text-sm">
            <span className="font-bold">Equação do Crime:</span> Lucro de R$ 40 bi com fraudes. Custo da blindagem: R$ 129 mi (0,3% do lucro). ROI extraordinário na captura da justiça.
            </p>
        </div>
        <div className="border-2 border-black p-4">
            <h4 className="font-black uppercase mb-2 border-b border-black pb-1">A Privatização da Suprema Corte</h4>
            <p className="text-sm">
            STF como câmara de arbitragem privada. A tríade: 1) ADI 5953 garante base legal, 2) esposa coleta recursos, 3) colega garante blindagem processual.
            </p>
        </div>
        <div className="border-2 border-brutal-red p-4">
            <h4 className="font-black uppercase mb-2 border-b border-brutal-red pb-1">O Veredito Final</h4>
            <p className="text-sm font-bold">
            O contrato de R$ 129 milhões é a certidão de óbito da imparcialidade judicial. Enquanto o cidadão comum enfrenta o rigor da lei, os artífices do desastre brindam em voos privados.
            </p>
        </div>
        </div>
        <div className="mt-6 pt-4 border-t-2 border-black text-center">
        <p className="text-xs font-mono uppercase">
            FIM DO RELATÓRIO - Baseado em dados públicos, investigações da PF (Op. Compliance Zero) e reportagens investigativas.
        </p>
        </div>
    </div>
    </section>
  );
}