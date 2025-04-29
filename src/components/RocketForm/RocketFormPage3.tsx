import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RocketFormValues } from '../../schemas/rocketSchema';

interface RocketFormPage3Props {
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  onFieldChange?: (fieldName: string) => void; // Updated to void return type
}

export const RocketFormPage3: React.FC<RocketFormPage3Props> = ({ 
  onNext, 
  onPrevious, 
  onCancel, 
  onFieldChange 
}) => {
  const { register, formState: { errors } } = useFormContext<RocketFormValues>();

  // Handler for field changes - now just clears the error
  const handleFieldChange = (fieldName: string) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (onFieldChange) {
        // Clear error when user makes any change to the field
        onFieldChange(fieldName);
      }
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Performance & Additional Details</h2>
      <FormField
        label="Maximum Thrust (kN)"
        htmlFor="maxThrust"
        error={errors.maxThrust}
      >
        <Input
          id="maxThrust"
          type="number"
          step="0.01"
          {...register('maxThrust')}
          error={!!errors.maxThrust}
          placeholder="Enter maximum thrust in kilonewtons"
          onChange={(e) => {
            register('maxThrust').onChange(e);
            handleFieldChange('maxThrust')(e);
          }}
        />
      </FormField>

      <FormField
        label="Passenger/Payload Capacity"
        htmlFor="capacity"
        error={errors.capacity}
      >
        <Input
          id="capacity"
          type="number"
          {...register('capacity')}
          error={!!errors.capacity}
          placeholder="Enter capacity"
          onChange={(e) => {
            register('capacity').onChange(e);
            handleFieldChange('capacity')(e);
          }}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="description"
        error={errors.description}
      >
        <textarea
          id="description"
          {...register('description')}
          className={`
            w-full px-3 py-2 border rounded-md
            ${errors.description ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          rows={4}
          placeholder="Enter description and additional details"
          onChange={(e) => {
            register('description').onChange(e);
            handleFieldChange('description')(e);
          }}
        />
      </FormField>

      <div className="flex justify-between">
        <div>
          <Button variant="secondary" onClick={onPrevious} className="mr-2">
            Previous
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <Button onClick={onNext}>
          Review
        </Button>
      </div>
    </div>
  );
};