import React, { useState } from 'react';
import { Calendar, CheckCircle, Bell, Trash2 } from 'lucide-react';

interface PrivacyDayEvent {
  id: string;
  date: string;
  completed: boolean;
  activities: string[];
  participants: string[];
}

const defaultActivities = [
  'Review all family member account lists',
  'Update passwords and recovery options',
  'Remove unused apps and services',
  'Discuss new platforms or apps family members want to use',
  'Review privacy settings on active accounts',
  'Check location sharing settings',
  'Review friend/follower lists on social media',
  'Update family privacy plan if needed',
];

const fieldClass =
  'px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-200 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500';

const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 rounded-lg transition-colors';

const btnSecondary =
  'inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors';

const PrivacyDayPlanner: React.FC = () => {
  const [events, setEvents] = useState<PrivacyDayEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);

  const addPrivacyDay = () => {
    if (!selectedDate) {return;}

    const newEvent: PrivacyDayEvent = {
      id: `event-${Date.now()}`,
      date: selectedDate,
      completed: false,
      activities: [...defaultActivities],
      participants: [],
    };

    setEvents([...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setSelectedDate('');
    setShowAddEvent(false);
  };

  const markEventComplete = (eventId: string) => {
    setEvents(events.map((event) => (event.id === eventId ? { ...event, completed: !event.completed } : event)));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
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
      day: 'numeric',
    });
  };

  const isUpcoming = (dateString: string): boolean => new Date(dateString) >= new Date();

  const eventBorderClass = (event: PrivacyDayEvent) => {
    if (event.completed) {return 'border-green-500 dark:border-green-600';}
    if (isUpcoming(event.date)) {return 'border-blue-500 dark:border-blue-500';}
    return 'border-gray-400 dark:border-gray-600';
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Family Privacy Day Planner
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
          Schedule quarterly &ldquo;Privacy Days&rdquo; to review and update your family&apos;s online privacy together
        </p>
      </div>

      <div className="rounded-xl border-2 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30 p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">What is a Privacy Day?</h3>
        <p className="text-blue-900 dark:text-blue-200/90 leading-relaxed m-0">
          A Privacy Day is a scheduled time (every 3 months) when your family comes together to review online accounts,
          update privacy settings, remove unused apps, and discuss new platforms. It&apos;s a great way to make privacy
          maintenance a regular family activity.
        </p>
      </div>

      <div className="mb-8">
        {!showAddEvent ? (
          <button
            type="button"
            onClick={() => {
              setSelectedDate(getNextQuarterDate());
              setShowAddEvent(true);
            }}
            className={btnPrimary}
          >
            <Calendar size={20} aria-hidden />
            Schedule Next Privacy Day
          </button>
        ) : (
          <div className="rounded-xl border-2 border-green-500 dark:border-green-600 bg-white dark:bg-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Schedule Privacy Day</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <label htmlFor="privacy-day-date" className="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">
                Date
              </label>
              <input
                id="privacy-day-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={fieldClass}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={addPrivacyDay} className={btnPrimary}>
                Add Privacy Day
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddEvent(false);
                  setSelectedDate('');
                }}
                className={btnSecondary}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-100/50 p-12 text-center">
          <Calendar size={48} className="text-gray-400 dark:text-gray-500 mx-auto mb-4" aria-hidden />
          <p className="text-gray-600 dark:text-gray-400">No Privacy Days scheduled yet. Schedule your first one above!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className={`rounded-xl border-2 bg-white dark:bg-gray-200 p-6 ${eventBorderClass(event)} ${
                event.completed ? 'opacity-70' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Calendar
                      size={20}
                      className={isUpcoming(event.date) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}
                      aria-hidden
                    />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 m-0">
                      {formatDate(event.date)}
                    </h3>
                    {event.completed && (
                      <span className="px-3 py-0.5 text-xs font-semibold text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900/40 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  {!isUpcoming(event.date) && !event.completed && (
                    <p className="text-red-600 dark:text-red-400 text-sm m-0">This Privacy Day has passed</p>
                  )}
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                  {!event.completed && (
                    <button
                      type="button"
                      onClick={() => markEventComplete(event.id)}
                      className="p-2 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-500 hover:opacity-90"
                      aria-label="Mark as complete"
                    >
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteEvent(event.id)}
                    className="p-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-500 hover:opacity-90"
                    aria-label="Delete privacy day"
                  >
                    <Trash2 size={20} className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>

              <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-3">Privacy Day Agenda:</h4>
              <div className="flex flex-col gap-2">
                {defaultActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-100/50"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 leading-relaxed">{activity}</span>
                  </div>
                ))}
              </div>

              {isUpcoming(event.date) && !event.completed && (
                <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-400 dark:border-amber-600 flex items-start gap-3">
                  <Bell size={20} className="text-amber-600 dark:text-amber-400 shrink-0" aria-hidden />
                  <div>
                    <strong className="block text-amber-900 dark:text-amber-200 mb-1">Reminder</strong>
                    <p className="text-amber-900 dark:text-amber-200/90 text-sm m-0">
                      Set a reminder for this Privacy Day in your calendar app
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950/30 p-6">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-4">
          Tips for a Successful Privacy Day
        </h3>
        <ul className="m-0 pl-5 text-green-900 dark:text-green-200 leading-relaxed space-y-2">
          <li>Make it a family activity — involve everyone in the process</li>
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
