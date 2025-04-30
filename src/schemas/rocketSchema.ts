import * as z from 'zod';

export const rocketSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  model: z.string().min(1, { message: "Model is required" }),
  manufacturer: z.string().min(2, { message: "Manufacturer must be at least 2 characters" }),
  yearBuilt: z.coerce.number().int().min(1900, { message: "Year must be 1900 or later" }).max(new Date().getFullYear(), { message: "Year cannot be in the future" }),
  height: z.coerce.number().positive({ message: "Height must be positive" }),
  diameter: z.coerce.number().positive({ message: "Diameter must be positive" }),
  mass: z.coerce.number().positive({ message: "Mass must be positive" }),
  fuelType: z.string().min(1, { message: "Fuel type is required" }),
  maxThrust: z.coerce.number().positive({ message: "Max thrust must be positive" }),
  capacity: z.coerce.number().int().nonnegative({ message: "Capacity must be 0 or greater" }),
  description: z.string().optional(),
});

export type RocketFormValues = z.infer<typeof rocketSchema>;
