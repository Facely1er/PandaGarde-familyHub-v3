import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ExternalLink, Heart, Lightbulb, ArrowRight } from 'lucide-react';

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

const ConversationStarter: React.FC<ConversationStarterProps> = ({
  childName,
  service,
  topic,
  script
}) => {
  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f59e0b';
      case 'very-high': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const riskColor = getRiskColor(service.riskLevel);

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `2px solid ${riskColor}`,
        borderLeft: `4px solid ${riskColor}`,
        marginBottom: '1rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <MessageCircle size={20} style={{ color: riskColor }} />
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: riskColor,
                textTransform: 'uppercase'
              }}
            >
              {service.riskLevel === 'very-high' ? 'Very High' : service.riskLevel.charAt(0).toUpperCase() + service.riskLevel.slice(1)} Risk
            </span>
          </div>
          <div
            style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#2C3E50',
              marginBottom: '0.25rem'
            }}
          >
            {topic}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            For {childName} • {service.name}
          </div>
        </div>
      </div>

      {/* Conversation Script */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          borderLeft: `3px solid ${riskColor}`
        }}
      >
        <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', fontWeight: 500 }}>
          What to say:
        </div>
        <div
          style={{
            fontSize: '1rem',
            color: '#2C3E50',
            lineHeight: 1.6,
            fontStyle: 'italic'
          }}
        >
          "{script}"
        </div>
      </div>

      {/* Parent Tips */}
      {service.parentTips.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', fontWeight: 500 }}>
            Tips for this conversation:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#2C3E50', lineHeight: 1.8 }}>
            {service.parentTips.slice(0, 2).map((tip, index) => (
              <li key={index} style={{ fontSize: '0.875rem' }}>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conversation Approach Reminders */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #3b82f6'
      }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Heart size={16} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#1e40af', display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              Remember: Show Care, Not Fear
            </strong>
            <p style={{ color: '#1e40af', margin: 0, fontSize: '0.8125rem', lineHeight: 1.6 }}>
              Focus on protecting and caring for {childName}, not on scary consequences. Use "we" language and express concern with love.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
          <Lightbulb size={16} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#1e40af', display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              Use Everyday Examples
            </strong>
            <p style={{ color: '#1e40af', margin: 0, fontSize: '0.8125rem', lineHeight: 1.6 }}>
              Connect online safety to real-world situations {childName} already understands, like not sharing your house key with strangers.
            </p>
          </div>
        </div>
      </div>

      {/* Link to Full Guide */}
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
        <Link
          to="/guides/conversation-approaches"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#4CAF50',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          Learn more conversation approaches
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ConversationStarter;

