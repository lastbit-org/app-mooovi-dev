import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getTrendingAll } from "../services/tmdb.js";
import { handleTmdbError } from "../lib/errorHandler.js";
import {
  parsePage,
  parseLanguage,
  parseTimeWindow,
} from "../lib/validation.js";

export async function trendingRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  /**
   * Get trending movies and TV shows (all)
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Trending content (movies, tv, people - filter client-side for media)
   */
  fastify.get<{
    Querystring: { time_window?: string; page?: string; language?: string };
  }>("/", async (request, reply) => {
    try {
      const timeWindow = parseTimeWindow(request.query.time_window);
      const page = parsePage(request.query.page);
      if (page === null) {
        return reply.status(400).send({ error: "Invalid page" });
      }
      const language = parseLanguage(request.query.language);
      const data = await getTrendingAll(timeWindow, page, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });
}
