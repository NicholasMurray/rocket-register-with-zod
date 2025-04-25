import { JSX } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { TextInput } from "../inputs/TextInput";
import { DateInput } from "../inputs/DateInput";
import { NumberInput } from "../inputs/NumberInput";
import { SelectInput } from "../inputs/SelectInput";

export const LaunchDetailsForm = (): JSX.Element => {
  const orbitOptions = [
    { value: "LEO", label: "Low Earth Orbit (LEO)" },
    { value: "MEO", label: "Medium Earth Orbit (MEO)" },
    { value: "GEO", label: "Geostationary Orbit (GEO)" },
    { value: "HEO", label: "Highly Elliptical Orbit (HEO)" },
    { value: "SSO", label: "Sun-Synchronous Orbit (SSO)" },
    { value: "Lunar", label: "Lunar" },
    { value: "Interplanetary", label: "Interplanetary" }
  ];
  
  return (
    <div>
      <SectionHeader title="Launch Details" />
      
      <TextInput
        name="launchSite"
        label="Launch Site"
        placeholder="Kennedy Space Center"
        required
      />
      
      <DateInput
        name="launchDate"
        label="Launch Date"
        required
      />
      
      <NumberInput
        name="payload"
        label="Payload Capacity"
        suffix="kg"
        required
      />
      
      <SelectInput
        name="orbit"
        label="Target Orbit"
        options={orbitOptions}
        placeholder="Select Orbit"
        required
      />
    </div>
  );
};
