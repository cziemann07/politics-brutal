/**
 * 🔒 SERVER-ONLY - This module uses server-only dependencies
 * 
 * Data Layer - Unified API for Politics Brutal
 * 
 * Provides:
 * - Zod-validated data types
 * - Cached API clients with stale fallback
 * - Standardized error handling
 */

// Schemas (safe for client import)
export * from "./schemas";

// Errors (safe for client import)
export * from "./errors";

// Server-only exports - DO NOT import in client components
export * from "./cache";
export * from "./camara-client";
