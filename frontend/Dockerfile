# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# VITE_API_URL: URL do backend em produção (ex: https://backend-xxx.run.app)
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage - nginx para servir arquivos estáticos
FROM nginx:alpine

# envsubst para substituir PORT em runtime (Cloud Run usa 8080, local usa 80)
RUN apk add --no-cache gettext

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
