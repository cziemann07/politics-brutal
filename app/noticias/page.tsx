"use client";

import { useState, useMemo } from "react";
import {
  Newspaper,
  ExternalLink,
  Calendar,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  Scale,
  Filter,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import NewsShareButton, { NewsShareData } from "@/components/ui/NewsShareButton";
import { VoteButtons } from "@/components/ui";
import { useVotes } from "@/hooks/useVotes";

interface Noticia {
  id: number;
  titulo: string;
  subtitulo: string;
  fonte: string;
  fonteUrl: string;
  data: string;
  categoria: "hipocrisia" | "corrupcao" | "polarizacao" | "alerta" | "fato";
  tags: string[];
  destaque?: string;
  contexto?: string;
  relevancia: "alta" | "media" | "baixa";
}

// Notícias reais e atuais - Dezembro 2025
const noticias: Noticia[] = [
  {
    id: 11,
    titulo: "Câmara Aprova Flexibilização do Licenciamento Ambiental",
    subtitulo:
      "PL 1.159/2024 reduz exigências para obras obterem autorização. Ambientalistas alertam para risco de mais desmatamento.",
    fonte: "Câmara dos Deputados",
    fonteUrl: "https://www.camara.leg.br/noticias/",
    data: "22/12/2025",
    categoria: "alerta",
    tags: ["Licenciamento Ambiental", "Câmara", "Meio Ambiente", "Agronegócio"],
    destaque: "Ruralistas celebram, ambientalistas protestam. O de sempre.",
    contexto:
      "O projeto segue para o Senado. Se aprovado, dependerá de sanção ou veto de Lula. Bancada ruralista votou em bloco a favor.",
    relevancia: "alta",
  },
  {
    id: 12,
    titulo: "Isenção de IR até R$ 5 Mil: Promessa ou Realidade?",
    subtitulo:
      "Governo anuncia isenção do Imposto de Renda para rendimentos até R$ 5 mil, mas medida só vale a partir de 2026.",
    fonte: "Ministério da Fazenda",
    fonteUrl: "https://www.gov.br/fazenda/",
    data: "21/12/2025",
    categoria: "fato",
    tags: ["Imposto de Renda", "Classe Média", "Economia", "Lula"],
    destaque: "Promessa de campanha de 2022. Implementação só em 2026.",
    contexto:
      "O pacote fiscal inclui também taxação de super-ricos e fundos exclusivos. Oposição critica timing eleitoral da medida.",
    relevancia: "alta",
  },
  {
    id: 13,
    titulo: "Salário Mínimo Sobe para R$ 1.518 em Janeiro",
    subtitulo:
      "Aumento de R$ 106 representa reposição da inflação mais ganho real de 2,5%. Empresários reclamam de custos.",
    fonte: "Governo Federal",
    fonteUrl: "https://www.gov.br/trabalho-e-emprego/",
    data: "20/12/2025",
    categoria: "fato",
    tags: ["Salário Mínimo", "Economia", "Trabalhadores", "2025"],
    destaque: "Ganho real de 2,5% - melhor que muitos esperavam.",
    contexto:
      "Impacto nas contas da Previdência estimado em R$ 14 bilhões. Benefícios atrelados ao mínimo também serão reajustados.",
    relevancia: "media",
  },
  {
    id: 14,
    titulo: "Brasil x EUA: Crise Comercial se Arrasta e Tensão Aumenta",
    subtitulo:
      "Trump aplica sanções a produtos brasileiros. Governo brasileiro contesta na OMC e aprova contra-tarifas.",
    fonte: "Ministério das Relações Exteriores",
    fonteUrl: "https://www.gov.br/mre/",
    data: "19/12/2025",
    categoria: "alerta",
    tags: ["EUA", "Trump", "Comércio", "Diplomacia", "OMC"],
    destaque: "Guerra comercial esquenta. Exportadores brasileiros no prejuízo.",
    contexto:
      "Sanções americanas atingem principalmente aço, alumínio e produtos agrícolas. Brasil retalia com tarifas sobre produtos tech.",
    relevancia: "alta",
  },
  {
    id: 15,
    titulo: "Mercosul-UE: Lula Dá Ultimato à União Europeia",
    subtitulo:
      "Presidente afirma que não haverá nova negociação se acordo atual não for aprovado até o final de 2025.",
    fonte: "R7 Notícias",
    fonteUrl: "https://noticias.r7.com/brasilia/lula-diz-que-brasil-nao-fara-acordo-mercosulue-se-pacto-nao-for-aprovado-em-2025-17122025/",
    data: "17/12/2025",
    categoria: "fato",
    tags: ["Mercosul", "União Europeia", "Comércio", "Diplomacia"],
    destaque: "25 anos de negociação. França e Itália ainda resistem.",
    contexto:
      "Macron e Meloni lideram oposição ao acordo por questões agrícolas. Agronegócio brasileiro perde mercado potencial de 450 milhões de consumidores.",
    relevancia: "alta",
  },
  {
    id: 16,
    titulo: "Investimento Estrangeiro Bate Recorde de 10 Anos",
    subtitulo:
      "Brasil recebe US$ 84,1 bilhões em investimentos diretos até novembro. Maior valor desde 2014.",
    fonte: "MDIC",
    fonteUrl: "https://www.gov.br/mdic/",
    data: "18/12/2025",
    categoria: "fato",
    tags: ["Investimento", "Economia", "PIB", "Estrangeiros"],
    destaque: "Dado positivo que governo vai explorar eleitoralmente.",
    contexto:
      "Setor de energia e mineração lidera os aportes. Críticos apontam que volume está concentrado em poucos setores.",
    relevancia: "media",
  },
  {
    id: 1,
    titulo: "Zezé Di Camargo: Do Palanque de Lula ao Moralismo de Ocasião",
    subtitulo:
      "Cantor que fez campanha para Lula em 2002 agora exige cancelamento de seu programa no SBT porque a emissora recebeu o presidente.",
    fonte: "Poder360 / CartaCapital",
    fonteUrl: "https://www.poder360.com.br/poder-midia/zeze-critica-sbt-sugere-aproximacao-com-lula-e-pede-fim-de-show/",
    data: "15/12/2025",
    categoria: "hipocrisia",
    tags: ["Zezé Di Camargo", "SBT", "Lula", "Hipocrisia"],
    destaque: "Em 2002 fez campanha para Lula. Em 2025 quer censurar sua presença na TV.",
    contexto:
      "Zezé recebeu R$ 2,21 milhões em cachês de prefeituras entre 2024-2025. Silvio Santos, que ele diz defender, nunca se indispôs com nenhum governo e pediu ajuda pessoalmente a Lula em 2010.",
    relevancia: "alta",
  },
  {
    id: 2,
    titulo: "Câmara Rejeita Cassar Zambelli Mesmo Após Condenação",
    subtitulo:
      "Deputados protegem colega condenada e presa no exterior. Corporativismo vence mais uma vez.",
    fonte: "Agência Brasil",
    fonteUrl: "https://agenciabrasil.ebc.com.br/politica",
    data: "14/12/2025",
    categoria: "corrupcao",
    tags: ["Zambelli", "Cassação", "Câmara", "Corporativismo"],
    destaque: "Quando se trata de proteger os seus, esquerda e direita se unem.",
    contexto:
      "Lindbergh Farias (PT) protocolou mandado de segurança pedindo que o STF determine a perda dos mandatos. A mesma Câmara que finge defender a moralidade.",
    relevancia: "alta",
  },
  {
    id: 3,
    titulo: "R$ 7,3 Bilhões em Emendas Pix Travadas por Suspeita de Desvio",
    subtitulo:
      "Dino manda PF investigar quase mil emendas. Assessora controlava 'salinha das emendas' na Câmara.",
    fonte: "Transparência Internacional",
    fonteUrl: "https://transparenciainternacional.org.br/publicacoes/raio-x-das-emendas-ao-orcamento/",
    data: "12/12/2025",
    categoria: "corrupcao",
    tags: ["Emendas Pix", "Orçamento Secreto", "Corrupção", "Dino"],
    destaque: "O 'Orçamento Secreto 2.0' que deputados de TODOS os partidos adoram.",
    contexto:
      "TCU investiga 40 mil emendas com conexões ao crime organizado. PF estima prejuízo de R$ 22 milhões só em uma operação de pavimentação.",
    relevancia: "alta",
  },
  {
    id: 4,
    titulo: "Desembargador Preso por Vender Sentenças e Vazar Operações",
    subtitulo:
      "Macário Judice Neto, relator do caso TH Joias, foi promovido a desembargador após 17 anos afastado por denúncias.",
    fonte: "ND Mais",
    fonteUrl: "https://ndmais.com.br/justica/quem-e-o-desembargador-macario-judice-neto-preso/",
    data: "10/12/2025",
    categoria: "corrupcao",
    tags: ["Judiciário", "Corrupção", "Operação Unha e Carne"],
    destaque: "Afastado por vender sentenças, voltou e foi PROMOVIDO.",
    contexto:
      "Presidente da Alerj foi abordado com R$ 90 mil em espécie no carro. Solto 6 dias depois com tornozeleira. Justiça para quem?",
    relevancia: "alta",
  },
  {
    id: 5,
    titulo: "Pablo Marçal: Condenado, Absolvido, e Pronto Para 2026",
    subtitulo:
      "Inelegibilidade revertida em segunda instância. Sistema protege quem sabe jogar o jogo.",
    fonte: "TRE-SP",
    fonteUrl: "https://www.tre-sp.jus.br/comunicacao/noticias/2025/Novembro/pablo-marcal-tem-condenacao-a-inelegibilidade-revertida-em-segunda-instancia",
    data: "Nov/2025",
    categoria: "alerta",
    tags: ["Pablo Marçal", "Eleições", "Inelegibilidade"],
    destaque: "Vendeu apoio por R$ 5.000 via Pix. Foi condenado. Foi absolvido.",
    contexto:
      "Também condenado por difamação contra Tabata Amaral e por acusações falsas contra instituto de pesquisa. Mas segue elegível.",
    relevancia: "alta",
  },
  {
    id: 6,
    titulo: "MBL e Marçal: Inimigos que Usam as Mesmas Táticas",
    subtitulo:
      "Renan Santos chama Marçal de 'mentiroso'. Marçal diz que MBL 'não serve pra nada'. Ambos têm razão.",
    fonte: "Revista Fórum / Metrópoles",
    fonteUrl: "https://revistaforum.com.br/politica/2025/11/24/video-pablo-maral-esculhamba-mbl-derrotados-no-serve-pra-nada-192778.html",
    data: "Nov/2025",
    categoria: "hipocrisia",
    tags: ["MBL", "Pablo Marçal", "Direita", "Briga"],
    destaque: "Ambos fazem a mesma coisa. Só brigam quando é um contra o outro.",
    contexto:
      "Analistas apontam que a liberação do partido do MBL e a absolvição de Marçal visam fragmentar o bolsonarismo. Todos disputando o mesmo eleitor.",
    relevancia: "media",
  },
  {
    id: 7,
    titulo: "Correios: De Centro do Mensalão a Buraco de R$ 4 Bilhões",
    subtitulo:
      "Empresa que foi pivô de escândalo em 2005 agora pede socorro ao Tesouro após sair da lista de privatização.",
    fonte: "ND Mais",
    fonteUrl: "https://ndmais.com.br/politica/polemicas-do-governo-lula-correios-bndes-dirceu/",
    data: "Dez/2025",
    categoria: "fato",
    tags: ["Correios", "Mensalão", "Governo Lula", "Estatais"],
    destaque: "20 anos depois, o mesmo problema. Os mesmos personagens.",
    contexto:
      "Dirceu articula nos bastidores. BNDES financia ditaduras amigas. A história se repete como farsa.",
    relevancia: "media",
  },
  {
    id: 8,
    titulo: "PEC da Blindagem: Congresso Quer Impunidade por Lei",
    subtitulo:
      "Proposta fortalece sigilo e dificulta investigações sobre uso de emendas. Voto secreto incluso.",
    fonte: "Agência Brasil",
    fonteUrl: "https://agenciabrasil.ebc.com.br/politica/noticia/2025-09/pec-da-blindagem-pode-barrar-acoes-contra-corrupcao-no-uso-de-emendas",
    data: "Set/2025",
    categoria: "corrupcao",
    tags: ["PEC", "Impunidade", "Emendas", "Congresso"],
    destaque: "Quanto mais se investiga, mais eles tentam se blindar.",
    contexto:
      "A urgência da blindagem coincide com o avanço das investigações que já alcançam quase uma centena de parlamentares.",
    relevancia: "alta",
  },
  {
    id: 9,
    titulo: "Anistia ao 8 de Janeiro: Senador Quer Perdão Total",
    subtitulo:
      "Espiridião Amin quer reincluir perdão completo aos condenados. PL beneficiaria também Bolsonaro.",
    fonte: "CNN Brasil",
    fonteUrl: "https://www.cnnbrasil.com.br/tudo-sobre/polemica/",
    data: "Dez/2025",
    categoria: "polarizacao",
    tags: ["8 de Janeiro", "Anistia", "Bolsonaro", "Golpe"],
    destaque: "Para a direita radical: 'patriotas injustiçados'. Para a lei: criminosos.",
    contexto:
      "Especialistas afirmam que o PL da Dosimetria beneficiaria também criminosos comuns, não só os golpistas.",
    relevancia: "alta",
  },
  {
    id: 10,
    titulo: "SBT Sempre Puxou Saco de Quem Está no Poder",
    subtitulo:
      "Silvio Santos nunca se indispôs com nenhum governo. Filhas seguem a mesma cartilha. Surpresa de quem?",
    fonte: "Análise PSF",
    fonteUrl: "#",
    data: "15/12/2025",
    categoria: "fato",
    tags: ["SBT", "Silvio Santos", "Governo", "Mídia"],
    destaque: "O SBT apoiou Collor, FHC, Lula 1, Lula 2, Dilma, Temer, Bolsonaro, Lula 3.",
    contexto:
      "Quem achou que as filhas de Silvio eram 'de direita' não entendeu nada sobre como funcionam grandes empresas de mídia no Brasil.",
    relevancia: "media",
  },
];

const categoriaLabels = {
  hipocrisia: { label: "Hipocrisia", icon: Users, color: "bg-brutal-red" },
  corrupcao: { label: "Corrupção", icon: DollarSign, color: "bg-black" },
  polarizacao: { label: "Polarização", icon: Scale, color: "bg-gray-700" },
  alerta: { label: "Alerta", icon: AlertTriangle, color: "bg-brutal-red" },
  fato: { label: "Fato", icon: Newspaper, color: "bg-gray-800" },
};

export default function NoticiasPage() {
  const [filtro, setFiltro] = useState<string>("todas");

  // IDs das notícias para o hook de votos
  const noticiaIds = useMemo(() => noticias.map((n) => n.id), []);
  const { votes, vote, isLoading: votesLoading, requiresLogin } = useVotes(noticiaIds);

  const categorias = [
    { id: "todas", label: "Todas" },
    { id: "hipocrisia", label: "Hipocrisia" },
    { id: "corrupcao", label: "Corrupção" },
    { id: "polarizacao", label: "Polarização" },
    { id: "alerta", label: "Alertas" },
  ];

  const noticiasFiltradas =
    filtro === "todas" ? noticias : noticias.filter((n) => n.categoria === filtro);

  return (
    <main className="min-h-screen bg-brutal-bg dark:bg-brutal-dark-bg p-4 md:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-8 border-b-3 border-black dark:border-brutal-dark-border pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black dark:bg-brutal-dark-accent p-2 border-2 border-black dark:border-brutal-dark-accent">
            <Newspaper size={32} className="text-white" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-brutal-dark-muted">
              Curadoria Crítica
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none dark:text-brutal-dark-text">
              Notícias Sem Filtro
            </h1>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-700 dark:text-brutal-dark-muted max-w-3xl">
          Não reproduzimos manchetes. Contextualizamos, criticamos e expomos a hipocrisia de
          todos os lados. Cada notícia aqui pode ser compartilhada como card no Instagram.
        </p>
      </div>

      {/* AVISO */}
      <div className="card-brutal bg-black text-white mb-8">
        <div className="flex items-start gap-4">
          <AlertTriangle size={24} className="text-brutal-red shrink-0 mt-1" />
          <div>
            <p className="font-bold mb-2">
              ATENÇÃO: Não somos isentos. Somos críticos de TODOS.
            </p>
            <p className="text-sm font-medium opacity-80">
              Cada notícia tem fontes linkadas. Verifique você mesmo. Não confie em nós.
              Não confie em ninguém. Pesquise.
            </p>
          </div>
        </div>
      </div>

      {/* AVISO DE LOGIN */}
      {requiresLogin && (
        <div className="card-brutal bg-brutal-red text-white mb-8 animate-pulse">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <LogIn size={24} />
              <div>
                <p className="font-black">Faça login para votar!</p>
                <p className="text-sm font-medium opacity-90">
                  Você precisa estar logado para dar upvote ou downvote nas notícias.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="bg-white text-brutal-red px-6 py-3 font-black uppercase border-2 border-white hover:bg-black hover:text-white hover:border-black transition-all"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      )}

      {/* FILTROS */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <div className="flex items-center gap-2 mr-4">
          <Filter size={18} className="text-gray-600 dark:text-brutal-dark-muted" />
          <span className="font-bold text-sm uppercase text-gray-600 dark:text-brutal-dark-muted">Filtrar:</span>
        </div>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFiltro(cat.id)}
            className={`px-4 py-2 font-bold uppercase text-sm border-2 border-black dark:border-brutal-dark-border transition-all ${
              filtro === cat.id
                ? "bg-black text-white dark:bg-brutal-dark-accent"
                : "bg-white dark:bg-brutal-dark-surface dark:text-brutal-dark-text hover:bg-black hover:text-white dark:hover:bg-brutal-dark-accent"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* GRID DE NOTÍCIAS */}
      <div className="space-y-6">
        {noticiasFiltradas.map((noticia) => {
          const catConfig = categoriaLabels[noticia.categoria];
          const CatIcon = catConfig.icon;

          const shareData: NewsShareData = {
            titulo: noticia.titulo,
            subtitulo: noticia.subtitulo,
            fonte: noticia.fonte,
            data: noticia.data,
            categoria: noticia.categoria,
            destaque: noticia.destaque,
            contexto: noticia.contexto,
          };

          return (
            <article
              key={noticia.id}
              className="card-brutal hover:shadow-hard-hover dark:hover:shadow-none transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* CONTEÚDO */}
                <div className="flex-1">
                  {/* META */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`${catConfig.color} text-white text-xs font-black px-3 py-1 uppercase flex items-center gap-2`}
                    >
                      <CatIcon size={14} />
                      {catConfig.label}
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-brutal-dark-muted flex items-center gap-1">
                      <Calendar size={12} />
                      {noticia.data}
                    </span>
                    {noticia.relevancia === "alta" && (
                      <span className="text-xs font-bold text-brutal-red flex items-center gap-1">
                        <TrendingUp size={12} />
                        DESTAQUE
                      </span>
                    )}
                  </div>

                  {/* TÍTULO */}
                  <h2 className="font-black text-xl md:text-2xl uppercase mb-3 leading-tight dark:text-brutal-dark-text">
                    {noticia.titulo}
                  </h2>

                  {/* SUBTÍTULO */}
                  <p className="font-medium text-gray-700 dark:text-brutal-dark-muted mb-4 leading-relaxed">
                    {noticia.subtitulo}
                  </p>

                  {/* DESTAQUE */}
                  {noticia.destaque && (
                    <div className="bg-brutal-red text-white p-4 mb-4 border-2 border-black dark:border-brutal-red">
                      <p className="font-black text-sm md:text-base">{noticia.destaque}</p>
                    </div>
                  )}

                  {/* CONTEXTO */}
                  {noticia.contexto && (
                    <div className="bg-gray-100 dark:bg-brutal-dark-bg p-4 mb-4 border-2 border-black dark:border-brutal-dark-border">
                      <p className="font-medium text-sm text-gray-700 dark:text-brutal-dark-muted">{noticia.contexto}</p>
                    </div>
                  )}

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {noticia.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-bold bg-white dark:bg-brutal-dark-surface border border-black dark:border-brutal-dark-border px-2 py-1 dark:text-brutal-dark-text"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AÇÕES */}
                <div className="flex lg:flex-col gap-3 lg:items-end shrink-0">
                  {/* BOTÃO COMPARTILHAR */}
                  <NewsShareButton data={shareData} />

                  {/* LINK FONTE */}
                  {noticia.fonteUrl !== "#" && (
                    <a
                      href={noticia.fonteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-brutal-dark-muted hover:text-black dark:hover:text-brutal-dark-text transition-colors"
                    >
                      <span className="hidden sm:inline">Ver fonte</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* FOOTER COM VOTOS */}
              <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-brutal-dark-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-500 dark:text-brutal-dark-muted">
                    FONTE: {noticia.fonte}
                  </span>
                  <span className="text-xs font-medium text-gray-400 dark:text-brutal-dark-muted hidden sm:inline">
                    Verifique. Não confie.
                  </span>
                </div>

                {/* VOTOS */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 dark:text-brutal-dark-muted uppercase hidden sm:inline">
                    Sua opinião:
                  </span>
                  <VoteButtons
                    upvotes={votes[noticia.id]?.upvotes || 0}
                    downvotes={votes[noticia.id]?.downvotes || 0}
                    userVote={votes[noticia.id]?.userVote || null}
                    onVote={(type) => vote(noticia.id, type)}
                    disabled={votesLoading}
                    size="sm"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-12 card-brutal bg-black text-white">
        <h3 className="font-black text-xl uppercase mb-4">Como Usar Esta Página</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <span className="text-brutal-red font-black text-2xl">1.</span>
            <p className="font-medium mt-2">
              Leia a notícia e o contexto que adicionamos
            </p>
          </div>
          <div>
            <span className="text-brutal-red font-black text-2xl">2.</span>
            <p className="font-medium mt-2">
              Clique na fonte original e verifique você mesmo
            </p>
          </div>
          <div>
            <span className="text-brutal-red font-black text-2xl">3.</span>
            <p className="font-medium mt-2">
              Use o botão "Compartilhar" para baixar o card e postar no Instagram
            </p>
          </div>
        </div>
      </div>

      {/* MENSAGEM FINAL */}
      <div className="mt-8 bg-brutal-bg dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border p-6 text-center">
        <p className="font-black text-lg uppercase dark:text-brutal-dark-text">
          Política Sem Filtro: Expondo a hipocrisia de esquerda, direita e centro desde 2025.
        </p>
      </div>
    </main>
  );
}
