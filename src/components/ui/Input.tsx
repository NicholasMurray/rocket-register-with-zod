import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full px-3 py-2 border rounded-md
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${className || ''}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
