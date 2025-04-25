import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: FieldError;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  children
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={htmlFor} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
