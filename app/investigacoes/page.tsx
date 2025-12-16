"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Scale,
  DollarSign,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  Gavel,
  Building2,
  UserX,
  Clock,
  Target,
  Flame,
  ShieldAlert,
  HandCoins,
} from "lucide-react";
import EscandaloShareButton, { EscandaloShareData } from "@/components/ui/EscandaloShareButton";

interface Condenado {
  nome: string;
  cargo: string;
  partido?: string;
  pena: string;
  situacao: string;
  destaque?: string;
}

interface Escandalo {
  id: string;
  nome: string;
  nomeCompleto: string;
  periodo: string;
  valorDesviado: string;
  valorRecuperado: string;
  condenados: number;
  denunciados: number;
  descricao: string;
  comoFuncionava: string[];
  principaisCondenados: Condenado[];
  partidosEnvolvidos: string[];
  destaque: string;
  frase?: string;
  fontes: string[];
}

const escandalos: Escandalo[] = [
  {
    id: "lava-jato",
    nome: "Operação Lava Jato",
    nomeCompleto: "Operação Lava Jato / Petrolão",
    periodo: "2014 - 2021",
    valorDesviado: "R$ 42 bilhões",
    valorRecuperado: "R$ 4,3 bilhões",
    condenados: 174,
    denunciados: 533,
    descricao:
      "A maior operação anticorrupção da história do Brasil. Investigou o esquema de corrupção na Petrobras envolvendo empreiteiras, políticos e partidos. Descobriu que funcionários da estatal cobravam propina de 1% a 3% sobre contratos superfaturados, distribuindo o dinheiro para partidos e políticos.",
    comoFuncionava: [
      "Empreiteiras formavam cartel para vencer licitações da Petrobras",
      "Contratos eram superfaturados em média 3%",
      "Diretores da Petrobras recebiam propina para facilitar contratos",
      "Operadores financeiros (doleiros) lavavam o dinheiro",
      "Propina era distribuída para partidos PT, PMDB e PP",
      "Políticos indicavam diretores em troca de controle das propinas",
    ],
    principaisCondenados: [
      {
        nome: "Luiz Inácio Lula da Silva",
        cargo: "Ex-Presidente da República",
        partido: "PT",
        pena: "12 anos e 1 mês (anulada pelo STF)",
        situacao: "Condenações anuladas - elegível",
        destaque: "Ficou preso 580 dias. STF anulou processos por incompetência de Curitiba.",
      },
      {
        nome: "Sérgio Cabral",
        cargo: "Ex-Governador do RJ",
        partido: "PMDB",
        pena: "+425 anos (somadas)",
        situacao: "Prisão domiciliar com tornozeleira",
        destaque: "Condenado em 9 processos. Teve 3 sentenças anuladas pelo STF.",
      },
      {
        nome: "Eduardo Cunha",
        cargo: "Ex-Presidente da Câmara",
        partido: "PMDB",
        pena: "30 anos (2 condenações)",
        situacao: "Solto - prisão domiciliar revogada",
        destaque: "Cassado em 2016. Tentou voltar em 2022, não teve votos suficientes.",
      },
      {
        nome: "Marcelo Odebrecht",
        cargo: "Ex-CEO da Odebrecht",
        partido: "-",
        pena: "19 anos (reduzida por delação)",
        situacao: "Em liberdade",
        destaque: "Sua delação revelou pagamentos a centenas de políticos.",
      },
      {
        nome: "José Dirceu",
        cargo: "Ex-Ministro da Casa Civil",
        partido: "PT",
        pena: "30 anos e 9 meses",
        situacao: "Cumpriu parte, beneficiado por habeas corpus",
        destaque: "Também condenado no Mensalão. Duas vezes preso por corrupção.",
      },
      {
        nome: "Antonio Palocci",
        cargo: "Ex-Ministro da Fazenda",
        partido: "PT",
        pena: "12 anos e 2 meses",
        situacao: "Em liberdade",
        destaque: "Fez delação premiada implicando Lula e outros políticos.",
      },
    ],
    partidosEnvolvidos: ["PT", "PMDB/MDB", "PP", "PTB", "PR", "PSDB", "DEM"],
    destaque:
      "79 fases operacionais. 195 denúncias. 278 condenações. 2.611 anos de penas somadas. A Petrobras perdeu R$ 6,2 bilhões contabilizados. O TCU estima prejuízo de R$ 29 bilhões.",
    frase: "Nunca antes na história deste país se roubou tanto.",
    fontes: ["MPF", "STF", "Petrobras", "TCU"],
  },
  {
    id: "mensalao",
    nome: "Mensalão",
    nomeCompleto: "Escândalo do Mensalão - Ação Penal 470",
    periodo: "2005 - 2014",
    valorDesviado: "R$ 141 milhões",
    valorRecuperado: "R$ 25 milhões",
    condenados: 24,
    denunciados: 40,
    descricao:
      "Esquema de compra de votos de parlamentares durante o governo Lula. O PT pagava mesadas de R$ 30 mil a deputados para votar a favor de projetos do governo. O operador era o empresário Marcos Valério.",
    comoFuncionava: [
      "PT desviava dinheiro de contratos públicos via empresas de Marcos Valério",
      "Dinheiro era usado para pagar 'mesadas' de R$ 30 mil a deputados",
      "Deputados votavam a favor de projetos do interesse do governo",
      "Valério usava empréstimos fraudulentos para lavar o dinheiro",
      "Núcleo político do PT comandava o esquema",
      "Partidos aliados (PL, PP) recebiam repasses mensais",
    ],
    principaisCondenados: [
      {
        nome: "José Dirceu",
        cargo: "Ex-Ministro da Casa Civil",
        partido: "PT",
        pena: "10 anos e 10 meses",
        situacao: "Beneficiado por indulto de Dilma",
        destaque: "Apontado como mentor do esquema. Cumpriu apenas 1 ano em regime fechado.",
      },
      {
        nome: "José Genoíno",
        cargo: "Ex-Presidente do PT",
        partido: "PT",
        pena: "6 anos e 11 meses",
        situacao: "Pena extinta pelo STF em 2014",
        destaque: "Cumpriu 1 ano e 2 meses na Papuda.",
      },
      {
        nome: "Delúbio Soares",
        cargo: "Ex-Tesoureiro do PT",
        partido: "PT",
        pena: "8 anos e 11 meses",
        situacao: "Cumpriu parte da pena",
        destaque: "Operacionalizava os pagamentos aos parlamentares.",
      },
      {
        nome: "Marcos Valério",
        cargo: "Empresário/Operador",
        partido: "-",
        pena: "37 anos e 8 meses",
        situacao: "Maior pena do processo",
        destaque: "Operador financeiro. Suas empresas lavavam o dinheiro do esquema.",
      },
      {
        nome: "Valdemar Costa Neto",
        cargo: "Ex-Deputado Federal",
        partido: "PL",
        pena: "7 anos e 10 meses",
        situacao: "Cumpriu parte da pena",
        destaque: "O PL teria recebido R$ 10,8 milhões do esquema.",
      },
    ],
    partidosEnvolvidos: ["PT", "PL", "PP", "PTB", "PMDB"],
    destaque:
      "Primeiro grande escândalo do PT. Derrubou José Dirceu da Casa Civil. 24 condenados, NENHUM permanece preso hoje. Todos beneficiados por indultos ou habeas corpus.",
    frase: "Eu não sabia de nada. - Lula",
    fontes: ["STF", "Câmara dos Deputados"],
  },
  {
    id: "petrolao",
    nome: "Petrolão",
    nomeCompleto: "Esquema de Corrupção na Petrobras",
    periodo: "2004 - 2014",
    valorDesviado: "R$ 6,2 bilhões (oficial)",
    valorRecuperado: "R$ 5,3 bilhões",
    condenados: 174,
    denunciados: 533,
    descricao:
      "Esquema de corrupção sistêmica na Petrobras durante os governos Lula e Dilma. Empreiteiras pagavam propina para vencer licitações superfaturadas. O dinheiro era distribuído entre diretores da estatal, partidos e políticos.",
    comoFuncionava: [
      "Cartel de 24 empreiteiras combinava preços em licitações",
      "Contratos superfaturados em até 14,53% segundo TCU",
      "1% a 3% do valor era destinado a propinas",
      "Cada partido controlava uma diretoria: PT (Abastecimento), PMDB (Serviços), PP (Internacional)",
      "Diretores indicados por partidos facilitavam contratos",
      "Doleiros e operadores lavavam o dinheiro no exterior",
    ],
    principaisCondenados: [
      {
        nome: "Paulo Roberto Costa",
        cargo: "Ex-Diretor de Abastecimento",
        partido: "PP",
        pena: "Delator - pena reduzida",
        situacao: "Em liberdade",
        destaque: "Primeiro delator. Revelou o esquema. 55% dos desvios foram em sua diretoria.",
      },
      {
        nome: "Nestor Cerveró",
        cargo: "Ex-Diretor Internacional",
        partido: "PMDB",
        pena: "12 anos",
        situacao: "Cumpriu parte da pena",
        destaque: "Controlava a área internacional. Fez delação premiada.",
      },
      {
        nome: "Renato Duque",
        cargo: "Ex-Diretor de Serviços",
        partido: "PT",
        pena: "20 anos",
        situacao: "Cumpriu parte da pena",
        destaque: "Área de Serviços era controlada pelo PT.",
      },
      {
        nome: "Pedro Barusco",
        cargo: "Ex-Gerente da Petrobras",
        partido: "-",
        pena: "Delator",
        situacao: "Em liberdade",
        destaque: "Devolveu US$ 97 milhões obtidos ilegalmente.",
      },
    ],
    partidosEnvolvidos: ["PT", "PMDB/MDB", "PP"],
    destaque:
      "O TCU estima prejuízo de R$ 18 a R$ 42 bilhões. Empreiteiras envolvidas: Odebrecht (R$ 7,1 bi), Queiroz Galvão (R$ 4 bi), Camargo Correa (R$ 3,9 bi), UTC (R$ 2,2 bi), Andrade Gutierrez (R$ 1,4 bi), OAS (R$ 1,2 bi).",
    frase: "Era um esquema que funcionava há mais de uma década.",
    fontes: ["MPF", "TCU", "Petrobras"],
  },
];

