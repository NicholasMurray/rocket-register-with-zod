import React from 'react';
import { Button } from '../ui/Button';
import { Rocket } from '../../types';
import { RocketItem } from './RocketItem';

interface RocketsListProps {
  rockets: Rocket[];
  onEdit: (rocket: Rocket) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const RocketsList: React.FC<RocketsListProps> = ({
  rockets,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Registered Rockets</h2>
        <Button onClick={onAddNew}>Add New Rocket</Button>
      </div>
      
      {rockets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500">No rockets registered yet.</p>
          <Button onClick={onAddNew} className="mt-4">Register Your First Rocket</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {rockets.map((rocket) => (
            <RocketItem
              key={rocket.id}
              rocket={rocket}
              onEdit={() => onEdit(rocket)}
              onDelete={() => onDelete(rocket.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
