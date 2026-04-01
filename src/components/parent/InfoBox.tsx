import React from 'react';
import { Info, AlertCircle, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

type InfoBoxType = 'info' | 'success' | 'warning' | 'error' | 'tip';

interface InfoBoxProps {
  type?: InfoBoxType;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  type = 'info',
  title,
  children,
  icon,
  onClose
}) => {
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: '#d1fae5',
          borderColor: '#10b981',
          textColor: '#065f46',
          iconColor: '#10b981',
          defaultIcon: CheckCircle
        };
      case 'warning':
        return {
          bgColor: '#fef3c7',
          borderColor: '#f59e0b',
          textColor: '#92400e',
          iconColor: '#f59e0b',
          defaultIcon: AlertTriangle
        };
      case 'error':
        return {
          bgColor: '#fee2e2',
          borderColor: '#dc2626',
          textColor: '#991b1b',
          iconColor: '#dc2626',
          defaultIcon: AlertCircle
        };
      case 'tip':
        return {
          bgColor: '#dbeafe',
          borderColor: '#3b82f6',
          textColor: '#1e40af',
          iconColor: '#3b82f6',
          defaultIcon: Lightbulb
        };
      default: // info
        return {
          bgColor: '#e0f2fe',
          borderColor: '#0ea5e9',
          textColor: '#0c4a6e',
          iconColor: '#0ea5e9',
          defaultIcon: Info
        };
    }
  };

  const config = getConfig();
  const Icon = icon || config.defaultIcon;

  return (
    <div
      style={{
        backgroundColor: config.bgColor,
        border: `2px solid ${config.borderColor}`,
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start',
        position: 'relative'
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '0.125rem' }}>
        {React.isValidElement(Icon) ? (
          Icon
        ) : (
          <Icon size={20} style={{ color: config.iconColor }} />
        )}
      </div>

      <div style={{ flex: 1, color: config.textColor }}>
        {title && (
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: config.textColor
            }}
          >
            {title}
          </div>
        )}
        <div style={{ fontSize: '0.9375rem', lineHeight: '1.6' }}>{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'none',
            border: 'none',
            color: config.textColor,
            cursor: 'pointer',
            padding: '0.25rem',
            opacity: 0.7
          }}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default InfoBox;

