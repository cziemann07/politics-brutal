/**
 * 🔒 SERVER-ONLY - Uses SUPABASE_SERVICE_ROLE_KEY
 * 
 * Typed wrapper for Câmara dos Deputados API
 * Validates responses with Zod and uses cache with stale fallback
 */

import { z } from "zod";
import * as camara from "../camara";
import {
    DeputySchema,
    DeputyWithCeapSchema,
    VotacaoSchema,
    VotoSchema,
    type Deputy,
    type DeputyWithCeap,
    type Votacao,
    type Voto,
} from "./schemas";
import {
    CamaraApiError,
    ValidationError,
    type FetchResult,
    freshResult,
    staleResult,
    errorResult,
} from "./errors";
import {
    getCached,
    getStaleCached,
    setCached,
    buildCacheKey,
    type CacheResource,
} from "./cache";

// ========== FETCH WITH CACHE ==========

/**
 * Generic cached fetch with stale fallback
 * Strategy: cache → API → stale → error
 */
async function fetchWithCache<T>(
    cacheKey: string,
    resource: CacheResource,
    fetcher: () => Promise<T>,
    validator: z.ZodSchema<T>
): Promise<FetchResult<T>> {
    // 1. Try fresh cache
    const cached = await getCached<T>(cacheKey, resource);
    if (cached) {
        try {
            const validated = validator.parse(cached.data);
            return freshResult(validated);
        } catch {
            // Cache data invalid, continue to fetch
        }
    }

    // 2. Try API fetch
    try {
        const rawData = await fetcher();
        const validated = validator.parse(rawData);

        // Store in cache (fire and forget)
        setCached(cacheKey, validated, resource).catch(() => { });

        return freshResult(validated);
    } catch (apiError) {
        // 3. API failed - try stale cache
        const stale = await getStaleCached<T>(cacheKey, resource);
        if (stale) {
            try {
                const validated = validator.parse(stale.data);
                return staleResult(validated, stale.fetchedAt);
            } catch {
                // Stale data also invalid
            }
        }

        // 4. No stale available - return error
        const error =
            apiError instanceof Error
                ? new CamaraApiError(apiError.message, apiError)
                : new CamaraApiError("Unknown API error", apiError);

        return errorResult(error);
    }
}

// ========== DEPUTIES ==========

/**
 * List all deputies with optional UF filter
 */
export async function listDeputies(params?: {
    uf?: string;
}): Promise<FetchResult<Deputy[]>> {
    const cacheKey = buildCacheKey("camara", "deputados", params);

    return fetchWithCache(
        cacheKey,
        "deputados",
        () => camara.listDeputies(params),
        z.array(DeputySchema)
    );
}

// ========== BANCADA (CEAP) ==========

/**
 * Build bancada dataset with CEAP totals
 */
export async function buildBancadaDataset(params: {
    ano: number;
    mes: number;
    uf?: string;
}): Promise<FetchResult<DeputyWithCeap[]>> {
    const cacheKey = buildCacheKey("camara", "bancada", {
        ano: params.ano,
        mes: params.mes,
        ...(params.uf ? { uf: params.uf } : {}),
    });

    return fetchWithCache(
        cacheKey,
        "bancada",
        () => camara.buildBancadaDataset(params),
        z.array(DeputyWithCeapSchema)
    );
}

// ========== VOTAÇÕES ==========

/**
 * List recent votações
 */
export async function listVotacoes(params?: {
    dataInicio?: string;
    dataFim?: string;
    itens?: number;
}): Promise<FetchResult<Votacao[]>> {
    const cacheKey = buildCacheKey("camara", "votacoes", {
        inicio: params?.dataInicio ?? "default",
        fim: params?.dataFim ?? "default",
        itens: params?.itens ?? 30,
    });

    return fetchWithCache(
        cacheKey,
        "votacoes",
        () => camara.listVotacoes(params),
        z.array(VotacaoSchema)
    );
}

/**
 * Get votos for a specific votação
 */
export async function getVotacaoVotos(
    votacaoId: string
): Promise<FetchResult<Voto[]>> {
    const cacheKey = buildCacheKey("camara", "votos", { id: votacaoId });

    return fetchWithCache(
        cacheKey,
        "votacoes",
        () => camara.getVotacaoVotos(votacaoId),
        z.array(VotoSchema)
    );
}

// ========== EXPENSES ==========

/**
 * Get CEAP total for a single deputy
 */
export async function ceapTotalForDeputy(params: {
    id: number;
    ano: number;
    mes: number;
}): Promise<FetchResult<number>> {
    const cacheKey = buildCacheKey("camara", "despesas", {
        deputado: params.id,
        ano: params.ano,
        mes: params.mes,
    });

    return fetchWithCache(
        cacheKey,
        "despesas",
        () => camara.ceapTotalForDeputy(params),
        z.number()
    );
}

// ========== UTILITY ==========

/**
 * Unwrap FetchResult, throwing on error
 * Use when you need the data or want to handle errors upstream
 */
export function unwrap<T>(result: FetchResult<T>): T {
    if (!result.success) {
        throw result.error;
    }
    return result.data;
}

/**
 * Unwrap FetchResult with default value on error
 */
export function unwrapOr<T>(result: FetchResult<T>, defaultValue: T): T {
    if (!result.success) {
        return defaultValue;
    }
    return result.data;
}
