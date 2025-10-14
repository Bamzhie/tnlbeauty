import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings as SettingsIcon,
  Plus
} from 'lucide-react';

interface SidebarProps {
  currentPage: 'overview' | 'clients' | 'expenses' | 'settings';
  onPageChange: (page: 'overview' | 'clients' | 'expenses' | 'settings') => void;
  onAddClick: () => void;
}

export function Sidebar({ currentPage, onPageChange, onAddClick }: SidebarProps) {
  const navigation = [
    { name: 'Overview', id: 'overview', icon: LayoutDashboard },
    { name: 'Clients', id: 'clients', icon: Users },
    { name: 'Expenses', id: 'expenses', icon: Package },
    { name: 'Settings', id: 'settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 z-50 safe-area-inset-bottom">
        <div className="relative">
          {/* Curved Notch Background */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white dark:bg-gray-800">
            <svg
              className="absolute left-1/2 -translate-x-1/2 -top-8"
              width="80"
              height="32"
              viewBox="0 0 80 32"
              fill="none"
            >
              <path
                d="M0 32C0 32 0 12 20 12C30 12 30 0 40 0C50 0 50 12 60 12C80 12 80 32 80 32H0Z"
                fill="#fff"
                className="fill-white dark:fill-gray-800"
              />
            </svg>
          </div>
          
          <div className="grid grid-cols-5 h-16 relative">
            {/* Overview */}
            <button
              onClick={() => onPageChange('overview')}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                currentPage === 'overview'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs font-medium">Overview</span>
            </button>

            {/* Clients */}
            <button
              onClick={() => onPageChange('clients')}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                currentPage === 'clients'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs font-medium">Clients</span>
            </button>

            {/* Add Button (Center) - Elevated with notch */}
            <div className="flex items-center justify-center">
              <button
                onClick={onAddClick}
                className="absolute -top-4 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-full shadow-xl flex items-center justify-center transform transition-transform active:scale-95 hover:shadow-2xl"
              >
                <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
              </button>
            </div>

            {/* Expenses */}
            <button
              onClick={() => onPageChange('expenses')}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                currentPage === 'expenses'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="text-xs font-medium">Expenses</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => onPageChange('settings')}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                currentPage === 'settings'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600 h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          <h1 className="text-xl font-bold text-blue-900 dark:text-blue-300">Trackr</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id as any)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 w-full text-left ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-r-2 border-blue-500 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}