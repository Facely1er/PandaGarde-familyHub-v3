import React from 'react';
import { getHubAgeGroupMeta, type HubAgeRange } from '../hubAgeBands';

interface AgeMatchedPreviewProps {
  age: number;
  ageBandLabel: (range: HubAgeRange) => string;
  matchedLabel: string;
}

/** Shown under the age field when the age maps to a mission band (5–17). */
const AgeMatchedPreview: React.FC<AgeMatchedPreviewProps> = ({ age, ageBandLabel, matchedLabel }) => {
  const group = getHubAgeGroupMeta(age, ageBandLabel);
  if (!group) {
    return null;
  }

  const Icon = group.icon;
  return (
    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
      {matchedLabel}{' '}
      <span className="inline-flex items-center gap-1 font-medium">
        <Icon size={14} aria-hidden="true" />
        {group.label}
      </span>
    </p>
  );
};

export default AgeMatchedPreview;
