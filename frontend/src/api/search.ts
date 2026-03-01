import { api } from './client';

export async function searchMulti(query: string, page = 1) {
  const { data } = await api.get('/api/search', {
    params: { q: query, page },
  });
  return data;
}
