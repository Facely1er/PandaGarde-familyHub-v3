import React from 'react';

interface MemberFormErrorsProps {
  errors: string[];
}

const MemberFormErrors: React.FC<MemberFormErrorsProps> = ({ errors }) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
    >
      <ul className="list-disc space-y-1 pl-4">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default MemberFormErrors;
