import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Gamepad2, Award, Settings } from 'lucide-react';

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/family-hub/dashboard' },
    { id: 'kids', label: 'Kids', icon: Users, path: '/family-hub/kids' },
    { id: 'activities', label: 'Activities', icon: Gamepad2, path: '/family-hub/activities' },
    { id: 'progress', label: 'Progress', icon: Award, path: '/family-hub/progress' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/family-hub/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/family-hub/dashboard') {
      return location.pathname === '/family-hub/dashboard' || location.pathname === '/family-hub';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 safe-area-inset">
      {/* Top Bar - Mobile App Style */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm safe-area-top">
        <div className="px-4 py-3 max-w-full">
          <div className="flex items-center justify-center">
            <h1 className="text-lg sm:text-xl font-bold text-teal-600 dark:text-teal-400">
              PandaGarde
            </h1>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
              Family Hub
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area - Mobile Optimized */}
      <main className="flex-1 overflow-y-auto overscroll-contain pb-safe">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation Tabs - Mobile App Style */}
      <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg safe-area-bottom">
        <div className="grid grid-cols-5 h-16 max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`
                  flex flex-col items-center justify-center gap-0.5
                  min-h-[64px] min-w-[64px] touch-manipulation
                  transition-all duration-200 active:scale-95
                  ${active
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
                    : 'text-gray-600 dark:text-gray-400 active:bg-gray-100 dark:active:bg-gray-700'
                  }
                `}
                aria-label={tab.label}
              >
                <Icon 
                  size={22} 
                  className={active ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'} 
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-[10px] sm:text-xs font-medium ${active ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppShell;

