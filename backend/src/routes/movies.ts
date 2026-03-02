import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  getPopularMovies,
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getSimilarMovies,
  searchMovies,
  getUpcomingMovies,
} from "../services/tmdb.js";
import { handleTmdbError } from "../lib/errorHandler.js";
import {
  parsePage,
  parseId,
  parseSearchQuery,
  parseLanguage,
} from "../lib/validation.js";

export async function moviesRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  /**
   * Get popular movies
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Popular movies
   */
  fastify.get<{
    Querystring: { page?: string; language?: string };
  }>("/popular", async (request, reply) => {
    try {
      const page = parsePage(request.query.page);
      if (page === null) {
        return reply.status(400).send({ error: "Invalid page" });
      }
      const language = parseLanguage(request.query.language);
      const data = await getPopularMovies(page, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get upcoming movies
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Upcoming movies
   */
  fastify.get<{
    Querystring: { page?: string; language?: string };
  }>("/upcoming", async (request, reply) => {
    try {
      const page = parsePage(request.query.page);
      if (page === null) {
        return reply.status(400).send({ error: "Invalid page" });
      }
      const language = parseLanguage(request.query.language);
      const data = await getUpcomingMovies(page, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Search for movies
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Search results
   */
  fastify.get<{
    Querystring: { q: string; page?: string; language?: string };
  }>("/search", async (request, reply) => {
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
      const data = await searchMovies(q, page, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get similar movies
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Similar movies
   */
  fastify.get<{
    Params: { id: string };
    Querystring: { page?: string; language?: string };
  }>("/:id/similar", async (request, reply) => {
    try {
      const id = parseId(request.params.id);
      if (id === null) {
        return reply.status(400).send({ error: "Invalid id" });
      }
      const page = parsePage(request.query.page);
      if (page === null) {
        return reply.status(400).send({ error: "Invalid page" });
      }
      const language = parseLanguage(request.query.language);
      const data = await getSimilarMovies(id, page, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get movie credits (cast and crew)
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Movie credits
   */
  fastify.get<{
    Params: { id: string };
    Querystring: { language?: string };
  }>("/:id/credits", async (request, reply) => {
    try {
      const id = parseId(request.params.id);
      if (id === null) {
        return reply.status(400).send({ error: "Invalid id" });
      }
      const language = parseLanguage(request.query.language);
      const data = await getMovieCredits(id, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get movie videos (trailers, teasers, etc.)
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Movie videos
   */
  fastify.get<{
    Params: { id: string };
    Querystring: { language?: string };
  }>("/:id/videos", async (request, reply) => {
    try {
      const id = parseId(request.params.id);
      if (id === null) {
        return reply.status(400).send({ error: "Invalid id" });
      }
      const language = parseLanguage(request.query.language);
      const data = await getMovieVideos(id, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get movie details
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Movie details
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
      const data = await getMovieDetails(id, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });
}
