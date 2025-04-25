import { JSX } from "react";
import { ProgressBarProps } from "../../types/rocketTypes";

export const ProgressBar = ({ steps, currentStep }: ProgressBarProps): JSX.Element => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {steps.map((step, i) => (
          <div 
            key={i} 
            className={`text-sm ${i === currentStep ? "font-bold text-blue-600" : "text-gray-500"}`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${(currentStep + 1) * (100 / steps.length)}%` }}
        ></div>
      </div>
    </div>
  );
};