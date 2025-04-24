import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface Props { onConfirm: () => void; onCancel: () => void; }
export const DeleteConfirm: React.FC<Props> = ({ onConfirm, onCancel }) => (
    <Modal onClose={onCancel}>
        <div data-testid="confirm-dialog">
            <p>Are you sure you want to delete?</p>
            <div className="mt-4 flex justify-end gap-2">
                <Button data-testid="cancel-delete" onClick={onCancel}>Cancel</Button>
                <Button data-testid="confirm-delete" onClick={onConfirm}>Delete</Button>
            </div>
        </div>
    </Modal>
);
