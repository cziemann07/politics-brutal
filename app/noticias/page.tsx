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

// Notícias reais e atuais - Fevereiro/Março 2026
const noticias: Noticia[] = [
  {
    id: 20,
    titulo: "CPMI do INSS Aprova Quebra de Sigilo de Lulinha com Briga e Confusão",
    subtitulo:
      "Votação terminou com empurrões e soco. Deputado do PT agrediu parlamentar do PL. Governo tenta anular decisão.",
    fonte: "Senado Notícias",
    fonteUrl: "https://www12.senado.leg.br/noticias/materias/2026/02/26/sob-protestos-cpmi-aprova-quebra-de-sigilos-de-lulinha",
    data: "26/02/2026",
    categoria: "corrupcao",
    tags: ["CPMI", "INSS", "Lulinha", "Sigilo", "Congresso"],
    destaque: "Filho do presidente tem sigilos bancário e fiscal quebrados. Governo surta.",
    contexto:
      "Lulinha aparece em decisão do STF que autorizou nova fase da Operação Sem Desconto, que investiga descontos não autorizados em aposentadorias. Defesa diz que ele não tem relação com fraudes no INSS.",
    relevancia: "alta",
  },
  {
    id: 21,
    titulo: "\"Acorda Brasil\": 22 Mil na Paulista Pedem Impeachment de Lula e Moraes",
    subtitulo:
      "Manifestação convocada por Nikolas Ferreira reuniu multidão em 19 estados. Bolsonaro apareceu por vídeo.",
    fonte: "Poder360",
    fonteUrl: "https://www.poder360.com.br/poder-brasil/ato-de-nikolas-contra-lula-e-moraes-reune-22-800-pessoas-na-paulista/",
    data: "01/03/2026",
    categoria: "polarizacao",
    tags: ["Manifestação", "Nikolas", "Bolsonaro", "Impeachment", "Paulista"],
    destaque: "Direita volta às ruas. Mas quem organiza também quer seu voto em outubro.",
    contexto:
      "Pautas incluem impeachment de Lula, de Moraes e de Toffoli, além de anistia aos condenados do 8 de Janeiro. Analistas apontam que ato serve de prévia eleitoral para 2026.",
    relevancia: "alta",
  },
  {
    id: 22,
    titulo: "Condenados da Lava Jato Planejam Retorno em Massa nas Eleições",
    subtitulo:
      "Dirceu, Cabral e outros condenados por corrupção querem se candidatar em 2026 após mudanças na Ficha Limpa.",
    fonte: "ISTOÉ",
    fonteUrl: "https://istoe.com.br/jose-dirceu-cunha-e-outros-condenados-na-lava-jato-planejam-retorno-a-politica-apos-absolvicoes/",
    data: "Fev/2026",
    categoria: "corrupcao",
    tags: ["Lava Jato", "Ficha Limpa", "Dirceu", "Cabral", "Eleições 2026"],
    destaque: "Condenados a centenas de anos de prisão. Nenhum preso. Todos querendo voltar.",
    contexto:
      "Dirceu (79 anos) quer ser deputado federal por SP. Cabral (435 anos de pena) aguarda STF devolver elegibilidade. Cunha planeja MG como domicílio eleitoral. Congresso alterou a Lei da Ficha Limpa no ano passado, encurtando prazos de inelegibilidade.",
    relevancia: "alta",
  },
  {
    id: 23,
    titulo: "Flávio Bolsonaro Protocola PEC Pelo Fim da Reeleição",
    subtitulo:
      "Proposta impede reeleição para presidente com mandato de 5 anos. Mas não impede Lula em 2026.",
    fonte: "Diário do Grande ABC",
    fonteUrl: "https://www.dgabc.com.br/Noticia/4288318/flavio-bolsonaro-protocola-pec-pelo-fim-da-reeleicao-a-presidencia",
    data: "03/03/2026",
    categoria: "hipocrisia",
    tags: ["Reeleição", "PEC", "Flávio Bolsonaro", "Mandato", "Eleições"],
    destaque: "Pai usou reeleição. Filho quer acabar com ela. Timing conveniente.",
    contexto:
      "PEC precisa de 3/5 dos votos nas duas casas. CCJ do Senado já aprovou versão anterior em maio de 2025. Se aprovada, não impediria Lula de concorrer em 2026 — só valeria para mandatos futuros.",
    relevancia: "alta",
  },
  {
    id: 24,
    titulo: "Toffoli Anula Quebra de Sigilo da Própria Família em CPI",
    subtitulo:
      "Decano do STF anulou decisão da CPI do Crime Organizado que queria investigar empresa ligada à sua família.",
    fonte: "CNN Brasil",
    fonteUrl: "https://www.cnnbrasil.com.br/politica/",
    data: "Fev/2026",
    categoria: "corrupcao",
    tags: ["STF", "Toffoli", "CPI", "Sigilo", "Judiciário"],
    destaque: "Ministro do STF usa o próprio poder para proteger a si mesmo. Normalizado.",
    contexto:
      "A empresa Maridt, da família de Toffoli, é investigada pela CPI. O ministro argumentou que a decisão da CPI extrapolou seus limites constitucionais. Oposição pede impeachment.",
    relevancia: "alta",
  },
  {
    id: 25,
    titulo: "Mudança na Ficha Limpa: Procurador Chama de \"Filme de Terror\"",
    subtitulo:
      "Alteração aprovada pelo Congresso encurta prazo de inelegibilidade e pode beneficiar dezenas de condenados.",
    fonte: "ND Mais",
    fonteUrl: "https://ndmais.com.br/politica/mudanca-na-lei-da-ficha-limpa-e-filme-de-terror-alerta-procurador/",
    data: "Fev/2026",
    categoria: "corrupcao",
    tags: ["Ficha Limpa", "Congresso", "Inelegibilidade", "Corrupção"],
    destaque: "Congresso muda regra para beneficiar condenados. Esquerda E direita votaram a favor.",
    contexto:
      "A contagem do prazo de inelegibilidade agora começa a partir da decisão de tribunal colegiado, não do trânsito em julgado. Bloco de políticos condenados aguarda decisão de Cármen Lúcia no STF sobre a constitucionalidade.",
    relevancia: "alta",
  },
  {
    id: 26,
    titulo: "PEC do Mandato de 5 Anos e Fim da Escala 6x1 Podem Ir a Plenário",
    subtitulo:
      "Senado pode votar duas PECs polêmicas: mandatos mais longos para políticos e jornada de 36h para trabalhadores.",
    fonte: "Senado Notícias",
    fonteUrl: "https://www12.senado.leg.br/noticias/materias/2026/01/23/pecs-do-mandato-de-5-anos-e-do-fim-da-escala-6x1-podem-ir-a-plenario",
    data: "Jan/2026",
    categoria: "alerta",
    tags: ["PEC", "Jornada 6x1", "Mandato", "Senado", "Trabalhadores"],
    destaque: "Políticos querem mais tempo no poder. Trabalhadores querem menos tempo no trabalho. Adivinha qual passa primeiro.",
    contexto:
      "A PEC da jornada 6x1 propõe 36h semanais. A PEC do mandato de 5 anos beneficia diretamente quem já está no poder. As duas tramitam juntas mas com velocidades diferentes.",
    relevancia: "alta",
  },
  {
    id: 3,
    titulo: "R$ 7,3 Bilhões em Emendas Pix Travadas por Suspeita de Desvio",
    subtitulo:
      "Dino manda PF investigar quase mil emendas. Assessora controlava 'salinha das emendas' na Câmara.",
    fonte: "Transparência Internacional",
    fonteUrl: "https://transparenciainternacional.org.br/publicacoes/raio-x-das-emendas-ao-orcamento/",
    data: "Dez/2025",
    categoria: "corrupcao",
    tags: ["Emendas Pix", "Orçamento Secreto", "Corrupção", "Dino"],
    destaque: "O 'Orçamento Secreto 2.0' que deputados de TODOS os partidos adoram.",
    contexto:
      "TCU investiga 40 mil emendas com conexões ao crime organizado. PF estima prejuízo de R$ 22 milhões só em uma operação de pavimentação.",
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
    id: 1,
    titulo: "Zezé Di Camargo: Do Palanque de Lula ao Moralismo de Ocasião",
    subtitulo:
      "Cantor que fez campanha para Lula em 2002 agora exige cancelamento de seu programa no SBT porque a emissora recebeu o presidente.",
    fonte: "Poder360 / CartaCapital",
    fonteUrl: "https://www.poder360.com.br/poder-midia/zeze-critica-sbt-sugere-aproximacao-com-lula-e-pede-fim-de-show/",
    data: "Dez/2025",
    categoria: "hipocrisia",
    tags: ["Zezé Di Camargo", "SBT", "Lula", "Hipocrisia"],
    destaque: "Em 2002 fez campanha para Lula. Em 2025 quer censurar sua presença na TV.",
    contexto:
      "Zezé recebeu R$ 2,21 milhões em cachês de prefeituras entre 2024-2025. Silvio Santos, que ele diz defender, nunca se indispôs com nenhum governo.",
    relevancia: "alta",
  },
  {
    id: 4,
    titulo: "Desembargador Preso por Vender Sentenças e Vazar Operações",
    subtitulo:
      "Macário Judice Neto, relator do caso TH Joias, foi promovido a desembargador após 17 anos afastado por denúncias.",
    fonte: "ND Mais",
    fonteUrl: "https://ndmais.com.br/justica/quem-e-o-desembargador-macario-judice-neto-preso/",
    data: "Dez/2025",
    categoria: "corrupcao",
    tags: ["Judiciário", "Corrupção", "Operação Unha e Carne"],
    destaque: "Afastado por vender sentenças, voltou e foi PROMOVIDO.",
    contexto:
      "Presidente da Alerj foi abordado com R$ 90 mil em espécie no carro. Solto 6 dias depois com tornozeleira. Justiça para quem?",
    relevancia: "alta",
  },
  {
    id: 9,
    titulo: "Anistia ao 8 de Janeiro: Pauta Volta com Força em Ano Eleitoral",
    subtitulo:
      "Direita radical pressiona por perdão total aos condenados. PL beneficiaria também Bolsonaro.",
    fonte: "CNN Brasil",
    fonteUrl: "https://www.cnnbrasil.com.br/tudo-sobre/polemica/",
    data: "Fev/2026",
    categoria: "polarizacao",
    tags: ["8 de Janeiro", "Anistia", "Bolsonaro", "Golpe", "Eleições"],
    destaque: "Para a direita radical: 'patriotas injustiçados'. Para a lei: criminosos.",
    contexto:
      "Manifestação do dia 1º de março incluiu anistia como pauta central. Especialistas afirmam que PL da Dosimetria beneficiaria também criminosos comuns.",
    relevancia: "alta",
  },
  {
    id: 27,
    titulo: "Moraes Arquiva Inquérito Contra Zambelli: Caso Encerrado",
    subtitulo:
      "Ministro do STF determinou arquivamento do inquérito que apurava obstrução de justiça pela deputada.",
    fonte: "Agência Brasil",
    fonteUrl: "https://agenciabrasil.ebc.com.br/politica",
    data: "Fev/2026",
    categoria: "fato",
    tags: ["Zambelli", "STF", "Moraes", "Arquivamento"],
    destaque: "A mesma Zambelli que a Câmara se recusou a cassar. Agora o STF encerra o caso.",
    contexto:
      "Zambelli foi investigada por suposta obstrução de justiça. O arquivamento foi determinado por Alexandre de Moraes, o mesmo ministro que é alvo dos protestos da direita.",
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
              href="/auth"
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
            className={`px-4 py-2 font-bold uppercase text-sm border-2 border-black dark:border-brutal-dark-border transition-all ${filtro === cat.id
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
