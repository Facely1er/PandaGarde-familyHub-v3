import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceCatalog from '../components/ServiceCatalog';
import EmailCaptureInline from '../components/EmailCaptureInline';
import { ProgressBar } from '../components/ui/ProgressBar';
import DfaJourneyStepper from '../components/journey/DfaJourneyStepper';
import { Bell, Shield, BarChart3, FileText, ArrowRight, Unlock, CheckCircle, Sparkles, Target, ExternalLink, Scale, Plus, Heart, School, BookOpen, AlertTriangle, Bot, Signal } from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';
import { PRIVACY_PORTAL_URL, PRIVACY_PORTAL_OPT_OUT_URL } from '../config/portal';
import { childServiceCatalog, getSchoolAssignedServices, getServicesWithLawEnforcementConcerns } from '../data/childServiceCatalog';
import { getServiceLogoUrlWithBrandColor, hasServiceLogo } from '../utils/serviceLogos';
import { updateDfaJourneyPhase } from '../lib/dfaJourney';

const SUGGESTED_SERVICE_IDS = ['youtube', 'instagram', 'whatsapp', 'roblox', 'khan-academy', 'duolingo'] as const;
const SCHOOL_SERVICE_IDS = ['google-classroom', 'microsoft-teams-edu', 'canvas-lms', 'schoology', 'seesaw', 'zoom', 'classdojo', 'kahoot', 'quizlet', 'ixl', 'remind', 'nearpod', 'prodigy', 'code-org'] as const;
const AI_SERVICE_IDS = ['chatgpt', 'google-gemini', 'microsoft-copilot', 'character-ai', 'snapchat-my-ai', 'meta-ai', 'grammarly', 'perplexity-ai', 'khanmigo'] as const;
const TELECOM_SERVICE_IDS = ['verizon', 'att', 'tmobile', 'cricket-wireless', 'boost-mobile', 'mint-mobile'] as const;
const HIGH_LE_CONCERN_IDS = ['att', 'verizon', 'tmobile', 'tiktok', 'google-classroom', 'chatgpt', 'discord', 'snapchat', 'instagram', 'youtube', 'microsoft-teams-edu'] as const;

const headerActionLinkClass =
  'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-green-800 px-4 py-2 text-white transition-colors hover:bg-green-900';

