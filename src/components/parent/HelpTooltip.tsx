import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  children?: React.ReactNode;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  title,
  position = 'top',
  trigger = 'hover',
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const positionStyles = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '8px'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '8px'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: '8px'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '8px'
    }
  };

  const arrowStyles = {
    top: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderTopColor: '#374151',
      borderBottom: 'none'
    },
    bottom: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderBottomColor: '#374151',
      borderTop: 'none'
    },
    left: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderLeftColor: '#374151',
      borderRight: 'none'
    },
    right: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderRightColor: '#374151',
      borderLeft: 'none'
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children || (
        <HelpCircle
          size={16}
          style={{
            color: '#6b7280',
            cursor: 'pointer',
            verticalAlign: 'middle'
          }}
        />
      )}

      {isVisible && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1000,
            ...positionStyles[position],
            minWidth: '200px',
            maxWidth: '300px',
            padding: '0.75rem',
            backgroundColor: '#374151',
            color: 'white',
            borderRadius: '8px',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: trigger === 'click' ? 'auto' : 'none'
          }}
        >
          {trigger === 'click' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              <X size={14} />
            </button>
          )}

          {title && (
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
              {title}
            </div>
          )}

          <div>{content}</div>

          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              border: '6px solid transparent',
              ...arrowStyles[position]
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;

