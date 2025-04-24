import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const Button: React.FC<ButtonProps> = props => (
    <button
        {...props}
        className={`px-4 py-2 rounded-lg shadow ${props.className || ''}`}
    >
        {props.children}
    </button>
);
