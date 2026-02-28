# GitHub Actions – Pipeline e Configuração

Este documento descreve os workflows de CI/CD do Mooovi, o que cada pipeline faz e o que precisa ser configurado no GitHub e no Google Cloud.

---

## Visão geral

O projeto usa dois workflows separados que fazem deploy no **Google Cloud Run**:

| Workflow | Trigger | Serviço Cloud Run |
|----------|---------|-------------------|
| **Deploy Frontend** | Push em `frontend/**` na branch `main` | `run-frontend` |
| **Deploy Backend** | Push em `backend/**` na branch `main` | `run-backend` |

Cada workflow roda apenas quando arquivos do respectivo diretório são alterados, evitando deploys desnecessários.

---

## Fluxo dos pipelines

### Deploy Frontend

```
Checkout → Auth (WIF) → Setup GCloud → Setup Docker → Validar BACKEND_URL → Build & Push → Deploy Cloud Run
```

1. **Checkout** – clona o repositório
2. **Auth** – autentica no GCP via Workload Identity Federation (sem chaves JSON)
3. **Setup GCloud** – configura o `gcloud` CLI
4. **Setup Docker** – configura autenticação para o Artifact Registry
5. **Validar BACKEND_URL** – verifica se o secret está configurado
6. **Build & Push** – build da imagem Docker e push para o Artifact Registry
7. **Deploy** – deploy no Cloud Run com `--allow-unauthenticated`

### Deploy Backend

```
Checkout → Auth (WIF) → Setup GCloud → Setup Docker → Build & Push → Deploy Cloud Run
```

1. **Checkout** – clona o repositório
2. **Auth** – autentica no GCP via Workload Identity Federation
3. **Setup GCloud** – configura o `gcloud` CLI
4. **Setup Docker** – configura autenticação para o Artifact Registry
5. **Build & Push** – build da imagem Docker e push para o Artifact Registry
6. **Deploy** – deploy no Cloud Run com `CORS_ORIGIN` e `--allow-unauthenticated`

---

## Configuração no GitHub

### Secrets obrigatórios

Configure em **Settings → Secrets and variables → Actions** do repositório:

| Secret | Usado em | Descrição |
|--------|----------|-----------|
| `WIF_PROVIDER` | Deploy Frontend, Backend | ID do Workload Identity Provider (ex: `projects/123/.../providers/github`) |
| `WIF_SERVICE_ACCOUNT` | Deploy Frontend, Backend | Email do service account (ex: `gha-deploy@lastbit-prj-b-seed.iam.gserviceaccount.com`) |
| `BACKEND_URL` | Deploy Frontend | URL do backend no Cloud Run (ex: `https://run-backend-xxxxx.us-central1.run.app`) |
| `FRONTEND_URL` | Deploy Backend | URL do frontend no Cloud Run (ex: `https://run-frontend-xxxxx.us-central1.run.app`) |

### Ordem de configuração

O deploy depende de URLs que só existem após o primeiro deploy:

1. **Primeiro deploy do backend** – não precisa de `FRONTEND_URL` se o frontend ainda não existir. Se o deploy falhar por falta de `FRONTEND_URL`, você pode criar o secret com um placeholder e ajustar depois.

2. **Primeiro deploy do frontend** – exige `BACKEND_URL` (URL do backend). Faça o deploy do backend antes e use a URL gerada.

3. **CORS** – o backend precisa de `FRONTEND_URL` para aceitar requisições do frontend. Após o primeiro deploy do frontend, configure `FRONTEND_URL` e faça um novo deploy do backend.

### Como obter as URLs

```bash
# URL do backend
gcloud run services describe run-backend \
  --region us-central1 \
  --project lastbit-prj-d-movieapi \
  --format='value(status.url)'

# URL do frontend
gcloud run services describe run-frontend \
  --region us-central1 \
  --project lastbit-prj-d-movieapi \
  --format='value(status.url)'
```

---

## Configuração no Google Cloud

### Projetos envolvidos

| Projeto | Uso |
|---------|-----|
| `lastbit-prj-d-movieapi` | API, Cloud Run (backend e frontend), Artifact Registry |
| `lastbit-prj-b-seed` | Service account do Workload Identity Federation |

### Workload Identity Federation (WIF)

O pipeline usa WIF para autenticar sem chaves JSON. O service account em `lastbit-prj-b-seed` precisa de permissões no projeto `lastbit-prj-d-movieapi`:

```bash
SA_EMAIL="seu-sa@lastbit-prj-b-seed.iam.gserviceaccount.com"

# Cloud Run
gcloud projects add-iam-policy-binding lastbit-prj-d-movieapi \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/run.admin"

# Service Account User (para deploy)
gcloud projects add-iam-policy-binding lastbit-prj-d-movieapi \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/iam.serviceAccountUser"

# Artifact Registry
gcloud projects add-iam-policy-binding lastbit-prj-d-movieapi \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/artifactregistry.writer"
```

### Backend – variáveis e secrets

- **TMDB_API_KEY** – configurado no Cloud Run via Secret Manager (não é alterado pelo pipeline).
- **CORS_ORIGIN** – definido no deploy com `secrets.FRONTEND_URL`.

### Variáveis de ambiente (workflows)

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `PROJECT_ID` | `lastbit-prj-d-movieapi` | Projeto GCP |
| `REGION` | `us-central1` | Região do Cloud Run |
| `ARTIFACT_REGISTRY` | `movieapi` | Nome do repositório de imagens |
| `IMAGE_NAME` | `app-mooovi-frontend` / `app-mooovi-backend` | Nome da imagem |
| `RUN_SERVICE_NAME` | `run-frontend` / `run-backend` | Nome do serviço no Cloud Run |

---

## Checklist de setup

- [ ] Workload Identity Federation configurado no GCP
- [ ] Service account com permissões em `lastbit-prj-d-movieapi`
- [ ] Secret `WIF_PROVIDER` no GitHub
- [ ] Secret `WIF_SERVICE_ACCOUNT` no GitHub
- [ ] Secret `TMDB_API_KEY` no Secret Manager (se ainda não configurado no Cloud Run)
- [ ] Deploy do backend executado
- [ ] Secret `BACKEND_URL` configurado com a URL do backend
- [ ] Deploy do frontend executado
- [ ] Secret `FRONTEND_URL` configurado com a URL do frontend
- [ ] Novo deploy do backend (para aplicar `CORS_ORIGIN`)

---

## Troubleshooting

### `PERMISSION_DENIED: Permission 'run.services.get' denied`

- O service account não tem permissão no projeto correto. Conceda `roles/run.admin` em `lastbit-prj-d-movieapi`.
- Se o erro mencionar `lastbit-prj-b-seed`, o deploy pode estar usando o projeto errado. Adicione `--project lastbit-prj-d-movieapi` no comando de deploy.

### `Cannot update environment variable [TMDB_API_KEY] to string literal`

- `TMDB_API_KEY` está configurado como Secret no Cloud Run. Não use `--set-env-vars` para ele; mantenha o deploy apenas com `CORS_ORIGIN`.

### Frontend retorna HTML em vez de JSON no `/api/movies/*`

- O frontend está chamando a URL errada. Verifique se `BACKEND_URL` está configurado no GitHub e aponta para o backend (não para o frontend).

### CORS bloqueando requisições

- `FRONTEND_URL` deve ser a URL exata do frontend (ex: `https://run-frontend-xxxxx.us-central1.run.app`).
- Sem `CORS_ORIGIN` definido, o backend só aceita requisições de localhost.
