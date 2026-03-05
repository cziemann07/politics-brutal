/**
 * Benefícios e remuneração dos deputados federais brasileiros.
 *
 * Todos esses valores são fixados por lei ou ato da Mesa Diretora e se aplicam
 * igualmente a todos os 513 deputados. Não precisam de API — só mudam quando
 * há nova resolução.
 *
 * Fontes:
 * - Decreto Legislativo nº 276/2014 (subsídio)
 * - Ato da Mesa nº 43/2009 (CEAP)
 * - Ato da Mesa nº 72/1997 (verba de gabinete / secretários parlamentares)
 * - Lei nº 8.112/1990 + regulamentos internos (auxílios)
 */

export const BENEFICIOS_DEPUTADO = {
  /** Salário bruto mensal (subsídio parlamentar) */
  salarioBruto: 44008.52,

  /** Auxílio moradia mensal (quando não ocupa imóvel funcional) */
  auxilioMoradia: 4253.00,

  /** Verba de gabinete mensal — teto para remuneração dos secretários parlamentares */
  verbaGabinete: 111675.59,

  /** Limite máximo de secretários parlamentares (assessores) por gabinete */
  limiteAssessores: 25,

  /** Auxílio saúde — plano PARLAMD (gratuito para titular + dependentes) */
  auxilioSaude: "PARLAMD (plano de saúde gratuito)",

  /** Cota para passagens aéreas — incluída na CEAP, varia por UF */
  passagensAereas: "Incluso na CEAP (varia por UF)",

  /** Auxílio mudança — 1 salário na posse e 1 no fim do mandato */
  auxilioMudanca: 44008.52,

  /** Imóvel funcional em Brasília — opcional (quem usa não recebe auxílio moradia) */
  imovelFuncional: "Apartamento funcional em Brasília (opcional)",
} as const;

/** Labels legíveis para exibição na UI */
export const BENEFICIOS_LABELS: Record<keyof typeof BENEFICIOS_DEPUTADO, string> = {
  salarioBruto: "Salário Bruto",
  auxilioMoradia: "Auxílio Moradia",
  verbaGabinete: "Verba de Gabinete",
  limiteAssessores: "Limite de Assessores",
  auxilioSaude: "Auxílio Saúde",
  passagensAereas: "Passagens Aéreas",
  auxilioMudanca: "Auxílio Mudança",
  imovelFuncional: "Imóvel Funcional",
};

/** Benefícios que são valores numéricos em R$/mês */
export const BENEFICIOS_MONETARIOS_MENSAIS = {
  salarioBruto: BENEFICIOS_DEPUTADO.salarioBruto,
  auxilioMoradia: BENEFICIOS_DEPUTADO.auxilioMoradia,
  verbaGabinete: BENEFICIOS_DEPUTADO.verbaGabinete,
} as const;

/** Soma total do custo mensal fixo por deputado (sem CEAP) */
export const CUSTO_MENSAL_FIXO =
  BENEFICIOS_DEPUTADO.salarioBruto +
  BENEFICIOS_DEPUTADO.auxilioMoradia +
  BENEFICIOS_DEPUTADO.verbaGabinete;
