"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Filter, AlertCircle, User, X, Building2, Phone, Mail, Users, MapPin, BarChart3, Heart } from "lucide-react";
import { PartidoDistribuicaoChart, GastosCeapChart, OrientacaoIdeologicaChart } from "@/components/charts";
import { PedirExplicacaoButton } from "@/components/ui";

/* =========================
  TYPES (ALINHADOS AO BACKEND)
========================= */

type DeputadoBasicApi = {
  id: number;
  name: string;
  party: string;
  state: string;
  role: string;
  image?: string;
};

type DeputadoCeapApi = {
  id: number;
  expenses: number;
  teto: number;
  status: "Regular" | "Irregular";
};

type PoliticianCard = DeputadoBasicApi & {
  expenses?: number;
  teto?: number;
  status?: "Regular" | "Irregular";
};

type DeputadoDetalhes = {
  id: number;
  nome: string;
  nomeCivil: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  email: string;
  dataNascimento: string;
  escolaridade: string;
  sexo: string;
  municipioNascimento: string;
  ufNascimento: string;
  ultimoStatus: {
    situacao: string;
    condicaoEleitoral: string;
    gabinete?: {
      nome: string;
      predio: string;
      sala: string;
      andar: string;
      telefone: string;
      email: string;
    };
  };
};

type OrgaoDeputado = {
  idOrgao: number;
  siglaOrgao: string;
  nomeOrgao: string;
  titulo: string;
  dataInicio: string;
  dataFim: string | null;
};

/* =========================
   CONSTANTES (MÊS FECHADO)
========================= */

const ANO_PADRAO = 2024;
const MES_PADRAO = 9;

/* =========================
   COMPONENT
========================= */

