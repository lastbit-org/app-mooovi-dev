import axios from 'axios';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  getPopularMovies,
  getMovieDetails,
  searchMovies,
  getUpcomingMovies,
} from '../services/tmdb.js';

export async function moviesRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  fastify.get<{
    Querystring: { page?: string; language?: string };
  }>('/popular', async (request, reply) => {
    try {
      const page = request.query.page ? parseInt(request.query.page, 10) : 1;
      const language = request.query.language;
      const data = await getPopularMovies(page, language);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return reply
          .status(error.response.status)
          .send(error.response.data);
      }
      throw error;
    }
  });

  fastify.get<{
    Querystring: { page?: string; language?: string };
  }>('/upcoming', async (request, reply) => {
    try {
      const page = request.query.page ? parseInt(request.query.page, 10) : 1;
      const language = request.query.language;
      const data = await getUpcomingMovies(page, language);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return reply
          .status(error.response.status)
          .send(error.response.data);
      }
      throw error;
    }
  });

  fastify.get<{
    Querystring: { q: string; page?: string; language?: string };
  }>('/search', async (request, reply) => {
    try {
      const { q } = request.query;
      if (!q) {
        return reply.status(400).send({ error: 'Query parameter "q" is required' });
      }
      const page = request.query.page ? parseInt(request.query.page, 10) : 1;
      const language = request.query.language;
      const data = await searchMovies(q, page, language);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return reply
          .status(error.response.status)
          .send(error.response.data);
      }
      throw error;
    }
  });

  fastify.get<{
    Params: { id: string };
    Querystring: { language?: string };
  }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const language = request.query.language;
      const data = await getMovieDetails(id);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return reply
          .status(error.response.status)
          .send(error.response.data);
      }
      throw error;
    }
  });
}
