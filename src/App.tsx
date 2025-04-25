import { useState, JSX } from 'react';
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define the Zod schema
const rocketSchema = z.object({
  // Basic Info
  name: z.string().min(3, 'Name must be at least 3 characters'),
  manufacturer: z.string().min(2, 'Manufacturer must be at least 2 characters'),
  model: z.string().min(1, 'Model is required'),

  // Technical Specs
  height: z.number().positive('Height must be positive'),
  diameter: z.number().positive('Diameter must be positive'),
  stages: z.number().int().min(1, 'Must have at least 1 stage'),
  engineType: z.string().min(1, 'Engine type is required'),

  // Launch Details
  launchSite: z.string().min(1, 'Launch site is required'),
  launchDate: z.string().min(1, 'Launch date is required'),
  payload: z.number().nonnegative('Payload cannot be negative'),
  orbit: z.string().min(1, 'Orbit is required'),
});

// Create type from Zod schema
type RocketFormData = z.infer<typeof rocketSchema>;

// Define types for other components
type PageNavigator = (page: number) => void;
type DirectionNavigator = (direction: 'next' | 'prev') => void;

type SummaryPageProps = {
  goToPage: PageNavigator;
};

type ResultsPageProps = {
  status: 'success' | 'error' | null;
  rockets: RocketFormData[];
  resetForm: () => void;
};

