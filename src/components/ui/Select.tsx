import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, error, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          w-full px-3 py-2 border rounded-md
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${className || ''}
        `}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';
