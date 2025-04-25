import { JSX } from "react";
import { useFormContext } from "react-hook-form";
import { SectionDefinition, SummaryPageProps, RocketFormData } from "../../types/rocketTypes";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";

export const SummaryPage = ({ goToPage }: SummaryPageProps): JSX.Element => {
  const { getValues } = useFormContext<RocketFormData>();
  const values = getValues();
  
  const sections: SectionDefinition[] = [
    {
      title: "Basic Information",
      page: 0,
      fields: [
        { label: "Rocket Name", key: "name" },
        { label: "Manufacturer", key: "manufacturer" },
        { label: "Model", key: "model" },
      ],
    },
    {
      title: "Technical Specifications",
      page: 1,
      fields: [
        { label: "Height", key: "height", suffix: " meters" },
        { label: "Diameter", key: "diameter", suffix: " meters" },
        { label: "Number of Stages", key: "stages" },
        { label: "Engine Type", key: "engineType" },
      ],
    },
    {
      title: "Launch Details",
      page: 2,
      fields: [
        { label: "Launch Site", key: "launchSite" },
        { label: "Launch Date", key: "launchDate" },
        { label: "Payload Capacity", key: "payload", suffix: " kg" },
        { label: "Target Orbit", key: "orbit" },
      ],
    },
  ];
  
  return (
    <div>
      <SectionHeader title="Summary" />
      <p className="mb-4 text-gray-600">Please review your rocket registration information.</p>
      
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
                  {values[field.key]}{field.suffix || ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <Button 
        variant="success" 
        fullWidth 
        onClick={() => goToPage(3)}
      >
        Submit Registration
      </Button>
    </div>
  );
};