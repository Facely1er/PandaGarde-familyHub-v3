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
  color = '#4CAF50',
  showTrend = true,
  formatValue = (val) => val.toString()
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
        <p>No data available yet</p>
      </div>
    );
  }

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) {return null;}
    const first = data[0].value;
    const last = data[data.length - 1].value;
    const diff = last - first;
    const percentChange = first !== 0 ? (diff / first) * 100 : 0;
    return { diff, percentChange, direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable' };
  };

  const trend = showTrend ? calculateTrend() : null;

  // Normalize values for display
  const normalizedData = data.map(point => ({
    ...point,
    normalizedValue: ((point.value - minValue) / (maxValue - minValue)) * 100
  }));

  // Simple bar chart visualization
  const maxBarHeight = 120;
  const barWidth = Math.max(40, Math.min(80, 400 / data.length));

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {title && (
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2C3E50', marginBottom: '1rem' }}>
          {title}
        </h3>
      )}

      {trend && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: trend.direction === 'up' ? '#d1fae5' : trend.direction === 'down' ? '#fee2e2' : '#f3f4f6',
          borderRadius: '8px'
        }}>
          {trend.direction === 'up' && <TrendingUp size={18} style={{ color: '#10b981' }} />}
          {trend.direction === 'down' && <TrendingDown size={18} style={{ color: '#dc2626' }} />}
          {trend.direction === 'stable' && <Minus size={18} style={{ color: '#6b7280' }} />}
          <span style={{ 
            fontSize: '0.875rem', 
            color: trend.direction === 'up' ? '#065f46' : trend.direction === 'down' ? '#991b1b' : '#374151',
            fontWeight: 500
          }}>
            {trend.direction === 'up' ? 'Improving' : trend.direction === 'down' ? 'Needs Attention' : 'Stable'}: 
            {' '}{Math.abs(trend.percentChange).toFixed(1)}% change
          </span>
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: '0.5rem', 
        height: `${maxBarHeight + 40}px`,
        paddingBottom: '2rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {normalizedData.map((point, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <div
              style={{
                width: '100%',
                height: `${(point.normalizedValue / 100) * maxBarHeight}px`,
                backgroundColor: color,
                borderRadius: '4px 4px 0 0',
                minHeight: point.normalizedValue > 0 ? '4px' : '0',
                transition: 'height 0.3s ease',
                position: 'relative'
              }}
              title={`${point.label || point.date}: ${formatValue(point.value)}`}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-1.5rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.75rem',
                  color: '#666',
                  whiteSpace: 'nowrap'
                }}
              >
                {formatValue(point.value)}
              </div>
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#666',
                textAlign: 'center',
                transform: 'rotate(-45deg)',
                transformOrigin: 'center',
                whiteSpace: 'nowrap',
                width: '60px',
                marginTop: '0.5rem'
              }}
            >
              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '1rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: '0.875rem', 
        color: '#666' 
      }}>
        <span>Min: {formatValue(minValue)}</span>
        <span>Max: {formatValue(maxValue)}</span>
      </div>
    </div>
  );
};

export default ProgressVisualization;

