import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  getPopularTVShows,
  getTrendingTVShows,
  getTVShowDetails,
} from '../services/tmdb.js';
import { handleTmdbError } from '../lib/errorHandler.js';
import {
  parsePage,
  parseId,
  parseLanguage,
  parseTimeWindow,
} from '../lib/validation.js';

export async function tvRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  fastify.get<{
    Querystring: { page?: string; language?: string };
  }>('/popular', async (request, reply) => {
    try {
      const page = parsePage(request.query.page);
      if (page === null) {
        return reply.status(400).send({ error: 'Invalid page' });
      }
      const language = parseLanguage(request.query.language);
      const data = await getPopularTVShows(page, language);
      return data;
    } catch (error) {
      handleTmdbError(error, reply);
    }
  });

  fastify.get<{
    Querystring: { time_window?: string; language?: string };
  }>('/trending', async (request, reply) => {
    try {
      const timeWindow = parseTimeWindow(request.query.time_window);
      const language = parseLanguage(request.query.language);
      const data = await getTrendingTVShows(timeWindow, language);
      return data;
    } catch (error) {
      handleTmdbError(error, reply);
    }
  });

  fastify.get<{
    Params: { id: string };
    Querystring: { language?: string };
  }>('/:id', async (request, reply) => {
    try {
      const id = parseId(request.params.id);
      if (id === null) {
        return reply.status(400).send({ error: 'Invalid id' });
      }
      const language = parseLanguage(request.query.language);
      const data = await getTVShowDetails(id, language);
      return data;
    } catch (error) {
      handleTmdbError(error, reply);
    }
  });
}
