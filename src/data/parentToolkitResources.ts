import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Eye,
  FileText,
  Lock,
  MessageCircle,
  Search,
  Settings,
  Shield,
  Star,
  Users,
} from 'lucide-react';

export type ToolkitResourceCategory =
  | 'templates'
  | 'guides'
  | 'checklists'
  | 'conversations'
  | 'tools'
  | 'expert';

export interface ParentToolkitResource {
  id: string;
  title: string;
  description: string;
  category: ToolkitResourceCategory;
  icon: LucideIcon;
  preview?: string[];
  duration?: string;
}

/** Cards link to real on-site pages — not downloadable PDF kits. */
export const PARENT_TOOLKIT_RESOURCES: ParentToolkitResource[] = [
  {
    id: 'privacy-policy-template',
    title: 'Family privacy plan',
    description: 'Use the guided family privacy plan on the website to agree on rules and next steps together.',
    category: 'templates',
    icon: FileText,
    preview: ['Household rules', 'Review cadence', 'Saved on this device'],
    duration: '15–20 min',
  },
  {
    id: 'device-setup-checklist',
    title: 'Device setup guide',
    description: 'Walk through security and privacy settings when a child gets a phone, tablet, or laptop.',
    category: 'guides',
    icon: CheckCircle,
    preview: ['Initial security', 'App permissions', 'Parental controls overview'],
    duration: '30 min',
  },
  {
    id: 'conversation-starters',
    title: 'Conversation approaches',
    description: 'Age-appropriate prompts from our parent conversation guide—not a separate PDF.',
    category: 'conversations',
    icon: MessageCircle,
    preview: ['Ages 5–8', 'Ages 9–12', 'Teens'],
    duration: '10 min',
  },
  {
    id: 'app-review-guide',
    title: 'App selection guide',
    description: 'Evaluate apps for privacy and fit before your child installs them.',
    category: 'guides',
    icon: Search,
    preview: ['Permissions', 'Age ratings', 'Red flags'],
    duration: '20 min',
  },
  {
    id: 'safety-checklist',
    title: 'Emergency safety guide',
    description: 'Steps for urgent online-safety situations—opens our emergency safety guide.',
    category: 'guides',
    icon: Shield,
    preview: ['Immediate steps', 'Who to contact', 'Follow-up'],
    duration: '25 min',
  },
  {
    id: 'privacy-settings-guide',
    title: 'Device privacy settings',
    description: 'Platform settings are covered in the device setup guide (not live monitoring).',
    category: 'guides',
    icon: Settings,
    preview: ['Mobile OS', 'Browsers', 'Common apps'],
    duration: '45 min',
  },
  {
    id: 'monitoring-tools-guide',
    title: 'Parental controls overview',
    description: 'Learn about controls in the device setup guide—PandaGarde does not monitor children’s devices.',
    category: 'tools',
    icon: Eye,
    preview: ['Control types', 'Privacy trade-offs', 'Age-appropriate use'],
    duration: '30 min',
  },
  {
    id: 'incident-response-plan',
    title: 'Emergency safety guide',
    description: 'Same emergency guide as above—useful when something goes wrong online.',
    category: 'guides',
    icon: AlertTriangle,
    preview: ['Document what happened', 'Support contacts', 'Prevention'],
    duration: '20 min',
  },
  {
    id: 'password-security-guide',
    title: 'Password safety activity',
    description: 'Interactive password activity for families—not a standalone PDF.',
    category: 'tools',
    icon: Lock,
    preview: ['Strong passwords', 'Practice quiz', 'Family habits'],
    duration: '25 min',
  },
  {
    id: 'expert-advice-library',
    title: 'Family privacy guide',
    description: 'Start with our family privacy guide—curated articles are not hosted as a separate library.',
    category: 'guides',
    icon: BookOpen,
    preview: ['Household basics', 'Age tips', 'Next steps'],
    duration: 'Variable',
  },
  {
    id: 'family-agreement-template',
    title: 'Family internet agreement',
    description: 'Printable agreement page on the website—customize together before signing.',
    category: 'templates',
    icon: FileText,
    preview: ['Usage rules', 'Schedules', 'Consequences'],
    duration: '30 min',
  },
  {
    id: 'social-media-guide',
    title: 'Teen handbook',
    description: 'Social media basics for teens—opens the ages 13–17 handbook.',
    category: 'guides',
    icon: Users,
    preview: ['Privacy settings', 'Sharing', 'Cyberbullying'],
    duration: '40 min',
  },
];
