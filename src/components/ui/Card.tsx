import { JSX, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className = "" }: CardProps): JSX.Element => {
  return (
    <div className={`border p-4 rounded ${className}`}>
      {children}
    </div>
  );
};