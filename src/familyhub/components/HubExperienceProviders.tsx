import React from 'react';
import { FamilyProviderOptional } from '../../contexts/FamilyContext';
import { ProgressProviderOptional } from '../../contexts/ProgressContext';
import { FamilyProgressProviderOptional } from '../../contexts/FamilyProgressContext';

/**
 * Ensures Family Hub screens always have required contexts, even when the hub
 * bundle is mounted without the main site's provider tree (e.g. alternate entry).
 * Skips nesting when an ancestor already supplies the same context.
 */
const HubExperienceProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FamilyProviderOptional>
    <ProgressProviderOptional>
      <FamilyProgressProviderOptional>{children}</FamilyProgressProviderOptional>
    </ProgressProviderOptional>
  </FamilyProviderOptional>
);

export default HubExperienceProviders;
