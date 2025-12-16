export default function MetodologiaPage() {
  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-4xl font-black uppercase mb-6">Metodologia</h1>

      <section className="mb-6">
        <h2 className="text-xl font-black mb-2">Fonte dos dados</h2>
        <p className="font-bold">
          Os dados apresentados neste projeto são obtidos por meio da API oficial de Dados Abertos
          da Câmara dos Deputados.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-black mb-2">Critério de classificação</h2>
        <p className="font-bold">
          Para cada parlamentar, é calculado o total mensal da Cota para Exercício da Atividade
          Parlamentar (CEAP).
        </p>
        <p className="font-bold mt-2">
          Um parlamentar é classificado como <strong>Irregular</strong> quando o valor total mensal
          da CEAP ultrapassa o teto máximo permitido para sua Unidade Federativa (UF), conforme
          normas da Câmara dos Deputados.
        </p>
        <p className="font-bold mt-2">
          Caso o valor permaneça dentro do limite, o parlamentar é classificado como{" "}
          <strong>Regular</strong>.
        </p>
      </section>

      <section>
        <p className="text-sm text-gray-600 font-bold">
          Este projeto não emite juízo de valor político, moral ou jurídico. A classificação é
          objetiva, matemática e baseada exclusivamente em dados oficiais.
        </p>
      </section>
    </main>
  );
}
