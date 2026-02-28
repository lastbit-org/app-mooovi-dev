export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w780";

export function getPosterUrl(path: string | null): string {
  return path ? `${TMDB_IMAGE_BASE}${path}` : "/placeholder-poster.svg";
}

export function getBackdropUrl(path: string | null): string {
  return path ? `${TMDB_BACKDROP_BASE}${path}` : "";
}
