import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchTracks,
    createTrack,
    updateTrack,
    deleteTrack,
    uploadTrack,
    Track,
} from '../api/tracks';

export const useTracks = (params: Record<string, any>) =>
    useQuery(['tracks', params], () => fetchTracks(params).then(res => res.data.data));

export const useCreateTrack = () => {
    const qc = useQueryClient();
    return useMutation(createTrack, {
        onSuccess: () => qc.invalidateQueries(['tracks']),
    });
};

export const useUpdateTrack = () => {
    const qc = useQueryClient();
    return useMutation(({ id, data }: { id: string; data: Partial<Track> }) => updateTrack(id, data), {
        onSuccess: () => qc.invalidateQueries(['tracks']),
    });
};

export const useDeleteTrack = () => {
    const qc = useQueryClient();
    return useMutation((id: string) => deleteTrack(id), {
        onSuccess: () => qc.invalidateQueries(['tracks']),
    });
};

export const useUploadTrack = () => {
    const qc = useQueryClient();
    return useMutation(({ id, file }: { id: string; file: File }) => uploadTrack(id, file), {
        onSuccess: () => qc.invalidateQueries(['tracks']),
    });
};
