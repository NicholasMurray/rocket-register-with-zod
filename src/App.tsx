import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rocketSchema, RocketFormValues } from './schemas/rocketSchema';
import { RocketFormPage1 } from './components/RocketForm/RocketFormPage1';
import { RocketFormPage2 } from './components/RocketForm/RocketFormPage2';
import { RocketFormPage3 } from './components/RocketForm/RocketFormPage3';
import { RocketFormSummary } from './components/RocketForm/RocketFormSummary';
// The RocketFormSuccess component is no longer needed as a separate view
import { RocketsList } from './components/RocketsList/RocketsList';
import { useRockets } from './hooks/useRockets';
import { Button } from './components/ui/Button';

const DEFAULT_ROCKET_FORM_VALUES: RocketFormValues = {
  name: '',
  model: '',
  manufacturer: '',
  yearBuilt: new Date().getFullYear(),
  height: 0,
  diameter: 0,
  mass: 0,
  fuelType: '',
  maxThrust: 0,
  capacity: 0,
  description: '',
};

enum FormStep {
  Page1,
  Page2,
  Page3,
  Summary,
  List
}

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.List);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const { 
    rockets, 
    editingRocket, 
    submissionStatus,
    addRocket, 
    updateRocket, 
    deleteRocket, 
    startEditing, 
    cancelEditing, 
    resetSubmissionStatus
  } = useRockets();

  const methods = useForm<RocketFormValues>({
    resolver: zodResolver(rocketSchema),
    defaultValues: DEFAULT_ROCKET_FORM_VALUES,
    mode: 'onBlur',
  });

  // Reset form and update with editing rocket data when it changes
  React.useEffect(() => {
    if (editingRocket) {
      // When editing a rocket, populate the form with its data
      methods.reset({
        name: editingRocket.name,
        model: editingRocket.model,
        manufacturer: editingRocket.manufacturer,
        yearBuilt: editingRocket.yearBuilt,
        height: editingRocket.height,
        diameter: editingRocket.diameter,
        mass: editingRocket.mass,
        fuelType: editingRocket.fuelType,
        maxThrust: editingRocket.maxThrust,
        capacity: editingRocket.capacity,
        description: editingRocket.description || '',
      });
      setCurrentStep(FormStep.Page1);
    }
  }, [editingRocket, methods]);

  // Add another useEffect to handle initial form state
  React.useEffect(() => {
    // Clear form data when the component mounts
    methods.reset(DEFAULT_ROCKET_FORM_VALUES);
  }, [methods]); // This will run only once on component mount

  const handleNextStep = () => {
    switch (currentStep) {
      case FormStep.Page1:
        methods.trigger(['name', 'model', 'manufacturer', 'yearBuilt']).then(isValid => {
          if (isValid) setCurrentStep(FormStep.Page2);
        });
        break;
      case FormStep.Page2:
        methods.trigger(['height', 'diameter', 'mass', 'fuelType']).then(isValid => {
          if (isValid) setCurrentStep(FormStep.Page3);
        });
        break;
      case FormStep.Page3:
        methods.trigger(['maxThrust', 'capacity']).then(isValid => {
          if (isValid) setCurrentStep(FormStep.Summary);
        });
        break;
      default:
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case FormStep.Page2:
        setCurrentStep(FormStep.Page1);
        break;
      case FormStep.Page3:
        setCurrentStep(FormStep.Page2);
        break;
      case FormStep.Summary:
        setCurrentStep(FormStep.Page3);
        break;
      default:
        break;
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    try {
      const values = methods.getValues();
      
      if (editingRocket) {
        await updateRocket(editingRocket.id, values);
      } else {
        await addRocket(values);
      }
      
      // After successful submission, go straight to list view
      setCurrentStep(FormStep.List);
      methods.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      // The status will already be set to 'error' in the hook
      setCurrentStep(FormStep.List); // Also navigate to list to show the error message
    }
  };

  const handleAddNew = () => {
    // First cancel any ongoing editing
    cancelEditing();
    
    // Reset the form with default values
    methods.reset(DEFAULT_ROCKET_FORM_VALUES);
    
    // Then navigate to the first page
    setCurrentStep(FormStep.Page1);
  };

  // Create a single cancel handler function
  const handleCancelForm = () => {
    // Check if the form has any filled values
    const values = methods.getValues();
    const hasFormData = Object.values(values).some(val => {
      if (typeof val === 'string') return val.trim() !== '';
      if (typeof val === 'number') return val !== 0 && val !== DEFAULT_ROCKET_FORM_VALUES.yearBuilt;
      return val !== undefined;
    });
    
    if (hasFormData) {
      // If there's data, show confirmation
      setShowCancelConfirmation(true);
    } else {
      // If no data, just cancel
      cancelFormWithoutConfirmation();
    }
  };

  // Function to cancel without confirmation
  const cancelFormWithoutConfirmation = () => {
    methods.reset(DEFAULT_ROCKET_FORM_VALUES);
    cancelEditing();
    setCurrentStep(FormStep.List);
    setShowCancelConfirmation(false);
  };
  
  // Function to handle cancel dialog "No" button
  const handleCancelDialogNo = () => {
    setShowCancelConfirmation(false);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case FormStep.Page1:
        return <RocketFormPage1 
          onNext={handleNextStep}
          onCancel={handleCancelForm}
        />;
      case FormStep.Page2:
        return <RocketFormPage2 
          onNext={handleNextStep} 
          onPrevious={handlePreviousStep}
          onCancel={handleCancelForm}
        />;
      case FormStep.Page3:
        return <RocketFormPage3 
          onNext={handleNextStep} 
          onPrevious={handlePreviousStep}
          onCancel={handleCancelForm}
        />;
      case FormStep.Summary:
        return (
          <RocketFormSummary 
            onSubmit={handleSubmit} 
            onEdit={goToStep} 
            isEditing={!!editingRocket}
            onCancel={handleCancelForm}
          />
        );
      case FormStep.List:
        return (
          <RocketsList 
            rockets={rockets}
            onEdit={startEditing}
            onDelete={deleteRocket}
            onAddNew={handleAddNew}
            submissionStatus={submissionStatus}
            resetStatus={resetSubmissionStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {currentStep === FormStep.List ? 'Rocket Registry' : 
           editingRocket ? 'Edit Rocket' : 'Register New Rocket'}
        </h1>
        
        {currentStep !== FormStep.List && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {[FormStep.Page1, FormStep.Page2, FormStep.Page3, FormStep.Summary].map((step, index) => (
                <React.Fragment key={step}>
                  <div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div 
                      className={`flex-1 h-1 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`} 
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <div>Basic Info</div>
              <div>Specifications</div>
              <div>Performance</div>
              <div>Review</div>
            </div>
          </div>
        )}
        
        <FormProvider {...methods}>
          {renderCurrentStep()}
        </FormProvider>
      
      {/* Add cancel confirmation dialog */}
      {showCancelConfirmation && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Discard Changes?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel? All unsaved changes will be lost.
              </p>
              <div className="flex justify-end space-x-4">
                <Button variant="secondary" onClick={handleCancelDialogNo}>
                  No, Keep Editing
                </Button>
                <Button variant="danger" onClick={cancelFormWithoutConfirmation}>
                  Yes, Discard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;