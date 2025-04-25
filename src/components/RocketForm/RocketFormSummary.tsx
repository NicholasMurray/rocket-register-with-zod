import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../ui/Button';
import { RocketFormValues } from '../../schemas/rocketSchema';

interface RocketFormSummaryProps {
  onSubmit: () => void;
  onEdit: (step: number) => void;
  isEditing: boolean;
  onCancel?: () => void;
}

export const RocketFormSummary: React.FC<RocketFormSummaryProps> = ({ 
  onSubmit, 
  onEdit, 
  isEditing,
  onCancel 
}) => {
  const { getValues } = useFormContext<RocketFormValues>();
  const values = getValues();
  
  const summaryItems = [
    { title: 'Basic Information', fields: [
      { label: 'Name', value: values.name },
      { label: 'Model', value: values.model },
      { label: 'Manufacturer', value: values.manufacturer },
      { label: 'Year Built', value: values.yearBuilt },
    ], editStep: 0 },
    { title: 'Physical Specifications', fields: [
      { label: 'Height', value: `${values.height} meters` },
      { label: 'Diameter', value: `${values.diameter} meters` },
      { label: 'Mass', value: `${values.mass} kg` },
      { label: 'Fuel Type', value: values.fuelType },
    ], editStep: 1 },
    { title: 'Performance & Additional Details', fields: [
      { label: 'Maximum Thrust', value: `${values.maxThrust} kN` },
      { label: 'Capacity', value: values.capacity },
      { label: 'Description', value: values.description || 'None provided' },
    ], editStep: 2 },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Rocket Information</h2>
      
      {summaryItems.map((section, index) => (
        <div key={index} className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{section.title}</h3>
            <button 
              type="button"
              onClick={() => onEdit(section.editStep)}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Change
            </button>
          </div>
          
          <dl className="grid grid-cols-1 gap-2">
            {section.fields.map((field, idx) => (
              <div key={idx} className="flex">
                <dt className="font-medium text-gray-500 w-1/3">{field.label}:</dt>
                <dd className="text-gray-900">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      
      <div className="flex justify-between pt-4">
        {isEditing && onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            Cancel Edit
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => onEdit(2)}>
            Back
          </Button>
        )}
        <Button onClick={onSubmit}>
          {isEditing ? 'Update Rocket' : 'Register Rocket'}
        </Button>
      </div>
    </div>
  );
};
