import React from 'react';
import {TrackList} from "../components/TrackList/TrackList";
import {TrackFormModal} from "../components/TrackFormModal/TrackFormModal";

const TracksPage: React.FC = () => {
    const [showCreate, setShowCreate] = React.useState(false);

    return (
        <div className="p-4">
            <h1 data-testid="tracks-header" className="text-2xl mb-4">Tracks</h1>
            <button
                data-testid="create-track-button"
                className="btn btn-primary mb-4"
                onClick={() => setShowCreate(true)}
            >
                Create Track
            </button>

            <TrackList />

            {/* Create Track Modal */}
            {showCreate && (
                <TrackFormModal
                    mode="create"
                    onClose={() => setShowCreate(false)}
                />
            )}
        </div>
    );
};

export default TracksPage;
