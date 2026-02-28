import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { moviesRoutes } from './routes/movies.js';
import { tvRoutes } from './routes/tv.js';

// Cloud Run usa PORT=8080 por padrão; localmente usamos 3001
const PORT = parseInt(process.env.PORT ?? '3001', 10);

if (!process.env.TMDB_API_KEY) {
  console.error('[STARTUP] TMDB_API_KEY is required. Configure via --set-env-vars no Cloud Run.');
  process.exit(1);
}

const fastify = Fastify({ logger: true });

// CORS: quando CORS_ORIGIN não está definido, permite qualquer origem (origin: true reflete o Origin da requisição)
// Quando definido, usa whitelist (ex: https://run-frontend-xxx.run.app)
const corsConfig = process.env.CORS_ORIGIN
  ? { origin: process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) }
  : { origin: true };

await fastify.register(cors, corsConfig);

await fastify.register(moviesRoutes, { prefix: '/api/movies' });
await fastify.register(tvRoutes, { prefix: '/api/tv' });

try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`[STARTUP] Server listening on port ${PORT}`);
} catch (err) {
  console.error('[STARTUP] Failed to listen:', err);
  process.exit(1);
}
