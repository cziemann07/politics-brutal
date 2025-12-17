"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Minus,
  RefreshCw,
  AlertTriangle,
  Vote,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Loader2,
  BarChart3,
} from "lucide-react";
import VotacaoShareButton, { VotacaoShareData } from "@/components/ui/VotacaoShareButton";
import { VotacaoBarChart } from "@/components/charts";

interface Votacao {
  id: string;
  data: string;
  dataHoraRegistro: string;
  orgao: string;
  proposicao: string | null;
  descricao: string;
  aprovado: boolean;
  votos: {
    sim: number;
    nao: number;
    total: number;
  } | null;
}

interface VotacaoDetalhes {
  id: string;
  data: string;
  descricao: string;
  aprovado: boolean;
  resumo: {
    sim: number;
    nao: number;
    abstencao: number;
    obstrucao: number;
    outros: number;
    total: number;
  };
  votosPorPartido: Array<{
    partido: string;
    sim: number;
    nao: number;
    abstencao: number;
    obstrucao: number;
    total: number;
  }>;
  votosIndividuais: Array<{
    tipoVoto: string;
    deputado: {
      id: number;
      nome: string;
      partido: string;
      uf: string;
      foto: string;
    };
  }>;
}

export default function VotacoesPage() {
  const [votacoes, setVotacoes] = useState<Votacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detalhes, setDetalhes] = useState<VotacaoDetalhes | null>(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  const [filtroPartido, setFiltroPartido] = useState<string>("todos");

  // Busca lista de votações
  const fetchVotacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/votacoes?itens=50");
      if (!res.ok) throw new Error("Falha ao buscar votações");
      const data = await res.json();
      setVotacoes(data.dados || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca detalhes de uma votação específica
  const fetchDetalhes = useCallback(async (id: string) => {
    setLoadingDetalhes(true);
    try {
      const res = await fetch(`/api/votacoes/${id}`);
      if (!res.ok) throw new Error("Falha ao buscar detalhes");
      const data = await res.json();
      setDetalhes(data.dados);
    } catch (e: any) {
      console.error("Erro ao buscar detalhes:", e);
      setDetalhes(null);
    } finally {
      setLoadingDetalhes(false);
    }
  }, []);

  useEffect(() => {
    fetchVotacoes();
  }, [fetchVotacoes]);

  // Quando seleciona uma votação, busca detalhes
  const handleSelectVotacao = (id: string) => {
    if (selectedId === id) {
      setSelectedId(null);
      setDetalhes(null);
    } else {
      setSelectedId(id);
      fetchDetalhes(id);
    }
  };

  // Partidos únicos para filtro
  const partidosUnicos = detalhes
    ? [...new Set(detalhes.votosPorPartido.map((v) => v.partido))].sort()
    : [];

  // Filtra votos por partido
  const votosFiltrados = detalhes?.votosIndividuais.filter(
    (v) => filtroPartido === "todos" || v.deputado.partido === filtroPartido
  );

  return (
    <main className="min-h-screen bg-brutal-bg p-4 md:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-8 border-b-3 border-black pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black p-2 border-2 border-black">
            <Vote size={32} className="text-white" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-500">
              Dados em Tempo Real
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Votações do Plenário
            </h1>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-700 max-w-3xl">
          Acompanhe as votações da Câmara dos Deputados em tempo real. Veja como cada partido
          e cada deputado votou. Dados diretos da API oficial.
        </p>
      </div>

      {/* AVISO */}
      <div className="card-brutal bg-black text-white mb-8">
        <div className="flex items-start gap-4">
          <AlertTriangle size={24} className="text-brutal-red shrink-0 mt-1" />
          <div>
            <p className="font-bold mb-2">
              POR QUE ACOMPANHAR VOTAÇÕES?
            </p>
            <p className="text-sm font-medium opacity-80">
              O político que você defende vota como você espera? Veja os fatos, não os discursos.
              Muitos "conservadores" votam com o PT. Muitos "progressistas" votam com o PL.
            </p>
          </div>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-gray-600" />
          <span className="font-bold text-sm uppercase text-gray-600">
            {votacoes.length} votações do Plenário
          </span>
        </div>
        <button
          onClick={fetchVotacoes}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 font-bold uppercase text-sm border-2 border-black bg-white hover:bg-black hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Atualizar
        </button>
      </div>

      {/* ERRO */}
      {error && (
        <div className="card-brutal bg-brutal-red text-white mb-6">
          <p className="font-bold">Erro: {error}</p>
          <button
            onClick={fetchVotacoes}
            className="mt-2 underline font-bold"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="card-brutal text-center py-12">
          <Loader2 size={48} className="animate-spin mx-auto mb-4 text-gray-400" />
          <p className="font-bold text-gray-600">Buscando votações da Câmara...</p>
        </div>
      )}

      {/* LISTA DE VOTAÇÕES */}
      {!loading && votacoes.length > 0 && (
        <div className="space-y-4">
          {votacoes.map((votacao) => {
            const isSelected = selectedId === votacao.id;
            const shareData: VotacaoShareData | null = votacao.votos
              ? {
                  descricao: votacao.descricao,
                  data: new Date(votacao.data).toLocaleDateString("pt-BR"),
                  aprovado: votacao.aprovado,
                  votos: votacao.votos,
                }
              : null;

            return (
              <div key={votacao.id} className="card-brutal">
                {/* CABEÇALHO DA VOTAÇÃO */}
                <div
                  onClick={() => handleSelectVotacao(votacao.id)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      {/* Status */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 font-black text-xs uppercase border-2 border-black ${
                            votacao.aprovado
                              ? "bg-green-400 text-black"
                              : "bg-brutal-red text-white"
                          }`}
                        >
                          {votacao.aprovado ? "Aprovado" : "Rejeitado"}
                        </span>
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(votacao.data).toLocaleDateString("pt-BR")}
                        </span>
                        {votacao.votos && (
                          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                            <Users size={12} />
                            {votacao.votos.total} votos
                          </span>
                        )}
                      </div>

                      {/* Descrição */}
                      <h3 className="font-black text-lg uppercase leading-tight">
                        {votacao.descricao.length > 200
                          ? votacao.descricao.slice(0, 200) + "..."
                          : votacao.descricao}
                      </h3>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-3 shrink-0">
                      {shareData && <VotacaoShareButton data={shareData} />}
                      <button className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                        {isSelected ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Resultado resumido */}
                  {votacao.votos && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-green-100 border-2 border-black p-3 text-center">
                        <CheckCircle2 size={18} className="mx-auto mb-1 text-green-600" />
                        <p className="text-xs font-bold">SIM</p>
                        <p className="text-xl font-black">{votacao.votos.sim}</p>
                      </div>
                      <div className="bg-red-100 border-2 border-black p-3 text-center">
                        <XCircle size={18} className="mx-auto mb-1 text-red-600" />
                        <p className="text-xs font-bold">NÃO</p>
                        <p className="text-xl font-black">{votacao.votos.nao}</p>
                      </div>
                      <div className="bg-gray-100 border-2 border-black p-3 text-center">
                        <Minus size={18} className="mx-auto mb-1 text-gray-600" />
                        <p className="text-xs font-bold">TOTAL</p>
                        <p className="text-xl font-black">{votacao.votos.total}</p>
                      </div>
                    </div>
                  )}

                  {!votacao.votos && (
                    <p className="text-sm font-medium text-gray-500 italic">
                      Votação simbólica (sem registro nominal)
                    </p>
                  )}
                </div>

                {/* DETALHES EXPANDIDOS */}
                {isSelected && (
                  <div className="mt-6 pt-6 border-t-3 border-black">
                    {loadingDetalhes ? (
                      <div className="text-center py-8">
                        <Loader2 size={32} className="animate-spin mx-auto mb-2 text-gray-400" />
                        <p className="font-bold text-gray-600">Carregando detalhes...</p>
                      </div>
                    ) : detalhes ? (
                      <div className="space-y-6">
                        {/* GRAFICO DE VOTOS POR PARTIDO */}
                        {detalhes.votosPorPartido.length > 0 && (
                          <VotacaoBarChart
                            dados={detalhes.votosPorPartido}
                            titulo={votacao.descricao}
                            descricao={`Votacao de ${new Date(votacao.data).toLocaleDateString("pt-BR")}`}
                            aprovado={votacao.aprovado}
                          />
                        )}

                        {/* Votos por Partido - Grid */}
                        <div>
                          <h4 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
                            <TrendingUp size={20} />
                            Votos por Partido (Detalhado)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {detalhes.votosPorPartido.slice(0, 12).map((p) => (
                              <div
                                key={p.partido}
                                className="border-2 border-black dark:border-brutal-dark-border p-3 text-center bg-white dark:bg-brutal-dark-surface"
                              >
                                <span className="font-black text-lg block">{p.partido}</span>
                                <div className="flex justify-center gap-2 mt-2 text-xs font-bold">
                                  <span className="text-green-600">{p.sim}S</span>
                                  <span className="text-red-600">{p.nao}N</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Filtro de Deputados */}
                        <div>
                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            <h4 className="font-black text-lg uppercase flex items-center gap-2">
                              <Users size={20} />
                              Votos Individuais
                            </h4>
                            <select
                              value={filtroPartido}
                              onChange={(e) => setFiltroPartido(e.target.value)}
                              className="px-3 py-2 border-2 border-black font-bold text-sm bg-white"
                            >
                              <option value="todos">Todos os Partidos</option>
                              {partidosUnicos.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                            <span className="text-sm font-medium text-gray-500">
                              {votosFiltrados?.length} deputados
                            </span>
                          </div>

                          {/* Lista de Deputados */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                            {votosFiltrados?.slice(0, 60).map((v, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-3 p-3 border-2 border-black ${
                                  v.tipoVoto === "Sim"
                                    ? "bg-green-50"
                                    : v.tipoVoto === "Não"
                                    ? "bg-red-50"
                                    : "bg-gray-50"
                                }`}
                              >
                                <img
                                  src={v.deputado.foto}
                                  alt={v.deputado.nome}
                                  className="w-10 h-10 border-2 border-black object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://www.camara.leg.br/tema/img/icon-dep-sem-foto.png";
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm truncate">{v.deputado.nome}</p>
                                  <p className="text-xs text-gray-600">
                                    {v.deputado.partido}/{v.deputado.uf}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-1 text-xs font-black uppercase ${
                                    v.tipoVoto === "Sim"
                                      ? "bg-green-500 text-white"
                                      : v.tipoVoto === "Não"
                                      ? "bg-red-500 text-white"
                                      : "bg-gray-400 text-white"
                                  }`}
                                >
                                  {v.tipoVoto}
                                </span>
                              </div>
                            ))}
                          </div>
                          {votosFiltrados && votosFiltrados.length > 60 && (
                            <p className="text-sm font-medium text-gray-500 mt-3 text-center">
                              Mostrando 60 de {votosFiltrados.length} deputados
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="font-bold text-gray-600">
                          Não foi possível carregar os detalhes desta votação.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Algumas votações não possuem registro nominal dos votos.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SEM VOTAÇÕES */}
      {!loading && votacoes.length === 0 && !error && (
        <div className="card-brutal text-center py-12">
          <Vote size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="font-bold text-gray-600">Nenhuma votação encontrada no período.</p>
        </div>
      )}

      {/* FOOTER EXPLICATIVO */}
      <div className="mt-12 card-brutal bg-black text-white">
        <h3 className="font-black text-xl uppercase mb-4">Como Usar Esta Página</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <span className="text-brutal-red font-black text-2xl">1.</span>
            <p className="font-medium mt-2">
              Clique em uma votação para expandir e ver todos os detalhes
            </p>
          </div>
          <div>
            <span className="text-brutal-red font-black text-2xl">2.</span>
            <p className="font-medium mt-2">
              Filtre por partido para ver como cada bancada votou
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
      <div className="mt-8 bg-brutal-bg border-3 border-black p-6 text-center">
        <p className="font-black text-lg uppercase">
          Cobre seu deputado. Veja como ele votou. Dados públicos da Câmara dos Deputados.
        </p>
      </div>
    </main>
  );
}
