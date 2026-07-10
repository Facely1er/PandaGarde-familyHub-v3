import React from 'react';
import { useAppReviewAutoTour } from '../useAppReviewAutoTour';

/** Mounts the App Review auto-tour when ?appReviewDemo=1 or VITE_APP_REVIEW_DEMO=true. */
const AppReviewTourHost: React.FC = () => {
  useAppReviewAutoTour();
  return null;
};

export default AppReviewTourHost;
