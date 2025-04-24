import React from 'react';
import { useUploadTrack } from '../../hooks/useTracks';
import { Button } from '../ui/Button';

interface Props { trackId: string; }
export const FileUpload: React.FC<Props> = ({ trackId }) => {
    const mutation = useUploadTrack();
    const [file, setFile] = React.useState<File>();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const upload = () => {
        if (file) mutation.mutate({ id: trackId, file });
    };

    return (
        <div>
            <input
                data-testid={`upload-track-${trackId}`}
                type="file"
                accept="audio/*"
                onChange={onChange}
            />
            <Button onClick={upload} disabled={!file || mutation.isLoading}>
                {mutation.isLoading ? 'Uploading...' : 'Upload'}
            </Button>
        </div>
    );
};
