import { api } from "./client";

export async function getUpcomingMovies(page = 1) {
  const { data } = await api.get("/api/movies/upcoming", { params: { page } });
  return data;
}

export async function getPopularMovies(page = 1, genreId?: number) {
  const { data } = await api.get("/api/movies/popular", {
    params: { page, ...(genreId != null && { genre: genreId }) },
  });
  return data;
}

export async function getMovieDetails(id: number | string) {
  const { data } = await api.get(`/api/movies/${id}`);
  return data;
}

export async function getMovieVideos(id: number | string) {
  const { data } = await api.get(`/api/movies/${id}/videos`);
  return data;
}

export async function getMovieCredits(id: number | string) {
  const { data } = await api.get(`/api/movies/${id}/credits`);
  return data;
}

export async function getSimilarMovies(id: number | string, page = 1) {
  const { data } = await api.get(`/api/movies/${id}/similar`, {
    params: { page },
  });
  return data;
}

export async function getMovieWatchProviders(id: number | string) {
  const { data } = await api.get(`/api/movies/${id}/watch-providers`);
  return data;
}

export async function searchMovies(query: string, page = 1) {
  const { data } = await api.get("/api/movies/search", {
    params: { q: query, page },
  });
  return data;
}
