/**
 * Zod Schemas for Politics Brutal Data Layer
 * Validates and types all external API responses
 */

import { z } from "zod";

// ========== DEPUTY SCHEMAS ==========

export const DeputySchema = z.object({
    id: z.number(),
    nome: z.string(),
    siglaPartido: z.string(),
    siglaUf: z.string(),
    urlFoto: z.string().optional(),
});

export type Deputy = z.infer<typeof DeputySchema>;

export const DeputyWithCeapSchema = DeputySchema.extend({
    ano: z.number(),
    mes: z.number(),
    totalCeap: z.number(),
    tetoCeap: z.number(),
    status: z.enum(["Regular", "Irregular", "Sem teto UF"]),
});

export type DeputyWithCeap = z.infer<typeof DeputyWithCeapSchema>;

// ========== EXPENSE SCHEMAS ==========

export const ExpenseSchema = z.object({
    deputadoId: z.number(),
    valor: z.number(),
    valorLiquido: z.number(),
    dataDocumento: z.string().optional(),
    tipoDespesa: z.string().optional(),
    nomeFornecedor: z.string().optional(),
});

export type Expense = z.infer<typeof ExpenseSchema>;

// ========== VOTACAO SCHEMAS ==========

export const VotoSchema = z.object({
    tipoVoto: z.string(),
    dataRegistroVoto: z.string().optional(),
    deputado_: z.object({
        id: z.number(),
        nome: z.string(),
        siglaPartido: z.string(),
        siglaUf: z.string(),
        urlFoto: z.string().optional(),
    }),
});

export type Voto = z.infer<typeof VotoSchema>;

export const VotacaoResumoSchema = z.object({
    sim: z.number(),
    nao: z.number(),
    abstencao: z.number(),
    obstrucao: z.number(),
    outros: z.number(),
    total: z.number(),
});

export type VotacaoResumo = z.infer<typeof VotacaoResumoSchema>;

export const VotacaoSchema = z.object({
    id: z.string(),
    uri: z.string().optional(),
    data: z.string(),
    dataHoraRegistro: z.string().optional(),
    siglaOrgao: z.string().optional(),
    descricao: z.string(),
    aprovacao: z.number().optional(),
});

export type Votacao = z.infer<typeof VotacaoSchema>;

export const VotacaoComVotosSchema = VotacaoSchema.extend({
    votos: z.array(VotoSchema),
    resumo: VotacaoResumoSchema,
});

export type VotacaoComVotos = z.infer<typeof VotacaoComVotosSchema>;

// ========== CACHE SCHEMAS ==========

export const CacheEntrySchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        data: dataSchema,
        fetchedAt: z.string().datetime(),
        expiresAt: z.string().datetime(),
    });

export type CacheEntry<T> = {
    data: T;
    fetchedAt: string;
    expiresAt: string;
};

// ========== API RESPONSE WRAPPERS ==========

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean(),
        data: dataSchema.optional(),
        error: z.string().optional(),
        stale: z.boolean().optional(),
    });

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    stale?: boolean;
};
