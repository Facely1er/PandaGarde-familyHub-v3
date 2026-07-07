import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Lightbulb, ArrowRight } from 'lucide-react';

interface ConversationStarterProps {
  childName: string;
  service: {
    name: string;
    riskLevel: string;
    parentTips: string[];
    privacyConcerns: string[];
  };
  topic: string;
  script: string;
}

const riskBorderClasses: Record<string, string> = {
  low: 'border-green-500 dark:border-green-600',
  medium: 'border-amber-500 dark:border-amber-600',
  high: 'border-orange-500 dark:border-orange-600',
  'very-high': 'border-red-500 dark:border-red-600',
};

const riskTextClasses: Record<string, string> = {
  low: 'text-green-600 dark:text-green-400',
  medium: 'text-amber-600 dark:text-amber-400',
  high: 'text-orange-600 dark:text-orange-400',
  'very-high': 'text-red-600 dark:text-red-400',
};

const ConversationStarter: React.FC<ConversationStarterProps> = ({
  childName,
  service,
  topic,
  script,
}) => {
  const borderClass = riskBorderClasses[service.riskLevel] || 'border-gray-400';
  const textClass = riskTextClasses[service.riskLevel] || 'text-gray-600';
  const riskLabel =
    service.riskLevel === 'very-high'
      ? 'Very High'
      : service.riskLevel.charAt(0).toUpperCase() + service.riskLevel.slice(1);

  return (
    <div
      className={`mb-4 rounded-xl border-2 border-l-4 bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6 ${borderClass}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <MessageCircle size={20} className={textClass} aria-hidden />
            <span className={`text-sm font-medium uppercase ${textClass}`}>{riskLabel} Risk</span>
          </div>
          <div className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">{topic}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            For {childName} • {service.name}
          </div>
        </div>
      </div>

      <div className={`mb-4 rounded-lg border-l-4 bg-gray-50 p-4 dark:bg-gray-900/40 ${borderClass}`}>
        <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">What to say:</div>
        <div className="text-base italic leading-relaxed text-gray-900 dark:text-gray-100">&quot;{script}&quot;</div>
      </div>

      {service.parentTips.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Tips for this conversation:
          </div>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-900 dark:text-gray-100">
            {service.parentTips.slice(0, 2).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
        <div className="mb-3 flex items-start gap-3">
          <Heart size={16} className="mt-0.5 flex-shrink-0 text-green-700 dark:text-green-400" aria-hidden />
          <div>
            <strong className="mb-1 block text-sm text-green-900 dark:text-green-100">
              Remember: Show Care, Not Fear
            </strong>
            <p className="m-0 text-[0.8125rem] leading-relaxed text-green-800 dark:text-green-200">
              Focus on protecting and caring for {childName}, not on scary consequences. Use &quot;we&quot;
              language and express concern with love.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Lightbulb size={16} className="mt-0.5 flex-shrink-0 text-green-700 dark:text-green-400" aria-hidden />
          <div>
            <strong className="mb-1 block text-sm text-green-900 dark:text-green-100">
              Use Everyday Examples
            </strong>
            <p className="m-0 text-[0.8125rem] leading-relaxed text-green-800 dark:text-green-200">
              Connect online safety to real-world situations {childName} already understands, like not
              sharing your house key with strangers.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
        <Link
          to="/guides/conversation-approaches"
          className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
        >
          Learn more conversation approaches
          <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
    </div>
  );
};

export default ConversationStarter;
