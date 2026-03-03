import { api } from "./client";

export async function getPersonDetails(id: number | string) {
  const { data } = await api.get(`/api/person/${id}`);
  return data;
}

export async function getPersonMovieCredits(id: number | string) {
  const { data } = await api.get(`/api/person/${id}/movie_credits`);
  return data;
}
