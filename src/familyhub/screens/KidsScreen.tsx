import React, { Suspense, useEffect, useRef, useState } from 'react';
import { lazy } from '../../lib/lazyWithRetry';
import { Link } from 'react-router-dom';
import { Plus, Eye, Trash2, Pencil, Lock, type LucideIcon } from 'lucide-react';
import { useHubFamilyMembers } from '../../hooks/useHubFamilyMembers';
import { useFamilyProgress } from '../../contexts/FamilyProgressContext';
import { useActiveMember } from '../../utils/familyProgressIntegration';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';
import { type HubFamilyMember, clearActiveMemberIfMatches } from '../hubFamilyMembers';
import { HubScreenFallback } from '../HubScreenFallback';
import { hubPaths } from '../hubPaths';
import HubPageLayout from '../components/HubPageLayout';
import HubScreenHero from '../components/HubScreenHero';
import HubWebsiteLink from '../components/HubWebsiteLink';
import { hubTheme } from '../hubTheme';
import { hubAgeBandForAge, HUB_AGE_BANDS } from '../hubAgeBands';
import { useHubI18n } from '../hubI18n';
import { APP_REVIEW_ADD_MEMBER, isAppReviewDemo } from '../../lib/appReviewDemo';
import { useStoreCaptureReady } from '../storeScreenshotMode';

const ChildProgressDetail = lazy(() => import('../../components/ChildProgressDetail'));

type AgeGroupMeta = {
  range: '5-8' | '9-12' | '13-17';
  label: string;
  icon: LucideIcon;
  badgeClass: string;
};

function getAgeGroup(age: number, labelForRange: (range: '5-8' | '9-12' | '13-17') => string): AgeGroupMeta | null {
  const band = hubAgeBandForAge(age);
  if (!band) {
    return null;
  }
  return {
    range: band.range,
    label: labelForRange(band.range),
    icon: band.icon,
    badgeClass: `${band.chipClass} border`,
  };
}

