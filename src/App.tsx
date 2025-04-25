import { JSX, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
import { BasicInfoForm } from "./components/forms/BasicInfoForm";
import { TechnicalSpecsForm } from "./components/forms/TechnicalSpecsForm";
import { LaunchDetailsForm } from "./components/forms/LaunchDetailsForm";
import { SummaryPage } from "./components/forms/SummaryPage";
import { ResultsPage } from "./components/forms/ResultsPage";
import { ProgressBar } from "./components/ui/ProgressBar";
import { rocketSchema, RocketFormData } from "./types/rocketTypes";

type DirectionNavigator = (direction: "next" | "prev") => void;

function App(): JSX.Element {
  const [page, setPage] = useState<number>(0);
  const [registeredRockets, setRegisteredRockets] = useState<RocketFormData[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<"success" | "error" | null>(null);
  
  const methods = useForm<RocketFormData>({
    resolver: zodResolver(rocketSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      model: "",
      height: 0,
      diameter: 0,
      stages: 1,
      engineType: "",
      launchSite: "",
      launchDate: "",
      payload: 0,
      orbit: "",
    },
  });
  
  const submitForm = (data: RocketFormData): void => {
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance of success
      if (success) {
        setRegisteredRockets([...registeredRockets, data]);
        setSubmissionStatus("success");
      } else {
        setSubmissionStatus("error");
      }
      setPage(4); // Move to results page
    }, 1000);
  };
  
  const navigatePages: DirectionNavigator = (direction) => {
    if (direction === "next") {
      if (page === 0) {
        methods.trigger(["name", "manufacturer", "model"]).then((valid) => {
          if (valid) setPage(page + 1);
        });
      } else if (page === 1) {
        methods.trigger(["height", "diameter", "stages", "engineType"]).then((valid) => {
          if (valid) setPage(page + 1);
        });
      } else if (page === 2) {
        methods.trigger(["launchSite", "launchDate", "payload", "orbit"]).then((valid) => {
          if (valid) setPage(page + 1);
        });
      } else if (page === 3) {
        methods.handleSubmit(submitForm)();
      }
    } else if (direction === "prev") {
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
        return <ResultsPage 
          status={submissionStatus} 
          rockets={registeredRockets} 
          resetForm={() => {
            methods.reset();
            setPage(0);
          }} 
        />;
      default:
        return <BasicInfoForm />;
    }
  };
  
  const formSteps = ["Basic Info", "Technical Specs", "Launch Details", "Summary"];
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Rocket Registration System
      </h1>
      
      {page < 4 && <ProgressBar steps={formSteps} currentStep={page} />}
      
      <FormProvider {...methods}>
        {renderForm()}
        
        {page < 3 && (
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigatePages("prev")}
              disabled={page === 0}
              className={`px-4 py-2 rounded ${
                page === 0 ? "bg-gray-300" : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => navigatePages("next")}
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

export default App;