"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  TrendingUp,
  ChevronRight,
  Users,
  AlertCircle,
  Bookmark,
  ExternalLink,
  Filter,
} from "lucide-react";

// Dados mock de notícias (substituir por dados do Supabase)
const mockNews = {
  featured: {
    id: "1",
    slug: "deputados-faltam-votacao-importante",
    title: "42 deputados faltaram à votação do marco fiscal",
    subtitle: "Análise revela padrão de ausências em votações críticas para o país",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=500&fit=crop",
    category: "politica",
    editorial: "radarnews",
    fonte: "Câmara dos Deputados",
    fonteUrl: "https://www.camara.leg.br/noticias/",
    publishedAt: "2026-01-04T10:30:00",
    readTime: 5,
  },
  secondary: [
    {
      id: "2",
      slug: "gastos-deputados-dezembro",
      title: "Gastos com CEAP ultrapassam R$ 45 milhões em dezembro",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      category: "economia",
      fonte: "Portal Transparência",
      publishedAt: "2026-01-04T08:15:00",
      readTime: 3,
    },
    {
      id: "3",
      slug: "votacao-reforma-tributaria",
      title: "Como votaram os deputados na reforma tributária",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
      category: "politica",
      fonte: "Senado Federal",
      publishedAt: "2026-01-03T18:45:00",
      readTime: 7,
    },
  ],
  latest: [
    {
      id: "4",
      slug: "analise-presenca-parlamentar",
      title: "Ranking: Os deputados mais ausentes de 2025",
      subtitle: "Levantamento mostra quem mais faltou às sessões da Câmara",
      category: "fiscalize",
      fonte: "Radar sem Filtro",
      publishedAt: "2026-01-03T14:20:00",
      readTime: 4,
    },
    {
      id: "5",
      slug: "deputado-muda-voto",
      title: "Deputado que prometeu votar contra muda posição na última hora",
      subtitle: "Caso levanta debate sobre coerência entre discurso e prática",
      category: "politica",
      fonte: "Agência Brasil",
      publishedAt: "2026-01-03T11:00:00",
      readTime: 3,
    },
    {
      id: "6",
      slug: "educacao-e-politica",
      title: "Por que a educação pública é essencial para a democracia",
      subtitle: "Artigo analisa relação entre escolaridade e participação política",
      category: "litera",
      fonte: "Radar sem Filtro",
      publishedAt: "2026-01-02T16:30:00",
      readTime: 8,
    },
    {
      id: "7",
      slug: "emendas-pix-investigadas",
      title: "R$ 7,3 bilhões em emendas Pix são investigadas pela PF",
      subtitle: "Ministro Dino determina apuração de quase mil emendas suspeitas",
      category: "dossie",
      fonte: "STF",
      publishedAt: "2026-01-02T09:00:00",
      readTime: 6,
    },
    {
      id: "8",
      slug: "salario-minimo-2026",
      title: "Salário mínimo sobe para R$ 1.518 em janeiro",
      subtitle: "Aumento representa ganho real de 2,5% sobre a inflação",
      category: "economia",
      fonte: "Governo Federal",
      publishedAt: "2026-01-01T08:00:00",
      readTime: 3,
    },
    {
      id: "9",
      slug: "polarizacao-redes-sociais",
      title: "Estudo revela como algoritmos amplificam a polarização",
      subtitle: "Pesquisa de universidades brasileiras mapeia bolhas ideológicas",
      category: "litera",
      fonte: "USP",
      publishedAt: "2025-12-30T14:00:00",
      readTime: 10,
    },
  ],
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "Agora há pouco";
  if (hours < 24) return `Há ${hours}h`;

  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
}

function getCategoryBadge(category: string) {
  const categories: Record<string, { label: string; class: string }> = {
    politica: { label: "Política", class: "badge-accent" },
    economia: { label: "Economia", class: "badge-info" },
    fiscalize: { label: "Fiscalize", class: "badge-success" },
    litera: { label: "Litera", class: "badge-warning" },
    dossie: { label: "Dossiê", class: "badge-error" },
  };
  return categories[category] || { label: category, class: "badge" };
}

