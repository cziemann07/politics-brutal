import { CheckCircle2, RefreshCcw } from "lucide-react";

export default function LegalDistinction() {
  return (
    <div className="grid md:grid-cols-2 gap-8 w-full">
      {/* CARD INOCENTE */}
      <div className="card-brutal border-green-700 dark:border-green-600 bg-green-50 dark:bg-green-900/30 relative group transition-transform hover:-translate-y-1">
        <div className="absolute -top-4 -left-4 bg-green-700 text-white font-bold px-3 py-1 border-2 border-black dark:border-green-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-none">
          ABSOLVIDO (MÉRITO)
        </div>
        <CheckCircle2 size={48} className="text-green-700 dark:text-green-500 mb-4 stroke-[3px]" />
        <h3 className="text-2xl font-black uppercase mb-2 dark:text-brutal-dark-text">Inocência Real</h3>
        <p className="text-sm font-bold border-b-2 border-black dark:border-brutal-dark-border pb-2 mb-2 dark:text-brutal-dark-text">
          "O Juiz leu as provas e viu que eu não fiz nada."
        </p>
        <p className="text-sm leading-tight dark:text-brutal-dark-muted">
          O processo foi até o fim. As provas foram analisadas e concluiu-se que o réu{" "}
          <span className="font-bold bg-green-200 dark:bg-green-700 dark:text-white px-1">não cometeu o crime</span>. Ele está livre
          porque é honesto no caso julgado.
        </p>
      </div>

      {/* CARD ANULADO */}
      <div className="card-brutal border-brutal-yellow dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 relative group transition-transform hover:-translate-y-1">
        <div className="absolute -top-4 -left-4 bg-brutal-yellow text-black font-bold px-3 py-1 border-2 border-black dark:border-yellow-600 shadow-[2px_2px_0px_0px_#000] dark:shadow-none">
          ANULADO (TÉCNICO)
        </div>
        <RefreshCcw size={48} className="text-black dark:text-yellow-500 mb-4 stroke-[3px]" />
        <h3 className="text-2xl font-black uppercase mb-2 dark:text-brutal-dark-text">Processo Anulado</h3>
        <p className="text-sm font-bold border-b-2 border-black dark:border-brutal-dark-border pb-2 mb-2 dark:text-brutal-dark-text">
          "O carteiro entregou o processo no endereço errado."
        </p>
        <p className="text-sm leading-tight dark:text-brutal-dark-muted">
          Houve um erro formal (ex: CEP errado, juiz errado). O jogo é resetado. As provas{" "}
          <span className="font-bold bg-yellow-200 dark:bg-yellow-700 dark:text-white px-1">não foram invalidadas</span>, apenas o
          processo. O crime pode ter ocorrido, mas prescreveu ou vai começar do zero.
        </p>
      </div>
    </div>
  );
}
