import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rocketSchema, RocketFormValues } from './schemas/rocketSchema';
import { Rocket, RocketFormData } from './types';
import { RocketFormPage1 } from './components/RocketForm/RocketFormPage1';
import { RocketFormPage2 } from './components/RocketForm/RocketFormPage2';
import { RocketFormPage3 } from './components/RocketForm/RocketFormPage3';
import { RocketFormSummary } from './components/RocketForm/RocketFormSummary';
import { RocketsList } from './components/RocketsList/RocketsList';
import { RocketDetail } from './components/RocketsList/RocketDetail';
import { Button } from './components/ui/Button';
import { ErrorSummary } from './components/ui/ErrorSummary';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { startEditing, cancelEditing } from './store/rocketSlice';
import { 
  useGetRocketsQuery, 
  useAddRocketMutation, 
  useUpdateRocketMutation, 
  useDeleteRocketMutation 
} from './store/rocketApi';

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
  List,
  Detail // New step for viewing rocket details
}

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.List);
  const [viewingRocketId, setViewingRocketId] = useState<string | null>(null); // Track which rocket is being viewed
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [operationType, setOperationType] = useState<'create' | 'update' | 'none'>('none');
  
  const dispatch = useDispatch();
  const editingRocket = useSelector((state: RootState) => state.rocket.editingRocket);
  
  // RTK Query hooks
  const { data: rockets = [] } = useGetRocketsQuery();
  const [addRocket, { isLoading: isAdding }] = useAddRocketMutation();
  const [updateRocket, { isLoading: isUpdating }] = useUpdateRocketMutation();
  const [deleteRocket] = useDeleteRocketMutation();

  const methods = useForm<RocketFormValues>({
    resolver: zodResolver(rocketSchema),
    defaultValues: DEFAULT_ROCKET_FORM_VALUES,
    mode: 'onSubmit', // Only validate on submit
    reValidateMode: 'onSubmit', // Only revalidate on submit
  });

  // Reset form and update with editing rocket data when it changes
  useEffect(() => {
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
  useEffect(() => {
    // Clear form data when the component mounts
    methods.reset(DEFAULT_ROCKET_FORM_VALUES);
  }, [methods]); // This will run only once on component mount

  // Get page-specific fields for validation
  const getFieldsForCurrentStep = () => {
    switch (currentStep) {
      case FormStep.Page1:
        return ['name', 'model', 'manufacturer', 'yearBuilt'];
      case FormStep.Page2:
        return ['height', 'diameter', 'mass', 'fuelType'];
      case FormStep.Page3:
        return ['maxThrust', 'capacity', 'description'];
      default:
        return [];
    }
  };

  // Handle next button click - validate the current page's fields
  const handleNextStep = async () => {
    const fieldsToValidate = getFieldsForCurrentStep();
    
    // This will set errors and return false if validation fails
    const isValid = await methods.trigger(fieldsToValidate);
    
    if (isValid) {
      switch (currentStep) {
        case FormStep.Page1:
          setCurrentStep(FormStep.Page2);
          break;
        case FormStep.Page2:
          setCurrentStep(FormStep.Page3);
          break;
        case FormStep.Page3:
          setCurrentStep(FormStep.Summary);
          break;
        default:
          break;
      }
    }
    // If not valid, errors will be displayed but we stay on current page
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
      const formValues = methods.getValues();
      
      // Transform to ensure all required fields are present
      const rocketData: RocketFormData = {
        name: formValues.name,
        model: formValues.model,
        manufacturer: formValues.manufacturer,
        yearBuilt: formValues.yearBuilt,
        height: formValues.height,
        diameter: formValues.diameter,
        mass: formValues.mass,
        fuelType: formValues.fuelType,
        maxThrust: formValues.maxThrust,
        capacity: formValues.capacity,
        // Ensure description is always a string (not undefined)
        description: formValues.description || ''
      };
      
      if (editingRocket) {
        await updateRocket({ id: editingRocket.id, data: rocketData }).unwrap();
        setOperationType('update');
      } else {
        await addRocket(rocketData).unwrap();
        setOperationType('create');
      }
      
      
      // Set success status and navigate to list view
      setSubmissionStatus('success');
      methods.reset(DEFAULT_ROCKET_FORM_VALUES);
      dispatch(cancelEditing());
      setCurrentStep(FormStep.List);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Also set the operation type for error messages
      setOperationType(editingRocket ? 'update' : 'create');
      setSubmissionStatus('error');
      setCurrentStep(FormStep.List);
    }
  };

  const handleAddNew = () => {
    // First cancel any ongoing editing
    dispatch(cancelEditing());
    
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
    dispatch(cancelEditing());
    setCurrentStep(FormStep.List);
    setShowCancelConfirmation(false);
  };
  
  // Function to handle cancel dialog "No" button
  const handleCancelDialogNo = () => {
    setShowCancelConfirmation(false);
  };

  const handleStartEditing = (rocket: Rocket) => {
    dispatch(startEditing(rocket));
  };

  const handleDeleteRocket = async (id: string) => {
    try {
      await deleteRocket(id).unwrap();
      // No need to update UI state as the query will automatically refresh
    } catch (error) {
      console.error('Failed to delete rocket:', error);
    }
  };

  // New handler for viewing rocket details
  const handleViewRocket = (id: string) => {
    setViewingRocketId(id);
    setCurrentStep(FormStep.Detail);
  };

  // Handler to go back to list from details view
  const handleBackToList = () => {
    setViewingRocketId(null);
    setCurrentStep(FormStep.List);
  };

  const resetSubmissionStatus = () => {
    setSubmissionStatus('idle');
    setOperationType('none');
  };

  // Get relevant errors for the current step to display in summary
  const getCurrentStepErrors = () => {
    const allErrors = methods.formState.errors;
    const relevantFields = getFieldsForCurrentStep();
    
    const stepErrors = {};
    relevantFields.forEach(field => {
      if (allErrors[field]) {
        stepErrors[field] = allErrors[field];
      }
    });
    
    return stepErrors;
  };

  // Function to clear validation errors for a specific field
  const clearFieldError = (fieldName: string) => {
    // Use clearErrors to remove error for that field
    methods.clearErrors(fieldName);
  };

  const renderCurrentStep = () => {
    // Get errors for current step to pass to error summary
    const currentStepErrors = getCurrentStepErrors();
    
    switch (currentStep) {
      case FormStep.Page1:
        return (
          <>
            <ErrorSummary errors={currentStepErrors} />
            <RocketFormPage1 
              onNext={handleNextStep}
              onCancel={handleCancelForm}
              onFieldChange={clearFieldError}
            />
          </>
        );
      case FormStep.Page2:
        return (
          <>
            <ErrorSummary errors={currentStepErrors} />
            <RocketFormPage2 
              onNext={handleNextStep} 
              onPrevious={handlePreviousStep}
              onCancel={handleCancelForm}
              onFieldChange={clearFieldError}
            />
          </>
        );
      case FormStep.Page3:
        return (
          <>
            <ErrorSummary errors={currentStepErrors} />
            <RocketFormPage3 
              onNext={handleNextStep} 
              onPrevious={handlePreviousStep}
              onCancel={handleCancelForm}
              onFieldChange={clearFieldError}
            />
          </>
        );
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
            onEdit={handleStartEditing}
            onDelete={handleDeleteRocket}
            onView={handleViewRocket}
            onAddNew={handleAddNew}
            submissionStatus={submissionStatus}
            resetStatus={resetSubmissionStatus}
            operationType={operationType}
          />
        );
      case FormStep.Detail:
        return viewingRocketId ? (
          <RocketDetail
            rocketId={viewingRocketId}
            onBack={handleBackToList}
            onEdit={handleStartEditing}
          />
        ) : null;
      default:
        return null;
    }
  };

  // Determine if we're currently in a loading state
  const isLoading = isAdding || isUpdating;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {currentStep === FormStep.List ? 'Rocket Registry' : 
           currentStep === FormStep.Detail ? 'Rocket Details' :
           editingRocket ? 'Edit Rocket' : 'Register New Rocket'}
        </h1>
        
        {(currentStep !== FormStep.List && currentStep !== FormStep.Detail) && (
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
      
        {/* Add loading indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 flex items-center justify-center z-40">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            </div>
          </div>
        )}
      
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