import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { moviesRoutes } from "./routes/movies.js";
import { tvRoutes } from "./routes/tv.js";
import { searchRoutes } from "./routes/search.js";

// Cloud Run usa PORT=8080 por padrão; localmente usamos 3001
const PORT = parseInt(process.env.PORT ?? "3001", 10);

if (!process.env.TMDB_API_KEY) {
  console.error(
    "[STARTUP] TMDB_API_KEY is required. Configure via --set-env-vars no Cloud Run.",
  );
  process.exit(1);
}

const fastify = Fastify({ logger: true });

await fastify.register(rateLimit, {
  max: 79,
  timeWindow: "1 minute",
});

// CORS para permitir requisições do frontend
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost",
        "http://127.0.0.1",
      ],
});

// Desabilita cache para evitar 304 e respostas vazias em APIs
fastify.addHook("onSend", async (_request, reply, payload) => {
  reply.header("Cache-Control", "no-store, no-cache, must-revalidate");
  reply.header("Pragma", "no-cache");
  return payload;
});

await fastify.register(moviesRoutes, { prefix: "/api/movies" });
await fastify.register(tvRoutes, { prefix: "/api/tv" });
await fastify.register(searchRoutes, { prefix: "/api/search" });

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  return reply.status(500).send({ error: "Internal server error" });
});

try {
  await fastify.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`[STARTUP] Server listening on port ${PORT}`);
} catch (err) {
  console.error("[STARTUP] Failed to listen:", err);
  process.exit(1);
}
