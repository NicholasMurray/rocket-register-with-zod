import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RocketFormValues } from '../../schemas/rocketSchema';

interface RocketFormPage3Props {
  onNext: () => void;
  onPrevious: () => void;
}

export const RocketFormPage3: React.FC<RocketFormPage3Props> = ({ onNext, onPrevious }) => {
  const { register, formState: { errors } } = useFormContext<RocketFormValues>();
  
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
        />
      </FormField>
      
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext}>
          Review
        </Button>
      </div>
    </div>
  );
};
