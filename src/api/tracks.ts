import { api } from './client';

export interface Track {
    id: string;
    title: string;
    artist: string;
    album?: string;
    genres: string[];
    coverUrl?: string;
    hasFile: boolean;
}

export const fetchTracks = (params: Record<string, any>) =>
    api.get<{ data: Track[] }>('/api/tracks', { params });
export const createTrack = (data: Omit<Track, 'id' | 'hasFile'>) =>
    api.post<Track>('/api/tracks', data);
export const updateTrack = (id: string, data: Partial<Track>) =>
    api.patch<Track>(`/api/tracks/${id}`, data);
export const deleteTrack = (id: string) => api.delete(`/api/tracks/${id}`);
export const uploadTrack = (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/api/tracks/${id}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
