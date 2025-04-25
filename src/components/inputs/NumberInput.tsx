import { JSX } from "react";
import { useFormContext } from "react-hook-form";
import { RocketFormData } from "../../types/rocketTypes";

type NumberInputProps = {
  name: keyof RocketFormData;
  label: string;
  min?: number;
  step?: string;
  suffix?: string;
  required?: boolean;
};

export const NumberInput = ({ 
  name, 
  label, 
  min, 
  step = "0.1", 
  suffix,
  required = false
}: NumberInputProps): JSX.Element => {
  const { register, formState: { errors } } = useFormContext<RocketFormData>();
  
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">
        {label}{suffix && ` (${suffix})`}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name, { valueAsNumber: true })}
        type="number"
        min={min}
        step={step}
        className="w-full p-2 border rounded"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};
