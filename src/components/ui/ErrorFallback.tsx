import React from 'react';
import { Button } from './Button';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onReload?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please reload the page to continue.',
  onReload,
}) => {
  const handleReload = () => {
    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      role="alert"
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
    >
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-green-200 bg-white shadow-md dark:border-green-800/60 dark:bg-gray-800">
          <img
            src="/LogoPandagarde.png"
            alt="PandaGarde"
            className="h-full w-full object-contain p-1"
            width={64}
            height={64}
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <Button variant="primary" onClick={handleReload}>
          Reload page
        </Button>
      </div>
    </div>
  );
};

export default ErrorFallback;
