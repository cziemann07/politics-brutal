"use client";

import { useState } from "react";
import { Newspaper, ExternalLink, Calendar, TrendingUp } from "lucide-react";

// Placeholder - será substituído por feed de notícias real
const mockNoticias = [
  {
    id: 1,
    titulo: "Deputado X ultrapassa teto de gastos em 150%",
    fonte: "Folha de S.Paulo",
    data: "2024-09-20",
    url: "#",
    relevancia: "alta",
    tags: ["Gastos", "CEAP", "Irregularidade"],
  },
  {
    id: 2,
    titulo: "Nova investigação sobre desvio de verba parlamentar",
    fonte: "G1",
    data: "2024-09-19",
    url: "#",
    relevancia: "alta",
    tags: ["Investigações", "Corrupção"],
  },
  {
    id: 3,
    titulo: "Projeções eleitorais 2026: veja quem está na frente",
    fonte: "Poder360",
    data: "2024-09-18",
    url: "#",
    relevancia: "media",
    tags: ["Eleições 2026", "Pesquisas"],
  },
];

export default function NoticiasPage() {
  const [filtro, setFiltro] = useState<string>("todas");

  const categorias = [
    { id: "todas", label: "Todas" },
    { id: "gastos", label: "Gastos" },
    { id: "investigacoes", label: "Investigações" },
    { id: "eleicoes", label: "Eleições 2026" },
  ];

  return (
    <main className="min-h-screen bg-brutal-bg p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-black uppercase mb-2 flex items-center gap-3">
          <Newspaper size={48} />
          Notícias Atuais
        </h1>
        <p className="text-lg font-bold text-gray-700">
          Acompanhe as últimas notícias sobre política brasileira
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFiltro(cat.id)}
            className={`px-4 py-2 font-bold uppercase border-2 border-black transition-all ${
              filtro === cat.id ? "bg-black text-white" : "bg-white hover:bg-brutal-yellow"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Notícias */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockNoticias.map((noticia) => (
          <article
            key={noticia.id}
            className="card-brutal hover:shadow-hard-hover transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-bold bg-black text-white px-2 py-1 uppercase">
                {noticia.fonte}
              </span>
              {noticia.relevancia === "alta" && (
                <TrendingUp size={16} className="text-brutal-red" />
              )}
            </div>

            <h3 className="font-black text-lg uppercase mb-3 group-hover:text-brutal-red transition-colors">
              {noticia.titulo}
            </h3>

            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-3">
              <Calendar size={14} />
              {new Date(noticia.data).toLocaleDateString("pt-BR")}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {noticia.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold bg-gray-100 border border-black px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={noticia.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-brutal-blue hover:text-black transition-colors"
            >
              Ler mais <ExternalLink size={14} />
            </a>
          </article>
        ))}
      </div>

      {/* Placeholder para integração futura */}
      <div className="mt-8 card-brutal bg-brutal-yellow">
        <p className="font-bold text-center">
          🔄 Em breve: Integração com feeds de notícias em tempo real
        </p>
      </div>
    </main>
  );
}
