import { JSX } from "react";
import { useFormContext } from "react-hook-form";
import { RocketFormData } from "../../types/rocketTypes";

type DateInputProps = {
  name: keyof RocketFormData;
  label: string;
  required?: boolean;
};

export const DateInput = ({ name, label, required = false }: DateInputProps): JSX.Element => {
  const { register, formState: { errors } } = useFormContext<RocketFormData>();
  
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name)}
        type="date"
        className="w-full p-2 border rounded"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};