import { api } from "./client";

export async function getPopularTVShows(page = 1) {
  const { data } = await api.get("/api/tv/popular", { params: { page } });
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
