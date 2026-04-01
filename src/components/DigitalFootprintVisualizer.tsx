import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  Users,
  Network,
  BarChart3,
  Target,
  CheckCircle,
  ArrowRight,
  Globe,
  MessageCircle,
  Gamepad2,
  Film,
  GraduationCap,
  Palette,
  Info,
  School,
  Home,
  Smartphone,
  Bot,
  Database,
  ChevronDown,
  ChevronUp,
  Link2,
  Zap,
  Signal,
  TrendingUp,
  TrendingDown,
  Minus,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';
import { footprintAnalyzer, type FootprintAnalysis } from '../lib/footprintAnalyzer';
import { getServiceLogoUrlWithBrandColor, hasServiceLogo } from '../utils/serviceLogos';
import { getServiceById } from '../data/childServiceCatalog';
import { getServiceDataChain } from '../data/dataBrokerNetwork';
import { ProgressBar } from './ui/ProgressBar';

// ─── localStorage keys ───────────────────────────────────────────────────────
const LS_PREV_SCORE = 'pandagarde_prev_privacy_score';
const LS_DONE_RECS  = 'pandagarde_done_recs';

interface DigitalFootprintVisualizerProps {
  compact?: boolean;
}

const DigitalFootprintVisualizer: React.FC<DigitalFootprintVisualizerProps> = ({ compact = false }) => {
  const { familyMembers, getFamilyServices } = useFamily();

  // ── Score delta ─────────────────────────────────────────────────────────────
  // Read previous score once on mount (before we overwrite it this visit)
  const [prevScore] = useState<number | null>(() => {
    try {
      const v = localStorage.getItem(LS_PREV_SCORE);
      return v ? parseInt(v, 10) : null;
    } catch { return null; }
  });

  // ── Recommendation done-tracking ────────────────────────────────────────────
  const [doneRecs, setDoneRecs] = useState<Set<string>>(() => {
    try {
      const v = localStorage.getItem(LS_DONE_RECS);
      return v ? new Set<string>(JSON.parse(v)) : new Set<string>();
    } catch { return new Set<string>(); }
  });

  // ── Chain expansion ──────────────────────────────────────────────────────────
  const [expandedChain, setExpandedChain] = useState<string | null>(null);

  // ── Data helpers ─────────────────────────────────────────────────────────────
  const catalogServices = getFamilyServices();

  const memberServices = useMemo(() => {
    const services: Record<string, string[]> = {};
    let totalMemberServices = 0;
    familyMembers.forEach(member => {
      const ids = (member as any).services?.map((s: any) => s.serviceId) || [];
      services[member.id] = ids;
      totalMemberServices += ids.length;
    });
    if (totalMemberServices === 0 && catalogServices.length > 0) {
      services['family'] = catalogServices;
    }
    return services;
  }, [familyMembers, catalogServices]);

  const membersForAnalysis = useMemo(() => {
    if (familyMembers.length > 0) return familyMembers;
    if (catalogServices.length > 0) {
      return [{ id: 'family', services: catalogServices.map(id => ({ serviceId: id, status: 'approved' })) }];
    }
    return [];
  }, [familyMembers, catalogServices]);

  const analysis = useMemo<FootprintAnalysis | null>(() => {
    const hasServices = Object.values(memberServices).some(arr => arr.length > 0);
    if (!hasServices) return null;
    return footprintAnalyzer.analyzeFamilyFootprint(membersForAnalysis, memberServices);
  }, [membersForAnalysis, memberServices]);

  // Persist current score for next visit's delta
  useEffect(() => {
    if (analysis?.privacyScore !== undefined) {
      try { localStorage.setItem(LS_PREV_SCORE, String(analysis.privacyScore)); } catch {}
    }
  }, [analysis?.privacyScore]);

  // Toggle a recommendation as done/undone
  const toggleDone = (recId: string) => {
    setDoneRecs(prev => {
      const next = new Set(prev);
      if (next.has(recId)) { next.delete(recId); } else { next.add(recId); }
      try { localStorage.setItem(LS_DONE_RECS, JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  // ── Display helpers ──────────────────────────────────────────────────────────
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social-media': return Users;
      case 'messaging':    return MessageCircle;
      case 'gaming':       return Gamepad2;
      case 'streaming':    return Film;
      case 'edtech':       return School;
      case 'education':    return GraduationCap;
      case 'ai':           return Bot;
      case 'telecom':      return Signal;
      case 'creative':     return Palette;
      default:             return Globe;
    }
  };

  const getContextIcon = (context: string) => {
    if (context === 'school') return School;
    if (context === 'home')   return Home;
    return Smartphone;
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very-high': return 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
      case 'high':      return 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
      case 'medium':    return 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      default:          return 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    }
  };

  // ── Empty / compact states ────────────────────────────────────────────────────
  if (!analysis) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Services Added Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Add your family's apps and services from the Service Catalog to see your digital footprint analysis.
        </p>
        <Link to="/service-catalog" className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
          <span>Add Services</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-900 dark:text-white">Digital Footprint</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            analysis.familyScore >= 70 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
            analysis.familyScore >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
          }`}>
            {analysis.familyScore}/100
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {analysis.totalServices} services • {analysis.totalMembers} family members
        </p>
      </div>
    );
  }

  // ── Derived values used across multiple sections ──────────────────────────────
  const scoreDelta = prevScore !== null ? analysis.privacyScore - prevScore : null;
  const doneCount  = analysis.recommendations.filter(r => doneRecs.has(r.id)).length;
  const totalRecs  = analysis.recommendations.length;
  const quickWins  = analysis.recommendations
    .filter(r => r.priority === 'high' && !doneRecs.has(r.id))
    .slice(0, 3);

  // ── Full render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Score Card ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your family's privacy at a glance
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              One number that shows how well your family's data is protected across all the apps you use
            </p>
          </div>

          {/* Score + delta */}
          <div className="text-center shrink-0 ml-4">
            <div className={`text-5xl font-bold mb-1 ${
              analysis.privacyScore >= 70 ? 'text-green-600 dark:text-green-400' :
              analysis.privacyScore >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {analysis.privacyScore}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Privacy Score</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Higher is better</p>

            {/* Score-level badge */}
            <div className={`mt-1 px-3 py-1 rounded-full text-xs font-medium ${
              analysis.privacyScore >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
              analysis.privacyScore >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {analysis.privacyScore >= 70 ? 'Good' : analysis.privacyScore >= 40 ? 'Moderate' : 'Needs attention'}
            </div>

            {/* Delta badge — only on repeat visits */}
            {scoreDelta !== null && (
              <div className={`mt-2 flex items-center justify-center gap-1 text-xs font-semibold ${
                scoreDelta > 0  ? 'text-green-600 dark:text-green-400' :
                scoreDelta < 0  ? 'text-red-500 dark:text-red-400' :
                'text-gray-400 dark:text-gray-500'
              }`}>
                {scoreDelta > 0  ? <TrendingUp  className="h-3.5 w-3.5" /> :
                 scoreDelta < 0  ? <TrendingDown className="h-3.5 w-3.5" /> :
                 <Minus className="h-3.5 w-3.5" />}
                {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta < 0 ? scoreDelta : 'No change'}{' '}
                <span className="font-normal opacity-80">since last visit</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-900 dark:text-white">How protected is your family's data?</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{analysis.privacyScore}/100</span>
          </div>
          <ProgressBar
            value={analysis.privacyScore}
            size="md"
            variant={analysis.privacyScore >= 70 ? 'low' : analysis.privacyScore >= 40 ? 'medium' : 'critical'}
            aria-label="Privacy score"
            className="mt-2"
          />
        </div>
      </div>

      {/* ── Quick Wins panel ─────────────────────────────────────────────────── */}
      {quickWins.length > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Start here — quick wins</h3>
            <span className="ml-auto text-xs bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-medium">
              {quickWins.length} high-priority action{quickWins.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-3">
            The most important steps you can take right now. Tick each one off as you go.
          </p>
          <div className="space-y-2">
            {quickWins.map(rec => (
              <div key={rec.id} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <button
                  type="button"
                  onClick={() => toggleDone(rec.id)}
                  className="mt-0.5 shrink-0 w-5 h-5 rounded border-2 border-emerald-400 dark:border-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                  title="Mark as done"
                  aria-label={`Mark "${rec.title}" as done`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{rec.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{rec.actionItems[0]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDone(rec.id)}
                  className="shrink-0 text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
                >
                  Mark done
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No outstanding quick wins — all addressed */}
      {quickWins.length === 0 && doneCount > 0 && analysis.recommendations.filter(r => r.priority === 'high').length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl">
          <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">All high-priority actions addressed!</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Review the full recommendations below to keep improving.</p>
          </div>
        </div>
      )}

      {/* ── Where does your data go? (context breakdown) ─────────────────────── */}
      {analysis.contextBreakdown && analysis.contextBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
            Where does your family's data go?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Apps from school, home, and everyday use each collect data. Here's how your exposure adds up in each place.
          </p>
          <div className="space-y-4">
            {analysis.contextBreakdown.map((ctx) => {
              const ContextIcon = getContextIcon(ctx.context);
              return (
                <div key={ctx.context} className={`p-4 rounded-xl border-2 ${getRiskColor(ctx.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ContextIcon className="h-5 w-5" />
                      <span className="font-semibold">{ctx.label}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {ctx.count} app{ctx.count !== 1 ? 's' : ''} · exposure {ctx.averageExposure}/100
                    </span>
                  </div>
                  <p className="text-sm opacity-90 mb-3">{ctx.description}</p>
                  {/* Per-app exposure mini-bars */}
                  <div className="space-y-1.5">
                    {ctx.serviceRisks.slice(0, 8).map((r) => (
                      <div key={r.serviceId} className="flex items-center gap-2">
                        <span className="text-xs font-medium w-28 truncate shrink-0">{r.serviceName}</span>
                        <div className="flex-1 bg-white/50 dark:bg-black/20 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              r.exposureIndex >= 70 ? 'bg-red-500' :
                              r.exposureIndex >= 50 ? 'bg-orange-500' :
                              r.exposureIndex >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${r.exposureIndex}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold w-8 text-right shrink-0">{r.exposureIndex}</span>
                      </div>
                    ))}
                    {ctx.serviceRisks.length > 8 && (
                      <p className="text-xs opacity-70 pt-1">+{ctx.serviceRisks.length - 8} more apps</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Key Metrics ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.totalServices}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Apps you're tracking</p>
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Add more in Service Catalog for a fuller picture</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.totalMembers}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Family members</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <span className={`text-2xl font-bold ${
              analysis.averageExposureIndex >= 70 ? 'text-red-600 dark:text-red-400' :
              analysis.averageExposureIndex >= 40 ? 'text-orange-600 dark:text-orange-400' :
              'text-green-600 dark:text-green-400'
            }`}>
              {analysis.averageExposureIndex}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average exposure</p>
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">How much your apps can see or share — lower is safer</p>
        </div>
      </div>

      {/* ── Category Breakdown ──────────────────────────────────────────────────── */}
      {analysis.categoryBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Apps by type</span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Breakdown by kind of app. Use this to see which types add the most exposure.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.categoryBreakdown.map((category) => {
              const CategoryIcon = getCategoryIcon(category.category);
              return (
                <div key={category.category} className={`p-4 rounded-lg border-2 ${getRiskColor(category.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon className="h-5 w-5" />
                      <span className="font-medium capitalize">{category.category.replace('-', ' ')}</span>
                    </div>
                    <span className="text-lg font-bold">{category.count}</span>
                  </div>
                  <div className="text-sm">Avg. Exposure: {category.averageExposure}/100</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── High-Risk Services ──────────────────────────────────────────────────── */}
      {analysis.serviceRisks.filter(r => r.exposureIndex >= 70).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Apps that need your attention</h3>
          </div>
          <p className="text-sm text-red-800 dark:text-red-200 mb-4">
            These apps can collect or share a lot of data. Check their settings and talk with your family about how they're used.
          </p>
          <div className="space-y-3">
            {analysis.serviceRisks
              .filter(r => r.exposureIndex >= 70)
              .slice(0, 5)
              .map((risk) => {
                const service = getServiceById(risk.serviceId);
                return (
                  <div key={risk.serviceId} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    {service && hasServiceLogo(service.id) ? (
                      <img src={getServiceLogoUrlWithBrandColor(service.id) || undefined} alt="" className="w-10 h-10 rounded-lg object-contain" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{risk.serviceName}</span>
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">{risk.exposureIndex}/100</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Used by {risk.memberCount} family member{risk.memberCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <Link to={`/service-catalog?service=${risk.serviceId}`} className="text-red-600 dark:text-red-400 hover:text-red-800">
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Data Sharing Network (parent-company grouping) ──────────────────────── */}
      {analysis.dataSharingNetwork.filter(n => n.parentCompany).length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-4">
            <Network className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">When apps share data with each other</h3>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
            Some of your apps belong to the same company. That company may use data from one app in another.
          </p>
          <div className="space-y-4">
            {Array.from(new Set(analysis.dataSharingNetwork.filter(n => n.parentCompany).map(n => n.parentCompany)))
              .slice(0, 3)
              .map((parentCompany) => {
                const relatedServices = analysis.dataSharingNetwork.filter(n => n.parentCompany === parentCompany);
                return (
                  <div key={parentCompany} className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">{parentCompany}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {relatedServices.length} service{relatedServices.length !== 1 ? 's' : ''}:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {relatedServices.map((service) => (
                        <span key={service.serviceId} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                          {service.serviceName}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Recommendations (with done tracking) ───────────────────────────────── */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          {/* Header + progress */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">What to do next</h3>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {doneCount} / {totalRecs} done
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-1">
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-green-500 transition-all duration-500"
                style={{ width: totalRecs > 0 ? `${Math.round((doneCount / totalRecs) * 100)}%` : '0%' }}
              />
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Simple steps to improve your family's privacy. Mark each one done as you go — your progress is saved.
          </p>

          <div className="space-y-3">
            {analysis.recommendations.map((rec) => {
              const isDone = doneRecs.has(rec.id);
              return (
                <div
                  key={rec.id}
                  className={`rounded-lg border-2 transition-all ${
                    isDone
                      ? 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 opacity-70'
                      : rec.priority === 'high'   ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                        'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between p-4 pb-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className={`font-semibold text-gray-900 dark:text-white ${isDone ? 'line-through opacity-60' : ''}`}>
                          {rec.title}
                        </h4>
                        {!isDone && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            rec.priority === 'high'   ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {rec.priority.toUpperCase()}
                          </span>
                        )}
                        {isDone && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            <CheckCircle className="h-3 w-3" /> Done
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Done toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleDone(rec.id)}
                      className={`ml-3 shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        isDone
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                      title={isDone ? 'Mark as not done' : 'Mark as done'}
                    >
                      {isDone
                        ? <><RotateCcw className="h-3 w-3" /> Undo</>
                        : <><CheckCircle className="h-3 w-3" /> Mark done</>
                      }
                    </button>
                  </div>

                  {/* Card body — hidden when done */}
                  {!isDone && (
                    <div className="px-4 pb-4 pt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{rec.description}</p>
                      <ul className="space-y-1">
                        {rec.actionItems.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {rec.affectedServices.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <Link
                            to={`/service-catalog?services=${rec.affectedServices.join(',')}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <span>View affected services</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AI Risk Summary ─────────────────────────────────────────────────────── */}
      {analysis.aiRiskSummary && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">AI Apps — specific risks</h3>
            <span className="bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 text-xs font-bold px-2 py-0.5 rounded-full">
              {analysis.aiRiskSummary.totalAiApps} app{analysis.aiRiskSummary.totalAiApps !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
            AI apps carry unique risks: conversations are stored, may be used to train AI models, and are usually not covered by school privacy laws.
          </p>
          <div className="space-y-2 mb-4">
            {analysis.aiRiskSummary.keyWarnings.map((warning, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                <AlertTriangle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{warning}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-sm">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className={`text-xl font-bold mb-1 ${analysis.aiRiskSummary.trainingDataRisk ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {analysis.aiRiskSummary.trainingDataRisk ? 'Yes' : 'No'}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Training data risk</div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className={`text-xl font-bold mb-1 ${analysis.aiRiskSummary.noFerpaApps.length > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                {analysis.aiRiskSummary.noFerpaApps.length}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Apps without FERPA protection</div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className={`text-xl font-bold mb-1 ${analysis.aiRiskSummary.highRiskAiApps.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {analysis.aiRiskSummary.highRiskAiApps.length}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Very-high risk AI apps</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Deep Trace: Data Broker Chain ───────────────────────────────────────── */}
      {analysis.dataBrokerAnalysis.totalMappedServices > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Deep trace: who else sees your child's data?
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            Beyond the app itself, data flows to <strong>analytics companies (3rd party)</strong> and then to <strong>data brokers (4th party)</strong> — companies that aggregate and sell profiles.
          </p>

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3 my-4 text-center text-sm">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">{analysis.dataBrokerAnalysis.totalMappedServices}</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs">Apps with known data chains</div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">{analysis.dataBrokerAnalysis.totalUniqueThirdParties}</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs">3rd-party trackers</div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">{analysis.dataBrokerAnalysis.totalUniqueBrokers}</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs">Data brokers (4th party)</div>
            </div>
          </div>

          {/* Cross-service convergence */}
          {analysis.dataBrokerAnalysis.crossServiceBrokers.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="font-semibold text-red-900 dark:text-red-100 text-sm">
                  Data convergence — {analysis.dataBrokerAnalysis.crossServiceBrokers.length} broker{analysis.dataBrokerAnalysis.crossServiceBrokers.length !== 1 ? 's' : ''} receive data from multiple apps
                </span>
              </div>
              <p className="text-xs text-red-800 dark:text-red-200 mb-3">
                When the same broker receives data from multiple apps, it can combine them into a single child profile — across school, home, and social contexts.
              </p>
              <div className="space-y-2">
                {analysis.dataBrokerAnalysis.crossServiceBrokers.slice(0, 4).map(broker => (
                  <div key={broker.name} className="flex items-start gap-2 text-xs bg-white dark:bg-gray-800 p-2 rounded">
                    <Zap className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">{broker.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">({broker.type})</span>
                      <span className="text-gray-600 dark:text-gray-400"> — sees data from: </span>
                      <span className="font-medium text-red-700 dark:text-red-300">{broker.seenInServices.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per-service chain — collapsible with visual flow */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Per-app data chains — click any app to see the full flow
            </p>
            {analysis.dataBrokerAnalysis.serviceChains.map(chain => {
              const isOpen = expandedChain === chain.serviceId;
              const fullChain = isOpen ? getServiceDataChain(chain.serviceId) : null;

              return (
                <div key={chain.serviceId} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  {/* Row header */}
                  <button
                    type="button"
                    onClick={() => setExpandedChain(isOpen ? null : chain.serviceId)}
                    className="w-full flex items-center justify-between p-3 text-left bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        chain.chainRiskLevel === 'very-high' ? 'bg-red-500' :
                        chain.chainRiskLevel === 'high'      ? 'bg-orange-500' :
                        chain.chainRiskLevel === 'medium'    ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="font-medium text-sm text-gray-900 dark:text-white">{chain.serviceName}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {chain.thirdPartyCount} tracker{chain.thirdPartyCount !== 1 ? 's' : ''} · {chain.brokerCount} broker{chain.brokerCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </button>

                  {/* Expanded: visual 3-column flow */}
                  {isOpen && (
                    <div className="bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700 p-4">
                      {/* Summary sentence */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        {chain.chainSummary}
                      </p>

                      {fullChain ? (
                        /* ── 3-column flow: App → Trackers → Brokers ── */
                        <div className="overflow-x-auto">
                          <div className="flex items-start gap-2 min-w-[520px]">

                            {/* Column 1: App */}
                            <div className="flex flex-col items-center gap-1 w-24 shrink-0 pt-1">
                              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden shadow-sm">
                                {hasServiceLogo(chain.serviceId)
                                  ? <img src={getServiceLogoUrlWithBrandColor(chain.serviceId) || undefined} alt="" className="w-8 h-8 object-contain" />
                                  : <Globe className="h-5 w-5 text-gray-400" />
                                }
                              </div>
                              <span className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300 leading-tight">{chain.serviceName}</span>
                              <span className="text-xs text-gray-400 text-center">(1st party)</span>
                            </div>

                            {/* Arrow 1 */}
                            <div className="flex flex-col items-center justify-start pt-4 shrink-0">
                              <div className="w-8 border-t-2 border-dashed border-orange-300 dark:border-orange-700" />
                              <ArrowRight className="h-3 w-3 text-orange-400 -mt-1.5 -mr-0.5" />
                            </div>

                            {/* Column 2: 3rd-party trackers */}
                            <div className="flex-1 min-w-[160px]">
                              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wide">
                                3rd party — trackers
                              </p>
                              <div className="space-y-1.5">
                                {fullChain.thirdPartyTrackers.map(t => (
                                  <div
                                    key={t.name}
                                    className="group relative px-2.5 py-1.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg text-xs"
                                    title={t.notes}
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.canProfileMinors ? 'bg-red-500' : 'bg-yellow-400'}`} />
                                      <span className="font-medium text-orange-900 dark:text-orange-100 leading-tight">{t.name}</span>
                                    </div>
                                    <div className="text-orange-500 dark:text-orange-400 capitalize mt-0.5">{t.role.replace('-', ' ')}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Arrow 2 */}
                            <div className="flex flex-col items-center justify-start pt-4 shrink-0">
                              <div className="w-8 border-t-2 border-dashed border-red-300 dark:border-red-700" />
                              <ArrowRight className="h-3 w-3 text-red-400 -mt-1.5 -mr-0.5" />
                            </div>

                            {/* Column 3: 4th-party brokers */}
                            <div className="flex-1 min-w-[160px]">
                              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">
                                4th party — data brokers
                              </p>
                              <div className="space-y-1.5">
                                {fullChain.fourthPartyBrokers.map(b => (
                                  <div
                                    key={b.name}
                                    className="px-2.5 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-xs"
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="font-medium text-red-900 dark:text-red-100 leading-tight">{b.name}</span>
                                      {b.optOutUrl && (
                                        <a
                                          href={b.optOutUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={e => e.stopPropagation()}
                                          className="shrink-0 text-red-500 hover:text-red-700"
                                          title="Opt-out page"
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      )}
                                    </div>
                                    <div className="text-red-500 dark:text-red-400 capitalize mt-0.5">{b.type.replace('-', ' ')}</div>
                                    {!b.documented && (
                                      <div className="text-red-400 dark:text-red-500 italic mt-0.5">reported</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Detailed chain data not available for this service.</p>
                      )}

                      {/* Opt-out links if any brokers have them */}
                      {fullChain && fullChain.fourthPartyBrokers.some(b => b.optOutUrl) && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Broker opt-out pages:</p>
                          <div className="flex flex-wrap gap-2">
                            {fullChain.fourthPartyBrokers.filter(b => b.optOutUrl).map(b => (
                              <a
                                key={b.name}
                                href={b.optOutUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {b.name} opt-out
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Data chains are based on publicly available privacy policies, FTC reports, and independent research. "Reported" entries are from journalistic sources and may not be fully verified.
          </p>
        </div>
      )}

      {/* ── Educational Info ────────────────────────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Understanding Your Digital Footprint</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Your digital footprint is the trail of data your family leaves online. A larger footprint means more personal information is being collected and shared.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>Small Footprint (0–39):</strong> Minimal data collection, good privacy practices</li>
              <li>• <strong>Moderate Footprint (40–69):</strong> Some data collection, room for improvement</li>
              <li>• <strong>Large Footprint (70–100):</strong> Significant data collection, action recommended</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DigitalFootprintVisualizer;
