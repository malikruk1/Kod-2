import { api } from './client';

export const fetchGenres = () => api.get<{ data: string[] }>('/api/genres');
