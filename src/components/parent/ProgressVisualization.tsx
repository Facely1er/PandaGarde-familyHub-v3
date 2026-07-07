import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressDataPoint {
  date: string;
  value: number;
  label?: string;
}

interface ProgressVisualizationProps {
  data: ProgressDataPoint[];
  title?: string;
  maxValue?: number;
  minValue?: number;
  color?: string;
  showTrend?: boolean;
  formatValue?: (value: number) => string;
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  data,
  title,
  maxValue = 100,
  minValue = 0,
  color = '#16a34a',
  showTrend = true,
  formatValue = (val) => val.toString(),
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600 dark:text-gray-400">
        <p>No data available yet</p>
      </div>
    );
  }

  const calculateTrend = () => {
    if (data.length < 2) return null;
    const first = data[0].value;
    const last = data[data.length - 1].value;
    const diff = last - first;
    const percentChange = first !== 0 ? (diff / first) * 100 : 0;
    return { diff, percentChange, direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable' };
  };

  const trend = showTrend ? calculateTrend() : null;

  const normalizedData = data.map((point) => ({
    ...point,
    normalizedValue: ((point.value - minValue) / (maxValue - minValue)) * 100,
  }));

  const maxBarHeight = 120;

  const trendClasses =
    trend?.direction === 'up'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
      : trend?.direction === 'down'
        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      )}

      {trend && (
        <div className={`mb-4 flex items-center gap-2 rounded-lg p-3 ${trendClasses}`}>
          {trend.direction === 'up' && <TrendingUp size={18} className="text-green-600" aria-hidden />}
          {trend.direction === 'down' && <TrendingDown size={18} className="text-red-600" aria-hidden />}
          {trend.direction === 'stable' && <Minus size={18} className="text-gray-500" aria-hidden />}
          <span className="text-sm font-medium">
            {trend.direction === 'up' ? 'Improving' : trend.direction === 'down' ? 'Needs Attention' : 'Stable'}:{' '}
            {Math.abs(trend.percentChange).toFixed(1)}% change
          </span>
        </div>
      )}

      <div
        className="flex items-end gap-2 border-b border-gray-200 pb-8 dark:border-gray-700"
        style={{ height: `${maxBarHeight + 40}px` }}
      >
        {normalizedData.map((point, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="relative w-full min-h-[4px] rounded-t transition-[height] duration-300"
              style={{
                height: `${(point.normalizedValue / 100) * maxBarHeight}px`,
                backgroundColor: color,
                minHeight: point.normalizedValue > 0 ? '4px' : '0',
              }}
              title={`${point.label || point.date}: ${formatValue(point.value)}`}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                {formatValue(point.value)}
              </div>
            </div>
            <div className="mt-2 w-[60px] origin-center -rotate-45 whitespace-nowrap text-center text-xs text-gray-600 dark:text-gray-400">
              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Min: {formatValue(minValue)}</span>
        <span>Max: {formatValue(maxValue)}</span>
      </div>
    </div>
  );
};

export default ProgressVisualization;
