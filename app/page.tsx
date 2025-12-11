import Link from 'next/link';
import PowerPyramid from '../components/features/Pyramid/PowerPyramid';
import LegalDistinction from '../components/features/Dictionary/LegalDistinction';
import PoliticianInvoice from '../components/features/Cost/PoliticianInvoice';
import MBLDossier from '../components/features/Scandals/MBLDossier';
import Supremo from '../components/features/Scandals/Supremo';
import BolsaFamiliaBarbaridade from '../components/features/Blocks/BolsaFamiliaBarbaridade';
import TaxacaoBlusinha from '../components/features/Blocks/TaxacaoBlusinha';
import BandidolatriaBrasil from '../components/features/Blocks/BandidolatriaBrasil';
import GastosJanja from '../components/features/Blocks/GastosJanja';
import { MapPin, Search, AlertOctagon, HelpCircle, Siren, Banknote, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-12 max-w-7xl mx-auto flex flex-col gap-16">
      
      {/* HERO SECTION */}
      <header className="flex flex-col gap-4 border-b-3 border-black pb-8">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
          Política <span className="bg-brutal-yellow px-2 border-2 border-black shadow-hard inline-block transform -rotate-2">Sem Filtro</span>
        </h1>
        <p className="text-xl font-bold max-w-2xl">
          Dados crus para combater a idolatria. Entenda como Brasília funciona antes de brigar no grupo da família.
        </p>
      </header>

      {/* SECTION 1: ONBOARDING + TOP GASTADOR */}
      <section className="grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* SELETOR DE ESTADO */}
        <div className="bg-brutal-yellow border-3 border-black shadow-hard p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-8 h-8 text-black" />
            <h2 className="text-2xl font-bold uppercase">Fiscalize seu Estado</h2>
          </div>
          <p className="mb-6 font-medium">
            O sistema detecta sua região. Veja quem você colocou lá.
          </p>
          <div className="flex flex-col gap-4">
            <label className="font-bold text-sm">SELECIONE SEU ESTADO</label>
            <div className="flex gap-2">
              <select className="flex-1 border-3 border-black p-3 font-bold bg-white shadow-hard focus:outline-none cursor-pointer">
                <option value="PR">PR - Paraná</option>
                <option value="SP">SP - São Paulo</option>
                <option value="RJ">RJ - Rio de Janeiro</option>
                <option value="MG">MG - Minas Gerais</option>
              </select>
              <button className="bg-white border-3 border-black shadow-hard px-4 hover:bg-black hover:text-white transition-colors active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* CARD DESTAQUE: CAMPEÃO DE GASTOS */}
        <div className="flex flex-col gap-4 justify-center">
            
           {/* Card do Político - CORRIGIDO */}
           <div className="bg-white border-3 border-black shadow-hard p-6 flex flex-col gap-2 relative overflow-hidden group">
             {/* Badge de Campeão */}
             <div className="absolute top-0 right-0 bg-brutal-red text-white text-xs font-black px-3 py-1 border-l-3 border-b-3 border-black z-10">
               #1 MAIOR GASTADOR (MÊS)
             </div>

             <div className="flex justify-between items-start pt-2">
               <div>
                 <span className="text-xs font-bold bg-black text-white px-2 py-1 mb-2 inline-block">DEPUTADA / PR</span>
                 <p className="font-black text-3xl mt-1 uppercase">Gleisi Hoffmann</p>
                 <p className="text-sm font-bold text-gray-600">PT</p>
               </div>
               <Trophy size={40} className="text-brutal-yellow stroke-black stroke-[2px]" />
             </div>

             <div className="mt-4 border-t-2 border-dashed border-black pt-4 flex justify-between items-end">
               <div className="text-xs font-medium max-w-[50%]">
                 <span className="block font-bold mb-1">MAIOR DESPESA:</span>
                 Divulgação de Atividade Parlamentar
               </div>
               <div className="text-right">
                 <p className="text-xs font-bold uppercase">Uso da Cota (Set)</p>
                 {/* Agora bate com o valor da tabela da página interna */}
                 <p className="text-3xl font-black text-brutal-red leading-none">R$ 31.200</p>
               </div>
             </div>
           </div>

           <Link href="/bancada" className="bg-white border-3 border-black shadow-hard p-3 font-bold uppercase text-center hover:bg-black hover:text-white transition-colors active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
             Ver bancada completa &rarr;
           </Link>
        </div>
      </section>
      
      <hr className="border-t-3 border-black" />

      {/* SECTION: DOSSIÊ SUPREMO (NOVO) */}
      <Supremo />

      {/* SECTION: DOSSIÊ MBL (NOVO) */}
      <MBLDossier />

      <hr className="border-t-3 border-black" />

      {/* SECTION 2: A FATURA */}
      <section className="py-8">
        <PoliticianInvoice />
      </section>

      <hr className="border-t-3 border-black" />

      {/* SECTION 3: PIRÂMIDE */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <h2 className="text-4xl font-black uppercase">A Hierarquia</h2>
          <span className="font-bold bg-black text-white px-2 py-1 rotate-2">
            QUEM MANDA EM QUEM?
          </span>
        </div>
        <PowerPyramid />
      </section>

      {/* SECTION 4: DICIONÁRIO E CONTROVÉRSIAS */}
      <section className="grid md:grid-cols-2 gap-8">
         <div className="md:col-span-2 mb-4">
            <h2 className="text-4xl font-black uppercase">Dicionário de Escândalos</h2>
         </div>
         <LegalDistinction />
      </section>

      {/* SECTION 5: CURIOSIDADES E CONTROVÉRSIAS */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-blue-50 border-3 border-black shadow-hard p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b-3 border-black pb-2">
            <HelpCircle className="w-8 h-8 text-brutal-blue stroke-[3px]" />
            <h3 className="text-2xl font-black uppercase">Teoria vs. Prática</h3>
          </div>
          <div className="space-y-4">
            <div>
              <span className="bg-brutal-blue text-white font-bold px-2 py-1 text-sm">NA TEORIA (O GOLEIRO)</span>
              <p className="mt-2 font-medium leading-tight">
                O STF não deveria criar leis, apenas barrar as inconstitucionais.
              </p>
            </div>
            <div>
              <span className="bg-black text-white font-bold px-2 py-1 text-sm">NA PRÁTICA (O ARTILHEIRO)</span>
              <p className="mt-2 font-medium leading-tight">
                Diante da omissão do Congresso, o STF "legisla" sobre temas polêmicos, criando a crise institucional.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-3 border-brutal-red border-black shadow-hard p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b-3 border-black pb-2">
            <AlertOctagon className="w-8 h-8 text-brutal-red stroke-[3px]" />
            <h3 className="text-2xl font-black uppercase text-brutal-red">Hipocrisia Alert</h3>
          </div>
          <ul className="space-y-6">
             <li className="relative pl-4 border-l-4 border-black">
                <h4 className="font-black text-lg uppercase">O "Liberal" Intervencionista</h4>
                <p className="text-sm italic mb-1">Kim Kataguiri</p>
                <p className="text-sm font-medium">
                  Votou a favor da interferência estatal nos preços ("batizar gasolina") em ano eleitoral.
                </p>
             </li>
             <li className="relative pl-4 border-l-4 border-black">
                <h4 className="font-black text-lg uppercase">Críticos do Fundão</h4>
                <p className="text-sm italic mb-1">MBL</p>
                <p className="text-sm font-medium">
                  Usam verba partidária e estrutura do União Brasil após anos criticando o fundo.
                </p>
             </li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: O FUNDÃO */}
      <section className="relative mt-8">
        <div className="bg-brutal-red border-3 border-black border-b-0 shadow-none p-2 inline-block ml-4 transform -translate-y-1">
          <div className="flex items-center gap-2 text-white">
            <Siren className="animate-pulse" />
            <span className="font-black uppercase tracking-wide">O Roubo Legalizado</span>
          </div>
        </div>
        <div className="bg-white border-3 border-black shadow-hard p-0 overflow-hidden">
           <div className="grid md:grid-cols-12 min-h-[300px]">
              <div className="md:col-span-4 bg-brutal-bg p-8 flex flex-col justify-center border-b-3 md:border-b-0 md:border-r-3 border-black">
                 <Banknote size={48} className="mb-4 text-green-700" />
                 <h3 className="text-xl font-bold uppercase mb-2">Fundo Eleitoral 2024</h3>
                 <p className="text-5xl md:text-6xl font-black text-brutal-red tracking-tighter">
                   4.9 <br/>BI
                 </p>
              </div>
              <div className="md:col-span-8 p-8 bg-white relative">
                 <h3 className="text-xl font-bold uppercase mb-4">Isso compraria: <span className="text-brutal-blue">16.300 Ambulâncias</span></h3>
                 <div className="flex flex-wrap gap-1 opacity-80" style={{ maxHeight: '200px', overflow: 'hidden' }}>
                    {[...Array(140)].map((_, i) => (
                       <div key={i} title="1 Ambulância" className="w-4 h-4 bg-black hover:bg-brutal-red cursor-crosshair"></div>
                    ))}
                 </div>
                 <div className="mt-6 border-t-2 border-black pt-4">
                    <p className="text-sm font-bold leading-tight">
                      Financia campanhas de candidatos laranjas e santinhos de papel.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* NOVA SECTION: BLOCOS EXTRAS */}
      <hr className="border-t-3 border-black" />

        <section className="grid md:grid-cols-2 gap-8">
            <BolsaFamiliaBarbaridade />
            <TaxacaoBlusinha />
            <BandidolatriaBrasil />
            <GastosJanja />
        </section>

      <footer className="text-center py-8 border-t-3 border-black font-mono text-xs uppercase mt-12">
        <p>Projeto Open Source • Transparência Radical</p>
      </footer>

    </main>
  );
}