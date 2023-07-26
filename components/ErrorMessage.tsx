import React from "react";

interface ErrorProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong className="font-bold">Oh no! An error occurred:</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  );
};

export default ErrorMessage;
