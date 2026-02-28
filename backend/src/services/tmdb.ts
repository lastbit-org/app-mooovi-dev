import axios from 'axios';

const apiKey = process.env.TMDB_API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL,
  params: { api_key: apiKey },
});

export async function getPopularMovies(page = 1, language?: string) {
  const { data } = await tmdbClient.get('/movie/popular', {
    params: { page, language },
  });
  return data;
}

export async function getUpcomingMovies(page = 1, language?: string) {
  const { data } = await tmdbClient.get('/movie/upcoming', {
    params: { page, language },
  });
  return data;
}

export async function getMovieDetails(id: number | string) {
  const { data } = await tmdbClient.get(`/movie/${id}`);
  return data;
}

export async function searchMovies(query: string, page = 1, language?: string) {
  const { data } = await tmdbClient.get('/search/movie', {
    params: { query, page, language },
  });
  return data;
}

export async function getPopularTVShows(page = 1, language?: string) {
  const { data } = await tmdbClient.get('/tv/popular', {
    params: { page, language },
  });
  return data;
}

export async function getTrendingTVShows(timeWindow: 'day' | 'week' = 'week', language?: string) {
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
