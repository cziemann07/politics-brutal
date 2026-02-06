/**
 * Custom Errors for Data Layer
 * 
 * Fallback Strategy: cache → stale → error
 * 1. Try fresh cache (< TTL)
 * 2. If miss: fetch from API
 * 3. If API fails: return stale cache (any age)
 * 4. If no stale: throw CamaraApiError
 */

export class DataLayerError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = "DataLayerError";
    }
}

export class CamaraApiError extends DataLayerError {
    constructor(message: string, cause?: unknown) {
        super(message, "CAMARA_API_ERROR", cause);
        this.name = "CamaraApiError";
    }
}

export class CacheError extends DataLayerError {
    constructor(message: string, cause?: unknown) {
        super(message, "CACHE_ERROR", cause);
        this.name = "CacheError";
    }
}

export class ValidationError extends DataLayerError {
    constructor(message: string, cause?: unknown) {
        super(message, "VALIDATION_ERROR", cause);
        this.name = "ValidationError";
    }
}

/**
 * Result type for operations that may return stale data
 */
export type FetchResult<T> =
    | { success: true; data: T; stale: false }
    | { success: true; data: T; stale: true; staleSince: Date }
    | { success: false; error: DataLayerError };

/**
 * Helper to create successful fresh result
 */
export function freshResult<T>(data: T): FetchResult<T> {
    return { success: true, data, stale: false };
}

/**
 * Helper to create successful stale result
 */
export function staleResult<T>(data: T, fetchedAt: Date): FetchResult<T> {
    return { success: true, data, stale: true, staleSince: fetchedAt };
}

/**
 * Helper to create error result
 */
export function errorResult<T>(error: DataLayerError): FetchResult<T> {
    return { success: false, error };
}
