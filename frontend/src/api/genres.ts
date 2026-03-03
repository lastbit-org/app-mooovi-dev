import { api } from "./client";

export interface Genre {
  id: number;
  name: string;
}

export async function getGenreMovieList(): Promise<{ genres: Genre[] }> {
  const { data } = await api.get("/api/genres/movie");
  return data;
}

export async function getGenreTVList(): Promise<{ genres: Genre[] }> {
  const { data } = await api.get("/api/genres/tv");
  return data;
}
