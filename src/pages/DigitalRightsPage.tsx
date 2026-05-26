import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Globe,
  Shield,
  BookOpen,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  FileText,
  ExternalLink,
  X,
  ListChecks
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { PRIVACY_PORTAL_URL, PRIVACY_PORTAL_OPT_OUT_URL } from '../config/portal';
import { digitalRightsModules, type LawModule } from '../data/digitalRightsModules';

const DigitalRightsPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<LawModule | null>(null);
  const [showModule, setShowModule] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const modules = digitalRightsModules;

  const categories = [
    { id: 'all', label: 'All Modules', icon: BookOpen },
    { id: 'privacy-laws', label: 'Privacy Laws', icon: Scale },
    { id: 'data-rights', label: 'School & Data', icon: FileText },
    { id: 'consent', label: 'Consent & Age', icon: Shield },
    { id: 'international', label: 'International', icon: Globe },
    { id: 'enforcement', label: 'Enforcement', icon: AlertTriangle },
    { id: 'future', label: 'Future Trends', icon: FileText }
  ];

  const filteredModules =
    activeCategory === 'all'
      ? modules
      : modules.filter((module) => module.category === activeCategory);

  const closeModule = useCallback(() => {
    setShowModule(false);
    setSelectedModule(null);
  }, []);

  useEffect(() => {
    const savedCompleted = localStorage.getItem('digital_rights_completed');
    if (savedCompleted) {
      try {
        setCompletedModules(JSON.parse(savedCompleted) as string[]);
      } catch {
        setCompletedModules([]);
      }
    }
  }, []);

  useEffect(() => {
    if (!showModule) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModule();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showModule, closeModule]);

  useEffect(() => {
    if (!showModule || !modalRef.current) {
      return;
    }

    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || focusable.length === 0) {
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [showModule, selectedModule?.id]);

  const handleModuleStart = (module: LawModule) => {
    setSelectedModule(module);
    setShowModule(true);
  };

  const handleModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId];
      setCompletedModules(newCompleted);
      localStorage.setItem('digital_rights_completed', JSON.stringify(newCompleted));
    }
    closeModule();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = categories.find((cat) => cat.id === category);
    return categoryInfo ? categoryInfo.icon : BookOpen;
  };

  const progressPercent =
    modules.length > 0 ? Math.round((completedModules.length / modules.length) * 100) : 0;

  return (
    <PageLayout
      title="Digital privacy rights"
      subtitle="Privacy legislation and your rights as a digital citizen—including Maryland’s MODPA for residents and how to exercise access, correction, and opt-out requests."
      breadcrumbs={true}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav
          className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm"
          aria-label="Related privacy pages"
        >
          <Link
            to="/for-families"
            className="inline-flex items-center gap-1.5 font-medium text-green-700 hover:underline dark:text-green-400"
          >
            <ListChecks size={15} aria-hidden />
            Resources
          </Link>
          <Link
            to="/digital-footprint"
            className="inline-flex items-center gap-1.5 font-medium text-green-700 hover:underline dark:text-green-400"
          >
            Footprint review
          </Link>
          <Link
            to="/for-families"
            className="inline-flex items-center gap-1.5 font-medium text-green-700 hover:underline dark:text-green-400"
          >
            <BookOpen size={15} aria-hidden />
            All resources
          </Link>
        </nav>

        <section className="mb-6 rounded-xl border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 p-5">
          <h3 className="font-bold text-teal-900 dark:text-teal-100 mb-2">
            Maryland residents: exercise your privacy rights
          </h3>
          <p className="text-sm text-teal-800 dark:text-teal-200 mb-3">
            Under the Maryland Online Data Privacy Act (MODPA), you can submit requests for access,
            correction, deletion, portability, and opt-out of sale or targeted advertising. If your
            school or organization uses the EduSoluce Privacy Portal, you can submit requests there.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={PRIVACY_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <ExternalLink size={16} aria-hidden />
              Privacy Portal – Data rights
            </a>
            <a
              href={PRIVACY_PORTAL_OPT_OUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-teal-900/50 text-teal-700 dark:text-teal-200 border-2 border-teal-600 dark:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-800/50 font-medium rounded-lg transition-colors text-sm"
            >
              <ExternalLink size={16} aria-hidden />
              Opt-out of sale / targeted ads
            </a>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-200 shadow-lg p-6 sm:p-8 mb-8 sm:mb-12">
            <h2 className="text-center text-xl sm:text-2xl font-bold mb-6 text-green-700 dark:text-green-400">
              Your Legal Knowledge Progress
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-6">
              <div className="text-center min-w-[5rem]">
                <div className="text-3xl font-bold text-slate-600 dark:text-slate-300">
                  {completedModules.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Modules Completed</div>
              </div>
              <div className="text-center min-w-[5rem]">
                <div className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                  {modules.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Modules</div>
              </div>
              <div className="text-center min-w-[5rem]">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {progressPercent}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
              </div>
            </div>
            <div
              className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Digital rights modules completed"
            >
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-green-700 to-green-500 dark:from-green-500 dark:to-green-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-center text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-700 text-white dark:bg-green-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} aria-hidden />
                  {category.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredModules.map((module) => {
              const Icon = module.icon;
              const CategoryIcon = getCategoryIcon(module.category);
              const isCompleted = completedModules.includes(module.id);

              return (
                <div
                  key={module.id}
                  role="button"
                  tabIndex={0}
                  className={`rounded-2xl border bg-white dark:bg-gray-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                    isCompleted
                      ? 'border-green-500 dark:border-green-600'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => handleModuleStart(module)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleModuleStart(module);
                    }
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-700 dark:bg-green-600 flex items-center justify-center text-white">
                        <Icon size={24} aria-hidden />
                      </div>
                      {isCompleted && (
                        <CheckCircle size={24} className="text-green-500" aria-label="Completed" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon size={16} className="text-gray-500 dark:text-gray-400" aria-hidden />
                      <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {module.category.replace('-', ' ')}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                      {module.title}
                    </h3>

                    <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      {module.description}
                    </p>

                    <div className="flex items-center justify-between mb-4 gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${getDifficultyColor(module.difficulty)}`}
                      >
                        {module.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 shrink-0">
                        <Clock size={14} aria-hidden />
                        {module.duration}
                      </span>
                    </div>

                    <Button
                      fullWidth
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleModuleStart(module);
                      }}
                    >
                      {isCompleted ? 'Review Module' : 'Start Learning'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {showModule && selectedModule && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
            onClick={closeModule}
            role="presentation"
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="digital-rights-module-title"
              className="bg-white dark:bg-gray-100 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-5xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <div className="min-w-0 flex-1">
                  <h3
                    id="digital-rights-module-title"
                    className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 pr-2"
                  >
                    {selectedModule.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={16} aria-hidden />
                      {selectedModule.duration} read
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(selectedModule.difficulty)}`}
                    >
                      {selectedModule.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeModule}
                  className="shrink-0 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close module"
                >
                  <X size={24} aria-hidden />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedModule.description}
                </p>

                <section aria-labelledby="module-overview-heading">
                  <h4
                    id="module-overview-heading"
                    className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3"
                  >
                    Overview
                  </h4>
                  <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedModule.overview.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-4 sm:p-5">
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Key points</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {selectedModule.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 p-4 sm:p-5">
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                      Real-world examples
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {selectedModule.realWorldExamples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4 sm:p-5 md:col-span-2 lg:col-span-1">
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Your rights</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {selectedModule.yourRights.map((right, index) => (
                        <li key={index}>{right}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <section
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-200/60 p-4 sm:p-5"
                  aria-labelledby="module-actions-heading"
                >
                  <h4
                    id="module-actions-heading"
                    className="font-semibold mb-3 text-gray-900 dark:text-gray-100 inline-flex items-center gap-2"
                  >
                    <ListChecks size={18} aria-hidden />
                    Try it yourself
                  </h4>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {selectedModule.actionSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </section>
              </div>

              <div className="shrink-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-100/80">
                <Button variant="secondary" size="sm" onClick={closeModule} className="w-full sm:w-auto">
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleModuleComplete(selectedModule.id)}
                  className="w-full sm:w-auto"
                >
                  Mark as complete
                </Button>
              </div>
            </div>
          </div>
        )}

        <section className="rounded-2xl bg-gradient-to-br from-green-800 to-green-600 dark:from-green-900 dark:to-green-700 text-white py-12 sm:py-16 px-6 text-center mt-8 sm:mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Know Your Digital Rights?</h2>
          <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Start your journey to understanding privacy laws and digital rights. Learn how to protect
            yourself and exercise your rights as a digital citizen.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/teen-handbook"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-colors"
            >
              <BookOpen size={20} aria-hidden />
              Teen Handbook
            </Link>
            <Link
              to="/family-hub"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              <Users size={20} aria-hidden />
              Family Hub
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default DigitalRightsPage;