const ServiceCatalogPage: React.FC = () => {
  const { getFamilyServices, addServiceToFamily, removeServiceFromFamily } = useFamily();
  const [servicesCount, setServicesCount] = useState(0);
  const [addingId, setAddingId] = useState<string | null>(null);
  const updateCount = () => setServicesCount(getFamilyServices().length);

  useEffect(() => {
    updateCount();
    const interval = setInterval(updateCount, 1000);
    return () => clearInterval(interval);
  }, [getFamilyServices]);

  useEffect(() => {
    updateDfaJourneyPhase('profile', {
      visited: true,
      completed: servicesCount >= 3,
      resumePath: servicesCount >= 3 ? '/digital-footprint' : '/service-catalog',
    });
  }, [servicesCount]);

  const progressPercent = Math.min((servicesCount / 5) * 100, 100);
  const isReadyForAnalysis = servicesCount >= 3;
  const familyServiceIds = getFamilyServices();
  const suggestedServices = childServiceCatalog.filter(s => SUGGESTED_SERVICE_IDS.includes(s.id as typeof SUGGESTED_SERVICE_IDS[number]));
  const schoolServices = getSchoolAssignedServices().filter(s => SCHOOL_SERVICE_IDS.includes(s.id as typeof SCHOOL_SERVICE_IDS[number]));
  const aiServices = childServiceCatalog.filter(s => AI_SERVICE_IDS.includes(s.id as typeof AI_SERVICE_IDS[number]));
  const telecomServices = childServiceCatalog.filter(s => TELECOM_SERVICE_IDS.includes(s.id as typeof TELECOM_SERVICE_IDS[number]));
  const leConcernServices = getServicesWithLawEnforcementConcerns().filter(s => HIGH_LE_CONCERN_IDS.includes(s.id as typeof HIGH_LE_CONCERN_IDS[number]));

  const handleSuggestedAddRemove = async (serviceId: string) => {
    if (addingId) {return;}
    setAddingId(serviceId);
    try {
      if (familyServiceIds.includes(serviceId)) {
        await removeServiceFromFamily(serviceId);
      } else {
        await addServiceToFamily(serviceId);
      }
      updateCount();
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <DfaJourneyStepper
            currentKey="profile"
            compact
            ctaHref={isReadyForAnalysis ? '/digital-footprint' : '/service-catalog'}
            ctaLabel={isReadyForAnalysis ? 'Continue to Digital Footprint Analysis' : 'Keep adding family services'}
            subtitle="Phase 1 is where families define the real apps and services they want PandaGarde to analyze. Add at least 3 to reduce friction in the next phase."
          />
        </div>

        {servicesCount > 0 && (
          <div className={`mb-6 rounded-xl border-2 p-4 transition-all ${isReadyForAnalysis ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-700 dark:from-green-900/20 dark:to-emerald-900/20' : 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isReadyForAnalysis ? 'bg-green-600' : 'bg-blue-600'}`}>
                  {isReadyForAnalysis ? <CheckCircle className="h-6 w-6 text-white" /> : <Target className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${isReadyForAnalysis ? 'text-green-900 dark:text-green-100' : 'text-blue-900 dark:text-blue-100'}`}>
                      {servicesCount} Service{servicesCount !== 1 ? 's' : ''} Added
                    </span>
                    {isReadyForAnalysis && (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-800 dark:text-green-200">
                        <Sparkles size={12} /> Ready for DFA
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <ProgressBar value={progressPercent} size="sm" variant={isReadyForAnalysis ? 'low' : 'primary'} aria-label="Services added progress" className="h-2 w-32" />
                    <span className={`text-sm ${isReadyForAnalysis ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'}`}>
                      {isReadyForAnalysis ? 'Phase 1 complete — continue into DFA.' : servicesCount === 1 ? 'Great start — add 2 more to unlock DFA.' : servicesCount === 2 ? 'Almost there — add 1 more to unlock DFA.' : 'Add 3 services to unlock DFA.'}
                    </span>
                  </div>
                </div>
              </div>
              {isReadyForAnalysis && (
                <Link to="/digital-footprint" className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg">
                  <BarChart3 className="h-5 w-5" />
                  <span>Run DFA</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="mb-8">
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">DFA journey:</span>{' '}
            <span className="font-medium text-green-600 dark:text-green-400">Phase 1 — set your starting point</span>
            {' → '}
            <Link to="/digital-footprint" className="font-medium text-blue-600 hover:underline dark:text-blue-400">Phase 2 — Digital Footprint Analysis</Link>
          </p>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Catalog</h1>
                {servicesCount === 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white">
                    <Unlock size={12} /> Phase 1
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Add the apps your family actually uses so PandaGarde can analyze something real. This phase should feel fast, not like a questionnaire marathon.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link to="/safety-alerts" className={headerActionLinkClass}>
                <Bell className="h-5 w-5 shrink-0" aria-hidden />
                <span>Safety Alerts</span>
              </Link>
              <Link to="/digital-footprint" className={headerActionLinkClass}>
                <BarChart3 className="h-5 w-5 shrink-0" aria-hidden />
                <span>Footprint</span>
              </Link>
            </div>
          </div>

          {servicesCount < 3 && (
            <div className="mb-6 rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6 dark:border-green-800 dark:from-green-900/20 dark:to-blue-900/20">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-700">
                    <Unlock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">How this phase works</h3>
                  <ol className="mb-4 list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li><strong>Choose services</strong> your family actually uses.</li>
                    <li><strong>Tap Add</strong> on each one — no account or backend required.</li>
                    <li><strong>Reach 3 services</strong> to unlock your Digital Footprint Analysis.</li>
                  </ol>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {[
                      ['Privacy snapshot', 'See your family’s exposure at a glance'],
                      ['Risk per app', 'Understand which apps need more care'],
                      ['Actionable next steps', 'Move directly into assessment and Family Hub'],
                    ].map(([title, desc]) => (
                      <div key={title} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {suggestedServices.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Heart className="h-5 w-5 text-green-600 dark:text-green-400" /> Start with these — popular with families
              </h3>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Tap <strong>Add</strong> on any app your family uses. You can add more from the full list below.</p>
              <div className="flex flex-wrap gap-3">
                {suggestedServices.map((service) => {
                  const isAdded = familyServiceIds.includes(service.id);
                  const isAdding = addingId === service.id;
                  return (
                    <div key={service.id} className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${isAdded ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20' : 'border-gray-200 bg-white hover:border-green-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-600'}`}>
                      {hasServiceLogo(service.id) ? (
                        <img src={getServiceLogoUrlWithBrandColor(service.id, 32)} alt={`${service.name} logo`} className="h-8 w-8 rounded" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"><Plus size={16} /></div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{service.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{service.category}</div>
                      </div>
                      <button onClick={() => handleSuggestedAddRemove(service.id)} disabled={isAdding} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isAdded ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800 dark:text-green-200' : 'bg-green-600 text-white hover:bg-green-700'} disabled:cursor-not-allowed disabled:opacity-60`}>
                        {isAdding ? 'Updating…' : isAdded ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <ServiceCatalog guidedMode />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Why this phase matters</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">DFA is only useful if it reflects the real school, home, AI, and telecom services touching your family’s data. This step defines the scope without forcing a heavy signup flow.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Continue when ready</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Once you reach at least three services, continue straight into Digital Footprint Analysis. Your place is saved locally.</p>
            <Link to={isReadyForAnalysis ? '/digital-footprint' : '/get-started'} className="mt-4 inline-flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
              {isReadyForAnalysis ? 'Go to Digital Footprint Analysis' : 'Review the DFA journey'} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {[{ title: 'School services frequently in scope', icon: School, items: schoolServices.slice(0, 6) }, { title: 'AI tools families are increasingly using', icon: Bot, items: aiServices.slice(0, 6) }, { title: 'Telecom services that shape the household data trail', icon: Signal, items: telecomServices.slice(0, 6) }, { title: 'Services with sharper law-enforcement concerns', icon: AlertTriangle, items: leConcernServices.slice(0, 6) }].map(({ title, icon: Icon, items }) => (
            <div key={title} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-slate-900 dark:text-white"><Icon size={18} /><h3 className="text-lg font-bold">{title}</h3></div>
              <div className="flex flex-wrap gap-2">
                {items.map((service) => (
                  <span key={service.id} className="rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1 text-sm text-slate-700 dark:text-slate-300">{service.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <EmailCaptureInline />
        </div>
      </div>
    </div>
  );
};

export default ServiceCatalogPage;
