# Deploy no Google Cloud Platform (GCP)

Este guia descreve como fazer o build das imagens Docker e enviá-las para o Google Cloud (Artifact Registry) para deploy em Cloud Run ou GKE.

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install) instalado
- Conta no GCP com billing habilitado

## 1. Configurar o Google Cloud

### Autenticar no GCP

```bash
gcloud auth login
```

### Definir o projeto

```bash
gcloud config set project SEU_PROJECT_ID
```

### Habilitar APIs necessárias

```bash
gcloud services enable artifactregistry.googleapis.com
gcloud services enable run.googleapis.com
```

## 2. Criar o Artifact Registry

```bash
# Criar repositório Docker (região sugerida: us-central1 ou southamerica-east1)
gcloud artifacts repositories create app-mooovi \
  --repository-format=docker \
  --location=us-central1 \
  --description="Imagens Docker do Mooovi"
```

## 3. Configurar Docker para o Artifact Registry

```bash
# Autenticar o Docker no Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## 4. Build das imagens

### Build local com docker-compose

```bash
# Criar arquivo .env na raiz do projeto (se ainda não existir)
# TMDB_API_KEY=sua_chave_tmdb
# VITE_API_URL=https://URL_DO_BACKEND_EM_PRODUCAO

docker compose build
```

### Build com tags para o GCP

Substitua `SEU_PROJECT_ID` e `us-central1` conforme seu projeto e região:

```bash
# Variáveis (ajuste conforme necessário)
export GCP_PROJECT=SEU_PROJECT_ID
export REGION=us-central1
export REPO=us-central1-docker.pkg.dev/${GCP_PROJECT}/app-mooovi

# Build do backend
docker build -t ${REPO}/backend:latest ./backend

# Build do frontend (IMPORTANTE: defina VITE_API_URL com a URL do backend em produção)
# Exemplo: se o backend estiver em https://backend-xxx.run.app
docker build \
  --build-arg VITE_API_URL=https://backend-xxx.run.app \
  -t ${REPO}/frontend:latest \
  ./frontend
```

**Nota:** O frontend precisa da URL do backend no momento do build. Se for a primeira vez, você pode:
1. Fazer o deploy do backend primeiro no Cloud Run
2. Copiar a URL gerada
3. Rebuildar o frontend com `VITE_API_URL` apontando para essa URL
4. Fazer o deploy do frontend

## 5. Enviar imagens para o Artifact Registry

```bash
# Push do backend
docker push ${REPO}/backend:latest

# Push do frontend
docker push ${REPO}/frontend:latest
```

## 6. Deploy no Cloud Run

### Backend

```bash
# Obtenha a URL do frontend após o deploy (ex: https://app-mooovi-frontend-xxx.run.app)
# e use em CORS_ORIGIN para permitir requisições do frontend
gcloud run deploy app-mooovi-backend \
  --image=${REPO}/backend:latest \
  --region=${REGION} \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="TMDB_API_KEY=sua_chave_tmdb,CORS_ORIGIN=https://app-mooovi-frontend-xxx.run.app"
```

### Frontend (após o backend estar no ar)

```bash
gcloud run deploy app-mooovi-frontend \
  --image=${REPO}/frontend:latest \
  --region=${REGION} \
  --platform=managed \
  --allow-unauthenticated
```

## Script completo de exemplo

Crie um arquivo `deploy-gcp.sh` na raiz do projeto:

```bash
#!/bin/bash
set -e

GCP_PROJECT=${GCP_PROJECT:-"seu-project-id"}
REGION=${REGION:-"us-central1"}
REPO=${REGION}-docker.pkg.dev/${GCP_PROJECT}/app-mooovi

# URL do backend no Cloud Run (ajuste após o primeiro deploy do backend)
BACKEND_URL=${BACKEND_URL:-"https://app-mooovi-backend-xxx.run.app"}

echo "Building backend..."
docker build -t ${REPO}/backend:latest ./backend

echo "Building frontend with BACKEND_URL=${BACKEND_URL}..."
docker build --build-arg VITE_API_URL=${BACKEND_URL} -t ${REPO}/frontend:latest ./frontend

echo "Pushing images..."
docker push ${REPO}/backend:latest
docker push ${REPO}/frontend:latest

echo "Deploying backend..."
gcloud run deploy app-mooovi-backend \
  --image=${REPO}/backend:latest \
  --region=${REGION} \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="TMDB_API_KEY=${TMDB_API_KEY},CORS_ORIGIN=https://app-mooovi-frontend-xxx.run.app"

echo "Deploying frontend..."
gcloud run deploy app-mooovi-frontend \
  --image=${REPO}/frontend:latest \
  --region=${REGION} \
  --platform=managed \
  --allow-unauthenticated

echo "Done! Get the frontend URL with: gcloud run services describe app-mooovi-frontend --region=${REGION} --format='value(status.url)'"
```

Uso:

```bash
chmod +x deploy-gcp.sh
export GCP_PROJECT=seu-project-id
export TMDB_API_KEY=sua_chave_tmdb
# Na primeira execução, use a URL padrão ou deixe vazia; após o backend subir, atualize BACKEND_URL
export BACKEND_URL=https://app-mooovi-backend-xxx.run.app  # após primeiro deploy
./deploy-gcp.sh
```

## CORS no backend

**Comportamento:** Se `CORS_ORIGIN` não estiver definida, o backend permite qualquer origem (`origin: true`). Para restringir, defina `CORS_ORIGIN` com a URL do frontend (ex: `https://run-frontend-xxx.run.app`). Múltiplas origens podem ser separadas por vírgula.

## Testar localmente com Docker

```bash
# Na raiz do projeto, crie .env com:
# TMDB_API_KEY=sua_chave

docker compose up --build
```

- Frontend: http://localhost
- Backend: http://localhost:3001

## Troubleshooting

### "Container failed to start and listen on PORT=8080"

**Backend – causa mais comum:** `TMDB_API_KEY` não foi passada no deploy. O backend sai imediatamente se a chave estiver ausente, antes de abrir a porta.

**Frontend – causa:** O nginx estava fixo na porta 80. O frontend usa `nginx.conf.template` + `docker-entrypoint.sh` para ler `PORT` em runtime (Cloud Run usa 8080, local usa 80). Rebuild da imagem e redeploy.

**Solução:** Garanta que `--set-env-vars` inclua a chave:

```bash
gcloud run deploy app-mooovi-backend \
  --image=... \
  --set-env-vars="TMDB_API_KEY=SUA_CHAVE_REAL"
```

**Outras causas:**
- Verifique os logs no Cloud Logging para ver a mensagem exata de erro
- O backend usa `process.env.PORT` automaticamente (Cloud Run injeta `PORT=8080`)
- Se usar Secret Manager: `--set-secrets="TMDB_API_KEY=tmdb-key:latest"`
