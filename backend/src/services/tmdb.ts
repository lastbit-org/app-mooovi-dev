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

export async function getMovieDetails(id: number | string, language?: string) {
  const { data } = await tmdbClient.get(`/movie/${id}`, {
    params: { language },
  });
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

export async function getSimilarMovies(
  id: number | string,
  page = 1,
  language?: string,
) {
  const { data } = await tmdbClient.get(`/movie/${id}/recommendations`, {
    params: { page, language },
  });
  return data;
}

/**
 * Get movie watch providers (streaming, rent, buy) by country
 */
export async function getMovieWatchProviders(id: number | string) {
  const { data } = await tmdbClient.get(`/movie/${id}/watch/providers`);
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

export async function getTVShowCredits(id: number | string, language?: string) {
  const { data } = await tmdbClient.get(`/tv/${id}/credits`, {
    params: { language },
  });
  return data;
}

export async function getSimilarTVShows(
  id: number | string,
  page = 1,
  language?: string,
) {
  const { data } = await tmdbClient.get(`/tv/${id}/recommendations`, {
    params: { page, language },
  });
  return data;
}

/**
 * Get TV show watch providers (streaming, rent, buy) by country
 */
export async function getTVShowWatchProviders(id: number | string) {
  const { data } = await tmdbClient.get(`/tv/${id}/watch/providers`);
  return data;
}

/**
 * Get TV season details (episodes list)
 */
export async function getTVSeasonDetails(
  seriesId: number | string,
  seasonNumber: number,
  language?: string,
) {
  const { data } = await tmdbClient.get(
    `/tv/${seriesId}/season/${seasonNumber}`,
    { params: { language } },
  );
  return data;
}

/**
 * Get movie genre list
 */
export async function getGenreMovieList(language?: string) {
  const { data } = await tmdbClient.get("/genre/movie/list", {
    params: { language },
  });
  return data;
}

/**
 * Get TV genre list
 */
export async function getGenreTVList(language?: string) {
  const { data } = await tmdbClient.get("/genre/tv/list", {
    params: { language },
  });
  return data;
}

/**
 * Discover movies by genre
 */
export async function getDiscoverMovies(
  genreId: number,
  page = 1,
  language?: string,
) {
  const { data } = await tmdbClient.get("/discover/movie", {
    params: {
      with_genres: genreId,
      page,
      language,
      sort_by: "popularity.desc",
    },
  });
  return data;
}

/**
 * Get person details
 */
export async function getPersonDetails(id: number | string, language?: string) {
  const { data } = await tmdbClient.get(`/person/${id}`, {
    params: { language },
  });
  return data;
}

/**
 * Get person movie credits (cast + crew)
 */
export async function getPersonMovieCredits(
  id: number | string,
  language?: string,
) {
  const { data } = await tmdbClient.get(`/person/${id}/movie_credits`, {
    params: { language },
  });
  return data;
}

/**
 * Discover TV shows by genre
 */
export async function getDiscoverTVShows(
  genreId: number,
  page = 1,
  language?: string,
) {
  const { data } = await tmdbClient.get("/discover/tv", {
    params: {
      with_genres: genreId,
      page,
      language,
      sort_by: "popularity.desc",
    },
  });
  return data;
}
