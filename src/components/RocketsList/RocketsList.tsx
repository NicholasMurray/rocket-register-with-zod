import React, { useEffect } from 'react';
import { Button } from '../ui/Button';
import { RocketItem } from './RocketItem';
import { StatusNotification } from '../ui/StatusNotification';
import { Rocket } from '../../types';

interface RocketsListProps {
  rockets: Rocket[];
  onEdit: (rocket: Rocket) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void; // New prop for viewing a rocket
  onAddNew: () => void;
  submissionStatus: 'idle' | 'success' | 'error';
  resetStatus: () => void;
  operationType: 'create' | 'update' | 'none';
}

export const RocketsList: React.FC<RocketsListProps> = ({
  rockets,
  onEdit,
  onDelete,
  onView,
  onAddNew,
  submissionStatus,
  resetStatus,
  operationType
}) => {
  // Display notification message based on operation status
  useEffect(() => {
    if (submissionStatus !== 'idle') {
      // Auto-reset status after a few seconds
      const timer = setTimeout(() => {
        resetStatus();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submissionStatus, resetStatus]);

  const getStatusMessage = () => {
    if (submissionStatus === 'success') {
      switch (operationType) {
        case 'create':
          return 'Rocket successfully registered!';
        case 'update':
          return 'Rocket successfully updated!';
        default:
          return 'Operation completed successfully!';
      }
    } else if (submissionStatus === 'error') {
      switch (operationType) {
        case 'create':
          return 'Failed to register rocket. Please try again.';
        case 'update':
          return 'Failed to update rocket. Please try again.';
        default:
          return 'Operation failed. Please try again.';
      }
    }
    return '';
  };

  return (
    <div>
      {/* Status message */}
      {submissionStatus !== 'idle' && (
        <StatusNotification 
          status={submissionStatus} 
          message={getStatusMessage()} 
          onClose={resetStatus} 
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Registered Rockets</h2>
        <Button variant="primary" onClick={onAddNew}>Add New Rocket</Button>
      </div>
      
      {rockets.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No rockets registered yet.</p>
          <Button variant="primary" onClick={onAddNew}>Register Your First Rocket</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {rockets.map(rocket => (
            <RocketItem 
              key={rocket.id} 
              rocket={rocket} 
              onEdit={() => onEdit(rocket)} 
              onDelete={() => onDelete(rocket.id)}
              onView={() => onView(rocket.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};