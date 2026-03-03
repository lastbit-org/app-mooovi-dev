import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  getPersonDetails,
  getPersonMovieCredits,
} from "../services/tmdb.js";
import { handleTmdbError } from "../lib/errorHandler.js";
import { parseId, parseLanguage } from "../lib/validation.js";

export async function personRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  /**
   * Get person details
   */
  fastify.get<{
    Params: { id: string };
    Querystring: { language?: string };
  }>("/:id", async (request, reply) => {
    try {
      const id = parseId(request.params.id);
      if (id === null) {
        return reply.status(400).send({ error: "Invalid id" });
      }
      const language = parseLanguage(request.query.language);
      const data = await getPersonDetails(id, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get person movie credits (cast + crew)
   */
  fastify.get<{
    Params: { id: string };
    Querystring: { language?: string };
  }>("/:id/movie_credits", async (request, reply) => {
    try {
      const id = parseId(request.params.id);
      if (id === null) {
        return reply.status(400).send({ error: "Invalid id" });
      }
      const language = parseLanguage(request.query.language);
      const data = await getPersonMovieCredits(id, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });
}
