const PAGE_MIN = 1;
const PAGE_MAX = 300;
const ID_MIN = 1;
const ID_MAX = 2_147_483_647;
const SEARCH_QUERY_MAX_LENGTH = 100;
const LANGUAGE_MAX_LENGTH = 10;

/**
 * Valida page: inteiro entre 1 e 500.
 * Retorna o valor validado ou null se inválido.
 */
export function parsePage(value: string | undefined): number | null {
  if (value === undefined || value === "") return PAGE_MIN;
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < PAGE_MIN || n > PAGE_MAX) return null;
  return n;
}

/**
 * Valida id: inteiro entre ID_MIN e ID_MAX (evita overflow/abuso).
 * Retorna o valor ou null se inválido.
 */
export function parseId(value: string | undefined): number | null {
  if (value === undefined || value === "") return null;
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < ID_MIN || n > ID_MAX) return null;
  return n;
}

/**
 * Valida query de busca: 1 a 100 caracteres.
 * Retorna o valor trimado ou null se inválido.
 */
export function parseSearchQuery(value: string | undefined): string | null {
  if (value === undefined || value === "") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > SEARCH_QUERY_MAX_LENGTH)
    return null;
  return trimmed;
}

/**
 * Valida language: máx. 10 caracteres.
 * Retorna o valor ou undefined se inválido (omitir na chamada).
 */
export function parseLanguage(value: string | undefined): string | undefined {
  if (value === undefined || value === "") return undefined;
  const trimmed = value.trim();
  if (trimmed.length > LANGUAGE_MAX_LENGTH) return undefined;
  return trimmed;
}

/**
 * Valida time_window: 'day' ou 'week'.
 */
export function parseTimeWindow(value: string | undefined): "day" | "week" {
  return value === "day" ? "day" : "week";
}
