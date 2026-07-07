import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getServiceById } from '../../data/childServiceCatalog';

interface ChildRiskCardProps {
  child: {
    id: string;
    first_name: string;
    last_name: string;
    profile_data?: { age?: number };
    services?: Array<{
      serviceId: string;
      status: string;
    }>;
  };
  riskScore: number;
  onViewServices: () => void;
}

const getRiskClasses = (score: number) => {
  if (score >= 70) {
    return {
      level: 'High',
      border: 'border-red-500 dark:border-red-600',
      avatar: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
      text: 'text-red-600 dark:text-red-400',
      bar: 'bg-red-500',
    };
  }
  if (score >= 40) {
    return {
      level: 'Medium',
      border: 'border-amber-500 dark:border-amber-600',
      avatar: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      text: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-amber-500',
    };
  }
  return {
    level: 'Low',
    border: 'border-green-500 dark:border-green-600',
    avatar: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    text: 'text-green-600 dark:text-green-400',
    bar: 'bg-green-500',
  };
};

const serviceRiskBadge: Record<string, string> = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  medium: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  high: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200',
  'very-high': 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200',
};

const ChildRiskCard: React.FC<ChildRiskCardProps> = ({ child, riskScore, onViewServices }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const risk = getRiskClasses(riskScore);
  const approvedServices = child.services?.filter((s) => s.status === 'approved') || [];

  return (
    <button
      type="button"
      className={`w-full cursor-pointer rounded-xl border-2 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 sm:p-6 ${risk.border}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="mb-4 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-2xl font-bold ${risk.avatar}`}
        >
          {child.first_name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">
            {child.first_name} {child.last_name}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {child.profile_data?.age && `Age ${child.profile_data.age}`}
            {child.profile_data?.age && approvedServices.length > 0 && ' • '}
            {approvedServices.length > 0 &&
              `${approvedServices.length} active ${approvedServices.length === 1 ? 'service' : 'services'}`}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="flex-shrink-0 text-gray-500" aria-hidden />
        ) : (
          <ChevronDown size={20} className="flex-shrink-0 text-gray-500" aria-hidden />
        )}
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Privacy Safety Level</span>
          <span className={`text-base font-bold ${risk.text}`}>
            {riskScore}/100 - {risk.level}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full transition-[width] duration-300 ${risk.bar}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      {approvedServices.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Active Services:</div>
          <div className="flex flex-wrap gap-2">
            {approvedServices.slice(0, 3).map((serviceUsage) => {
              const service = getServiceById(serviceUsage.serviceId);
              if (!service) {return null;}
              return (
                <span
                  key={serviceUsage.serviceId}
                  className={`rounded-xl px-3 py-1 text-xs font-medium ${serviceRiskBadge[service.riskLevel] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                >
                  {service.name}
                </span>
              );
            })}
            {approvedServices.length > 3 && (
              <span className="rounded-xl bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                +{approvedServices.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewServices();
            }}
            className="w-full rounded-lg bg-green-700 py-3 text-sm font-medium text-white transition-colors hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
          >
            View All Services
          </button>
        </div>
      )}
    </button>
  );
};

export default ChildRiskCard;
