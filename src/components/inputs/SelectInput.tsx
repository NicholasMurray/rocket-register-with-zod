import { JSX } from "react";
import { useFormContext } from "react-hook-form";
import { RocketFormData } from "../../types/rocketTypes";

type Option = {
  value: string;
  label: string;
};

type SelectInputProps = {
  name: keyof RocketFormData;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
};

export const SelectInput = ({ 
  name, 
  label, 
  options, 
  placeholder = "Select an option",
  required = false
}: SelectInputProps): JSX.Element => {
  const { register, formState: { errors } } = useFormContext<RocketFormData>();
  
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...register(name)}
        className="w-full p-2 border rounded"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};