export default function NoticiasPage() {
  const [news] = useState(mockNews);
  const [filter, setFilter] = useState("todas");

  const categories = [
    { id: "todas", label: "Todas" },
    { id: "politica", label: "Política" },
    { id: "economia", label: "Economia" },
    { id: "fiscalize", label: "Fiscalize" },
    { id: "litera", label: "Litera" },
    { id: "dossie", label: "Dossiês" },
  ];

  const filteredNews = filter === "todas"
    ? news.latest
    : news.latest.filter(n => n.category === filter);

  return (
    <div className="min-h-screen bg-radar-bg dark:bg-radar-dark-bg">
      {/* Hero Section - Featured News */}
      <section className="container-main py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Featured Article - Large */}
          <Link
            href={`/noticias/${news.featured.slug}`}
            className="lg:col-span-2 group"
          >
            <article className="card overflow-hidden h-full">
              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                <img
                  src={news.featured.image}
                  alt={news.featured.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <span className={getCategoryBadge(news.featured.category).class + " mb-3"}>
                    {getCategoryBadge(news.featured.category).label}
                  </span>
                  <h1 className="text-headline-md md:text-headline-lg text-white mb-2">
                    {news.featured.title}
                  </h1>
                  <p className="text-body-md text-white/80 hidden md:block">
                    {news.featured.subtitle}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-white/60 text-body-sm">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {news.featured.readTime} min de leitura
                    </span>
                    <span>{formatDate(news.featured.publishedAt)}</span>
                    <span className="hidden sm:inline">Fonte: {news.featured.fonte}</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>

          {/* Secondary Articles */}
          <div className="flex flex-col gap-4">
            {news.secondary.map((article) => (
              <Link
                key={article.id}
                href={`/noticias/${article.slug}`}
                className="group flex-1"
              >
                <article className="card overflow-hidden h-full">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className={getCategoryBadge(article.category).class + " mb-2 text-xs"}>
                        {getCategoryBadge(article.category).label}
                      </span>
                      <h2 className="text-headline-sm text-white line-clamp-2">
                        {article.title}
                      </h2>
                      <span className="text-caption text-white/60 mt-2 block">
                        {formatDate(article.publishedAt)} • {article.fonte}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container-main py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/fiscalize" className="card-interactive p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-radar-secondary/10 flex items-center justify-center">
              <Users className="text-radar-secondary" size={20} />
            </div>
            <div>
              <p className="font-semibold text-radar-text dark:text-radar-dark-text">Fiscalize</p>
              <p className="text-caption">Acompanhe deputados</p>
            </div>
          </Link>

          <Link href="/fiscalize/votacoes" className="card-interactive p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-radar-accent/10 flex items-center justify-center">
              <TrendingUp className="text-radar-accent" size={20} />
            </div>
            <div>
              <p className="font-semibold text-radar-text dark:text-radar-dark-text">Votações</p>
              <p className="text-caption">Últimas votações</p>
            </div>
          </Link>

          <Link href="/investigacoes" className="card-interactive p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-radar-warning/10 flex items-center justify-center">
              <AlertCircle className="text-radar-warning" size={20} />
            </div>
            <div>
              <p className="font-semibold text-radar-text dark:text-radar-dark-text">Dossiês</p>
              <p className="text-caption">Investigações</p>
            </div>
          </Link>

          <Link href="/planos" className="card-interactive p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-radar-success/10 flex items-center justify-center">
              <Bookmark className="text-radar-success" size={20} />
            </div>
            <div>
              <p className="font-semibold text-radar-text dark:text-radar-dark-text">Assinar</p>
              <p className="text-caption">A partir de R$0,99</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Latest News with Filter */}
      <section className="container-main py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-headline-md text-radar-text dark:text-radar-dark-text">
            Últimas Notícias
          </h2>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter size={16} className="text-radar-muted shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 text-body-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  filter === cat.id
                    ? "bg-radar-accent text-white"
                    : "bg-radar-surface dark:bg-radar-dark-surface text-radar-text dark:text-radar-dark-text hover:bg-radar-border dark:hover:bg-radar-dark-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((article) => (
            <Link
              key={article.id}
              href={`/noticias/${article.slug}`}
              className="group"
            >
              <article className="card p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={getCategoryBadge(article.category).class}>
                    {getCategoryBadge(article.category).label}
                  </span>
                  {article.category === "dossie" && (
                    <span className="badge-error">Exclusivo</span>
                  )}
                </div>
                <h3 className="text-headline-sm text-radar-text dark:text-radar-dark-text mb-2 group-hover:text-radar-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-body-sm text-radar-muted dark:text-radar-dark-muted flex-1">
                  {article.subtitle}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-radar-border dark:border-radar-dark-border">
                  <div className="flex items-center gap-2">
                    <span className="text-caption">{formatDate(article.publishedAt)}</span>
                    <span className="text-radar-border">•</span>
                    <span className="text-caption">{article.fonte}</span>
                  </div>
                  <span className="text-caption flex items-center gap-1">
                    <Clock size={12} /> {article.readTime} min
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-radar-muted dark:text-radar-dark-muted">
              Nenhuma notícia encontrada nesta categoria.
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container-main py-12">
        <div className="card bg-radar-primary dark:bg-radar-dark-surface p-8 md:p-12 text-center">
          <h2 className="text-headline-lg text-white mb-4">
            Acompanhe seus deputados de perto
          </h2>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto mb-6">
            Receba alertas sobre ausências, votações polêmicas e gastos acima da média.
            Escolha quem você quer fiscalizar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth" className="btn-primary text-lg px-8">
              Criar conta grátis
            </Link>
            <Link href="/planos" className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-radar-primary transition-colors">
              Ver planos
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-radar-border dark:border-radar-dark-border">
        <div className="container-main py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-radar-text dark:text-radar-dark-text mb-4">
                Radar sem Filtro
              </h3>
              <p className="text-body-sm text-radar-muted dark:text-radar-dark-muted">
                Transparência política para o cidadão brasileiro. Dados oficiais, sem viés partidário.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-radar-text dark:text-radar-dark-text mb-4">Editorias</h4>
              <ul className="space-y-2">
                <li><Link href="/noticias" className="link text-body-sm">Radarnews</Link></li>
                <li><Link href="/fiscalize" className="link text-body-sm">Fiscalize</Link></li>
                <li><Link href="/litera" className="link text-body-sm">Litera</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-radar-text dark:text-radar-dark-text mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><Link href="/fiscalize/deputados" className="link text-body-sm">Deputados</Link></li>
                <li><Link href="/fiscalize/votacoes" className="link text-body-sm">Votações</Link></li>
                <li><Link href="/investigacoes" className="link text-body-sm">Dossiês</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-radar-text dark:text-radar-dark-text mb-4">Conta</h4>
              <ul className="space-y-2">
                <li><Link href="/planos" className="link text-body-sm">Planos</Link></li>
                <li><Link href="/auth" className="link text-body-sm">Entrar</Link></li>
                <li><Link href="/contato" className="link text-body-sm">Contato</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-radar-border dark:border-radar-dark-border text-center">
            <p className="text-caption">
              Dados fornecidos pela API de Dados Abertos da Câmara dos Deputados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
