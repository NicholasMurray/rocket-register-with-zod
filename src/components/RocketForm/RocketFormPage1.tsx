import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RocketFormValues } from '../../schemas/rocketSchema';

interface RocketFormPage1Props {
  onNext: () => void;
}

export const RocketFormPage1: React.FC<RocketFormPage1Props> = ({ onNext }) => {
  const { register, formState: { errors } } = useFormContext<RocketFormValues>();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Basic Information</h2>
      
      <FormField 
        label="Rocket Name" 
        htmlFor="name" 
        error={errors.name}
      >
        <Input 
          id="name"
          {...register('name')}
          error={!!errors.name}
          placeholder="Enter rocket name"
        />
      </FormField>
      
      <FormField 
        label="Model" 
        htmlFor="model" 
        error={errors.model}
      >
        <Input 
          id="model"
          {...register('model')}
          error={!!errors.model}
          placeholder="Enter model designation"
        />
      </FormField>
      
      <FormField 
        label="Manufacturer" 
        htmlFor="manufacturer" 
        error={errors.manufacturer}
      >
        <Input 
          id="manufacturer"
          {...register('manufacturer')}
          error={!!errors.manufacturer}
          placeholder="Enter manufacturer name"
        />
      </FormField>
      
      <FormField 
        label="Year Built" 
        htmlFor="yearBuilt" 
        error={errors.yearBuilt}
      >
        <Input 
          id="yearBuilt"
          type="number"
          {...register('yearBuilt')}
          error={!!errors.yearBuilt}
          placeholder="Enter year built"
        />
      </FormField>
      
      <div className="flex justify-end">
        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};
