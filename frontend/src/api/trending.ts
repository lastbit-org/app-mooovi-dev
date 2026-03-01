import { api } from "./client";

export async function getTrendingAll(
  timeWindow: "day" | "week" = "week",
  page = 1
) {
  const { data } = await api.get("/api/trending", {
    params: { time_window: timeWindow, page },
  });
  return data;
}
