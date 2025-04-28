export type Rocket = {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  yearBuilt: number;
  height: number;
  diameter: number;
  mass: number;
  fuelType: string;
  maxThrust: number;
  capacity: number;
  description: string;
};

export type RocketFormData = Omit<Rocket, 'id'>;

// Type for error object
export type FormErrors = {
  [key: string]: { 
    message?: string;
    type?: string;
  }
};
