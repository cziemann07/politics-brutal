"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Search, Filter, AlertCircle, User } from 'lucide-react';
import { MOCK_POLITICIANS } from '../../data/politicians'; 

export default function BancadaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("TODOS");

  // Lógica de filtragem
  const filteredPoliticians = MOCK_POLITICIANS.filter(pol => {
    const matchesSearch = pol.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pol.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = filterState === "TODOS" || pol.state === filterState;
    return matchesSearch && matchesState;
  });

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto bg-brutal-bg font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <Link href="/" className="btn-brutal inline-flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Voltar para Home
        </Link>
        <div className="flex flex-col items-end">
            <h1 className="text-4xl md:text-5xl font-black uppercase">Bancada Federal</h1>
            <p className="text-sm font-bold bg-black text-white px-2">DADOS DE SETEMBRO/2025</p>
        </div>
      </div>

      {/* FILTROS */}
      <section className="card-brutal mb-8 bg-white p-4 sticky top-4 z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                    type="text"
                    placeholder="Busque por nome ou partido..."
                    className="w-full border-3 border-black pl-10 p-2 font-bold focus:outline-none focus:bg-yellow-50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 border-3 border-black p-2 bg-gray-100 min-w-[200px]">
                <Filter size={20} />
                <select 
                    className="bg-transparent font-bold w-full focus:outline-none cursor-pointer"
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                >
                    <option value="TODOS">Todos os Estados</option>
                    <option value="PR">PR - Paraná</option>
                    <option value="SP">SP - São Paulo</option>
                    <option value="MG">MG - Minas Gerais</option>
                    <option value="RJ">RJ - Rio de Janeiro</option>
                </select>
            </div>
        </div>
      </section>
      
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoliticians.map((pol) => (
            // AQUI ESTÁ A MUDANÇA: O Link envolve o card inteiro
            <Link href={`/politico/${pol.id}`} key={pol.id} className="block group h-full">
                <div className="card-brutal p-0 flex flex-col hover:-translate-y-2 transition-transform h-full cursor-pointer relative">
                    
                    {/* Indicador visual de clique (Seta que aparece no hover) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 z-30 transition-opacity pointer-events-none">
                        <span className="bg-black text-white px-3 py-1 font-black uppercase shadow-hard text-sm border-2 border-white rotate-[-5deg]">
                            Ver Dossiê
                        </span>
                    </div>

                    {/* ÁREA DA FOTO BLINDADA */}
                    <div className="relative h-48 bg-gray-200 border-b-3 border-black overflow-hidden flex items-center justify-center group-hover:border-b-4">
                        
                        {/* Tarja de Status */}
                        <div className={`absolute top-2 right-2 px-2 py-1 border-2 border-black text-xs font-black uppercase z-10 shadow-hard
                            ${pol.status === 'Regular' ? 'bg-green-400 text-black' : 'bg-brutal-red text-white'}
                        `}>
                            {pol.status}
                        </div>
                        
                        <img 
                            src={pol.image} 
                            alt={pol.name}
                            className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                        />

                        {/* FALLBACK */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-300 -z-10">
                            <User size={64} className="text-gray-500 mb-2" />
                            <span className="font-black text-2xl text-gray-500 uppercase opacity-50">
                              {pol.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                            </span>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 bg-black text-white px-3 py-1 font-black text-xl border-t-3 border-r-3 border-black z-20">
                            {pol.party}
                        </div>
                    </div>

                    {/* CORPO DO CARD */}
                    <div className="p-4 flex-1 flex flex-col justify-between group-hover:bg-yellow-50 transition-colors">
                        <div>
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-black uppercase leading-none mb-1 group-hover:underline decoration-4 decoration-black">{pol.name}</h2>
                                <span className="font-mono font-bold text-gray-500">{pol.state}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-600 mb-4">{pol.role}</p>
                        </div>

                        <div className="bg-white border-2 border-black p-2 mt-2 group-hover:border-brutal-red group-hover:shadow-[2px_2px_0px_0px_#FF4444] transition-all">
                            <p className="text-xs font-bold uppercase mb-1 flex items-center gap-1">
                                <AlertCircle size={12} /> Cota Parlamentar (Mês)
                            </p>
                            <p className="text-2xl font-black text-right text-brutal-red tracking-tighter">
                                R$ {pol.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        ))}
      </div>
    </main>
  );
}