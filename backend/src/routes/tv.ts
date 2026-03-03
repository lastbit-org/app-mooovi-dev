import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  getPopularTVShows,
  getDiscoverTVShows,
  getTrendingTVShows,
  getTVShowDetails,
  getTVShowVideos,
  getTVShowCredits,
  getSimilarTVShows,
  getTVShowWatchProviders,
} from "../services/tmdb.js";
import { handleTmdbError } from "../lib/errorHandler.js";
import {
  parsePage,
  parseId,
  parseLanguage,
  parseTimeWindow,
  parseGenre,
} from "../lib/validation.js";

export async function tvRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  /**
   * Get popular TV shows (or discover by genre when genre param is present)
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Popular or genre-filtered TV shows
   */
  fastify.get<{
    Querystring: { page?: string; language?: string; genre?: string };
  }>("/popular", async (request, reply) => {
    try {
      const page = parsePage(request.query.page);
      if (page === null) {
        return reply.status(400).send({ error: "Invalid page" });
      }
      const language = parseLanguage(request.query.language);
      const genreId = parseGenre(request.query.genre);
      const data =
        genreId !== null
          ? await getDiscoverTVShows(genreId, page, language)
          : await getPopularTVShows(page, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get trending TV shows
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Trending TV shows
   */
  fastify.get<{
    Querystring: { time_window?: string; language?: string };
  }>("/trending", async (request, reply) => {
    try {
      const timeWindow = parseTimeWindow(request.query.time_window);
      const language = parseLanguage(request.query.language);
      const data = await getTrendingTVShows(timeWindow, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get similar TV shows
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Similar TV shows
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
      const data = await getSimilarTVShows(id, page, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get TV show credits (cast and crew)
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns TV show credits
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
      const data = await getTVShowCredits(id, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get TV show watch providers (streaming, rent, buy)
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns Watch providers by country
   */
  fastify.get<{
    Params: { id: string };
  }>("/:id/watch-providers", async (request, reply) => {
    try {
      const id = parseId(request.params.id);
      if (id === null) {
        return reply.status(400).send({ error: "Invalid id" });
      }
      const data = await getTVShowWatchProviders(id);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get TV show videos (trailers, teasers, etc.)
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns TV show videos
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
      const data = await getTVShowVideos(id, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });

  /**
   * Get TV show details
   * @param request - Fastify request
   * @param reply - Fastify reply
   * @returns TV show details
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
      const data = await getTVShowDetails(id, language);
      return reply.type("application/json").send(data);
    } catch (error) {
      return handleTmdbError(error, reply);
    }
  });
}
