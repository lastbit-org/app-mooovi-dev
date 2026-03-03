export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";
export const TMDB_PROVIDER_LOGO_BASE = "https://image.tmdb.org/t/p/w92";
export const TMDB_STILL_BASE = "https://image.tmdb.org/t/p/w300";
export const TMDB_PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

/** Must match backend PAGE_MAX in lib/validation.ts (currently 300). */
const PAGE_MAX = 300;

export function getPosterUrl(path: string | null): string {
  return path ? `${TMDB_IMAGE_BASE}${path}` : "/placeholder-poster.svg";
}

export function getBackdropUrl(path: string | null): string {
  return path ? `${TMDB_BACKDROP_BASE}${path}` : "";
}

export function getProviderLogoUrl(path: string | null): string {
  return path ? `${TMDB_PROVIDER_LOGO_BASE}${path}` : "";
}

export function getStillUrl(path: string | null): string {
  return path ? `${TMDB_STILL_BASE}${path}` : "/placeholder-poster.svg";
}

export function getProfileUrl(path: string | null): string {
  return path ? `${TMDB_PROFILE_BASE}${path}` : "/placeholder-profile.svg";
}

/**
 * Parse and clamp a page query-param value.
 * Returns a safe integer between 1 and PAGE_MAX.
 */
export function parsePageParam(value: string | null): number {
  if (!value) return 1;
  const n = parseInt(value, 10);
  return Number.isNaN(n) || n < 1 ? 1 : Math.min(n, PAGE_MAX);
}
