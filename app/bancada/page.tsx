import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BancadaPage() {
  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto bg-brutal-bg">
      <Link href="/" className="btn-brutal inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={20} /> Voltar para Home
      </Link>
      
      <h1 className="text-5xl font-black uppercase mb-8">Bancada: <span className="text-brutal-blue">Paraná</span></h1>
      
      <div className="card-brutal p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black text-white uppercase text-sm font-bold">
            <tr>
              <th className="p-4">Político</th>
              <th className="p-4">Partido</th>
              <th className="p-4 text-right">Gastos (Mês)</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            <tr className="border-b-2 border-black hover:bg-yellow-50">
              <td className="p-4 font-bold">Sergio Moro</td>
              <td className="p-4">UNIÃO</td>
              <td className="p-4 text-right font-bold text-red-600">R$ 28.400</td>
            </tr>
            <tr className="border-b-2 border-black hover:bg-yellow-50">
              <td className="p-4 font-bold">Gleisi Hoffmann</td>
              <td className="p-4">PT</td>
              <td className="p-4 text-right font-bold text-red-600">R$ 31.200</td>
            </tr>
             <tr className="border-b-2 border-black hover:bg-yellow-50">
              <td className="p-4 font-bold">Beto Richa</td>
              <td className="p-4">PSDB</td>
              <td className="p-4 text-right font-bold text-red-600">R$ 25.100</td>
            </tr>
            {/* Mais dados viriam da API depois */}
          </tbody>
        </table>
        <div className="p-4 bg-gray-100 border-t-3 border-black text-center font-bold text-xs uppercase">
           Dados simulados (API Integration Pending)
        </div>
      </div>
    </main>
  );
}