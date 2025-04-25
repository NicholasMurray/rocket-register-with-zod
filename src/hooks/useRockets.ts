// src/hooks/useRockets.ts
import { useState } from 'react';
import { Rocket, RocketFormData } from '../types';

export const useRockets = () => {
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [editingRocket, setEditingRocket] = useState<Rocket | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const addRocket = (rocketData: RocketFormData) => {
    // Set status to idle first to clear any previous status
    setSubmissionStatus('idle');
    
    return new Promise<void>((resolve, reject) => {
      // Simulate API call with 500ms delay
      setTimeout(() => {
        try {
          const newRocket: Rocket = {
            ...rocketData,
            id: Date.now().toString(),
          };
          
          setRockets(prev => [...prev, newRocket]);
          setSubmissionStatus('success');
          resolve();
        } catch (error) {
          setSubmissionStatus('error');
          reject(error);
        }
      }, 500);
    });
  };

  const updateRocket = (id: string, rocketData: RocketFormData) => {
    // Set status to idle first to clear any previous status
    setSubmissionStatus('idle');
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          setRockets(prev => 
            prev.map(rocket => 
              rocket.id === id ? { ...rocketData, id } : rocket
            )
          );
          setEditingRocket(null);
          setSubmissionStatus('success');
          resolve();
        } catch (error) {
          setSubmissionStatus('error');
          reject(error);
        }
      }, 500);
    });
  };

  const deleteRocket = (id: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          setRockets(prev => prev.filter(rocket => rocket.id !== id));
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  };

  const startEditing = (rocket: Rocket) => {
    setEditingRocket(rocket);
  };

  const cancelEditing = () => {
    setEditingRocket(null);
  };

  const resetSubmissionStatus = () => {
    setSubmissionStatus('idle');
  };

  return {
    rockets,
    editingRocket,
    submissionStatus,
    addRocket,
    updateRocket,
    deleteRocket,
    startEditing,
    cancelEditing,
    resetSubmissionStatus
  };
};