import { useContext } from 'react';
import { HubFamilyContext, type HubFamilyContextValue } from '../contexts/hubFamilyContextState';

export function useHubFamilyMembers(): HubFamilyContextValue {
  const context = useContext(HubFamilyContext);
  if (!context) {
    throw new Error('useHubFamilyMembers must be used within HubFamilyProvider');
  }
  return context;
}
