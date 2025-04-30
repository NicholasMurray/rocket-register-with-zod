import React from 'react';
import { Button } from '../ui/Button';
import { Rocket } from '../../types';
import { useGetRocketByIdQuery } from '../../store/rocketApi';

interface RocketDetailProps {
  rocketId: string;
  onBack: () => void;
  onEdit: (rocket: Rocket) => void;
}

export const RocketDetail: React.FC<RocketDetailProps> = ({ rocketId, onBack, onEdit }) => {
  const { data: rocket, isLoading, error } = useGetRocketByIdQuery(rocketId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="flex items-center">
          <svg className="animate-spin h-6 w-6 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>Loading rocket details...</span>
        </div>
      </div>
    );
  }

  if (error || !rocket) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Rocket</h3>
        <p className="text-red-600 mb-4">We couldn't load the rocket details. It may have been deleted or there was a network issue.</p>
        <Button variant="primary" onClick={onBack}>Back to List</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{rocket.name}</h2>
          <p className="text-gray-600">
            Model: {rocket.model} • Manufacturer: {rocket.manufacturer} • Year: {rocket.yearBuilt}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => onEdit(rocket)}>Edit</Button>
          <Button variant="primary" onClick={onBack}>Back to List</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Physical Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Height</p>
              <p className="font-medium">{rocket.height} meters</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Diameter</p>
              <p className="font-medium">{rocket.diameter} meters</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mass</p>
              <p className="font-medium">{rocket.mass} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fuel Type</p>
              <p className="font-medium">{rocket.fuelType}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Maximum Thrust</p>
              <p className="font-medium">{rocket.maxThrust} kN</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="font-medium">{rocket.capacity}</p>
            </div>
          </div>
        </div>
      </div>

      {rocket.description && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Description</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{rocket.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};