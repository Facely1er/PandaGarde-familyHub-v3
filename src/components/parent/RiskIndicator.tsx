import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface RiskIndicatorProps {
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  score?: number; // Optional numeric score (0-100)
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'badge' | 'card' | 'inline';
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  riskLevel,
  score,
  showLabel = true,
  size = 'medium',
  variant = 'badge'
}) => {
  const getRiskConfig = () => {
    switch (riskLevel) {
      case 'low':
        return {
          color: '#10b981',
          bgColor: '#d1fae5',
          borderColor: '#10b981',
          icon: CheckCircle,
          label: 'Low Risk',
          textColor: '#065f46'
        };
      case 'medium':
        return {
          color: '#f59e0b',
          bgColor: '#fef3c7',
          borderColor: '#f59e0b',
          icon: AlertTriangle,
          label: 'Medium Risk',
          textColor: '#92400e'
        };
      case 'high':
        return {
          color: '#f97316',
          bgColor: '#fed7aa',
          borderColor: '#f97316',
          icon: AlertTriangle,
          label: 'High Risk',
          textColor: '#9a3412'
        };
      case 'very-high':
        return {
          color: '#dc2626',
          bgColor: '#fee2e2',
          borderColor: '#dc2626',
          icon: XCircle,
          label: 'Very High Risk',
          textColor: '#991b1b'
        };
      default:
        return {
          color: '#6b7280',
          bgColor: '#f3f4f6',
          borderColor: '#6b7280',
          icon: Shield,
          label: 'Unknown',
          textColor: '#374151'
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  const sizeConfig = {
    small: { icon: 14, text: '0.75rem', padding: '0.25rem 0.5rem' },
    medium: { icon: 18, text: '0.875rem', padding: '0.5rem 0.75rem' },
    large: { icon: 24, text: '1rem', padding: '0.75rem 1rem' }
  };

  const currentSize = sizeConfig[size];

  if (variant === 'card') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: config.bgColor,
          border: `2px solid ${config.borderColor}`,
          borderRadius: '12px',
          marginBottom: '1rem'
        }}
      >
        <Icon size={currentSize.icon} style={{ color: config.color, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          {showLabel && (
            <div style={{ fontSize: currentSize.text, fontWeight: 600, color: config.textColor, marginBottom: '0.25rem' }}>
              {config.label}
            </div>
          )}
          {score !== undefined && (
            <div style={{ fontSize: '0.875rem', color: config.textColor }}>
              Privacy Safety Score: {score}/100
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontSize: currentSize.text,
          color: config.textColor,
          fontWeight: 500
        }}
      >
        <Icon size={currentSize.icon} style={{ color: config.color }} />
        {showLabel && config.label}
        {score !== undefined && ` (${score}/100)`}
      </span>
    );
  }

  // Default badge variant
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: currentSize.padding,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '9999px',
        fontSize: currentSize.text,
        fontWeight: 500,
        color: config.textColor
      }}
    >
      <Icon size={currentSize.icon} style={{ color: config.color }} />
      {showLabel && config.label}
      {score !== undefined && ` ${score}/100`}
    </span>
  );
};

export default RiskIndicator;

