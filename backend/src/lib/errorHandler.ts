import axios from 'axios';
import type { FastifyReply } from 'fastify';

/**
 * Trata erros da TMDB e outros erros inesperados.
 * Nunca expõe detalhes sensíveis ao cliente.
 */
export function handleTmdbError(error: unknown, reply: FastifyReply): void {
  if (axios.isAxiosError(error) && error.response) {
    reply.status(502).send({ error: 'Service temporarily unavailable' });
    return;
  }
  reply.status(500).send({ error: 'Internal server error' });
}
