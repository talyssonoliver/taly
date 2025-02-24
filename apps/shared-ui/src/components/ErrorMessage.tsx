import type React from "react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  if (!message) return null;

  return (
    <div className={`text-red-600 text-sm font-medium ${className}`}>
      {message}
    </div>
  );
};

export default ErrorMessage;
