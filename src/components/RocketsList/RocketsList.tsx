import React from 'react';
import { Button } from '../ui/Button';
import { Rocket } from '../../types';
import { RocketItem } from './RocketItem';
import { StatusNotification } from '../ui/StatusNotification';

interface RocketsListProps {
  rockets: Rocket[];
  onEdit: (rocket: Rocket) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  submissionStatus: 'idle' | 'success' | 'error';
  resetStatus: () => void;
}

export const RocketsList: React.FC<RocketsListProps> = ({
  rockets,
  onEdit,
  onDelete,
  onAddNew,
  submissionStatus,
  resetStatus,
}) => {
  // Determine notification content based on status
  const getNotificationContent = () => {
    if (submissionStatus === 'success') {
      return {
        message: 'Rocket Registration Successful!',
        description: 'Your rocket has been registered successfully in our database.'
      };
    } else {
      return {
        message: 'Registration Failed',
        description: 'There was an error registering your rocket. Please try again.'
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Show status notification when not idle */}
      {submissionStatus !== 'idle' && (
        <StatusNotification
          status={submissionStatus as 'success' | 'error'}
          onDismiss={resetStatus}
          {...getNotificationContent()}
        />
      )}
      
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