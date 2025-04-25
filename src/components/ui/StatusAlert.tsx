import { JSX } from "react";

type StatusAlertProps = {
    type: "success" | "error";
    title: string;
    message: string;
  };
  
export const StatusAlert = ({ type, title, message }: StatusAlertProps): JSX.Element => {
const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
const textColor = type === "success" ? "text-green-700" : "text-red-700";

return (
    <div className={`${bgColor} ${textColor} p-4 rounded mb-6`}>
    <h2 className="text-xl font-bold">{title}</h2>
    <p>{message}</p>
    </div>
);
};