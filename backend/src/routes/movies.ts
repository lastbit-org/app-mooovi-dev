import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  getPopularMovies,
  getMovieDetails,
  searchMovies,
  getUpcomingMovies,
} from '../services/tmdb.js';
import { handleTmdbError } from '../lib/errorHandler.js';
import {
  parsePage,
  parseId,
  parseSearchQuery,
  parseLanguage,
} from '../lib/validation.js';

export async function moviesRoutes(
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
      const data = await getPopularMovies(page, language);
      return data;
    } catch (error) {
      handleTmdbError(error, reply);
    }
  });

  fastify.get<{
    Querystring: { page?: string; language?: string };
  }>('/upcoming', async (request, reply) => {
    try {
      const page = parsePage(request.query.page);
      if (page === null) {
        return reply.status(400).send({ error: 'Invalid page' });
      }
      const language = parseLanguage(request.query.language);
      const data = await getUpcomingMovies(page, language);
      return data;
    } catch (error) {
      handleTmdbError(error, reply);
    }
  });

  fastify.get<{
    Querystring: { q: string; page?: string; language?: string };
  }>('/search', async (request, reply) => {
    try {
      const q = parseSearchQuery(request.query.q);
      if (q === null) {
        return reply.status(400).send({
          error: 'Query parameter "q" is required (max 100 characters)',
        });
      }
      const page = parsePage(request.query.page);
      if (page === null) {
        return reply.status(400).send({ error: 'Invalid page' });
      }
      const language = parseLanguage(request.query.language);
      const data = await searchMovies(q, page, language);
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
      const data = await getMovieDetails(id);
      return data;
    } catch (error) {
      handleTmdbError(error, reply);
    }
  });
}
