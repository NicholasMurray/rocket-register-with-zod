import { JSX } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { NumberInput } from "../inputs/NumberInput";
import { SelectInput } from "../inputs/SelectInput";

export const TechnicalSpecsForm = (): JSX.Element => {
  const engineOptions = [
    { value: "Liquid", label: "Liquid" },
    { value: "Solid", label: "Solid" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Ion", label: "Ion" },
    { value: "Nuclear", label: "Nuclear" }
  ];
  
  return (
    <div>
      <SectionHeader title="Technical Specifications" />
      
      <NumberInput
        name="height"
        label="Height"
        suffix="meters"
        required
      />
      
      <NumberInput
        name="diameter"
        label="Diameter"
        suffix="meters"
        required
      />
      
      <NumberInput
        name="stages"
        label="Number of Stages"
        min={1}
        step="1"
        required
      />
      
      <SelectInput
        name="engineType"
        label="Engine Type"
        options={engineOptions}
        placeholder="Select Engine Type"
        required
      />
    </div>
  );
};
