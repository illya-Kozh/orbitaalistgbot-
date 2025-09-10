import React from 'react';
import { Package, Home, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'cases', label: 'Cases', icon: Package },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-blue-900/50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-6 rounded-lg transition-all duration-200 text-center ${
                isActive 
                  ? 'text-cyan-400 shadow-lg shadow-cyan-500/25' 
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
              style={{
                boxShadow: isActive ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none'
              }}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}