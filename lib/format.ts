/** Formats a date with Indonesian locale: "14 Juni 2026, 13:05". */
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/** Indonesian month names, indexed 0 (Januari) – 11 (Desember). */
export const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

/** A month (1–12) and a full year, e.g. `{ month: 6, year: 2026 }`. */
export interface MonthYear {
  month: number;
  year: number;
}

/** The current month (1–12) and year. */
export function getCurrentMonthYear(): MonthYear {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

/**
 * Resolves raw `month`/`year` search params to a valid `MonthYear`,
 * falling back to the current month/year when missing or invalid.
 */
export function parseMonthYear(
  monthParam?: string,
  yearParam?: string,
): MonthYear {
  const current = getCurrentMonthYear();
  const month = Number(monthParam);
  const year = Number(yearParam);
  return {
    month: Number.isInteger(month) && month >= 1 && month <= 12 ? month : current.month,
    year: Number.isInteger(year) && year > 1970 ? year : current.year,
  };
}

/** Keeps only items whose `createdAt` falls within the given month/year. */
export function filterByMonthYear<T extends { createdAt: Date | string }>(
  items: T[],
  { month, year }: MonthYear,
): T[] {
  return items.filter((item) => {
    const d = new Date(item.createdAt);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
}

/**
 * The distinct years present in `items` (by `createdAt`), plus the current
 * year, sorted descending — used to populate the year filter options.
 */
export function getAvailableYears(
  items: { createdAt: Date | string }[],
): number[] {
  const years = new Set<number>(
    items.map((i) => new Date(i.createdAt).getFullYear()),
  );
  years.add(getCurrentMonthYear().year);
  return [...years].sort((a, b) => b - a);
}

/**
 * Parses a Report `values` string into meter readings.
 * The field is stored as a JSON string, e.g. `{"current":120,"previous":100}`.
 * Falls back gracefully to `{ current, previous: 0 }` for legacy/plain values.
 */
export function parseValues(raw: string): { current: number; previous: number } {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && "current" in parsed) return parsed;
    if (typeof parsed === "number") return { current: parsed, previous: 0 };
  } catch {
    const n = parseFloat(raw);
    if (!isNaN(n)) return { current: n, previous: 0 };
  }
  return { current: 0, previous: 0 };
}
