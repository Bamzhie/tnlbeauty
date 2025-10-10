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

export function Sidebar  ({ currentPage, onPageChange, isOpen, onToggleMenu }: any)  {
  const navigation = [
    { name: 'Overview', id: 'overview', icon: LayoutDashboard },
    { name: 'Clients', id: 'clients', icon: Users },
    { name: 'Expenses', id: 'expenses', icon: Package },
    { name: 'Analytics', id: 'analytics', icon: BarChart2 },
  ];

  return (
    <>
      {/* Mobile Hamburger - FIXED POSITIONING */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
        <button 
          className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg"
          onClick={onToggleMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-blue-900">Trackr</h1>
        <div className="w-10"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
            onClick={onToggleMenu}
          />
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-blue-900">Trackr</h1>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          onPageChange(item.id);
                          onToggleMenu();
                        }}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full text-left ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
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
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-56 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-900">Trackr</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 w-full text-left ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50'
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


