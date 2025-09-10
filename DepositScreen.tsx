import React from 'react';
import { ArrowLeft, Wallet, Gift, CreditCard, Smartphone } from 'lucide-react';

interface DepositScreenProps {
  onBack: () => void;
}

export function DepositScreen({ onBack }: DepositScreenProps) {
  const depositMethods = [
    {
      id: 'ton',
      name: 'TON Tokens',
      description: 'Deposit using TON cryptocurrency',
      icon: Wallet,
      color: 'bg-blue-600',
      glow: 'rgba(6, 182, 212, 0.4)'
    },
    {
      id: 'gifts',
      name: 'Telegram Gifts',
      description: 'Use your Telegram gift balance',
      icon: Gift,
      color: 'bg-purple-600',
      glow: 'rgba(147, 51, 234, 0.4)'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, and more',
      icon: CreditCard,
      color: 'bg-green-600',
      glow: 'rgba(34, 197, 94, 0.4)'
    },
    {
      id: 'mobile',
      name: 'Mobile Payment',
      description: 'Apple Pay, Google Pay, etc.',
      icon: Smartphone,
      color: 'bg-orange-600',
      glow: 'rgba(234, 88, 12, 0.4)'
    }
  ];

  const handleMethodClick = (method: any) => {
    // Mock deposit action
    alert(`${method.name} deposit would be processed here`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-blue-900/30">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors text-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl text-white">Deposit Funds</h1>
      </div>

      <div className="p-4">
        {/* Info Section */}
        <div className="bg-slate-800/50 border border-blue-900/30 rounded-xl p-4 mb-6">
          <h2 className="text-white mb-2">Add Funds to Your Account</h2>
          <p className="text-slate-400 text-sm">
            Choose your preferred payment method to add funds to your trading account. 
            All transactions are secure and processed instantly.
          </p>
        </div>

        {/* Deposit Methods */}
        <div className="space-y-4">
          <h3 className="text-white mb-4">Payment Methods</h3>
          
          {depositMethods.map((method) => {
            const Icon = method.icon;
            
            return (
              <button
                key={method.id}
                onClick={() => handleMethodClick(method)}
                className="w-full bg-slate-800/50 border border-blue-900/30 rounded-xl p-4 transition-all duration-200 hover:border-cyan-500/50 active:scale-98 text-center"
                style={{
                  boxShadow: `0 4px 15px ${method.glow}`
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-white">{method.name}</p>
                    <p className="text-slate-400 text-sm">{method.description}</p>
                  </div>
                  <div className="text-cyan-400">
                    <span className="text-sm">Select</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Security Note */}
        <div className="mt-8 bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
          <h4 className="text-cyan-400 mb-2">🔒 Secure Payments</h4>
          <p className="text-slate-300 text-sm">
            All payments are processed through secure, encrypted channels. 
            Your financial information is never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}