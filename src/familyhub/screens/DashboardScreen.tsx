import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import FamilyDashboard from "../../components/FamilyDashboard";
import { updateDfaJourneyPhase } from "../../lib/dfaJourney";

const DashboardScreen: React.FC = () => {
  useEffect(() => {
    updateDfaJourneyPhase('hub', { visited: true, completed: true, resumePath: '/family-hub/dashboard' });
  }, []);

  return (
    <div className="min-h-full">
      <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={18} className="mt-0.5 text-emerald-700" />
            <p className="leading-6">You are in <strong>Phase 4</strong> of the DFA journey. Family Hub keeps the plan visible so the work does not disappear after the assessment.</p>
          </div>
          <Link to="/privacy-assessment" className="inline-flex items-center gap-2 font-semibold text-emerald-800 hover:text-emerald-900">
            <ArrowLeft size={16} /> Review assessment
          </Link>
        </div>
      </div>
      <FamilyDashboard appMode={true} />
    </div>
  );
};

export default DashboardScreen;
