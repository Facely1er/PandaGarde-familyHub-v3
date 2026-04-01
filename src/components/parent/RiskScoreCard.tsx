import React from 'react';
import { Shield } from 'lucide-react';

interface RiskScoreCardProps {
  score: number;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ 
  score, 
  label = 'Privacy Safety Level',
  size = 'medium'
}) => {
  const getRiskLevel = (score: number): { level: string; color: string; bgColor: string } => {
    if (score >= 70) {return { level: 'High', color: '#dc2626', bgColor: '#fee2e2' };}
    if (score >= 40) {return { level: 'Medium', color: '#f59e0b', bgColor: '#fef3c7' };}
    return { level: 'Low', color: '#10b981', bgColor: '#d1fae5' };
  };

  const riskLevel = getRiskLevel(score);
  const sizeClasses = {
    small: { icon: 20, value: '1.5rem', label: '0.875rem' },
    medium: { icon: 32, value: '2.5rem', label: '1rem' },
    large: { icon: 48, value: '3.5rem', label: '1.25rem' }
  };

  const sizes = sizeClasses[size];

  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: size === 'large' ? '1.5rem' : '1rem',
        backgroundColor: riskLevel.bgColor,
        border: `2px solid ${riskLevel.color}`,
        borderRadius: '12px',
        minWidth: size === 'large' ? '280px' : '200px'
      }}
    >
      <Shield size={sizes.icon} style={{ color: riskLevel.color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div 
          style={{ 
            fontSize: sizes.value, 
            fontWeight: 'bold', 
            color: riskLevel.color,
            lineHeight: 1.2
          }}
        >
          {score}/100
        </div>
        <div 
          style={{ 
            fontSize: sizes.label, 
            color: riskLevel.color,
            fontWeight: 500,
            marginTop: '0.25rem'
          }}
        >
          {riskLevel.level} Risk
        </div>
        {label && size !== 'small' && (
          <div 
            style={{ 
              fontSize: '0.75rem', 
              color: '#666',
              marginTop: '0.25rem'
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskScoreCard;

