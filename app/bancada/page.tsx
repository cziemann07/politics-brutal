"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  AlertCircle,
  User,
  X,
  Building2,
  Phone,
  Mail,
  Users,
  MapPin,
  BarChart3,
  Heart,
  DollarSign,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { PartidoDistribuicaoChart, OrientacaoIdeologicaChart } from "@/components/charts";

/* =========================
  TYPES
========================= */

type DeputadoCard = {
  id: number;
  nome: string;
  nomeCivil: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  email: string | null;
  sexo: string;
  dataNascimento: string;
  ufNascimento: string;
  municipioNascimento: string;
  escolaridade: string;
  redeSocial: string[];
  situacao: string;
  condicaoEleitoral: string;
  gabinete: {
    nome: string;
    predio: string;
    sala: string;
    andar: string;
    telefone: string;
    email: string;
  } | null;
  totalAssessores: number;
};

type CeapData = {
  total: number;
  loading: boolean;
  loaded: boolean;
};

/* =========================
   CONSTANTES
========================= */

const SALARIO_BRUTO = 44008.52;
const AUXILIO_MORADIA = 4253.0;
const VERBA_GABINETE = 111675.59;
const LIMITE_ASSESSORES = 25;

function calcularIdade(dataNascimento: string): number | null {
  if (!dataNascimento) return null;
  const [ano, mes, dia] = dataNascimento.split("-").map(Number);
  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  const mesAtual = hoje.getMonth() + 1;
  if (mesAtual < mes || (mesAtual === mes && hoje.getDate() < dia)) {
    idade--;
  }
  return idade;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* =========================
   COMPONENT
========================= */

export default function BancadaPage() {
  const [deputados, setDeputados] = useState<DeputadoCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("TODOS");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [selectedDeputado, setSelectedDeputado] = useState<DeputadoCard | null>(null);
  const [ceapData, setCeapData] = useState<CeapData>({ total: 0, loading: false, loaded: false });

  // Gráficos
  const [showCharts, setShowCharts] = useState(false);

  // Favoritos
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [isPremium, setIsPremium] = useState(false);

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

  function toggleFavorito(dep: DeputadoCard, e: React.MouseEvent) {
    e.stopPropagation();
    const isFav = favoritos.includes(dep.id);

    if (isFav) {
      const novos = favoritos.filter((id) => id !== dep.id);
      setFavoritos(novos);
      const savedData = localStorage.getItem("deputados-favoritos");
      const parsed = savedData ? JSON.parse(savedData) : [];
      localStorage.setItem(
        "deputados-favoritos",
        JSON.stringify(parsed.filter((f: { id: number }) => f.id !== dep.id))
      );
    } else {
      if (!podeAdicionar) {
        alert(
          isPremium
            ? "Você já atingiu o limite de 5 deputados favoritos."
            : "No plano gratuito você pode favoritar apenas 1 deputado. Faça upgrade para o Vigilante PRO!"
        );
        return;
      }
      setFavoritos([...favoritos, dep.id]);
      const savedData = localStorage.getItem("deputados-favoritos");
      const parsed = savedData ? JSON.parse(savedData) : [];
      const novoFav = {
        id: dep.id,
        nome: dep.nome,
        partido: dep.siglaPartido,
        estado: dep.siglaUf,
        urlFoto: dep.urlFoto || "",
      };
      localStorage.setItem("deputados-favoritos", JSON.stringify([...parsed, novoFav]));
    }
  }

  /* === CARREGA DEPUTADOS DO JSON ESTÁTICO === */

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/deputados");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? "Erro ao buscar deputados");
        if (Array.isArray(json?.dados) && alive) {
          setDeputados(json.dados);
        }
      } catch (e: unknown) {
        if (alive) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  /* === UFs DINÂMICAS === */

  const availableUFs = useMemo(() => {
    return Array.from(new Set(deputados.map((c) => c.siglaUf))).sort();
  }, [deputados]);

  const dadosDistribuicaoPartido = useMemo(() => {
    const contagem: Record<string, number> = {};
    deputados.forEach((c) => {
      contagem[c.siglaPartido] = (contagem[c.siglaPartido] || 0) + 1;
    });
    return Object.entries(contagem).map(([partido, quantidade]) => ({
      partido,
      quantidade,
    }));
  }, [deputados]);

  /* === FILTRO === */

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return deputados.filter((dep) => {
      const matchText =
        !term ||
        dep.nome.toLowerCase().includes(term) ||
        dep.siglaPartido.toLowerCase().includes(term);
      const matchUF = filterState === "TODOS" || dep.siglaUf === filterState;
      return matchText && matchUF;
    });
  }, [deputados, searchTerm, filterState]);

  /* === MODAL === */

  function openModal(dep: DeputadoCard) {
    setSelectedDeputado(dep);
    setCeapData({ total: 0, loading: false, loaded: false });
  }

  function closeModal() {
    setSelectedDeputado(null);
    setCeapData({ total: 0, loading: false, loaded: false });
  }

  async function loadCeapIndividual(depId: number) {
    setCeapData({ total: 0, loading: true, loaded: false });
    try {
      const res = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/deputados/${depId}/despesas?ano=2024&itens=100&ordem=ASC&ordenarPor=ano`
      );
      const json = await res.json();
      let total = 0;
      for (const row of json.dados ?? []) {
        const v = typeof row.valorLiquido === "string" ? Number(row.valorLiquido) : row.valorLiquido;
        if (Number.isFinite(v)) total += v;
      }

      // Check for more pages
      let nextUrl = json.links?.find((l: { rel: string; href: string }) => l.rel === "next")?.href;
      while (nextUrl) {
        const nextRes = await fetch(nextUrl);
        const nextJson = await nextRes.json();
        for (const row of nextJson.dados ?? []) {
          const v = typeof row.valorLiquido === "string" ? Number(row.valorLiquido) : row.valorLiquido;
          if (Number.isFinite(v)) total += v;
        }
        nextUrl = nextJson.links?.find((l: { rel: string; href: string }) => l.rel === "next")?.href;
        if ((nextJson.dados?.length ?? 0) === 0) break;
      }

      setCeapData({ total: Math.round(total * 100) / 100, loading: false, loaded: true });
    } catch {
      setCeapData({ total: 0, loading: false, loaded: true });
    }
  }

  /* === RENDER === */

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto bg-brutal-bg dark:bg-brutal-dark-bg">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-5xl font-black uppercase mb-2 dark:text-brutal-dark-text">
          Bancada Federal
        </h1>
        <p className="text-sm font-bold bg-black dark:bg-brutal-dark-accent text-white px-2 inline-block">
          513 DEPUTADOS EM EXERCÍCIO
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-brutal-red text-white p-3 font-bold border-3 border-black">
          Erro: {error}
        </div>
      )}

      {/* AÇÕES */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setShowCharts(!showCharts)}
          disabled={isLoading}
          className="btn-brutal bg-brutal-blue text-white font-black flex items-center gap-2"
        >
          <BarChart3 size={18} />
          {showCharts ? "Ocultar Gráficos" : "Ver Gráficos"}
        </button>
      </div>

      {/* GRÁFICOS */}
      {showCharts && !isLoading && (
        <div className="mb-8 space-y-6">
          <OrientacaoIdeologicaChart
            dados={dadosDistribuicaoPartido}
            titulo="Orientação Ideológica da Câmara"
          />
          <PartidoDistribuicaoChart
            dados={dadosDistribuicaoPartido}
            titulo="Distribuição por Partido"
          />
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
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
      </div>

      {/* RESUMO DE BENEFÍCIOS */}
      <div className="card-brutal p-4 mb-8 bg-brutal-yellow dark:bg-brutal-dark-surface border-3 border-black dark:border-brutal-dark-border">
        <h3 className="font-black text-sm uppercase mb-3 dark:text-brutal-dark-text">
          Custo fixo mensal por deputado (igual para todos)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-brutal-dark-muted">Salário Bruto</p>
            <p className="font-black dark:text-brutal-dark-text">{formatCurrency(SALARIO_BRUTO)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-brutal-dark-muted">Auxílio Moradia</p>
            <p className="font-black dark:text-brutal-dark-text">{formatCurrency(AUXILIO_MORADIA)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-brutal-dark-muted">Verba de Gabinete</p>
            <p className="font-black dark:text-brutal-dark-text">{formatCurrency(VERBA_GABINETE)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-brutal-dark-muted">Custo Fixo Total</p>
            <p className="font-black text-brutal-red">
              {formatCurrency(SALARIO_BRUTO + AUXILIO_MORADIA + VERBA_GABINETE)}
            </p>
          </div>
        </div>
      </div>

      {/* GRID */}
      {isLoading ? (
        <div className="font-black text-xl dark:text-brutal-dark-text">Carregando deputados...</div>
      ) : (
        <>
          <p className="text-sm font-bold mb-4 dark:text-brutal-dark-muted">
            {filtered.length} deputados encontrados
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dep) => {
              const isFav = favoritos.includes(dep.id);
              const idade = calcularIdade(dep.dataNascimento);

              return (
                <div
                  key={dep.id}
                  onClick={() => openModal(dep)}
                  className="card-brutal hover:-translate-y-1 transition relative cursor-pointer dark:bg-brutal-dark-surface dark:border-brutal-dark-border"
                >
                  {/* Favorito */}
                  <button
                    onClick={(e) => toggleFavorito(dep, e)}
                    className={`absolute top-2 left-2 p-2 border-2 border-black dark:border-brutal-dark-border z-10 transition-all ${
                      isFav
                        ? "bg-brutal-red text-white"
                        : "bg-white dark:bg-brutal-dark-bg hover:bg-brutal-red hover:text-white"
                    }`}
                    title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Heart size={16} className={isFav ? "fill-current" : ""} />
                  </button>

                  {/* Assessores badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 text-xs font-black border-2 border-black bg-brutal-blue text-white dark:border-brutal-dark-border">
                    {dep.totalAssessores}/{LIMITE_ASSESSORES} assessores
                  </div>

                  {/* Foto */}
                  <div className="h-44 bg-gray-200 dark:bg-brutal-dark-bg flex items-center justify-center overflow-hidden">
                    {dep.urlFoto ? (
                      <img src={dep.urlFoto} alt={dep.nome} className="object-cover w-full h-full" />
                    ) : (
                      <User size={48} className="text-gray-500 dark:text-brutal-dark-muted" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h2 className="font-black text-xl uppercase dark:text-brutal-dark-text">
                      {dep.nome}
                    </h2>
                    <p className="font-bold text-sm text-gray-600 dark:text-brutal-dark-muted">
                      {dep.siglaPartido} · {dep.siglaUf}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {idade && (
                        <span className="bg-gray-100 dark:bg-brutal-dark-bg border border-black dark:border-brutal-dark-border px-2 py-1 font-bold dark:text-brutal-dark-text">
                          {idade} anos
                        </span>
                      )}
                      <span className="bg-gray-100 dark:bg-brutal-dark-bg border border-black dark:border-brutal-dark-border px-2 py-1 font-bold dark:text-brutal-dark-text">
                        {dep.sexo === "M" ? "Masculino" : dep.sexo === "F" ? "Feminino" : dep.sexo}
                      </span>
                      {dep.escolaridade && (
                        <span className="bg-gray-100 dark:bg-brutal-dark-bg border border-black dark:border-brutal-dark-border px-2 py-1 font-bold dark:text-brutal-dark-text">
                          {dep.escolaridade}
                        </span>
                      )}
                    </div>

                    {/* Custo fixo */}
                    <div className="mt-3 border-2 border-black dark:border-brutal-dark-border p-2">
                      <p className="text-xs font-bold flex gap-1 items-center dark:text-brutal-dark-text">
                        <DollarSign size={12} /> Salário mensal
                      </p>
                      <p className="font-black text-lg text-right dark:text-brutal-dark-text">
                        {formatCurrency(SALARIO_BRUTO)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* MODAL */}
      {selectedDeputado && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-brutal-dark-surface border-4 border-black dark:border-brutal-dark-border shadow-hard dark:shadow-none max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-black dark:bg-brutal-dark-accent text-white p-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="font-black text-xl uppercase">Detalhes do Deputado</h2>
              <button onClick={closeModal} className="p-1 hover:bg-white/20 transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Foto + Info */}
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-1">
                  <div className="border-4 border-black dark:border-brutal-dark-border shadow-hard dark:shadow-none bg-gray-100 dark:bg-brutal-dark-bg">
                    {selectedDeputado.urlFoto ? (
                      <img
                        src={selectedDeputado.urlFoto}
                        alt={selectedDeputado.nome}
                        className="w-full aspect-square object-cover object-top"
                      />
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center bg-gray-200">
                        <User size={80} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-3xl font-black uppercase leading-tight dark:text-brutal-dark-text">
                      {selectedDeputado.nome}
                    </h3>
                    {selectedDeputado.nomeCivil && selectedDeputado.nomeCivil !== selectedDeputado.nome && (
                      <p className="text-sm text-gray-500 dark:text-brutal-dark-muted">
                        Nome civil: {selectedDeputado.nomeCivil}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="highlight-brutal px-3 py-1 font-black border-2">
                      {selectedDeputado.siglaPartido}
                    </span>
                    <span className="bg-brutal-blue dark:bg-brutal-dark-accent text-white border-2 border-black dark:border-brutal-dark-accent px-3 py-1 font-black">
                      {selectedDeputado.siglaUf}
                    </span>
                    <span className="bg-gray-200 dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border px-3 py-1 font-bold dark:text-brutal-dark-text">
                      {selectedDeputado.condicaoEleitoral || "Deputado Federal"}
                    </span>
                  </div>

                  {/* Dados pessoais */}
                  <div className="space-y-2 text-sm dark:text-brutal-dark-text">
                    {selectedDeputado.dataNascimento && (
                      <p className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500 dark:text-brutal-dark-muted" />
                        <span>
                          {new Date(selectedDeputado.dataNascimento + "T00:00:00").toLocaleDateString("pt-BR")}
                          {" "}({calcularIdade(selectedDeputado.dataNascimento)} anos)
                        </span>
                      </p>
                    )}
                    {selectedDeputado.municipioNascimento && (
                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-500 dark:text-brutal-dark-muted" />
                        <span>
                          Natural de <strong>{selectedDeputado.municipioNascimento}</strong>
                          {selectedDeputado.ufNascimento && ` - ${selectedDeputado.ufNascimento}`}
                        </span>
                      </p>
                    )}
                    {selectedDeputado.escolaridade && (
                      <p className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-gray-500 dark:text-brutal-dark-muted" />
                        <span>Escolaridade: <strong>{selectedDeputado.escolaridade}</strong></span>
                      </p>
                    )}
                    {selectedDeputado.email && (
                      <p className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-500 dark:text-brutal-dark-muted" />
                        <a href={`mailto:${selectedDeputado.email}`} className="text-brutal-blue dark:text-brutal-dark-accent underline">
                          {selectedDeputado.email}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Assessores */}
              <div className="border-3 border-black dark:border-brutal-dark-border mb-6">
                <div className="bg-brutal-blue text-white px-4 py-2 flex items-center gap-2">
                  <Users size={18} />
                  <span className="font-black uppercase">Assessores (Secretários Parlamentares)</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-4xl font-black dark:text-brutal-dark-text">
                        {selectedDeputado.totalAssessores}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-brutal-dark-muted">
                        de {LIMITE_ASSESSORES} permitidos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-brutal-dark-muted">Verba mensal de gabinete</p>
                      <p className="font-black text-lg dark:text-brutal-dark-text">
                        {formatCurrency(VERBA_GABINETE)}
                      </p>
                    </div>
                  </div>
                  {/* Barra visual */}
                  <div className="w-full bg-gray-200 dark:bg-brutal-dark-bg border-2 border-black dark:border-brutal-dark-border h-6">
                    <div
                      className={`h-full transition-all ${
                        selectedDeputado.totalAssessores >= LIMITE_ASSESSORES
                          ? "bg-brutal-red"
                          : selectedDeputado.totalAssessores >= 20
                          ? "bg-brutal-yellow"
                          : "bg-green-400"
                      }`}
                      style={{ width: `${(selectedDeputado.totalAssessores / LIMITE_ASSESSORES) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-brutal-dark-muted mt-1">
                    {((selectedDeputado.totalAssessores / LIMITE_ASSESSORES) * 100).toFixed(0)}% do limite utilizado
                  </p>
                </div>
              </div>

              {/* Benefícios */}
              <div className="border-3 border-black dark:border-brutal-dark-border mb-6">
                <div className="highlight-brutal px-4 py-2 border-b-3 border-black flex items-center gap-2">
                  <DollarSign size={18} />
                  <span className="font-black uppercase">Remuneração e Benefícios</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-brutal-dark-border pb-2">
                    <span className="font-bold dark:text-brutal-dark-text">Salário Bruto</span>
                    <span className="font-black dark:text-brutal-dark-text">{formatCurrency(SALARIO_BRUTO)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-brutal-dark-border pb-2">
                    <span className="font-bold dark:text-brutal-dark-text">Auxílio Moradia</span>
                    <span className="font-black dark:text-brutal-dark-text">{formatCurrency(AUXILIO_MORADIA)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-brutal-dark-border pb-2">
                    <span className="font-bold dark:text-brutal-dark-text">Verba de Gabinete</span>
                    <span className="font-black dark:text-brutal-dark-text">{formatCurrency(VERBA_GABINETE)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-gray-300 dark:border-brutal-dark-border pb-2">
                    <span className="font-bold dark:text-brutal-dark-text">Saúde</span>
                    <span className="font-bold text-sm dark:text-brutal-dark-text">PARLAMD (gratuito)</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-black text-lg dark:text-brutal-dark-text">CUSTO FIXO MENSAL</span>
                    <span className="font-black text-lg text-brutal-red">
                      {formatCurrency(SALARIO_BRUTO + AUXILIO_MORADIA + VERBA_GABINETE)}
                    </span>
                  </div>
                </div>
              </div>

              {/* CEAP sob demanda */}
              <div className="border-3 border-black dark:border-brutal-dark-border mb-6">
                <div className="bg-black dark:bg-brutal-dark-accent text-white px-4 py-2 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="font-black uppercase">CEAP — Cota Parlamentar (2024)</span>
                </div>
                <div className="p-4">
                  {!ceapData.loaded && !ceapData.loading && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-brutal-dark-muted mb-3">
                        Reembolso de despesas de trabalho (passagens, alimentação, escritório, etc.)
                      </p>
                      <button
                        onClick={() => loadCeapIndividual(selectedDeputado.id)}
                        className="btn-brutal bg-black text-white font-black"
                      >
                        Carregar Gastos CEAP
                      </button>
                    </div>
                  )}
                  {ceapData.loading && (
                    <p className="font-black text-center dark:text-brutal-dark-text">Carregando...</p>
                  )}
                  {ceapData.loaded && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-brutal-dark-muted mb-1">Total gasto em 2024</p>
                      <p className="font-black text-3xl text-brutal-red">
                        {formatCurrency(ceapData.total)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gabinete */}
              {selectedDeputado.gabinete && (
                <div className="border-3 border-black dark:border-brutal-dark-border mb-6">
                  <div className="bg-black dark:bg-brutal-dark-accent text-white px-4 py-2 flex items-center gap-2">
                    <Building2 size={18} />
                    <span className="font-black uppercase">Gabinete</span>
                  </div>
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-brutal-dark-muted">Localização</p>
                      <p className="font-bold dark:text-brutal-dark-text">
                        Prédio {selectedDeputado.gabinete.predio}, {selectedDeputado.gabinete.andar}º andar, Sala {selectedDeputado.gabinete.sala}
                      </p>
                    </div>
                    {selectedDeputado.gabinete.telefone && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-brutal-dark-muted flex items-center gap-1">
                          <Phone size={12} /> Telefone
                        </p>
                        <p className="font-bold dark:text-brutal-dark-text">{selectedDeputado.gabinete.telefone}</p>
                      </div>
                    )}
                    {selectedDeputado.gabinete.email && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 dark:text-brutal-dark-muted flex items-center gap-1">
                          <Mail size={12} /> E-mail do Gabinete
                        </p>
                        <a
                          href={`mailto:${selectedDeputado.gabinete.email}`}
                          className="font-bold text-brutal-blue dark:text-brutal-dark-accent underline"
                        >
                          {selectedDeputado.gabinete.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Redes sociais */}
              {selectedDeputado.redeSocial && selectedDeputado.redeSocial.length > 0 && (
                <div className="border-3 border-black dark:border-brutal-dark-border">
                  <div className="bg-gray-200 dark:bg-brutal-dark-bg px-4 py-2 border-b-3 border-black dark:border-brutal-dark-border">
                    <span className="font-black uppercase dark:text-brutal-dark-text">Redes Sociais</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {selectedDeputado.redeSocial.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-brutal-blue dark:text-brutal-dark-accent underline truncate"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
