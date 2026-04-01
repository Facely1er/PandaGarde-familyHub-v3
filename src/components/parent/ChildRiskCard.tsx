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

const ChildRiskCard: React.FC<ChildRiskCardProps> = ({
  child,
  riskScore,
  onViewServices
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskLevel = (score: number): { level: string; color: string; bgColor: string } => {
    if (score >= 70) {return { level: 'High', color: '#dc2626', bgColor: '#fee2e2' };}
    if (score >= 40) {return { level: 'Medium', color: '#f59e0b', bgColor: '#fef3c7' };}
    return { level: 'Low', color: '#10b981', bgColor: '#d1fae5' };
  };

  const riskLevel = getRiskLevel(riskScore);
  const approvedServices = child.services?.filter(s => s.status === 'approved') || [];

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `2px solid ${riskLevel.color}`,
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: riskLevel.bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: riskLevel.color,
            flexShrink: 0
          }}
        >
          {child.first_name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#2C3E50',
              marginBottom: '0.25rem'
            }}
          >
            {child.first_name} {child.last_name}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            {child.profile_data?.age && `Age ${child.profile_data.age}`}
            {child.profile_data?.age && approvedServices.length > 0 && ' • '}
            {approvedServices.length > 0 && `${approvedServices.length} active ${approvedServices.length === 1 ? 'service' : 'services'}`}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} style={{ color: '#666', flexShrink: 0 }} />
        ) : (
          <ChevronDown size={20} style={{ color: '#666', flexShrink: 0 }} />
        )}
      </div>

      {/* Risk Indicator */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#666', fontWeight: 500 }}>
            Privacy Safety Level
          </span>
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: riskLevel.color
            }}
          >
            {riskScore}/100 - {riskLevel.level}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${riskScore}%`,
              height: '100%',
              backgroundColor: riskLevel.color,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Services Preview */}
      {approvedServices.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', fontWeight: 500 }}>
            Active Services:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {approvedServices.slice(0, 3).map(serviceUsage => {
              const service = getServiceById(serviceUsage.serviceId);
              if (!service) {return null;}
              const bgColors: Record<string, string> = {
                low: '#d1fae5',
                medium: '#fef3c7',
                high: '#fee2e2',
                'very-high': '#fee2e2'
              };
              const textColors: Record<string, string> = {
                low: '#065f46',
                medium: '#92400e',
                high: '#991b1b',
                'very-high': '#991b1b'
              };
              return (
                <span
                  key={serviceUsage.serviceId}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor: bgColors[service.riskLevel] || '#e5e7eb',
                    color: textColors[service.riskLevel] || '#666'
                  }}
                >
                  {service.name}
                </span>
              );
            })}
            {approvedServices.length > 3 && (
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  backgroundColor: '#e5e7eb',
                  color: '#666'
                }}
              >
                +{approvedServices.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewServices();
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#45a049';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4CAF50';
            }}
          >
            View All Services
          </button>
        </div>
      )}
    </div>
  );
};

export default ChildRiskCard;

