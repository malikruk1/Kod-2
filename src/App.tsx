import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TracksPage from './pages/TracksPage';

const App: React.FC = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/tracks" replace />} />
        <Route path="/tracks" element={<TracksPage />} />
    </Routes>
);

export default App;