export default function InvestigacoesPage() {
  const [expandido, setExpandido] = useState<string | null>("lava-jato");
  const [abaAtiva, setAbaAtiva] = useState<"timeline" | "condenados" | "numeros">("timeline");

  const toggleExpand = (id: string) => {
    setExpandido(expandido === id ? null : id);
    setAbaAtiva("timeline");
  };

  return (
    <main className="min-h-screen bg-brutal-bg p-4 md:p-8 max-w-7xl mx-auto">
      {/* HEADER IMPACTANTE */}
      <div className="mb-8 border-b-3 border-black pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-brutal-red p-3 border-2 border-black">
            <Flame size={36} className="text-white" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-brutal-red">
              Refrescando Sua Memória
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Os Maiores Escândalos
            </h1>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-700 max-w-3xl">
          Eles querem que você esqueça. Querem que o tempo apague a memória. Que você volte a
          confiar cegamente. Não deixe. Aqui está a história que NINGUÉM deve esquecer.
        </p>
      </div>

      {/* AVISO FORTE */}
      <div className="card-brutal bg-brutal-red text-white mb-8">
        <div className="flex items-start gap-4">
          <ShieldAlert size={32} className="shrink-0 mt-1" />
          <div>
            <p className="font-black text-xl uppercase mb-2">
              Sempre é bom relembrar...
            </p>
            <p className="font-medium text-lg opacity-90">
              Enquanto você briga sobre esquerda e direita, TODOS esses partidos participaram de
              esquemas bilionários de corrupção. PT, PMDB, PP, PL, PSDB... O sistema inteiro é podre.
              E eles querem que você defenda um deles.
            </p>
          </div>
        </div>
      </div>

      {/* ESTATÍSTICAS GERAIS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="card-brutal bg-brutal-red text-white text-center">
          <DollarSign size={28} className="mx-auto mb-2" />
          <p className="text-3xl font-black mb-1">R$ 48+ Bi</p>
          <p className="text-xs font-bold uppercase">Desviados (estimativa)</p>
        </div>
        <div className="card-brutal bg-black text-white text-center">
          <Users size={28} className="mx-auto mb-2" />
          <p className="text-3xl font-black mb-1">500+</p>
          <p className="text-xs font-bold uppercase">Denunciados</p>
        </div>
        <div className="card-brutal bg-gray-800 text-white text-center">
          <Gavel size={28} className="mx-auto mb-2" />
          <p className="text-3xl font-black mb-1">200+</p>
          <p className="text-xs font-bold uppercase">Condenados</p>
        </div>
        <div className="card-brutal bg-green-600 text-white text-center">
          <HandCoins size={28} className="mx-auto mb-2" />
          <p className="text-3xl font-black mb-1">R$ 10+ Bi</p>
          <p className="text-xs font-bold uppercase">Recuperados</p>
        </div>
      </div>

      {/* LISTA DE ESCÂNDALOS */}
      <div className="space-y-6">
        {escandalos.map((escandalo) => {
          const isExpanded = expandido === escandalo.id;
          const shareData: EscandaloShareData = {
            nome: escandalo.nome,
            periodo: escandalo.periodo,
            valorDesviado: escandalo.valorDesviado,
            valorRecuperado: escandalo.valorRecuperado,
            condenados: escandalo.condenados,
            destaque: escandalo.descricao.slice(0, 150) + "...",
            frase: escandalo.frase,
          };

          return (
            <div
              key={escandalo.id}
              className={`card-brutal ${escandalo.id === "lava-jato" ? "border-4 border-brutal-red" : ""}`}
            >
              {/* CABEÇALHO DO ESCÂNDALO */}
              <div
                onClick={() => toggleExpand(escandalo.id)}
                className="cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    {/* Badge especial para Lava Jato */}
                    {escandalo.id === "lava-jato" && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-brutal-red text-white px-3 py-1 font-black text-xs uppercase animate-pulse">
                          A MAIOR OPERAÇÃO DA HISTÓRIA
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h2 className="font-black text-2xl md:text-3xl uppercase">
                        {escandalo.nome}
                      </h2>
                      <span className="text-sm font-bold bg-gray-200 px-3 py-1 border-2 border-black flex items-center gap-1">
                        <Calendar size={14} />
                        {escandalo.periodo}
                      </span>
                    </div>

                    <p className="font-medium text-gray-700 mb-4">
                      {escandalo.descricao}
                    </p>

                    {/* Mini stats */}
                    <div className="flex flex-wrap gap-4 text-sm font-bold">
                      <span className="flex items-center gap-1 text-brutal-red">
                        <DollarSign size={16} />
                        {escandalo.valorDesviado}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserX size={16} />
                        {escandalo.condenados} condenados
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <HandCoins size={16} />
                        {escandalo.valorRecuperado} recuperados
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-3 shrink-0">
                    <EscandaloShareButton data={shareData} />
                    <button className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                  </div>
                </div>

                {/* Partidos envolvidos */}
                <div className="flex flex-wrap gap-2">
                  {escandalo.partidosEnvolvidos.map((partido) => (
                    <span
                      key={partido}
                      className="px-2 py-1 text-xs font-black uppercase bg-black text-white"
                    >
                      {partido}
                    </span>
                  ))}
                </div>
              </div>

              {/* CONTEÚDO EXPANDIDO */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t-3 border-black">
                  {/* Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-black">
                    {[
                      { id: "timeline" as const, label: "Como Funcionava", icon: Target },
                      { id: "condenados" as const, label: "Principais Condenados", icon: UserX },
                      { id: "numeros" as const, label: "Os Números", icon: DollarSign },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAbaAtiva(tab.id);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 font-black uppercase text-sm border-2 border-b-0 border-black transition-all ${
                            abaAtiva === tab.id
                              ? "bg-black text-white"
                              : "bg-white hover:bg-black hover:text-white"
                          }`}
                        >
                          <Icon size={16} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab: Como Funcionava */}
                  {abaAtiva === "timeline" && (
                    <div className="space-y-4">
                      <h3 className="font-black text-xl uppercase mb-4 flex items-center gap-2">
                        <Target size={24} className="text-brutal-red" />
                        O Esquema Passo a Passo
                      </h3>
                      <div className="space-y-3">
                        {escandalo.comoFuncionava.map((passo, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4 p-4 bg-brutal-bg border-2 border-black"
                          >
                            <div className="bg-brutal-red text-white w-8 h-8 flex items-center justify-center font-black shrink-0">
                              {idx + 1}
                            </div>
                            <p className="font-medium">{passo}</p>
                          </div>
                        ))}
                      </div>

                      {escandalo.frase && (
                        <div className="mt-6 bg-black text-white p-6 text-center">
                          <p className="text-xl font-black italic">"{escandalo.frase}"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab: Condenados */}
                  {abaAtiva === "condenados" && (
                    <div className="space-y-4">
                      <h3 className="font-black text-xl uppercase mb-4 flex items-center gap-2">
                        <UserX size={24} className="text-brutal-red" />
                        Principais Condenados - Onde Estão Hoje?
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {escandalo.principaisCondenados.map((condenado, idx) => (
                          <div
                            key={idx}
                            className="border-3 border-black p-4 bg-white"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-black text-lg uppercase">{condenado.nome}</h4>
                                <p className="text-sm font-bold text-gray-600">
                                  {condenado.cargo}
                                  {condenado.partido && ` (${condenado.partido})`}
                                </p>
                              </div>
                              {condenado.partido && (
                                <span className="bg-black text-white px-2 py-1 text-xs font-black">
                                  {condenado.partido}
                                </span>
                              )}
                            </div>

                            <div className="space-y-2 mt-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Gavel size={14} className="text-brutal-red" />
                                <span className="font-bold">Pena:</span>
                                <span>{condenado.pena}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock size={14} className="text-gray-600" />
                                <span className="font-bold">Situação:</span>
                                <span>{condenado.situacao}</span>
                              </div>
                            </div>

                            {condenado.destaque && (
                              <div className="mt-3 bg-brutal-bg p-3 border-2 border-black">
                                <p className="text-sm font-medium italic">{condenado.destaque}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 bg-brutal-red text-white p-4 text-center">
                        <p className="font-black uppercase">
                          A maioria já está solta. Muitos voltaram à política. O crime compensa?
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab: Números */}
                  {abaAtiva === "numeros" && (
                    <div className="space-y-6">
                      <h3 className="font-black text-xl uppercase mb-4 flex items-center gap-2">
                        <DollarSign size={24} className="text-brutal-red" />
                        Os Números que Você Precisa Saber
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-brutal-red text-white p-4 border-2 border-black text-center">
                          <DollarSign size={24} className="mx-auto mb-2" />
                          <p className="text-2xl font-black">{escandalo.valorDesviado}</p>
                          <p className="text-xs font-bold uppercase">Desviados</p>
                        </div>
                        <div className="bg-green-600 text-white p-4 border-2 border-black text-center">
                          <HandCoins size={24} className="mx-auto mb-2" />
                          <p className="text-2xl font-black">{escandalo.valorRecuperado}</p>
                          <p className="text-xs font-bold uppercase">Recuperados</p>
                        </div>
                        <div className="bg-black text-white p-4 border-2 border-black text-center">
                          <Users size={24} className="mx-auto mb-2" />
                          <p className="text-2xl font-black">{escandalo.denunciados}</p>
                          <p className="text-xs font-bold uppercase">Denunciados</p>
                        </div>
                        <div className="bg-gray-800 text-white p-4 border-2 border-black text-center">
                          <Gavel size={24} className="mx-auto mb-2" />
                          <p className="text-2xl font-black">{escandalo.condenados}</p>
                          <p className="text-xs font-bold uppercase">Condenados</p>
                        </div>
                      </div>

                      <div className="bg-brutal-bg border-3 border-black p-6">
                        <h4 className="font-black text-lg uppercase mb-3">Destaque:</h4>
                        <p className="font-medium text-lg">{escandalo.destaque}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border-2 border-black p-4">
                          <h4 className="font-black uppercase mb-2 flex items-center gap-2">
                            <Building2 size={18} />
                            Partidos Envolvidos
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {escandalo.partidosEnvolvidos.map((partido) => (
                              <span
                                key={partido}
                                className="bg-black text-white px-3 py-1 font-bold text-sm"
                              >
                                {partido}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="border-2 border-black p-4">
                          <h4 className="font-black uppercase mb-2 flex items-center gap-2">
                            <Scale size={18} />
                            Fontes Oficiais
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {escandalo.fontes.map((fonte) => (
                              <span
                                key={fonte}
                                className="bg-gray-200 px-3 py-1 font-bold text-sm border border-black"
                              >
                                {fonte}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SEÇÃO ESPECIAL: LAVA JATO */}
      <div className="mt-12 card-brutal bg-black text-white border-4 border-brutal-red">
        <div className="flex items-center gap-3 mb-6">
          <Flame size={32} className="text-brutal-red" />
          <h2 className="text-2xl font-black uppercase">
            Por Que a Lava Jato Importa
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-black text-lg uppercase mb-3 text-brutal-red">O que ela revelou:</h3>
            <ul className="space-y-2 font-medium">
              <li>- Corrupção sistêmica em TODOS os grandes partidos</li>
              <li>- Empreiteiras financiavam campanhas em troca de contratos</li>
              <li>- Bilhões desviados enquanto o país passava necessidade</li>
              <li>- Políticos "inimigos" eram sócios nos esquemas</li>
              <li>- O sistema protege os seus: a maioria já está solta</li>
            </ul>
          </div>
          <div>
            <h3 className="font-black text-lg uppercase mb-3 text-brutal-red">O que aconteceu depois:</h3>
            <ul className="space-y-2 font-medium">
              <li>- STF anulou várias condenações por "incompetência"</li>
              <li>- Sergio Moro declarado suspeito nos processos de Lula</li>
              <li>- Condenados soltos, alguns voltaram à política</li>
              <li>- Lula eleito presidente novamente em 2022</li>
              <li>- Deltan, Moro e outros investigadores foram alvo</li>
            </ul>
          </div>
        </div>

        <div className="bg-brutal-red p-4 text-center">
          <p className="font-black text-xl uppercase">
            Você pode amar ou odiar a Lava Jato. Mas não pode negar: ELA EXISTIU.
            E os crimes que ela revelou ACONTECERAM.
          </p>
        </div>
      </div>

      {/* MENSAGEM FINAL */}
      <div className="mt-8 bg-brutal-bg border-3 border-black p-6 md:p-8">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-brutal-red" />
          <h3 className="text-2xl font-black uppercase mb-4">
            A História Se Repete. Não Deixe.
          </h3>
          <p className="font-medium text-lg max-w-2xl mx-auto mb-6">
            Mensalão, Petrolão, Lava Jato... Todos envolveram os mesmos partidos que hoje pedem
            seu voto. PT, PMDB, PP, PL... Eles não mudaram. Você é que esqueceu.
          </p>
          <div className="bg-black text-white p-4 inline-block">
            <p className="font-black text-lg uppercase">
              Compartilhe. Não deixe ninguém esquecer.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
