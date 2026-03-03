# syntax=docker/dockerfile:1
# Build stage - usa Docker Build Secrets para config do Firebase (evita ARG/ENV sensíveis)
FROM node:22-alpine AS builder

WORKDIR /app

# VITE_API_URL: URL do backend (não sensível, é endpoint público)
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .

# Firebase config via Docker Build Secrets (não persiste em layers)
# Uso: docker build --secret id=firebase_api_key,env=VITE_FIREBASE_API_KEY ...
RUN --mount=type=secret,id=firebase_api_key \
    --mount=type=secret,id=firebase_auth_domain \
    --mount=type=secret,id=firebase_project_id \
    --mount=type=secret,id=firebase_storage_bucket \
    --mount=type=secret,id=firebase_messaging_sender_id \
    --mount=type=secret,id=firebase_app_id \
    export VITE_FIREBASE_API_KEY="$(cat /run/secrets/firebase_api_key 2>/dev/null || true)" && \
    export VITE_FIREBASE_AUTH_DOMAIN="$(cat /run/secrets/firebase_auth_domain 2>/dev/null || true)" && \
    export VITE_FIREBASE_PROJECT_ID="$(cat /run/secrets/firebase_project_id 2>/dev/null || true)" && \
    export VITE_FIREBASE_STORAGE_BUCKET="$(cat /run/secrets/firebase_storage_bucket 2>/dev/null || true)" && \
    export VITE_FIREBASE_MESSAGING_SENDER_ID="$(cat /run/secrets/firebase_messaging_sender_id 2>/dev/null || true)" && \
    export VITE_FIREBASE_APP_ID="$(cat /run/secrets/firebase_app_id 2>/dev/null || true)" && \
    npm run build

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
