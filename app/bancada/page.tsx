"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Filter, AlertCircle, User } from "lucide-react";

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
     2) CARREGA CEAP SOB DEMANDA
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
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto bg-brutal-bg">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-5xl font-black uppercase mb-2">Bancada Federal</h1>
        <p className="text-sm font-bold bg-black text-white px-2 inline-block">DADOS DE 09/2024</p>
      </div>

      {/* ALERTAS */}
      {error && (
        <div className="mb-6 bg-brutal-red text-white p-3 font-bold border-3 border-black">
          Erro: {error}
        </div>
      )}

      {/* AÇÕES */}
      <button
        onClick={loadCeap}
        disabled={isLoadingBase || isLoadingCeap}
        className="btn-brutal bg-black text-white font-black mb-6"
      >
        {isLoadingCeap ? "Calculando CEAP..." : "Carregar CEAP"}
      </button>

      {/* FILTROS */}
      <div className="card-brutal p-4 mb-8 bg-white flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            className="w-full border-3 border-black pl-9 p-2 font-bold"
            placeholder="Buscar por nome ou partido"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="border-3 border-black p-2 font-bold bg-gray-100">
          <Filter size={16} />
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-transparent ml-2"
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
        <div className="font-black text-xl">Carregando deputados…</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoliticians.map((pol) => (
            <Link key={pol.id} href={`/politico/${pol.id}`}>
              <div className="card-brutal hover:-translate-y-1 transition relative">
                {pol.status && (
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 text-xs font-black border-2 border-black
                    ${pol.status === "Regular" ? "bg-green-400" : "bg-brutal-red text-white"}`}
                  >
                    {pol.status}
                  </div>
                )}

                <div className="h-44 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {pol.image ? (
                    <img src={pol.image} alt={pol.name} className="object-cover w-full h-full" />
                  ) : (
                    <User size={48} className="text-gray-500" />
                  )}
                </div>

                <div className="p-4">
                  <h2 className="font-black text-xl uppercase">{pol.name}</h2>
                  <p className="font-bold text-sm text-gray-600">
                    {pol.party} · {pol.state}
                  </p>

                  <div className="mt-3 border-2 border-black p-2">
                    <p className="text-xs font-bold flex gap-1 items-center">
                      <AlertCircle size={12} /> CEAP
                    </p>

                    <p className="font-black text-xl text-brutal-red text-right">
                      R$ {pol.expenses?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>

                    {typeof pol.teto === "number" && (
                      <p className="text-[10px] text-right text-gray-500">
                        Teto UF: R$ {pol.teto.toLocaleString("pt-BR")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
