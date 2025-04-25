import { JSX } from "react";
import { ResultsPageProps } from "../../types/rocketTypes"; 
import { SectionHeader } from "../ui/SectionHeader";
import { StatusAlert } from "../ui/StatusAlert";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export const ResultsPage = ({ status, rockets, resetForm }: ResultsPageProps): JSX.Element => {
  return (
    <div>
      {status === "success" ? (
        <div className="text-center mb-6">
          <StatusAlert 
            type="success"
            title="Registration Successful"
            message="Your rocket has been registered successfully!"
          />
        </div>
      ) : (
        <div className="text-center mb-6">
          <StatusAlert 
            type="error"
            title="Registration Failed"
            message="There was an error registering your rocket. Please try again."
          />
          <Button onClick={resetForm}>Try Again</Button>
        </div>
      )}
      
      <SectionHeader title="Registered Rockets" />
      
      {rockets.length === 0 ? (
        <p className="text-gray-500">No rockets have been registered yet.</p>
      ) : (
        <div className="space-y-4">
          {rockets.map((rocket, idx) => (
            <Card key={idx}>
              <h3 className="font-bold">{rocket.name}</h3>
              <p className="text-gray-600">Manufacturer: {rocket.manufacturer}</p>
              <p className="text-gray-600">Launch Date: {rocket.launchDate}</p>
            </Card>
          ))}
        </div>
      )}
      
      {status === "success" && (
        <Button 
          onClick={resetForm} 
          className="mt-6"
        >
          Register Another Rocket
        </Button>
      )}
    </div>
  );
};