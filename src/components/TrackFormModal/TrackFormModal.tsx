import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { TagSelector } from '../ui/TagSelector';
import { useGenres } from '../../hooks/useGenres';
import { useCreateTrack, useUpdateTrack } from '../../hooks/useTracks';
import type { Track } from '../../api/tracks';

// Schema definition
const schema = z.object({
    title: z.string().nonempty({ message: 'Title is required' }),
    artist: z.string().nonempty({ message: 'Artist is required' }),
    album: z.string().optional(),
    coverUrl: z.union([
        z.string().url({ message: 'Must be a valid URL' }),
        z.literal('')
    ]),
    genres: z.array(z.string()).min(1, { message: 'At least one genre required' }),
});

type FormData = z.infer<typeof schema>;

interface Props {
    mode: 'create' | 'edit';
    track?: Track;
    onClose: () => void;
}

export const TrackFormModal: React.FC<Props> = ({ mode, track, onClose }) => {
    const { data: genreOptions = [] } = useGenres();
    const createTrack = useCreateTrack();
    const updateTrack = useUpdateTrack();

    // Set default form values
    const defaultValues: FormData = {
        title: mode === 'edit' && track ? track.title : '',
        artist: mode === 'edit' && track ? track.artist : '',
        album: mode === 'edit' && track ? track.album || '' : '',
        coverUrl: mode === 'edit' && track ? track.coverUrl || '' : '',
        genres: mode === 'edit' && track ? track.genres : [],
    } as FormData;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const onSubmit = async (data: FormData) => {
        try {
            if (mode === 'create') await createTrack.mutateAsync(data);
            else if (mode === 'edit' && track) await updateTrack.mutateAsync({ id: track.id, data });
            onClose();
        } catch (err) {
            console.error('Failed to save track:', err);
        }
    };

    return (
        <Modal onClose={onClose}>
            <form data-testid="track-form" onSubmit={handleSubmit(onSubmit)}>
                {/* Title */}
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <div className="mb-4">
                            <label htmlFor="title">Title</label>
                            <Input {...field} id="title" data-testid="input-title" />
                            {errors.title && (
                                <p data-testid="error-title" className="text-red-600">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                {/* Artist */}
                <Controller
                    name="artist"
                    control={control}
                    render={({ field }) => (
                        <div className="mb-4">
                            <label htmlFor="artist">Artist</label>
                            <Input {...field} id="artist" data-testid="input-artist" />
                            {errors.artist && (
                                <p data-testid="error-artist" className="text-red-600">
                                    {errors.artist.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                {/* Album */}
                <Controller
                    name="album"
                    control={control}
                    render={({ field }) => (
                        <div className="mb-4">
                            <label htmlFor="album">Album</label>
                            <Input {...field} id="album" data-testid="input-album" />
                        </div>
                    )}
                />

                {/* Cover Image URL */}
                <Controller
                    name="coverUrl"
                    control={control}
                    render={({ field }) => (
                        <div className="mb-4">
                            <label htmlFor="coverUrl">Cover Image URL</label>
                            <Input
                                {...field}
                                id="coverUrl"
                                data-testid="input-cover-image"
                            />
                            {errors.coverUrl && (
                                <p data-testid="error-cover-image" className="text-red-600">
                                    {errors.coverUrl.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                {/* Genres */}
                <Controller
                    name="genres"
                    control={control}
                    render={({ field }) => (
                        <div className="mb-4">
                            <label>Genres</label>
                            <TagSelector
                                options={genreOptions}
                                selected={field.value}
                                onChange={field.onChange}
                            />
                            {errors.genres && (
                                <p data-testid="error-genre" className="text-red-600">
                                    {errors.genres.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                {/* Submit */}
                <button
                    data-testid="submit-button"
                    type="submit"
                    className="btn btn-primary mt-4"
                    disabled={isSubmitting}
                >
                    {mode === 'create' ? 'Create' : 'Save'}
                </button>
            </form>
        </Modal>
    );
};