const KidsScreen: React.FC = () => {
  useStoreCaptureReady();
  const { t, ageBandLabel, getRoleLabel } = useHubI18n();
  const { members: familyMembers, syncing, addMember, updateMember, removeMember } = useHubFamilyMembers();
  const { calculateMemberScore, removeMemberProgress } = useFamilyProgress();
  const { currentMemberId, setActiveMember } = useActiveMember();
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<HubFamilyMember | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<HubFamilyMember | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [newMember, setNewMember] = useState({ name: '', age: 0, role: 'Child' });
  const [editMember, setEditMember] = useState({ name: '', age: 0, role: 'Child' });
  const addMemberTriggerRef = useRef<HTMLButtonElement>(null);
  const editMemberTriggerRef = useRef<HTMLButtonElement>(null);
  const removeMemberTriggerRef = useRef<HTMLButtonElement>(null);

  const closeAddMember = () => setShowAddMember(false);
  const addDialogRef = useDialogFocusTrap({
    isOpen: showAddMember,
    onClose: closeAddMember,
    returnFocusRef: addMemberTriggerRef,
  });

  const closeRemoveConfirm = () => setMemberToRemove(null);
  const removeDialogRef = useDialogFocusTrap({
    isOpen: memberToRemove !== null,
    onClose: closeRemoveConfirm,
    returnFocusRef: removeMemberTriggerRef,
  });

  const openEditMember = (member: HubFamilyMember, trigger: HTMLButtonElement | null) => {
    editMemberTriggerRef.current = trigger;
    setEditMember({ name: member.name, age: member.age, role: member.role });
    setMemberToEdit(member);
  };

  const closeEditMember = () => setMemberToEdit(null);
  const editDialogRef = useDialogFocusTrap({
    isOpen: memberToEdit !== null,
    onClose: closeEditMember,
    returnFocusRef: editMemberTriggerRef,
  });

  useEffect(() => {
    if (familyMembers.length === 1 && currentMemberId === null) {
      setActiveMember(familyMembers[0].id);
    }
  }, [familyMembers, currentMemberId, setActiveMember]);

  useEffect(() => {
    if (!isAppReviewDemo()) {
      return;
    }
    const onAddMember = (event: Event) => {
      const detail = (event as CustomEvent<{ name: string; age: number; role?: string }>).detail;
      if (!detail?.name?.trim() || detail.age <= 0) {
        return;
      }
      void (async () => {
        const linked = await addMember(detail.name.trim(), detail.age, detail.role ?? 'Child');
        if (linked && familyMembers.length === 0) {
          setActiveMember(linked.id);
        }
      })();
    };
    window.addEventListener(APP_REVIEW_ADD_MEMBER, onAddMember);
    return () => window.removeEventListener(APP_REVIEW_ADD_MEMBER, onAddMember);
  }, [addMember, familyMembers.length, setActiveMember]);

  const selectMember = (memberId: number) => {
    setActiveMember(memberId);
  };

  const addFamilyMember = async () => {
    if (!newMember.name.trim() || newMember.age <= 0) {
      return;
    }

    const linked = await addMember(newMember.name, newMember.age, newMember.role);
    if (!linked) {
      return;
    }

    if (familyMembers.length === 0) {
      setActiveMember(linked.id);
    }
    setNewMember({ name: '', age: 0, role: 'Child' });
    setShowAddMember(false);
  };

  const saveEditedMember = async () => {
    if (!memberToEdit || !editMember.name.trim() || editMember.age <= 0) {
      return;
    }

    const updated = await updateMember(memberToEdit, editMember);
    if (updated && currentMemberId === memberToEdit.id) {
      setActiveMember(updated.id);
    }
    setMemberToEdit(null);
  };

  const confirmRemoveFamilyMember = async () => {
    if (!memberToRemove) {
      return;
    }
    removeMemberProgress(memberToRemove.id);
    clearActiveMemberIfMatches(memberToRemove.id);
    if (selectedChildId === memberToRemove.id) {
      setSelectedChildId(null);
    }
    await removeMember(memberToRemove);
    setMemberToRemove(null);
  };

  if (selectedChildId) {
    const selectedChild = familyMembers.find((m) => m.id === selectedChildId);
    if (selectedChild) {
      return (
        <Suspense fallback={<HubScreenFallback />}>
          <ChildProgressDetail
            memberId={selectedChild.id}
            memberName={selectedChild.name}
            memberAge={selectedChild.age}
            onBack={() => setSelectedChildId(null)}
          />
        </Suspense>
      );
    }
  }

  return (
    <HubPageLayout>
      <HubScreenHero
        badge={t('hub.kids.badge')}
        title={t('hub.kids.title')}
        subtitle={t('hub.kids.subtitle')}
        compact
      />

      {familyMembers.length === 0 ? (
        <>
          <div className={`${hubTheme.card} flex flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-10`}>
            <div className="mb-4 flex justify-center gap-2.5" aria-hidden="true">
              {HUB_AGE_BANDS.map((b) => {
                const Icon = b.icon;
                return (
                  <span
                    key={b.range}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${b.iconBadgeClass}`}
                  >
                    <Icon size={18} />
                  </span>
                );
              })}
            </div>
            <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
              {t('hub.kids.emptyTitle')}
            </h2>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {t('hub.kids.emptyBody')}
            </p>
            <button
              ref={addMemberTriggerRef}
              type="button"
              onClick={() => setShowAddMember(true)}
              className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-700 min-h-[44px] sm:w-auto"
            >
              <Plus size={18} aria-hidden="true" />
              {t('hub.kids.addFirst')}
            </button>
          </div>
          <p className="flex items-start gap-2 text-left text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            <Lock size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              {t('hub.kids.privacyNote')}{' '}
              <HubWebsiteLink path="/privacy" className="underline hover:text-teal-700 dark:hover:text-teal-300">
                {t('hub.kids.privacyPolicy')}
              </HubWebsiteLink>
            </span>
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('hub.kids.memberCount', { count: familyMembers.length })}
            </p>
            <button
              ref={addMemberTriggerRef}
              type="button"
              onClick={() => setShowAddMember(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-white transition-colors hover:bg-teal-700 min-h-[44px] sm:w-auto"
            >
              <Plus size={18} aria-hidden="true" />
              <span>{t('hub.kids.addMember')}</span>
            </button>
          </div>
          <div className="hub-kids-member-grid gap-4">
          {familyMembers.map((member) => {
            const ageGroup = getAgeGroup(member.age, ageBandLabel);
            const band = hubAgeBandForAge(member.age);
            return (
              <div
                key={member.id}
                className="hub-card-lift rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div
                      className={[
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md',
                        band ? band.avatarClass : 'bg-teal-600 text-white dark:bg-teal-700',
                      ].join(' ')}
                      aria-label={t('hub.kids.avatar', { label: band ? ageBandLabel(band.range) : member.name })}
                    >
                      {band ? (
                        <band.icon size={22} aria-hidden="true" />
                      ) : (
                        <span className="text-lg font-bold">{member.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('hub.kids.roleAge', { role: getRoleLabel(member.role), age: member.age })}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {t('hub.kids.practiceScore', { score: calculateMemberScore(member.id) })}
                      </p>
                      {ageGroup && (
                        <Link
                          to={hubPaths.activities}
                          state={{ initialAgeFilter: ageGroup.range }}
                          onClick={() => selectMember(member.id)}
                          className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${ageGroup.badgeClass}`}
                          aria-label={t('hub.kids.activitiesFor', { label: ageGroup.label, name: member.name })}
                        >
                          <ageGroup.icon size={14} aria-hidden="true" />
                          {t('hub.kids.activitiesFor', { label: ageGroup.label })}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => openEditMember(member, e.currentTarget)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-all hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title={t('hub.kids.editMember')}
                      aria-label={t('hub.kids.editName', { name: member.name })}
                    >
                      <Pencil size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        selectMember(member.id);
                        setSelectedChildId(member.id);
                      }}
                      className={`p-2 rounded-lg transition-all hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                        currentMemberId === member.id
                          ? 'text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-900/30'
                          : 'text-green-700 hover:text-green-800 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                      }`}
                      title={currentMemberId === member.id ? t('hub.kids.activeProgress') : t('hub.kids.setActiveProgress')}
                      aria-label={t('hub.kids.viewProgress', { name: member.name })}
                      aria-pressed={currentMemberId === member.id}
                    >
                      <Eye size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        removeMemberTriggerRef.current = e.currentTarget;
                        setMemberToRemove(member);
                      }}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title={t('hub.kids.removeMember')}
                      aria-label={t('hub.kids.removeName', { name: member.name })}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </>
      )}

      {showAddMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeAddMember();
            }
          }}
        >
          <div
            ref={addDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-member-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 id="add-member-title" className="text-xl font-bold text-gray-900 dark:text-white">
                {t('hub.kids.addTitle')}
              </h3>
              <button
                type="button"
                onClick={closeAddMember}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center text-3xl leading-none transition-colors"
                aria-label={t('hub.kids.closeDialog')}
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="member-name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('hub.kids.nameLabel')}
                </label>
                <input
                  id="member-name"
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                  placeholder={t('hub.kids.namePlaceholder')}
                  maxLength={50}
                  autoFocus
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="member-age" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('hub.kids.ageLabel')}
                </label>
                <input
                  id="member-age"
                  type="number"
                  value={newMember.age || ''}
                  onChange={(e) => setNewMember({ ...newMember, age: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                  placeholder={t('hub.kids.agePlaceholder')}
                  min="1"
                  max="100"
                  aria-required="true"
                />
                {newMember.age >= 5 && newMember.age <= 17 && (() => {
                  const g = getAgeGroup(newMember.age);
                  return g ? (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {t('hub.kids.ageMatched')}{' '}
                      <span className="inline-flex items-center gap-1 font-medium">
                        <g.icon size={14} aria-hidden="true" />
                        {g.label}
                      </span>
                    </p>
                  ) : null;
                })()}
              </div>

              <div>
                <label htmlFor="member-role" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('hub.kids.roleLabel')}
                </label>
                <select
                  id="member-role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Parent">{t('hub.roles.parent')}</option>
                  <option value="Child">{t('hub.roles.child')}</option>
                  <option value="Teen">{t('hub.roles.teen')}</option>
                  <option value="Guardian">{t('hub.roles.guardian')}</option>
                </select>
              </div>

              <p className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Lock size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  {t('hub.kids.privacyFormNote')}
                </span>
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeAddMember}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors min-h-[44px] font-medium"
                >
                  {t('hub.kids.cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => void addFamilyMember()}
                  disabled={syncing}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors min-h-[44px] font-medium disabled:opacity-60"
                >
                  {syncing ? t('hub.kids.saving') : t('hub.kids.addMember')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {memberToEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeEditMember();
            }
          }}
        >
          <div
            ref={editDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-member-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 id="edit-member-title" className="text-xl font-bold text-gray-900 dark:text-white">
                {t('hub.kids.editTitle', { name: memberToEdit.name })}
              </h3>
              <button
                type="button"
                onClick={closeEditMember}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center text-3xl leading-none transition-colors"
                aria-label={t('hub.kids.closeDialog')}
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="edit-member-name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('hub.kids.nameLabel')}
                </label>
                <input
                  id="edit-member-name"
                  type="text"
                  value={editMember.name}
                  onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                  maxLength={50}
                  autoFocus
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="edit-member-age" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('hub.kids.ageLabel')}
                </label>
                <input
                  id="edit-member-age"
                  type="number"
                  value={editMember.age || ''}
                  onChange={(e) => setEditMember({ ...editMember, age: parseInt(e.target.value, 10) || 0 })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="100"
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="edit-member-role" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('hub.kids.roleLabel')}
                </label>
                <select
                  id="edit-member-role"
                  value={editMember.role}
                  onChange={(e) => setEditMember({ ...editMember, role: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Parent">{t('hub.roles.parent')}</option>
                  <option value="Child">{t('hub.roles.child')}</option>
                  <option value="Teen">{t('hub.roles.teen')}</option>
                  <option value="Guardian">{t('hub.roles.guardian')}</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditMember}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors min-h-[44px] font-medium"
                >
                  {t('hub.kids.cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => void saveEditedMember()}
                  disabled={syncing}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors min-h-[44px] font-medium disabled:opacity-60"
                >
                  {syncing ? t('hub.kids.saving') : t('hub.kids.saveChanges')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {memberToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeRemoveConfirm();
            }
          }}
        >
          <div
            ref={removeDialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-member-title"
            aria-describedby="remove-member-desc"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
          >
            <h3 id="remove-member-title" className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('hub.kids.removeTitle', { name: memberToRemove.name })}
            </h3>
            <p id="remove-member-desc" className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t('hub.kids.removeBody')}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeRemoveConfirm}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors min-h-[44px] font-medium"
              >
                {t('hub.kids.cancel')}
              </button>
              <button
                type="button"
                onClick={() => void confirmRemoveFamilyMember()}
                disabled={syncing}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors min-h-[44px] font-medium disabled:opacity-60"
              >
                {syncing ? t('hub.kids.removing') : t('hub.kids.remove')}
              </button>
            </div>
          </div>
        </div>
      )}
    </HubPageLayout>
  );
};

export default KidsScreen;
