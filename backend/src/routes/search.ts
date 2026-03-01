import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { searchMulti } from "../services/tmdb.js";
import { handleTmdbError } from "../lib/errorHandler.js";
import {
  parsePage,
  parseSearchQuery,
  parseLanguage,
} from "../lib/validation.js";

export async function searchRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  /**
   * Search movies and TV shows (multi-search)
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Search results (movies, tv, people - filter client-side for media only)
   */
  fastify.get<{
    Querystring: { q: string; page?: string; language?: string };
  }>("/", async (request, reply) => {
    try {
      const q = parseSearchQuery(request.query.q);
      if (q === null) {
        return reply.status(400).send({
          error: 'Query parameter "q" is required (max 100 characters)',
        });
      }
      const page = parsePage(request.query.page);
      if (page === null) {
        return reply.status(400).send({ error: "Invalid page" });
      }
      const language = parseLanguage(request.query.language);
      const data = await searchMulti(q, page, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });
}
