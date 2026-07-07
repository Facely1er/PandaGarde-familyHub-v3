/** Generic trusted-adult roles — never stores real names (research §1.4). */
export interface TrustedRole {
  id: string;
  label: string;
  emoji: string;
}

export const TRUSTED_ROLES: TrustedRole[] = [
  { id: 'mom', label: 'Mom', emoji: '👩' },
  { id: 'dad', label: 'Dad', emoji: '👨' },
  { id: 'grandparent', label: 'Grandparent', emoji: '👵' },
  { id: 'teacher', label: 'A teacher', emoji: '🧑‍🏫' },
  { id: 'sibling', label: 'Big brother / sister', emoji: '🧑' },
  { id: 'aunt-uncle', label: 'Aunt / Uncle', emoji: '🧢' },
  { id: 'coach', label: 'A coach', emoji: '🏀' },
  { id: 'counselor', label: 'School counselor', emoji: '💼' },
  { id: 'other', label: 'Another grown-up I trust', emoji: '🌟' },
];

export const CODE_WORDS = ['Bamboo', 'Lantern', 'Firefly', 'Campfire', 'River Stone', 'Moon Leaf'];

export function getTrustedRoleLabel(roleId: string): string | undefined {
  return TRUSTED_ROLES.find((r) => r.id === roleId)?.label;
}
