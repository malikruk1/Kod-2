import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input: React.FC<InputProps> = props => (
    <input
        {...props}
        className={`border p-2 rounded w-full ${props.className || ''}`}
    />
);
