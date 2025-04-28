export const ErrorSummary = ({ errors }) => {
if (!errors || Object.keys(errors).length === 0) return null;

  return (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <h3 className="text-red-700 font-medium mb-2">Please fix the following errors:</h3>
      <ul className="list-disc pl-5">
          {Object.entries(errors).map(([field, error]) => (
          <li key={field} className="text-red-600 text-sm">
              {error.message?.toString()}
          </li>
          ))}
      </ul>
      </div>
  );
};