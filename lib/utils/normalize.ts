/**
 * Vote normalization utilities for Politics Brutal
 * 
 * Provides strict mapping of vote strings to standardized categories.
 * Handles accents, case variations, and whitespace.
 */

/**
 * Standardized vote categories.
 * These are the ONLY valid output values from normalizeVote.
 */
export type VoteCategory =
    | 'SIM'
    | 'NAO'
    | 'ABSTENCAO'
    | 'OBSTRUCAO'
    | 'AUSENTE'
    | 'OUTRO';

/**
 * Remove accents from a string.
 * Example: "Não" -> "Nao", "Abstenção" -> "Abstencao"
 */
function removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalize a vote string to a strict category.
 * 
 * Handles:
 * - Case insensitivity
 * - Accent variations (não/nao, abstenção/abstencao)
 * - Whitespace trimming
 * 
 * @param vote - Raw vote string from API
 * @returns Normalized VoteCategory
 */
export function normalizeVote(vote: string | null | undefined): VoteCategory {
    if (!vote) {
        return 'AUSENTE';
    }

    // Trim, lowercase, remove accents
    const normalized = removeAccents(vote.trim().toLowerCase());

    // Strict mapping
    switch (normalized) {
        case 'sim':
            return 'SIM';

        case 'nao':
        case 'não': // In case accent removal didn't work
            return 'NAO';

        case 'abstencao':
        case 'abstenção':
            return 'ABSTENCAO';

        case 'obstrucao':
        case 'obstrução':
            return 'OBSTRUCAO';

        case 'ausente':
        case 'nao registrado':
        case 'não registrado':
        case 'presidente':
        case 'art. 17':
        case 'art.17':
            return 'AUSENTE';

        default:
            // Log unexpected values for debugging (only in dev)
            if (process.env.NODE_ENV !== 'production') {
                console.warn(`[normalizeVote] Unmapped vote: "${vote}" (normalized: "${normalized}")`);
            }
            return 'OUTRO';
    }
}

/**
 * Display labels for vote categories (Portuguese).
 */
export const VOTE_LABELS: Record<VoteCategory, string> = {
    SIM: 'Sim',
    NAO: 'Não',
    ABSTENCAO: 'Abstenção',
    OBSTRUCAO: 'Obstrução',
    AUSENTE: 'Ausente',
    OUTRO: 'Outro',
};

/**
 * Count votes by category from an array of vote strings.
 * Ensures sum of all categories equals total input.
 * 
 * @param votes - Array of raw vote strings
 * @returns Object with counts per category and total
 */
export function countVotesByCategory(votes: (string | null | undefined)[]): Record<VoteCategory, number> & { total: number } {
    const counts: Record<VoteCategory, number> = {
        SIM: 0,
        NAO: 0,
        ABSTENCAO: 0,
        OBSTRUCAO: 0,
        AUSENTE: 0,
        OUTRO: 0,
    };

    for (const vote of votes) {
        const category = normalizeVote(vote);
        counts[category]++;
    }

    const total = votes.length;

    // Sanity check: sum must equal total
    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    if (sum !== total && process.env.NODE_ENV !== 'production') {
        console.error(`[countVotesByCategory] Sum mismatch! Expected ${total}, got ${sum}`);
    }

    return { ...counts, total };
}
