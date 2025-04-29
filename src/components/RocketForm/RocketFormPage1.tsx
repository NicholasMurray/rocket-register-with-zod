import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RocketFormValues } from '../../schemas/rocketSchema';

interface RocketFormPage1Props {
  onNext: () => void;
  onCancel: () => void;
  onFieldChange?: (fieldName: string) => void; // Changed to void return type
}

export const RocketFormPage1: React.FC<RocketFormPage1Props> = ({
  onNext,
  onCancel,
  onFieldChange
}) => {
  const { register, formState: { errors } } = useFormContext<RocketFormValues>();

  // Handler for field changes - now just clears the error
  const handleFieldChange = (fieldName: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onFieldChange) {
        // Clear error when user makes any change to the field
        onFieldChange(fieldName);
      }
    };
  };

  return (
    <div className="space-y-6">
      <FormField
        label="Rocket Name"
        htmlFor="name"
        error={errors.name}
      >
        <Input
          type="text"
          {...register('name')}
          onChange={(e) => {
            register('name').onChange(e); // Keep the original onChange handler
            handleFieldChange('name')(e); // Clear validation error
          }}
        />
      </FormField>

      <FormField
        label="Model"
        htmlFor="model"
        error={errors.model}
      >
        <Input
          type="text"
          {...register('model')}
          onChange={(e) => {
            register('model').onChange(e);
            handleFieldChange('model')(e);
          }}
        />
      </FormField>

      <FormField
        label="Manufacturer"
        htmlFor="manufacturer"
        error={errors.manufacturer}
      >
        <Input
          type="text"
          {...register('manufacturer')}
          onChange={(e) => {
            register('manufacturer').onChange(e);
            handleFieldChange('manufacturer')(e);
          }}
        />
      </FormField>

      <FormField
        label="Year Built"
        htmlFor="yearBuilt"
        error={errors.yearBuilt}
      >
        <Input
          type="number"
          {...register('yearBuilt', { valueAsNumber: true })}
          onChange={(e) => {
            register('yearBuilt', { valueAsNumber: true }).onChange(e);
            handleFieldChange('yearBuilt')(e);
          }}
        />
      </FormField>

      <div className="flex justify-end space-x-3 pt-6">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};