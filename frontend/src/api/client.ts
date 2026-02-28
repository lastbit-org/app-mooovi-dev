import axios from "axios";

// VITE_API_URL vazio no build → baseURL vazia → requests vão para o frontend (retornam HTML)
// Garantir fallback quando secret BACKEND_URL não está configurado no deploy
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});
