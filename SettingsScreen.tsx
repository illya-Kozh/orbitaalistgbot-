import React from 'react';
import { MessageSquare, Globe, CreditCard, ChevronRight } from 'lucide-react';

interface SettingsScreenProps {
  onDeposit: () => void;
}

export function SettingsScreen({ onDeposit }: SettingsScreenProps) {
  const settingsItems = [
    {
      id: 'contact',
      label: 'Contact Us',
      description: 'Get help with any problems',
      icon: MessageSquare,
      action: () => {
        // Mock contact action
        alert('Contact form would open here');
      }
    },
    {
      id: 'language',
      label: 'Change Language',
      description: 'Select your preferred language',
      icon: Globe,
      action: () => {
        // Mock language selector
        alert('Language selector would open here');
      }
    },
    {
      id: 'deposit',
      label: 'Deposit Options',
      description: 'Add funds to your account',
      icon: CreditCard,
      action: onDeposit
    }
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="text-center py-6 mb-6">
        <h1 className="text-2xl text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-2">Manage your account preferences</p>
      </div>

      {/* Settings List */}
      <div className="space-y-3">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full bg-slate-800/50 border border-blue-900/30 rounded-xl p-4 transition-all duration-200 hover:border-cyan-500/50 hover:bg-slate-800/70 active:scale-98"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white">{item.label}</p>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* App Info */}
      <div className="mt-12 text-center">
        <p className="text-slate-500 text-sm">Trading Mini App v1.0</p>
        <p className="text-slate-500 text-xs mt-1">Built for Telegram</p>
      </div>
    </div>
  );
}