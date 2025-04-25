import React, { useEffect } from 'react';
import { Button } from '../ui/Button';

interface RocketFormSuccessProps {
  status: 'success' | 'error';
  onContinue: () => void;
  resetStatus: () => void;
}

export const RocketFormSuccess: React.FC<RocketFormSuccessProps> = ({ 
  status, 
  onContinue,
  resetStatus
}) => {
  // Reset status when component unmounts
  useEffect(() => {
    return () => resetStatus();
  }, [resetStatus]);
  
  return (
    <div className="text-center py-8">
      {status === 'success' ? (
        <>
          <div className="mb-4 text-green-600">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Rocket Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Your rocket has been registered successfully in our database.</p>
        </>
      ) : (
        <>
          <div className="mb-4 text-red-600">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Registration Failed</h2>
          <p className="text-gray-600 mb-6">There was an error registering your rocket. Please try again.</p>
        </>
      )}
      
      <Button onClick={onContinue}>
        View All Rockets
      </Button>
    </div>
  );
};
