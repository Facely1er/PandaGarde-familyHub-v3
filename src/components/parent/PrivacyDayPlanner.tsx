import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, Bell, Users, Shield, RefreshCw, Trash2, MessageCircle } from 'lucide-react';

interface PrivacyDayEvent {
  id: string;
  date: string;
  completed: boolean;
  activities: string[];
  participants: string[];
}

const PrivacyDayPlanner: React.FC = () => {
  const [events, setEvents] = useState<PrivacyDayEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showAddEvent, setShowAddEvent] = useState(false);

  const defaultActivities = [
    'Review all family member account lists',
    'Update passwords and recovery options',
    'Remove unused apps and services',
    'Discuss new platforms or apps family members want to use',
    'Review privacy settings on active accounts',
    'Check location sharing settings',
    'Review friend/follower lists on social media',
    'Update family privacy plan if needed'
  ];

  const addPrivacyDay = () => {
    if (!selectedDate) {return;}

    const newEvent: PrivacyDayEvent = {
      id: `event-${Date.now()}`,
      date: selectedDate,
      completed: false,
      activities: [...defaultActivities],
      participants: []
    };

    setEvents([...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setSelectedDate('');
    setShowAddEvent(false);
  };

  const toggleActivity = (eventId: string, activityIndex: number) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const newActivities = [...event.activities];
        // For simplicity, we'll just mark activities as done by removing them
        // In a real app, you'd track completion separately
        return event;
      }
      return event;
    }));
  };

  const markEventComplete = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, completed: !event.completed } : event
    ));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const getNextQuarterDate = (): string => {
    const today = new Date();
    const nextQuarter = new Date(today);
    nextQuarter.setMonth(today.getMonth() + 3);
    return nextQuarter.toISOString().split('T')[0];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isUpcoming = (dateString: string): boolean => {
    return new Date(dateString) >= new Date();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '0.5rem' }}>
          Family Privacy Day Planner
        </h2>
        <p style={{ color: '#666', fontSize: '1.125rem' }}>
          Schedule quarterly "Privacy Days" to review and update your family's online privacy together
        </p>
      </div>

      {/* Info Box */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '2px solid #3b82f6',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.75rem' }}>
          What is a Privacy Day?
        </h3>
        <p style={{ color: '#1e40af', lineHeight: 1.8, margin: 0 }}>
          A Privacy Day is a scheduled time (every 3 months) when your family comes together to review online accounts, 
          update privacy settings, remove unused apps, and discuss new platforms. It's a great way to make privacy 
          maintenance a regular family activity.
        </p>
      </div>

      {/* Add Privacy Day Button */}
      <div style={{ marginBottom: '2rem' }}>
        {!showAddEvent ? (
          <button
            onClick={() => {
              setSelectedDate(getNextQuarterDate());
              setShowAddEvent(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 1.5rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            <Calendar size={20} />
            Schedule Next Privacy Day
          </button>
        ) : (
          <div style={{
            backgroundColor: 'white',
            border: '2px solid #4CAF50',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2C3E50', marginBottom: '1rem' }}>
              Schedule Privacy Day
            </h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#666', fontWeight: 500 }}>
                Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={addPrivacyDay}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                Add Privacy Day
              </button>
              <button
                onClick={() => {
                  setShowAddEvent(false);
                  setSelectedDate('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#666',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Day Events */}
      {events.length === 0 ? (
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <Calendar size={48} style={{ color: '#9ca3af', marginBottom: '1rem' }} />
          <p style={{ color: '#666', fontSize: '1rem' }}>
            No Privacy Days scheduled yet. Schedule your first one above!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {events.map(event => (
            <div
              key={event.id}
              style={{
                backgroundColor: 'white',
                border: `2px solid ${event.completed ? '#10b981' : isUpcoming(event.date) ? '#3b82f6' : '#9ca3af'}`,
                borderRadius: '12px',
                padding: '1.5rem',
                opacity: event.completed ? 0.7 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Calendar size={20} style={{ color: isUpcoming(event.date) ? '#3b82f6' : '#9ca3af' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2C3E50', margin: 0 }}>
                      {formatDate(event.date)}
                    </h3>
                    {event.completed && (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        Completed
                      </span>
                    )}
                  </div>
                  {!isUpcoming(event.date) && !event.completed && (
                    <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>
                      This Privacy Day has passed
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!event.completed && (
                    <button
                      onClick={() => markEventComplete(event.id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #10b981',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Mark as complete"
                    >
                      <CheckCircle size={20} style={{ color: '#10b981' }} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteEvent(event.id)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #dc2626',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete"
                  >
                    <Trash2 size={20} style={{ color: '#dc2626' }} />
                  </button>
                </div>
              </div>

              {/* Agenda */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50', marginBottom: '1rem' }}>
                  Privacy Day Agenda:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {defaultActivities.map((activity, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>
                          {index + 1}
                        </span>
                      </div>
                      <span style={{ color: '#2C3E50', lineHeight: 1.6 }}>
                        {activity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reminder */}
              {isUpcoming(event.date) && !event.completed && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  border: '1px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Bell size={20} style={{ color: '#f59e0b' }} />
                  <div>
                    <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.25rem' }}>
                      Reminder
                    </strong>
                    <p style={{ color: '#92400e', margin: 0, fontSize: '0.875rem' }}>
                      Set a reminder for this Privacy Day in your calendar app
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div style={{
        marginTop: '2rem',
        backgroundColor: '#f0fdf4',
        border: '1px solid #10b981',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#065f46', marginBottom: '1rem' }}>
          Tips for a Successful Privacy Day
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#065f46', lineHeight: 1.8 }}>
          <li>Make it a family activity - involve everyone in the process</li>
          <li>Keep it positive and educational, not scary or punitive</li>
          <li>Order pizza or have a special treat to make it fun</li>
          <li>Take breaks if it gets overwhelming</li>
          <li>Celebrate progress, even small steps</li>
          <li>Use this time to discuss new apps or platforms family members want to use</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyDayPlanner;

