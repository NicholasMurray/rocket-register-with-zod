import { JSX, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
};

export const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className = ""
}: ButtonProps): JSX.Element => {
  const baseClasses = "px-4 py-2 rounded";
  const widthClass = fullWidth ? "w-full" : "";
  
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };
  
  const disabledClass = disabled ? "bg-gray-300 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${widthClass} ${variantClasses[variant]} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
};