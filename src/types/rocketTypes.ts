// types/rocketTypes.ts
import { z } from "zod";

// Define the Zod schema
export const rocketSchema = z.object({
  // Basic Info
  name: z.string().min(3, "Name must be at least 3 characters"),
  manufacturer: z.string().min(2, "Manufacturer must be at least 2 characters"),
  model: z.string().min(1, "Model is required"),
  
  // Technical Specs
  height: z.number().positive("Height must be positive"),
  diameter: z.number().positive("Diameter must be positive"),
  stages: z.number().int().min(1, "Must have at least 1 stage"),
  engineType: z.string().min(1, "Engine type is required"),
  
  // Launch Details
  launchSite: z.string().min(1, "Launch site is required"),
  launchDate: z.string().min(1, "Launch date is required"),
  payload: z.number().nonnegative("Payload cannot be negative"),
  orbit: z.string().min(1, "Orbit is required"),
});

// Create type from Zod schema
export type RocketFormData = z.infer<typeof rocketSchema>;

// Define types for field definitions
export type FieldDefinition = {
  label: string;
  key: keyof RocketFormData;
  suffix?: string;
};

export type SectionDefinition = {
  title: string;
  page: number;
  fields: FieldDefinition[];
};

// Define component prop types
export type PageNavigator = (page: number) => void;

export type SummaryPageProps = {
  goToPage: PageNavigator;
};

export type ResultsPageProps = {
  status: "success" | "error" | null;
  rockets: RocketFormData[];
  resetForm: () => void;
};

export type ProgressBarProps = {
  steps: string[];
  currentStep: number;
};