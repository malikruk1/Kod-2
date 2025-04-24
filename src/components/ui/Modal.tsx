import React from 'react';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <button
                className="absolute top-2 right-2"
                onClick={onClose}
                aria-label="Close modal"
            >
                ✕
            </button>
            {children}
        </div>
    </div>
);
