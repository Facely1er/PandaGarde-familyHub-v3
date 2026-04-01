import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ActionItemCardProps {
  id: string;
  type: 'approval' | 'high-risk' | 'conversation' | 'education';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  onClick: () => void;
  icon: React.ElementType;
}

const ActionItemCard: React.FC<ActionItemCardProps> = ({
  id,
  type,
  priority,
  title,
  description,
  onClick,
  icon: Icon
}) => {
  const priorityStyles = {
    high: {
      borderColor: '#dc2626',
      backgroundColor: '#fef2f2',
      iconBg: '#fee2e2'
    },
    medium: {
      borderColor: '#f59e0b',
      backgroundColor: '#fffbeb',
      iconBg: '#fef3c7'
    },
    low: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4',
      iconBg: '#d1fae5'
    }
  };

  const style = priorityStyles[priority];

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem',
        backgroundColor: style.backgroundColor,
        border: `2px solid ${style.borderColor}`,
        borderLeft: `4px solid ${style.borderColor}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '0.75rem'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: style.iconBg,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Icon size={20} style={{ color: style.borderColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#2C3E50',
            marginBottom: '0.25rem'
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '0.875rem',
            color: '#666',
            lineHeight: 1.5
          }}
        >
          {description}
        </div>
      </div>
      <ChevronRight size={20} style={{ color: style.borderColor, flexShrink: 0 }} />
    </div>
  );
};

export default ActionItemCard;

