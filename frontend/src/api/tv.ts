import { api } from "./client";

export async function getPopularTVShows(page = 1, genreId?: number) {
  const { data } = await api.get("/api/tv/popular", {
    params: { page, ...(genreId != null && { genre: genreId }) },
  });
  return data;
}

export async function getTrendingTVShows(timeWindow: "day" | "week" = "week") {
  const { data } = await api.get("/api/tv/trending", {
    params: { time_window: timeWindow },
  });
  return data;
}

export async function getTVShowDetails(id: number | string) {
  const { data } = await api.get(`/api/tv/${id}`);
  return data;
}

export async function getTVShowVideos(id: number | string) {
  const { data } = await api.get(`/api/tv/${id}/videos`);
  return data;
}

export async function getTVShowCredits(id: number | string) {
  const { data } = await api.get(`/api/tv/${id}/credits`);
  return data;
}

export async function getSimilarTVShows(id: number | string, page = 1) {
  const { data } = await api.get(`/api/tv/${id}/similar`, {
    params: { page },
  });
  return data;
}

export async function getTVShowWatchProviders(id: number | string) {
  const { data } = await api.get(`/api/tv/${id}/watch-providers`);
  return data;
}
