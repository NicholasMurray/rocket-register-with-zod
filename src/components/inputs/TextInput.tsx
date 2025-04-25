import { JSX } from "react";
import { useFormContext } from "react-hook-form";
import { RocketFormData } from "../../types/rocketTypes";

type TextInputProps = {
  name: keyof RocketFormData;
  label: string;
  placeholder?: string;
  required?: boolean;
};

export const TextInput = ({ name, label, placeholder, required = false }: TextInputProps): JSX.Element => {
  const { register, formState: { errors } } = useFormContext<RocketFormData>();
  
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register(name)}
        className="w-full p-2 border rounded"
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};