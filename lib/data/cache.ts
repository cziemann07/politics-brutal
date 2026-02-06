/**
 * 🔒 SERVER-ONLY - Do not import in client components
 * 
 * Supabase-backed cache layer with stale fallback strategy.
 * Uses SUPABASE_SERVICE_ROLE_KEY for write access.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CacheError } from "./errors";

// ========== CONFIGURATION ==========

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Key format: {source}:{resource}:{params}
// Examples:
//   camara:deputados:uf=SP
//   camara:bancada:2024-09
//   camara:votacoes:2024-01-01_2024-01-31

// TTLs in milliseconds
export const TTL = {
    deputados: {
        fresh: 24 * 60 * 60 * 1000,      // 24h
        staleMax: 7 * 24 * 60 * 60 * 1000, // 7d
    },
    bancada: {
        fresh: 60 * 60 * 1000,            // 1h
        staleMax: 24 * 60 * 60 * 1000,    // 24h
    },
    votacoes: {
        fresh: 30 * 60 * 1000,            // 30min
        staleMax: 6 * 60 * 60 * 1000,     // 6h
    },
    despesas: {
        fresh: 24 * 60 * 60 * 1000,       // 24h
        staleMax: 7 * 24 * 60 * 60 * 1000, // 7d
    },
} as const;

export type CacheResource = keyof typeof TTL;

// ========== CACHE CLIENT ==========

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient | null {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        if (process.env.NODE_ENV !== "production") {
            console.warn("[Cache] Supabase not configured, cache disabled");
        }
        return null;
    }

    if (!supabaseAdmin) {
        supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
            auth: { persistSession: false },
        });
    }

    return supabaseAdmin;
}

// ========== CACHE INTERFACE ==========

interface CacheRow {
    key: string;
    data: unknown;
    fetched_at: string;
    expires_at: string;
}

/**
 * Build cache key from components
 */
export function buildCacheKey(
    source: string,
    resource: string,
    params?: Record<string, string | number>
): string {
    const paramStr = params
        ? Object.entries(params)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}=${v}`)
            .join("&")
        : "";
    return paramStr ? `${source}:${resource}:${paramStr}` : `${source}:${resource}`;
}

/**
 * Get cached data if fresh (< TTL)
 * Returns null if not found or expired
 */
export async function getCached<T>(
    key: string,
    resource: CacheResource
): Promise<{ data: T; fetchedAt: Date } | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    try {
        const { data: row, error } = await supabase
            .from("api_cache")
            .select("*")
            .eq("key", key)
            .single();

        if (error || !row) return null;

        const expiresAt = new Date(row.expires_at);
        const fetchedAt = new Date(row.fetched_at);

        // Check if still fresh
        if (expiresAt > new Date()) {
            return { data: row.data as T, fetchedAt };
        }

        return null;
    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error("[Cache] Get error:", err);
        }
        return null;
    }
}

/**
 * Get stale cached data (any age, up to staleMax)
 * Used as fallback when API is down
 */
export async function getStaleCached<T>(
    key: string,
    resource: CacheResource
): Promise<{ data: T; fetchedAt: Date } | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    try {
        const { data: row, error } = await supabase
            .from("api_cache")
            .select("*")
            .eq("key", key)
            .single();

        if (error || !row) return null;

        const fetchedAt = new Date(row.fetched_at);
        const staleMaxMs = TTL[resource].staleMax;
        const maxAge = new Date(Date.now() - staleMaxMs);

        // Check if within stale max age
        if (fetchedAt > maxAge) {
            return { data: row.data as T, fetchedAt };
        }

        return null;
    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error("[Cache] Get stale error:", err);
        }
        return null;
    }
}

/**
 * Store data in cache with TTL
 */
export async function setCached<T>(
    key: string,
    data: T,
    resource: CacheResource
): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + TTL[resource].fresh);

    try {
        const { error } = await supabase.from("api_cache").upsert(
            {
                key,
                data,
                fetched_at: now.toISOString(),
                expires_at: expiresAt.toISOString(),
            },
            { onConflict: "key" }
        );

        if (error) {
            throw new CacheError(`Failed to set cache: ${error.message}`, error);
        }

        if (process.env.NODE_ENV !== "production") {
            console.log(`[Cache] Set: ${key} (expires: ${expiresAt.toISOString()})`);
        }
    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error("[Cache] Set error:", err);
        }
        // Don't throw - cache failures shouldn't break the app
    }
}

/**
 * Invalidate a specific cache key
 */
export async function invalidateCache(key: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;

    try {
        await supabase.from("api_cache").delete().eq("key", key);
    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error("[Cache] Invalidate error:", err);
        }
    }
}

/**
 * Invalidate all cache keys matching a pattern (prefix)
 */
export async function invalidateCacheByPrefix(prefix: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;

    try {
        await supabase.from("api_cache").delete().like("key", `${prefix}%`);
    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error("[Cache] Invalidate by prefix error:", err);
        }
    }
}

/**
 * Cleanup expired cache entries (run periodically)
 */
export async function cleanupExpiredCache(): Promise<number> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return 0;

    try {
        // Delete entries older than max stale age (7 days)
        const maxStaleAge = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const { data, error } = await supabase
            .from("api_cache")
            .delete()
            .lt("fetched_at", maxStaleAge.toISOString())
            .select("key");

        if (error) throw error;

        return data?.length ?? 0;
    } catch (err) {
        if (process.env.NODE_ENV !== "production") {
            console.error("[Cache] Cleanup error:", err);
        }
        return 0;
    }
}
