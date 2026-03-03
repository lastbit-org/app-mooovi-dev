import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getGenreMovieList, getGenreTVList } from "../services/tmdb.js";
import { handleTmdbError } from "../lib/errorHandler.js";
import { parseLanguage } from "../lib/validation.js";

export async function genresRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  /**
   * Get movie genre list
   */
  fastify.get<{
    Querystring: { language?: string };
  }>("/movie", async (request, reply) => {
    try {
      const language = parseLanguage(request.query.language);
      const data = await getGenreMovieList(language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get TV genre list
   */
  fastify.get<{
    Querystring: { language?: string };
  }>("/tv", async (request, reply) => {
    try {
      const language = parseLanguage(request.query.language);
      const data = await getGenreTVList(language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });
}
