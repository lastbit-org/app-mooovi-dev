import axios from 'axios';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  getPopularTVShows,
  getTrendingTVShows,
} from '../services/tmdb.js';

export async function tvRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  fastify.get<{
    Querystring: { page?: string; language?: string };
  }>('/popular', async (request, reply) => {
    try {
      const page = request.query.page ? parseInt(request.query.page, 10) : 1;
      const language = request.query.language;
      const data = await getPopularTVShows(page, language);
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
    Querystring: { time_window?: string; language?: string };
  }>('/trending', async (request, reply) => {
    try {
      const timeWindow = (request.query.time_window === 'day' ? 'day' : 'week') as 'day' | 'week';
      const language = request.query.language;
      const data = await getTrendingTVShows(timeWindow, language);
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