function App(): JSX.Element {
  const [page, setPage] = useState<number>(0);
  const [registeredRockets, setRegisteredRockets] = useState<RocketFormData[]>(
    []
  );
  const [submissionStatus, setSubmissionStatus] = useState<
    'success' | 'error' | null
  >(null);

  const methods = useForm<RocketFormData>({
    resolver: zodResolver(rocketSchema),
    defaultValues: {
      name: '',
      manufacturer: '',
      model: '',
      height: 0,
      diameter: 0,
      stages: 1,
      engineType: '',
      launchSite: '',
      launchDate: '',
      payload: 0,
      orbit: '',
    },
  });

  const submitForm = (data: RocketFormData): void => {
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance of success
      if (success) {
        setRegisteredRockets([...registeredRockets, data]);
        setSubmissionStatus('success');
      } else {
        setSubmissionStatus('error');
      }
      setPage(4); // Move to results page
    }, 1000);
  };

  const navigatePages: DirectionNavigator = (direction) => {
    if (direction === 'next') {
      if (page === 0) {
        methods.trigger(['name', 'manufacturer', 'model']).then((valid) => {
          if (valid) setPage(page + 1);
        });
      } else if (page === 1) {
        methods
          .trigger(['height', 'diameter', 'stages', 'engineType'])
          .then((valid) => {
            if (valid) setPage(page + 1);
          });
      } else if (page === 2) {
        methods
          .trigger(['launchSite', 'launchDate', 'payload', 'orbit'])
          .then((valid) => {
            if (valid) setPage(page + 1);
          });
      } else if (page === 3) {
        methods.handleSubmit(submitForm)();
      }
    } else if (direction === 'prev') {
      setPage(Math.max(0, page - 1));
    }
  };

  const renderForm = (): JSX.Element => {
    switch (page) {
      case 0:
        return <BasicInfoForm />;
      case 1:
        return <TechnicalSpecsForm />;
      case 2:
        return <LaunchDetailsForm />;
      case 3:
        return <SummaryPage goToPage={setPage} />;
      case 4:
        return (
          <ResultsPage
            status={submissionStatus}
            rockets={registeredRockets}
            resetForm={() => {
              methods.reset();
              setPage(0);
            }}
          />
        );
      default:
        return <BasicInfoForm />;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Rocket Registration System
      </h1>

      {page < 4 && (
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {['Basic Info', 'Technical Specs', 'Launch Details', 'Summary'].map(
              (step, i) => (
                <div
                  key={i}
                  className={`text-sm ${
                    i === page ? 'font-bold text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {step}
                </div>
              )
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(page + 1) * 25}%` }}
            ></div>
          </div>
        </div>
      )}

      <FormProvider {...methods}>
        {renderForm()}

        {page < 3 && (
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigatePages('prev')}
              disabled={page === 0}
              className={`px-4 py-2 rounded ${
                page === 0
                  ? 'bg-gray-300'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => navigatePages('next')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        )}
      </FormProvider>
    </div>
  );
}

// Form Step 1: Basic Info
function BasicInfoForm(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<RocketFormData>();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Rocket Name</label>
        <input
          {...register('name')}
          className="w-full p-2 border rounded"
          placeholder="Falcon 9"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Manufacturer</label>
        <input
          {...register('manufacturer')}
          className="w-full p-2 border rounded"
          placeholder="SpaceX"
        />
        {errors.manufacturer && (
          <p className="text-red-500 text-sm mt-1">
            {errors.manufacturer.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Model</label>
        <input
          {...register('model')}
          className="w-full p-2 border rounded"
          placeholder="Block 5"
        />
        {errors.model && (
          <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
        )}
      </div>
    </div>
  );
}

// Form Step 2: Technical Specs
function TechnicalSpecsForm(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<RocketFormData>();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Height (meters)</label>
        <input
          {...register('height', { valueAsNumber: true })}
          type="number"
          className="w-full p-2 border rounded"
          step="0.1"
        />
        {errors.height && (
          <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Diameter (meters)</label>
        <input
          {...register('diameter', { valueAsNumber: true })}
          type="number"
          className="w-full p-2 border rounded"
          step="0.1"
        />
        {errors.diameter && (
          <p className="text-red-500 text-sm mt-1">{errors.diameter.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Number of Stages</label>
        <input
          {...register('stages', { valueAsNumber: true })}
          type="number"
          className="w-full p-2 border rounded"
          min="1"
        />
        {errors.stages && (
          <p className="text-red-500 text-sm mt-1">{errors.stages.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Engine Type</label>
        <select
          {...register('engineType')}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Engine Type</option>
          <option value="Liquid">Liquid</option>
          <option value="Solid">Solid</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Ion">Ion</option>
          <option value="Nuclear">Nuclear</option>
        </select>
        {errors.engineType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.engineType.message}
          </p>
        )}
      </div>
    </div>
  );
}

// Form Step 3: Launch Details
function LaunchDetailsForm(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<RocketFormData>();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Launch Details</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Launch Site</label>
        <input
          {...register('launchSite')}
          className="w-full p-2 border rounded"
          placeholder="Kennedy Space Center"
        />
        {errors.launchSite && (
          <p className="text-red-500 text-sm mt-1">
            {errors.launchSite.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Launch Date</label>
        <input
          {...register('launchDate')}
          type="date"
          className="w-full p-2 border rounded"
        />
        {errors.launchDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.launchDate.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Payload Capacity (kg)</label>
        <input
          {...register('payload', { valueAsNumber: true })}
          type="number"
          className="w-full p-2 border rounded"
        />
        {errors.payload && (
          <p className="text-red-500 text-sm mt-1">{errors.payload.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Target Orbit</label>
        <select {...register('orbit')} className="w-full p-2 border rounded">
          <option value="">Select Orbit</option>
          <option value="LEO">Low Earth Orbit (LEO)</option>
          <option value="MEO">Medium Earth Orbit (MEO)</option>
          <option value="GEO">Geostationary Orbit (GEO)</option>
          <option value="HEO">Highly Elliptical Orbit (HEO)</option>
          <option value="SSO">Sun-Synchronous Orbit (SSO)</option>
          <option value="Lunar">Lunar</option>
          <option value="Interplanetary">Interplanetary</option>
        </select>
        {errors.orbit && (
          <p className="text-red-500 text-sm mt-1">{errors.orbit.message}</p>
        )}
      </div>
    </div>
  );
}

// Define types for field definitions
type FieldDefinition = {
  label: string;
  key: keyof RocketFormData;
  suffix?: string;
};

type SectionDefinition = {
  title: string;
  page: number;
  fields: FieldDefinition[];
};

// Summary Page with Change Links
function SummaryPage({ goToPage }: SummaryPageProps): JSX.Element {
  const { getValues } = useFormContext<RocketFormData>();
  const values = getValues();

  const sections: SectionDefinition[] = [
    {
      title: 'Basic Information',
      page: 0,
      fields: [
        { label: 'Rocket Name', key: 'name' },
        { label: 'Manufacturer', key: 'manufacturer' },
        { label: 'Model', key: 'model' },
      ],
    },
    {
      title: 'Technical Specifications',
      page: 1,
      fields: [
        { label: 'Height', key: 'height', suffix: ' meters' },
        { label: 'Diameter', key: 'diameter', suffix: ' meters' },
        { label: 'Number of Stages', key: 'stages' },
        { label: 'Engine Type', key: 'engineType' },
      ],
    },
    {
      title: 'Launch Details',
      page: 2,
      fields: [
        { label: 'Launch Site', key: 'launchSite' },
        { label: 'Launch Date', key: 'launchDate' },
        { label: 'Payload Capacity', key: 'payload', suffix: ' kg' },
        { label: 'Target Orbit', key: 'orbit' },
      ],
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <p className="mb-4 text-gray-600">
        Please review your rocket registration information.
      </p>

      {sections.map((section, idx) => (
        <div key={idx} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-lg">{section.title}</h3>
            <button
              type="button"
              onClick={() => goToPage(section.page)}
              className="text-blue-500 text-sm hover:underline"
            >
              Change
            </button>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            {section.fields.map((field, fidx) => (
              <div key={fidx} className="flex py-1">
                <div className="text-gray-600 w-1/2">{field.label}:</div>
                <div className="font-medium">
                  {values[field.key]}
                  {field.suffix || ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => goToPage(3)}
        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
      >
        Submit Registration
      </button>
    </div>
  );
}

// Results Page
function ResultsPage({
  status,
  rockets,
  resetForm,
}: ResultsPageProps): JSX.Element {
  return (
    <div>
      {status === 'success' ? (
        <div className="text-center mb-6">
          <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
            <h2 className="text-xl font-bold">Registration Successful</h2>
            <p>Your rocket has been registered successfully!</p>
          </div>
        </div>
      ) : (
        <div className="text-center mb-6">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            <h2 className="text-xl font-bold">Registration Failed</h2>
            <p>There was an error registering your rocket. Please try again.</p>
          </div>
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Registered Rockets</h2>
      {rockets.length === 0 ? (
        <p className="text-gray-500">No rockets have been registered yet.</p>
      ) : (
        <div className="space-y-4">
          {rockets.map((rocket, idx) => (
            <div key={idx} className="border p-4 rounded">
              <h3 className="font-bold">{rocket.name}</h3>
              <p className="text-gray-600">
                Manufacturer: {rocket.manufacturer}
              </p>
              <p className="text-gray-600">Launch Date: {rocket.launchDate}</p>
            </div>
          ))}
        </div>
      )}

      {status === 'success' && (
        <button
          onClick={resetForm}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register Another Rocket
        </button>
      )}
    </div>
  );
}

export default App;
