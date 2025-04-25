import { JSX } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { TextInput } from "../inputs/TextInput";

export const BasicInfoForm = (): JSX.Element => {
  return (
    <div>
      <SectionHeader title="Basic Information" />
      
      <TextInput
        name="name"
        label="Rocket Name"
        placeholder="Falcon 9"
        required
      />
      
      <TextInput
        name="manufacturer"
        label="Manufacturer"
        placeholder="SpaceX"
        required
      />
      
      <TextInput
        name="model"
        label="Model"
        placeholder="Block 5"
        required
      />
    </div>
  );
};