export default function BancadaPage() {
  const [cards, setCards] = useState<PoliticianCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("TODOS");

  const [isLoadingBase, setIsLoadingBase] = useState(true);
  const [isLoadingCeap, setIsLoadingCeap] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados do modal
  const [selectedDeputado, setSelectedDeputado] = useState<PoliticianCard | null>(null);
  const [detalhes, setDetalhes] = useState<DeputadoDetalhes | null>(null);
  const [orgaos, setOrgaos] = useState<OrgaoDeputado[]>([]);
  const [isLoadingDetalhes, setIsLoadingDetalhes] = useState(false);

  // Estado para mostrar/ocultar graficos
  const [showCharts, setShowCharts] = useState(false);

  // Estado para favoritos
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  // Carregar favoritos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("deputados-favoritos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFavoritos(parsed.map((f: { id: number }) => f.id));
      } catch {
        setFavoritos([]);
      }
    }

    const premiumStatus = localStorage.getItem("vigilante-premium");
    setIsPremium(premiumStatus === "true");
  }, []);

  const limiteFavoritos = isPremium ? 5 : 1;
  const podeAdicionar = favoritos.length < limiteFavoritos;

  function toggleFavorito(deputado: PoliticianCard, e: React.MouseEvent) {
    e.stopPropagation(); // Evita abrir o modal

    const isFavorito = favoritos.includes(deputado.id);

    if (isFavorito) {
      // Remover dos favoritos
      const novosFavoritos = favoritos.filter((id) => id !== deputado.id);
      setFavoritos(novosFavoritos);

      const savedData = localStorage.getItem("deputados-favoritos");
      const parsed = savedData ? JSON.parse(savedData) : [];
      const updated = parsed.filter((f: { id: number }) => f.id !== deputado.id);
      localStorage.setItem("deputados-favoritos", JSON.stringify(updated));
    } else {
      // Adicionar aos favoritos
      if (!podeAdicionar) {
        alert(
          isPremium
            ? "Voce ja atingiu o limite de 5 deputados favoritos."
            : "No plano gratuito você pode favoritar apenas 1 deputado. Faça upgrade para o Vigilante PRO!"
        );
        return;
      }

      const novosFavoritos = [...favoritos, deputado.id];
      setFavoritos(novosFavoritos);

      const savedData = localStorage.getItem("deputados-favoritos");
      const parsed = savedData ? JSON.parse(savedData) : [];
      const novoFavorito = {
        id: deputado.id,
        nome: deputado.name,
        partido: deputado.party,
        estado: deputado.state,
        urlFoto: deputado.image || "",
      };
      localStorage.setItem("deputados-favoritos", JSON.stringify([...parsed, novoFavorito]));
    }
  }

  /* =========================
     1) CARREGA DEPUTADOS (RÁPIDO)
  ========================= */

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsLoadingBase(true);
        setError(null);

        const res = await fetch("/api/deputados?emExercicio=true");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error ?? "Erro ao buscar deputados");
        }

        if (Array.isArray(json?.dados) && alive) {
          setCards(json.dados);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        if (alive) setError(message);
      } finally {
        if (alive) setIsLoadingBase(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  /* =========================
     UFs DINÂMICAS
  ========================= */

  const availableUFs = useMemo(() => {
    return Array.from(new Set(cards.map((c) => c.state))).sort();
  }, [cards]);

  // Dados para o grafico de distribuicao por partido
  const dadosDistribuicaoPartido = useMemo(() => {
    const contagem: Record<string, number> = {};
    cards.forEach((c) => {
      contagem[c.party] = (contagem[c.party] || 0) + 1;
    });
    return Object.entries(contagem).map(([partido, quantidade]) => ({
      partido,
      quantidade,
    }));
  }, [cards]);

  // Dados para o grafico de gastos CEAP
  const dadosGastosCeap = useMemo(() => {
    return cards
      .filter((c) => typeof c.expenses === "number" && c.expenses > 0)
      .map((c) => ({
        id: c.id,
        nome: c.name,
        partido: c.party,
        estado: c.state,
        gastos: c.expenses || 0,
        teto: c.teto || 0,
        status: c.status || "Regular",
      }));
  }, [cards]);

  /* =========================
     FILTRO LOCAL
  ========================= */

  const filteredPoliticians = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return cards.filter((pol) => {
      const matchText =
        !term || pol.name.toLowerCase().includes(term) || pol.party.toLowerCase().includes(term);

      const matchUF = filterState === "TODOS" || pol.state === filterState;

      return matchText && matchUF;
    });
  }, [cards, searchTerm, filterState]);

  /* =========================
     2) ABRE MODAL COM DETALHES DO DEPUTADO
  ========================= */

  async function openDeputadoModal(deputado: PoliticianCard) {
    setSelectedDeputado(deputado);
    setIsLoadingDetalhes(true);
    setDetalhes(null);
    setOrgaos([]);

    try {
      // Busca detalhes e órgãos em paralelo diretamente da API da Câmara
      const [detalhesRes, orgaosRes] = await Promise.all([
        fetch(`https://dadosabertos.camara.leg.br/api/v2/deputados/${deputado.id}`),
        fetch(`https://dadosabertos.camara.leg.br/api/v2/deputados/${deputado.id}/orgaos?dataInicio=2023-01-01&itens=50`),
      ]);

      if (detalhesRes.ok) {
        const detalhesJson = await detalhesRes.json();
        setDetalhes(detalhesJson.dados);
      }

      if (orgaosRes.ok) {
        const orgaosJson = await orgaosRes.json();
        // Filtra apenas órgãos ativos (sem dataFim)
        const orgaosAtivos = (orgaosJson.dados || []).filter(
          (o: OrgaoDeputado) => !o.dataFim
        );
        setOrgaos(orgaosAtivos);
      }
    } catch (e) {
      console.error("Erro ao buscar detalhes:", e);
    } finally {
      setIsLoadingDetalhes(false);
    }
  }

  function closeModal() {
    setSelectedDeputado(null);
    setDetalhes(null);
    setOrgaos([]);
  }

  /* =========================
     3) CARREGA CEAP SOB DEMANDA
  ========================= */

  async function loadCeap() {
    try {
      setIsLoadingCeap(true);
      setError(null);

      const res = await fetch(`/api/bancada?ano=${ANO_PADRAO}&mes=${MES_PADRAO}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "Erro ao calcular CEAP");
      }

      const lista: DeputadoCeapApi[] = json?.dados ?? [];
      const byId = new Map(lista.map((d) => [d.id, d]));

      setCards((prev) =>
        prev.map((c) => {
          const ceap = byId.get(c.id);

          // deputado sem gasto → CEAP = 0, Regular
          if (!ceap) {
            return {
              ...c,
              expenses: 0,
              status: "Regular",
            };
          }

          return {
            ...c,
            expenses: ceap.expenses,
            teto: ceap.teto,
            status: ceap.status,
          };
        })
      );
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
    } finally {
      setIsLoadingCeap(false);
    }
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto bg-brutal-bg dark:bg-brutal-dark-bg">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-5xl font-black uppercase mb-2 dark:text-brutal-dark-text">Bancada Federal</h1>
        <p className="text-sm font-bold bg-black dark:bg-brutal-dark-accent text-white px-2 inline-block">DADOS DE 09/2024</p>
      </div>

      {/* ALERTAS */}
      {error && (
        <div className="mb-6 bg-brutal-red text-white p-3 font-bold border-3 border-black">
          Erro: {error}
        </div>
      )}

      {/* AÇÕES */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={loadCeap}
          disabled={isLoadingBase || isLoadingCeap}
          className="btn-brutal bg-black text-white font-black"
        >
          {isLoadingCeap ? "Calculando CEAP..." : "Carregar CEAP"}
        </button>

        <button
          onClick={() => setShowCharts(!showCharts)}
          disabled={isLoadingBase}
          className="btn-brutal bg-brutal-blue text-white font-black flex items-center gap-2"
        >
          <BarChart3 size={18} />
          {showCharts ? "Ocultar Graficos" : "Ver Graficos"}
        </button>
      </div>

      {/* GRAFICOS */}
      {showCharts && !isLoadingBase && (
        <div className="mb-8 space-y-6">
          {/* Gráfico de Orientação Ideológica */}
          <OrientacaoIdeologicaChart
            dados={dadosDistribuicaoPartido}
            titulo="Orientação Ideológica da Câmara"
          />

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Grafico de Distribuicao por Partido */}
            <PartidoDistribuicaoChart
              dados={dadosDistribuicaoPartido}
              titulo="Distribuição por Partido"
            />

            {/* Grafico de Gastos CEAP (so aparece se tiver dados) */}
            {dadosGastosCeap.length > 0 && (
              <GastosCeapChart
                dados={dadosGastosCeap}
                titulo="Top Gastadores CEAP"
                periodo="09/2024"
              />
            )}
          </div>

          {dadosGastosCeap.length === 0 && (
            <div className="card-brutal bg-brutal-yellow text-black p-4 text-center">
              <p className="font-bold">
                Clique em "Carregar CEAP" para ver o gráfico de gastos dos deputados.
              </p>
            </div>
          )}
        </div>
      )}

      {/* FILTROS */}
      <div className="card-brutal p-4 mb-8 bg-white dark:bg-brutal-dark-surface flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400 dark:text-brutal-dark-muted" size={18} />
          <input
            className="w-full border-3 border-black dark:border-brutal-dark-border pl-9 p-2 font-bold dark:bg-brutal-dark-bg dark:text-brutal-dark-text"
            placeholder="Buscar por nome ou partido"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="border-3 border-black dark:border-brutal-dark-border p-2 font-bold bg-gray-100 dark:bg-brutal-dark-bg dark:text-brutal-dark-text">
          <Filter size={16} />
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-transparent ml-2 dark:bg-brutal-dark-bg"
          >
            <option value="TODOS">Todos</option>
            {availableUFs.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRID */}
      {isLoadingBase ? (
        <div className="font-black text-xl dark:text-brutal-dark-text">Carregando deputados...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoliticians.map((pol) => {
            const isFavorito = favoritos.includes(pol.id);
            return (
            <div
              key={pol.id}
              onClick={() => openDeputadoModal(pol)}
              className="card-brutal hover:-translate-y-1 transition relative cursor-pointer dark:bg-brutal-dark-surface dark:border-brutal-dark-border"
            >
              {/* Botao de favoritar */}
              <button
                onClick={(e) => toggleFavorito(pol, e)}
                className={`absolute top-2 left-2 p-2 border-2 border-black dark:border-brutal-dark-border z-10 transition-all ${
                  isFavorito
                    ? "bg-brutal-red text-white"
                    : "bg-white dark:bg-brutal-dark-bg hover:bg-brutal-red hover:text-white"
                }`}
                title={isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart size={16} className={isFavorito ? "fill-current" : ""} />
              </button>

              {pol.status && (
                <div
                  className={`absolute top-2 right-2 px-2 py-1 text-xs font-black border-2 border-black
                  ${pol.status === "Regular" ? "bg-green-400" : "bg-brutal-red text-white"}`}
                >
                  {pol.status}
                </div>
              )}

              <div className="h-44 bg-gray-200 dark:bg-brutal-dark-bg flex items-center justify-center overflow-hidden">
                {pol.image ? (
                  <img src={pol.image} alt={pol.name} className="object-cover w-full h-full" />
                ) : (
                  <User size={48} className="text-gray-500 dark:text-brutal-dark-muted" />
                )}
              </div>

              <div className="p-4">
                <h2 className="font-black text-xl uppercase dark:text-brutal-dark-text">{pol.name}</h2>
                <p className="font-bold text-sm text-gray-600 dark:text-brutal-dark-muted">
                  {pol.party} · {pol.state}
                </p>

                <div className="mt-3 border-2 border-black dark:border-brutal-dark-border p-2">
                  <p className="text-xs font-bold flex gap-1 items-center dark:text-brutal-dark-text">
                    <AlertCircle size={12} /> CEAP
                  </p>

                  <p className="font-black text-xl text-brutal-red text-right">
                    R$ {pol.expenses?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>

                  {typeof pol.teto === "number" && (
                    <p className="text-[10px] text-right text-gray-500 dark:text-brutal-dark-muted">
                      Teto UF: R$ {pol.teto.toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}

      {/* MODAL DE DETALHES DO DEPUTADO */}
      {selectedDeputado && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-brutal-dark-surface border-4 border-black dark:border-brutal-dark-border shadow-hard dark:shadow-none max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="bg-black dark:bg-brutal-dark-accent text-white p-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="font-black text-xl uppercase">Detalhes do Deputado</h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white/20 transition"
              >
                <X size={24} />
              </button>
            </div>

            {isLoadingDetalhes ? (
              <div className="p-8 text-center">
                <div className="font-black text-xl dark:text-brutal-dark-text">Carregando detalhes...</div>
              </div>
            ) : (
              <div className="p-6">
                {/* Seção Principal: Foto + Info */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  {/* Foto Ampliada */}
                  <div className="md:col-span-1">
                    <div className="border-4 border-black dark:border-brutal-dark-border shadow-hard dark:shadow-none bg-gray-100 dark:bg-brutal-dark-bg">
                      {(detalhes?.urlFoto || selectedDeputado.image) ? (
                        <img
                          src={detalhes?.urlFoto || selectedDeputado.image}
                          alt={selectedDeputado.name}
                          className="w-full aspect-square object-cover object-top"
                        />
                      ) : (
                        <div className="w-full aspect-square flex items-center justify-center bg-gray-200">
                          <User size={80} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    {selectedDeputado.status && (
                      <div
                        className={`mt-3 px-3 py-2 text-center font-black uppercase border-3 border-black
                        ${selectedDeputado.status === "Regular" ? "bg-green-400" : "bg-brutal-red text-white"}`}
                      >
                        Status CEAP: {selectedDeputado.status}
                      </div>
                    )}
                  </div>

                  {/* Informações Básicas */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-3xl font-black uppercase leading-tight dark:text-brutal-dark-text">
                        {detalhes?.nome || selectedDeputado.name}
                      </h3>
                      {detalhes?.nomeCivil && detalhes.nomeCivil !== detalhes.nome && (
                        <p className="text-sm text-gray-500 dark:text-brutal-dark-muted">
                          Nome civil: {detalhes.nomeCivil}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="highlight-brutal px-3 py-1 font-black border-2">
                        {selectedDeputado.party}
                      </span>
                      <span className="bg-brutal-blue dark:bg-brutal-dark-accent text-white border-2 border-black dark:border-brutal-dark-accent px-3 py-1 font-black">
                        {selectedDeputado.state}
                      </span>
                      <span className="bg-gray-200 dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border px-3 py-1 font-bold dark:text-brutal-dark-text">
                        Deputado Federal
                      </span>
                    </div>

                    {detalhes && (
                      <div className="space-y-2 text-sm dark:text-brutal-dark-text">
                        {detalhes.municipioNascimento && (
                          <p className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-500 dark:text-brutal-dark-muted" />
                            <span>
                              Natural de <strong>{detalhes.municipioNascimento}</strong>
                              {detalhes.ufNascimento && ` - ${detalhes.ufNascimento}`}
                            </span>
                          </p>
                        )}
                        {detalhes.escolaridade && (
                          <p className="flex items-center gap-2">
                            <Users size={16} className="text-gray-500 dark:text-brutal-dark-muted" />
                            <span>Escolaridade: <strong>{detalhes.escolaridade}</strong></span>
                          </p>
                        )}
                        {detalhes.email && (
                          <p className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-500 dark:text-brutal-dark-muted" />
                            <a href={`mailto:${detalhes.email}`} className="text-brutal-blue dark:text-brutal-dark-accent underline">
                              {detalhes.email}
                            </a>
                          </p>
                        )}
                      </div>
                    )}

                    {/* CEAP */}
                    <div className="border-3 border-black dark:border-brutal-dark-border p-3 bg-gray-50 dark:bg-brutal-dark-bg">
                      <p className="text-xs font-bold flex gap-1 items-center mb-1 dark:text-brutal-dark-text">
                        <AlertCircle size={14} /> CEAP (09/2024)
                      </p>
                      <p className="font-black text-2xl text-brutal-red">
                        R$ {selectedDeputado.expenses?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
                      </p>
                      {typeof selectedDeputado.teto === "number" && (
                        <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">
                          Teto para {selectedDeputado.state}: R$ {selectedDeputado.teto.toLocaleString("pt-BR")}
                        </p>
                      )}
                    </div>

                    {/* Botao Pedir Explicacao */}
                    {selectedDeputado.expenses && selectedDeputado.expenses > 0 && (
                      <div className="mt-4">
                        <PedirExplicacaoButton
                          deputadoNome={selectedDeputado.name}
                          deputadoPartido={selectedDeputado.party}
                          deputadoEstado={selectedDeputado.state}
                          gastoValor={selectedDeputado.expenses}
                          gastoTipo="CEAP"
                          gastoPeriodo="em 09/2024"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Gabinete */}
                {detalhes?.ultimoStatus?.gabinete && (
                  <div className="border-3 border-black dark:border-brutal-dark-border mb-6">
                    <div className="bg-black dark:bg-brutal-dark-accent text-white px-4 py-2 flex items-center gap-2">
                      <Building2 size={18} />
                      <span className="font-black uppercase">Gabinete</span>
                    </div>
                    <div className="p-4 grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-brutal-dark-muted">Localização</p>
                        <p className="font-bold dark:text-brutal-dark-text">
                          {detalhes.ultimoStatus.gabinete.predio}, {detalhes.ultimoStatus.gabinete.andar}º andar, Sala {detalhes.ultimoStatus.gabinete.sala}
                        </p>
                      </div>
                      {detalhes.ultimoStatus.gabinete.telefone && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-brutal-dark-muted flex items-center gap-1">
                            <Phone size={12} /> Telefone
                          </p>
                          <p className="font-bold dark:text-brutal-dark-text">{detalhes.ultimoStatus.gabinete.telefone}</p>
                        </div>
                      )}
                      {detalhes.ultimoStatus.gabinete.email && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500 dark:text-brutal-dark-muted flex items-center gap-1">
                            <Mail size={12} /> E-mail do Gabinete
                          </p>
                          <a
                            href={`mailto:${detalhes.ultimoStatus.gabinete.email}`}
                            className="font-bold text-brutal-blue dark:text-brutal-dark-accent underline"
                          >
                            {detalhes.ultimoStatus.gabinete.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Órgãos/Comissões */}
                {orgaos.length > 0 && (
                  <div className="border-3 border-black dark:border-brutal-dark-border">
                    <div className="highlight-brutal px-4 py-2 border-b-3 border-black dark:border-brutal-dark-accent">
                      <span className="font-black uppercase">Comissões e Órgãos ({orgaos.length})</span>
                    </div>
                    <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                      {orgaos.map((orgao) => (
                        <div
                          key={`${orgao.idOrgao}-${orgao.titulo}`}
                          className="flex justify-between items-start border-b border-dashed border-gray-300 dark:border-brutal-dark-border pb-2 last:border-0"
                        >
                          <div>
                            <p className="font-bold text-sm dark:text-brutal-dark-text">{orgao.siglaOrgao}</p>
                            <p className="text-xs text-gray-600 dark:text-brutal-dark-muted">{orgao.nomeOrgao}</p>
                          </div>
                          <span className="text-xs bg-gray-200 dark:bg-brutal-dark-bg px-2 py-1 font-bold border border-black dark:border-brutal-dark-border dark:text-brutal-dark-text">
                            {orgao.titulo}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info sobre assessores */}
                <div className="mt-6 p-4 bg-gray-100 dark:bg-brutal-dark-bg border-2 border-dashed border-gray-400 dark:border-brutal-dark-border">
                  <p className="text-sm text-gray-600 dark:text-brutal-dark-muted">
                    <strong className="dark:text-brutal-dark-text">Nota:</strong> Cada gabinete de deputado pode ter até <strong className="dark:text-brutal-dark-text">25 secretários parlamentares</strong> (assessores),
                    com verba mensal de até <strong className="dark:text-brutal-dark-text">R$ 111.675,59</strong> para remuneração de pessoal.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
