import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart2, 
  Menu 
} from 'lucide-react';

interface SidebarProps {
  currentPage: 'overview' | 'clients' | 'expenses' | 'analytics';
  onPageChange: (page: 'overview' | 'clients' | 'expenses' | 'analytics') => void;
  isOpen: boolean;
  onToggleMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isOpen, onToggleMenu }) => {
  const navigation = [
    { name: 'Overview', id: 'overview', icon: LayoutDashboard },
    { name: 'Clients', id: 'clients', icon: Users },
    { name: 'Expenses', id: 'expenses', icon: Package },
    { name: 'Analytics', id: 'analytics', icon: BarChart2 },
  ];

  return (
    <>
      {/* Mobile Navbar (Hamburger Menu) */}
      <div className="lg:hidden">
        <button 
          className="fixed top-4 left-4 p-2 text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm z-50"
          onClick={onToggleMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        {isOpen && (
          <div 
            className="fixed top-14 left-4 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            {/* Navigation */}
            <nav className="p-4">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          onPageChange(item.id as 'overview' | 'clients' | 'expenses' | 'analytics');
                          onToggleMenu();
                        }}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 w-full text-left ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
          </div>
        )}
        {/* Overlay for mobile menu */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-gray-900/30 z-40"
            onClick={onToggleMenu}
          ></div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-56 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-28 h-8 relative">
              <h1 className="text-xl font-bold text-blue-900">
                Money Tracker
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id as 'overview' | 'clients' | 'expenses' | 'analytics')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 w-full text-left ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
};