import { Navigate } from 'react-router-dom';
import { loadDfaJourneyState } from '../lib/dfaJourney';

/** Legacy `/get-started` — resume the saved DFA step instead of a duplicate hub page. */
const GetStartedRedirect: React.FC = () => {
  const { resumePath } = loadDfaJourneyState();
  const target = resumePath === '/get-started' ? '/service-catalog' : resumePath;
  return <Navigate to={target} replace />;
};

export default GetStartedRedirect;
