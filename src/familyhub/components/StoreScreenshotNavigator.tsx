import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initStoreScreenshotMode, isStoreScreenshotBuild } from '../storeScreenshotMode';

/** Polls the local capture server for the next screen (iOS Simulator automation). */
const StoreScreenshotNavigator: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isStoreScreenshotBuild()) {
      return undefined;
    }
    return initStoreScreenshotMode(navigate);
  }, [navigate]);

  return null;
};

export default StoreScreenshotNavigator;
