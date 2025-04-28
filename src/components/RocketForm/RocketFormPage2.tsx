import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { RocketFormValues } from '../../schemas/rocketSchema';

interface RocketFormPage2Props {
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  onFieldChange?: (fieldName: string) => Promise<boolean>; // New prop for validating fields
}

export const RocketFormPage2: React.FC<RocketFormPage2Props> = ({ 
  onNext, 
  onPrevious, 
  onCancel,
  onFieldChange 
}) => {
  const { register, formState: { errors } } = useFormContext<RocketFormValues>();
  
  // Handler for field changes
  const handleFieldChange = (fieldName: string) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (onFieldChange) {
        // Use setTimeout to ensure React has processed the state change
        setTimeout(() => onFieldChange(fieldName), 0);
      }
    };
  };

  const fuelOptions = [
    { value: 'LOX/RP-1', label: 'LOX/RP-1 (Liquid Oxygen & Refined Petroleum)' },
    { value: 'LOX/LH2', label: 'LOX/LH2 (Liquid Oxygen & Liquid Hydrogen)' },
    { value: 'LOX/CH4', label: 'LOX/CH4 (Liquid Oxygen & Methane)' },
    { value: 'UDMH/N2O4', label: 'UDMH/N2O4 (Unsymmetrical Dimethylhydrazine & Nitrogen Tetroxide)' },
    { value: 'Solid', label: 'Solid Fuel' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Physical Specifications</h2>
      
      <FormField
        label="Height (meters)"
        htmlFor="height"
        error={errors.height}
      >
        <Input
          id="height"
          type="number"
          step="0.01"
          {...register('height')}
          error={!!errors.height}
          placeholder="Enter height in meters"
          onChange={(e) => {
            register('height').onChange(e);
            handleFieldChange('height')(e);
          }}
        />
      </FormField>
      
      <FormField
        label="Diameter (meters)"
        htmlFor="diameter"
        error={errors.diameter}
      >
        <Input
          id="diameter"
          type="number"
          step="0.01"
          {...register('diameter')}
          error={!!errors.diameter}
          placeholder="Enter diameter in meters"
          onChange={(e) => {
            register('diameter').onChange(e);
            handleFieldChange('diameter')(e);
          }}
        />
      </FormField>
      
      <FormField
        label="Mass (kg)"
        htmlFor="mass"
        error={errors.mass}
      >
        <Input
          id="mass"
          type="number"
          {...register('mass')}
          error={!!errors.mass}
          placeholder="Enter mass in kilograms"
          onChange={(e) => {
            register('mass').onChange(e);
            handleFieldChange('mass')(e);
          }}
        />
      </FormField>
      
      <FormField
        label="Fuel Type"
        htmlFor="fuelType"
        error={errors.fuelType}
      >
        <Select
          id="fuelType"
          options={fuelOptions}
          {...register('fuelType')}
          error={!!errors.fuelType}
          onChange={(e) => {
            register('fuelType').onChange(e);
            handleFieldChange('fuelType')(e);
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
          Next
        </Button>
      </div>
    </div>
  );
};