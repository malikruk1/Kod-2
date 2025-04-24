import React from 'react';
import { Track } from '../../api/tracks';
import { FileUpload } from '../FileUpload/FileUpload';
import { DeleteConfirm } from '../DeleteConfirm/DeleteConfirm';
import { useDeleteTrack } from '../../hooks/useTracks';

interface Props { track: Track; onEdit: (t: Track) => void; }
export const TrackItem: React.FC<Props> = ({ track, onEdit }) => {
    const deleteMutation = useDeleteTrack();
    const [confirm, setConfirm] = React.useState(false);

    return (
        <div data-testid={`track-item-${track.id}`} className="border p-4 mb-2 rounded">
            <h3 data-testid={`track-item-${track.id}-title`} className="text-lg">{track.title}</h3>
            <p data-testid={`track-item-${track.id}-artist`}>{track.artist}</p>
            <button data-testid={`edit-track-${track.id}`} onClick={() => onEdit(track)}>
                Edit
            </button>
            <button data-testid={`delete-track-${track.id}`} onClick={() => setConfirm(true)}>
                Delete
            </button>
            {confirm && (
                <DeleteConfirm
                    onCancel={() => setConfirm(false)}
                    onConfirm={() => deleteMutation.mutate(track.id)}
                />
            )}
            {track.hasFile ? (
                <audio        data-testid={`audio-player-${track.id}`}
                controls
                />
                ) : (
                <FileUpload trackId={track.id} />
    )}
</div>
);
};
