
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart3, BookOpen, Plus } from 'lucide-react';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: BarChart3, path: '/viewstats', label: 'Stats' },
    { icon: Plus, path: '/addHabit', label: 'Add', isCenter: true },
    { icon: BookOpen, path: '/journals', label: 'Journal' },
    { icon: Calendar, path: '/user', label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="bg-blue-500 p-4 rounded-full shadow-lg transform transition-transform active:scale-95"
              >
                <Icon className="w-6 h-6 text-white" />
              </button>
            );
          }
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
