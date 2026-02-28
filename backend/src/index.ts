import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { moviesRoutes } from './routes/movies.js';
import { tvRoutes } from './routes/tv.js';

const PORT = parseInt(process.env.PORT ?? '3001', 10);

if (!process.env.TMDB_API_KEY) {
  console.error('TMDB_API_KEY is required. Set it in .env');
  process.exit(1);
}

const fastify = Fastify({ logger: true });

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost', 'http://127.0.0.1'];

await fastify.register(cors, {
  origin: corsOrigins,
});

await fastify.register(moviesRoutes, { prefix: '/api/movies' });
await fastify.register(tvRoutes, { prefix: '/api/tv' });

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Server running at http://localhost:${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
