export interface EmailSubscription {
  email: string;
  purpose: string;
  subscribedAt: string;
  preferences: {
    safetyAlerts: boolean;
    updates: boolean;
    newsletter: boolean;
  };
}
