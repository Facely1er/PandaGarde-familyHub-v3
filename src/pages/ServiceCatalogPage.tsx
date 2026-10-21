import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Plus } from 'lucide-react';
import ServiceCatalog from '../components/ServiceCatalog';
import FamilyPlanSteps from '../components/journey/FamilyPlanSteps';
import PageLayout from '../components/layout/PageLayout';
import { useFamily } from '../contexts/FamilyContext';
import { childServiceCatalog, type ChildService } from '../data/childServiceCatalog';
import { PICTURE_AREAS, PICTURE_AREA_ORDER, PICTURE_KINDS } from '../data/familyBigPicture';
import { loadFamilyPictureSelection } from '../lib/familyBigPicture';
import { updateDfaJourneyPhase } from '../lib/dfaJourney';
import { getServiceLogoUrlWithBrandColor, hasServiceLogo } from '../utils/serviceLogos';

/** Shown when the family skipped the big picture. */
const POPULAR_SERVICE_IDS = ['youtube', 'roblox', 'minecraft', 'tiktok', 'snapchat', 'google-classroom', 'netflix', 'chatgpt'];

/** Suggestions per big-picture area, limited so the first screen stays short. */
const SUGGESTIONS_PER_AREA = 8;
const SUGGESTIONS_PER_KIND = 4;

interface SuggestionGroup {
  title: string;
  services: ChildService[];
}

const ServiceCatalogPage: React.FC = () => {
  const { getFamilyServices, addServiceToFamily, removeServiceFromFamily } = useFamily();
  const [familyServiceIds, setFamilyServiceIds] = useState<string[]>(() => getFamilyServices());
  const [busyId, setBusyId] = useState<string | null>(null);
  const picture = useMemo(() => loadFamilyPictureSelection(), []);

  const refresh = useCallback(() => setFamilyServiceIds(getFamilyServices()), [getFamilyServices]);

  // The full catalog below adds apps through the same store; poll so the count stays in sync.
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  const servicesCount = familyServiceIds.length;

  useEffect(() => {
    updateDfaJourneyPhase('profile', {
      visited: true,
      completed: servicesCount >= 3,
      resumePath: servicesCount > 0 ? '/digital-footprint' : '/service-catalog',
    });
  }, [servicesCount]);

  const groups = useMemo<SuggestionGroup[]>(() => {
    const byId = new Map(childServiceCatalog.map((s) => [s.id, s]));
    const pick = (ids: string[]) => ids.map((id) => byId.get(id)).filter((s): s is ChildService => Boolean(s));
    if (!picture.kinds.length) {
      return [{ title: 'Popular with families', services: pick(POPULAR_SERVICE_IDS) }];
    }
    return PICTURE_AREA_ORDER.map((area) => {
      // Top few from each ticked kind, so every kind is represented before the area cap.
      const ids = picture.kinds
        .filter((k) => PICTURE_KINDS[k].area === area)
        .flatMap((k) => PICTURE_KINDS[k].catalogIds.slice(0, SUGGESTIONS_PER_KIND));
      return { title: PICTURE_AREAS[area].name, services: pick([...new Set(ids)].slice(0, SUGGESTIONS_PER_AREA)) };
    }).filter((g) => g.services.length);
  }, [picture]);

  const toggle = async (serviceId: string) => {
    if (busyId) {return;}
    setBusyId(serviceId);
    try {
      if (familyServiceIds.includes(serviceId)) {await removeServiceFromFamily(serviceId);}
      else {await addServiceToFamily(serviceId);}
      refresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <PageLayout
      title="Your apps"
      subtitle="Step 2 of 3 — tap the apps your child uses. Your action plan is built from this list."
      breadcrumbs
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <FamilyPlanSteps current="apps" done={{ picture: picture.kinds.length > 0, apps: servicesCount > 0 }} />

        <section aria-labelledby="apps-suggested" className="flex flex-col gap-5">
          <div>
            <h2 id="apps-suggested" className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {picture.kinds.length ? 'Suggested from your big picture' : 'Start with the apps you know'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Tap <strong>Add</strong> on each app your child uses. Nothing is installed or checked on their device.
            </p>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{group.title}</h3>
              <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
                {group.services.map((service) => {
                  const added = familyServiceIds.includes(service.id);
                  return (
                    <li key={service.id}>
                      <button
                        type="button"
                        onClick={() => { void toggle(service.id); }}
                        disabled={busyId === service.id}
                        aria-pressed={added}
                        aria-label={`${added ? 'Remove' : 'Add'} ${service.name}`}
                        className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border-2 px-3 py-2 text-left transition-colors disabled:opacity-60 ${
                          added
                            ? 'border-green-700 bg-green-50 dark:border-green-400 dark:bg-green-950'
                            : 'border-gray-200 bg-white hover:border-green-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-500'
                        }`}
                      >
                        {hasServiceLogo(service.id) ? (
                          <img src={getServiceLogoUrlWithBrandColor(service.id) ?? undefined} alt="" className="h-8 w-8 shrink-0 rounded" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                        ) : (
                          <span className="h-8 w-8 shrink-0 rounded bg-gray-100 dark:bg-gray-700" aria-hidden />
                        )}
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{service.name}</span>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            added ? 'bg-green-700 text-white dark:bg-green-400 dark:text-gray-900' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                          }`}
                          aria-hidden
                        >
                          {added ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                          {added ? 'Added' : 'Add'}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        <div className="sticky bottom-2 z-10 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 sm:flex-row sm:items-center">
          {servicesCount > 0 ? (
            <Link to="/digital-footprint" className="button button-primary inline-flex min-h-[44px] items-center justify-center gap-2">
              See your action plan
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : (
            <span className="button button-primary inline-flex min-h-[44px] cursor-not-allowed items-center justify-center gap-2 opacity-50" aria-disabled="true">
              See your action plan
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
            {servicesCount === 0
              ? 'Add at least one app to build your plan.'
              : `${servicesCount} app${servicesCount === 1 ? '' : 's'} in your list.`}
            {!picture.kinds.length ? (
              <>
                {' '}
                <Link to="/big-picture" className="font-medium text-green-700 underline underline-offset-2 dark:text-green-400">
                  Not sure? Start with the big picture
                </Link>
              </>
            ) : null}
          </p>
        </div>

        <section aria-labelledby="apps-all" className="flex flex-col gap-3">
          <div>
            <h2 id="apps-all" className="text-lg font-bold text-gray-900 dark:text-gray-100">Can’t see an app? Search them all</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">School, games, social, streaming, AI, health and phone carriers.</p>
          </div>
          <ServiceCatalog guidedMode />
        </section>
      </div>
    </PageLayout>
  );
};

export default ServiceCatalogPage;
