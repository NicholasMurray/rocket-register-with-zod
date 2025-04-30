import React from 'react';
import { Button } from '../ui/Button';
import { Rocket } from '../../types';

interface RocketItemProps {
  rocket: Rocket;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void; // New prop for viewing a rocket
}

export const RocketItem: React.FC<RocketItemProps> = ({ rocket, onEdit, onDelete, onView }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow transition">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold">{rocket.name}</h3>
          <p className="text-gray-600">{rocket.model} • {rocket.manufacturer} • {rocket.yearBuilt}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
            <div><span className="font-medium">Height:</span> {rocket.height}m</div>
            <div><span className="font-medium">Diameter:</span> {rocket.diameter}m</div>
            <div><span className="font-medium">Mass:</span> {rocket.mass}kg</div>
            <div><span className="font-medium">Fuel:</span> {rocket.fuelType}</div>
            <div><span className="font-medium">Thrust:</span> {rocket.maxThrust}kN</div>
            <div><span className="font-medium">Capacity:</span> {rocket.capacity}</div>
          </div>
          {rocket.description && (
            <p className="mt-2 text-sm text-gray-700">{rocket.description}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <Button variant="primary" onClick={onView}>View</Button>
          <Button variant="secondary" onClick={onEdit}>Edit</Button>
          <Button variant="danger" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
};