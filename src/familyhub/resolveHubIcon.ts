import {
  type LucideIcon,
  Backpack,
  BarChart3,
  Bot,
  Camera,
  Castle,
  Compass,
  Fish,
  FlaskConical,
  Footprints,
  Globe,
  Handshake,
  Lock,
  Palette,
  Rocket,
  Scale,
  ScanSearch,
  Search,
  Settings,
  Shield,
  Smartphone,
  Sprout,
  Timer,
  TrafficCone,
  Trophy,
  Users,
} from 'lucide-react';

/** Maps legacy emoji glyphs from activity data to Lucide icons */
const GLYPH_TO_ICON: Record<string, LucideIcon> = {
  '🐼': Compass,
  '🕵️': Search,
  '🌐': Globe,
  '🎒': Backpack,
  '🚦': TrafficCone,
  '🔒': Lock,
  '👨‍👩‍👧': Users,
  '🎨': Palette,
  '🤝': Handshake,
  '👣': Footprints,
  '🎣': Fish,
  '🔍': Search,
  '⚙️': Settings,
  '📸': Camera,
  '🧪': FlaskConical,
  '🏰': Castle,
  '🔎': ScanSearch,
  '📊': BarChart3,
  '⚖️': Scale,
  '📱': Smartphone,
  '🤖': Bot,
  '🌱': Sprout,
  '🚀': Rocket,
  '🏆': Trophy,
  '⏱️': Timer,
};

const DEFAULT_ICON: LucideIcon = Shield;

export function resolveHubIcon(glyph: string): LucideIcon {
  return GLYPH_TO_ICON[glyph] ?? DEFAULT_ICON;
}
