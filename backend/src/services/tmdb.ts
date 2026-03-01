import axios from "axios";

const apiKey = process.env.TMDB_API_KEY;
const baseURL = "https://api.themoviedb.org/3";

/**
 * TMDB API client
 * @param baseURL - The base URL of the TMDB API
 * @param apiKey - The API key for the TMDB API
 * @returns A new axios instance
 */
const tmdbClient = axios.create({
  baseURL,
  params: { api_key: apiKey },
});

/**
 * Get popular movies
 * @param page - The page number
 * @param language - The language of the movies
 * @returns Popular movies
 */
export async function getPopularMovies(page = 1, language?: string) {
  const { data } = await tmdbClient.get("/movie/popular", {
    params: { page, language },
  });
  return data;
}

/**
 * Get upcoming movies
 * @param page - The page number
 * @param language - The language of the movies
 * @returns Upcoming movies
 */
export async function getUpcomingMovies(page = 1, language?: string) {
  const { data } = await tmdbClient.get("/movie/upcoming", {
    params: { page, language },
  });
  return data;
}

export async function getMovieDetails(id: number | string) {
  const { data } = await tmdbClient.get(`/movie/${id}`);
  return data;
}

export async function getMovieVideos(id: number | string, language?: string) {
  const { data } = await tmdbClient.get(`/movie/${id}/videos`, {
    params: { language },
  });
  return data;
}

export async function getMovieCredits(id: number | string, language?: string) {
  const { data } = await tmdbClient.get(`/movie/${id}/credits`, {
    params: { language },
  });
  return data;
}

export async function searchMovies(query: string, page = 1, language?: string) {
  const { data } = await tmdbClient.get("/search/movie", {
    params: { query, page, language },
  });
  return data;
}

export async function searchMulti(
  query: string,
  page = 1,
  language?: string,
  includeAdult = false,
) {
  const { data } = await tmdbClient.get("/search/multi", {
    params: { query, page, language, include_adult: includeAdult },
  });
  return data;
}

export async function getTrendingAll(
  timeWindow: "day" | "week" = "week",
  page = 1,
  language?: string,
) {
  const { data } = await tmdbClient.get(`/trending/all/${timeWindow}`, {
    params: { page, language },
  });
  return data;
}

export async function getPopularTVShows(page = 1, language?: string) {
  const { data } = await tmdbClient.get("/tv/popular", {
    params: { page, language },
  });
  return data;
}

export async function getTrendingTVShows(
  timeWindow: "day" | "week" = "week",
  language?: string,
) {
  const { data } = await tmdbClient.get(`/trending/tv/${timeWindow}`, {
    params: { language },
  });
  return data;
}

export async function getTVShowDetails(id: number | string, language?: string) {
  const { data } = await tmdbClient.get(`/tv/${id}`, {
    params: { language },
  });
  return data;
}

export async function getTVShowVideos(id: number | string, language?: string) {
  const { data } = await tmdbClient.get(`/tv/${id}/videos`, {
    params: { language },
  });
  return data;
}

export async function getTVShowCredits(
  id: number | string,
  language?: string,
) {
  const { data } = await tmdbClient.get(`/tv/${id}/credits`, {
    params: { language },
  });
  return data;
}
