/**
 * Date utility functions for Politics Brutal
 * 
 * Provides helpers for dynamic date ranges used across the application.
 */

export interface DateRange {
  start: Date;
  end: Date;
  /** Format: YYYY-MM */
  monthKey: string;
}

/**
 * Returns the last fully closed month.
 * Example: If today is 2026-02-04, returns January 2026 (2026-01-01 to 2026-01-31).
 * Handles year rollover: January -> December of previous year.
 */
export function getLastClosedMonth(): DateRange {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  let targetYear: number;
  let targetMonth: number;

  if (currentMonth === 0) {
    // January -> December of previous year
    targetYear = currentYear - 1;
    targetMonth = 11; // December
  } else {
    targetYear = currentYear;
    targetMonth = currentMonth - 1;
  }

  // First day of target month
  const start = new Date(targetYear, targetMonth, 1);
  
  // Last day of target month (day 0 of next month)
  const end = new Date(targetYear, targetMonth + 1, 0);
  
  const monthKey = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;

  return { start, end, monthKey };
}

/**
 * Validates and parses a month query parameter in YYYY-MM format.
 * Returns the parsed DateRange if valid, or fallback to last closed month if invalid.
 * 
 * @param monthParam - Query parameter string, e.g., "2026-01"
 * @returns DateRange for the specified or fallback month
 */
export function parseMonthParam(monthParam: string | null | undefined): DateRange {
  if (!monthParam) {
    return getLastClosedMonth();
  }

  // Validate format: YYYY-MM
  const regex = /^\d{4}-\d{2}$/;
  if (!regex.test(monthParam)) {
    console.warn(`Invalid month format: ${monthParam}. Using fallback.`);
    return getLastClosedMonth();
  }

  const [yearStr, monthStr] = monthParam.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  // Validate month range (1-12)
  if (month < 1 || month > 12) {
    console.warn(`Invalid month value: ${monthParam}. Using fallback.`);
    return getLastClosedMonth();
  }

  // Validate year is reasonable (e.g., 2000-2100)
  if (year < 2000 || year > 2100) {
    console.warn(`Invalid year value: ${monthParam}. Using fallback.`);
    return getLastClosedMonth();
  }

  const targetMonth = month - 1; // Convert to 0-indexed
  const start = new Date(year, targetMonth, 1);
  const end = new Date(year, targetMonth + 1, 0);

  return { start, end, monthKey: monthParam };
}

/**
 * Formats a DateRange for display purposes.
 * Example: "Janeiro de 2026"
 */
export function formatMonthDisplay(range: DateRange): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const month = range.start.getMonth();
  const year = range.start.getFullYear();
  return `${months[month]} de ${year}`;
}
