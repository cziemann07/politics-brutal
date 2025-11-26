import Link from 'next/link';
import { ArrowLeft, Scale, Siren, Share2 } from 'lucide-react';
import { MOCK_POLITICIANS } from '../../../data/politicians';
import PoliticianInvoice from '../../../components/features/Cost/PoliticianInvoice';

export default function PoliticianProfile({ params }: { params: { id: string } }) {
  const politician = MOCK_POLITICIANS.find(p => p.id === Number(params.id));

  if (!politician) {
    return <div className="p-10 font-bold text-center text-3xl">POLÍTICO NÃO ENCONTRADO (404)</div>;
  }

  return (
    <main className="min-h-screen bg-brutal-bg p-4 md:p-8 font-sans">
      
      <Link href="/bancada" className="btn-brutal inline-flex items-center gap-2 mb-8 text-sm">
        <ArrowLeft size={16} /> Voltar para Bancada
      </Link>

      <header className="grid md:grid-cols-12 gap-8 mb-12">
        <div className="md:col-span-4 flex flex-col gap-4">
            <div className="card-brutal p-2 rotate-1 bg-white">
                <img 
                    src={politician.image} 
                    className="w-full h-auto object-cover border-2 border-black aspect-square object-top"
                    alt={politician.name}
                />
            </div>
            <div className="text-center">
                <span className={`inline-block px-3 py-1 border-2 border-black font-black uppercase text-sm shadow-hard mb-2
                    ${politician.status === 'Regular' ? 'bg-green-400' : 'bg-brutal-red text-white'}
                `}>
                    Status: {politician.status}
                </span>
            </div>
        </div>

        <div className="md:col-span-8 flex flex-col justify-end">
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] mb-4">
                {politician.name}
            </h1>
            <div className="flex gap-4 font-bold text-xl uppercase border-y-3 border-black py-4">
                <span>{politician.party}</span>
                <span>•</span>
                <span>{politician.state}</span>
                <span>•</span>
                <span>{politician.role}</span>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
            <section className="card-brutal bg-white p-0 overflow-hidden">
                <div className="bg-black text-white p-4 flex items-center gap-2">
                    <Scale />
                    <h2 className="font-black uppercase text-xl">Ficha Corrida</h2>
                </div>
                <div className="p-6 space-y-4">
                    {politician.processes ? politician.processes.map((proc, idx) => (
                        <div key={idx} className="border-b-2 border-dashed border-gray-300 pb-2 last:border-0">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold uppercase text-brutal-red">{proc.title}</span>
                                <span className="text-xs bg-gray-200 px-2 py-0.5 font-bold border border-black">{proc.type}</span>
                            </div>
                            <p className="text-sm font-medium leading-tight text-gray-700">{proc.desc}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500 italic">Nenhum processo "marcante" cadastrado.</p>
                    )}
                </div>
            </section>

            <section className="relative">
                <div className="absolute -top-3 -left-2 bg-brutal-yellow border-2 border-black px-2 font-bold text-xs shadow-hard z-10">
                    FATOS & CONTROVÉRSIAS
                </div>
                <div className="card-brutal bg-yellow-50 border-brutal-red">
                    <ul className="list-disc pl-4 space-y-2 mt-2">
                        {politician.absurdities ? politician.absurdities.map((item, idx) => (
                            <li key={idx} className="font-bold text-sm leading-tight">{item}</li>
                        )) : (
                           <li className="text-sm">Sem polêmicas registradas recentemente.</li>
                        )}
                    </ul>
                </div>
            </section>
        </div>

        <div className="space-y-8">
            <div className="flex items-center gap-2 mb-2">
                <Siren className="text-brutal-red animate-pulse" />
                <h2 className="font-black uppercase text-2xl">Custo para o Bolso</h2>
            </div>
            
            <PoliticianInvoice 
                politicianData={{
                    name: politician.name,
                    expenses: politician.expenses,
                    advisors: politician.advisors || 25,
                    cabinet_budget: politician.cabinet_budget || 111000
                }} 
            />
            
            <button className="w-full btn-brutal bg-brutal-blue text-white flex justify-center gap-2">
                <Share2 size={20} /> Compartilhar ficha
            </button>
        </div>
      </div>
    </main>
  );
}