import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Gamepad2, Play, Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ActivityManager from '../components/activities/ActivityManager';
import {
  PRIVACY_ACTIVITIES,
  getActivityById,
  resolveActivityId,
} from '../data/privacyActivitiesCatalog';

const ActivitiesPage: React.FC = () => {
  const { activityId: routeSlug } = useParams<{ activityId?: string }>();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!routeSlug) {return;}
    const id = resolveActivityId(routeSlug);
    if (id) {setSelectedId(id);}
  }, [routeSlug]);

  const selected = selectedId ? getActivityById(selectedId) : undefined;

  const clearSelection = () => {
    setSelectedId(null);
    if (routeSlug) {navigate('/activities', { replace: true });}
  };

  if (selectedId && selected) {
    return (
      <PageLayout
        title={selected.name}
        subtitle={selected.educationalObjective}
        icon={Gamepad2}
        badge={selected.category.toUpperCase()}
        breadcrumbs
      >
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <button
            type="button"
            onClick={clearSelection}
            className="mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-900/30 min-h-[44px]"
          >
            <ArrowLeft size={18} aria-hidden />
            Back to all activities
          </button>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden min-h-[400px]">
            <ActivityManager
              activityId={selectedId}
              onClose={clearSelection}
              onComplete={clearSelection}
            />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Family Privacy Activities"
      subtitle="Interactive missions that teach password safety, safe sharing, and digital wellbeing."
      icon={Gamepad2}
      badge="INTERACTIVE MISSIONS"
      breadcrumbs
    >
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl">
        <section className="mb-10 rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="text-emerald-900 dark:text-emerald-100 leading-relaxed mb-4">
            Each activity teaches one privacy concept with a clear goal. Start with the story, then pick a mission.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/privacy-panda"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 min-h-[44px]"
            >
              <BookOpen size={18} aria-hidden />
              Privacy Panda Story
            </Link>
            <Link
              to="/family-hub/activities"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 dark:text-emerald-200 dark:hover:bg-emerald-900/40 min-h-[44px]"
            >
              <Shield size={18} aria-hidden />
              Family Hub progress
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRIVACY_ACTIVITIES.map((activity) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => navigate(`/activities/${activity.slug}`)}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-left shadow-sm hover:border-teal-500 hover:shadow-md transition-all min-h-[140px] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-3xl" aria-hidden>
                    {activity.icon}
                  </span>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">{activity.name}</h2>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-0.5">
                      {activity.category} · {activity.difficulty}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  Ages {activity.ageGroup} · ~{activity.durationMinutes} min
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 mt-4">
                <Play size={16} aria-hidden />
                Start mission
              </span>
            </button>
          ))}
        </div>
      </main>
    </PageLayout>
  );
};

export default ActivitiesPage;
