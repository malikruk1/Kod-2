import React from 'react';
import { useTracks } from '../../hooks/useTracks';
import { TrackItem } from './TrackItem';
import { useGenres } from '../../hooks/useGenres';
import { Input } from '../ui/Input';
import { debounce } from '../../utils/debounce';
import {TrackFormModal} from "../TrackFormModal/TrackFormModal";

export const TrackList: React.FC = () => {
    const [search, setSearch] = React.useState('');
    const [genreFilter, setGenreFilter] = React.useState('');
    const [artistFilter, setArtistFilter] = React.useState('');
    const [page, setPage] = React.useState(1);
    const {data: genres} = useGenres();

    const params = { search, genre: genreFilter, artist: artistFilter, page };
    const { data: tracks, isLoading } = useTracks(params);

    const onSearchChange = debounce((val: string) => setSearch(val), 300);

    const [editing, setEditing] = React.useState(null as any);

    return (
        <>
            <div className="flex gap-2 mb-4">
                <Input
                    data-testid="search-input"
                    placeholder="Search..."
                    onChange={e => onSearchChange(e.target.value)}
                />
                <select
                    data-testid="filter-genre"
                    onChange={e => setGenreFilter(e.target.value)}
                    defaultValue=""
                >
                    <option value="">All Genres</option>
                    {(genres as string[])?.map(g => (<option key={g} value={g}>{g}</option>))}
                </select>
                <Input
                    data-testid="filter-artist"
                    placeholder="Filter by artist"
                    onChange={e => setArtistFilter(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div data-testid="loading-tracks">Loading...</div>
            ) : (
                tracks?.map(track => (
                    <TrackItem key={track.id} track={track} onEdit={t => setEditing(t)} />
                ))
            )}

            <div data-testid="pagination" className="flex gap-2 mt-4">
                <button
                    data-testid="pagination-prev"
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                >Prev</button>
                <span>Page {page}</span>
                <button
                    data-testid="pagination-next"
                    onClick={() => setPage(p => p + 1)}
                >Next</button>
            </div>

            {/* Edit Modal */}
            {editing && (
                <TrackFormModal
                    mode="edit"
                    track={editing}
                    onClose={() => setEditing(null)}
                />
            )}
        </>
    );
};
