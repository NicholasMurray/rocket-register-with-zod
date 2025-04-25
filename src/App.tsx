import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rocketSchema, RocketFormValues } from './schemas/rocketSchema';
import { RocketFormPage1 } from './components/RocketForm/RocketFormPage1';
import { RocketFormPage2 } from './components/RocketForm/RocketFormPage2';
import { RocketFormPage3 } from './components/RocketForm/RocketFormPage3';
import { RocketFormSummary } from './components/RocketForm/RocketFormSummary';
import { RocketFormSuccess } from './components/RocketForm/RocketFormSuccess';
import { RocketsList } from './components/RocketsList/RocketsList';
import { useRockets } from './hooks/useRockets';

enum FormStep {
  Page1,
  Page2,
  Page3,
  Summary,
  Success,
  List
}

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.List);
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
    defaultValues: {
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
    },
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
    methods.reset({
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
    });
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
      
      // Only move to success page after the async operation completes
      // and the status has been set to success
      setCurrentStep(FormStep.Success);
      methods.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      // The status will already be set to 'error' in the hook
    }
  };

  const handleAddNew = () => {
    // First cancel any ongoing editing
    cancelEditing();
    
    // Reset the form with explicit default values
    methods.reset({
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
    });
    
    // Then navigate to the first page
    setCurrentStep(FormStep.Page1);
  };

  const handleCancelEdit = () => {
    cancelEditing();
    methods.reset({
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
    });
    setCurrentStep(FormStep.List);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case FormStep.Page1:
        return <RocketFormPage1 onNext={handleNextStep} />;
      case FormStep.Page2:
        return <RocketFormPage2 onNext={handleNextStep} onPrevious={handlePreviousStep} />;
      case FormStep.Page3:
        return <RocketFormPage3 onNext={handleNextStep} onPrevious={handlePreviousStep} />;
      case FormStep.Summary:
        return (
          <RocketFormSummary 
            onSubmit={handleSubmit} 
            onEdit={goToStep} 
            isEditing={!!editingRocket}
            onCancel={handleCancelEdit}
          />
        );
        case FormStep.Success:
          return (
            <RocketFormSuccess 
              status={submissionStatus}
              onContinue={() => {
                // Reset the form before navigating to the list view
                methods.reset({
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
                });
                setCurrentStep(FormStep.List);
              }}
              resetStatus={resetSubmissionStatus}
            />
          );
      case FormStep.List:
        return (
          <RocketsList 
            rockets={rockets}
            onEdit={startEditing}
            onDelete={deleteRocket}
            onAddNew={handleAddNew}
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
        
        {currentStep !== FormStep.List && currentStep !== FormStep.Success && (
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
      </div>
    </div>
  );
};

export default App;
