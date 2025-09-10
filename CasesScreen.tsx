import React, { useState } from 'react';
import { Wallet, Plus, User } from 'lucide-react';
import { CaseModal } from './CaseModal';
import { Gift } from '../App';

interface CasesScreenProps {
  tonBalance: number;
  onKeepGift: (gift: Gift) => void;
  onSellGift: (gift: Gift) => void;
  onSpendTon: (amount: number) => boolean;
  onTopUp: () => void;
}

interface Case {
  id: number;
  name: string;
  price: number;
  icon: string;
  isFree: boolean;
}

export function CasesScreen({ tonBalance, onKeepGift, onSellGift, onSpendTon, onTopUp }: CasesScreenProps) {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [activeCategory, setActiveCategory] = useState<'paid' | 'free'>('paid');
  
  const paidCases: Case[] = [
    { id: 1, name: 'Basic Case', price: 0.1, icon: '📦', isFree: false },
    { id: 2, name: 'Premium Case', price: 1, icon: '🎁', isFree: false },
    { id: 3, name: 'Elite Case', price: 5, icon: '💎', isFree: false },
    { id: 4, name: 'Legendary Case', price: 10, icon: '👑', isFree: false },
    { id: 5, name: 'Mystery Case', price: 2.5, icon: '🔮', isFree: false },
    { id: 6, name: 'Golden Case', price: 15, icon: '🏆', isFree: false },
  ];

  const freeCases: Case[] = [
    { id: 101, name: 'Daily Free Case', price: 0, icon: '🎈', isFree: true },
    { id: 102, name: 'Welcome Case', price: 0, icon: '🎉', isFree: true },
    { id: 103, name: 'Bonus Case', price: 0, icon: '🎊', isFree: true },
    { id: 104, name: 'Lucky Case', price: 0, icon: '🍀', isFree: true },
  ];

  const currentCases = activeCategory === 'paid' ? paidCases : freeCases;

  const handleCaseClick = (caseItem: Case) => {
    setSelectedCase(caseItem);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  return (
    <div className="p-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Left side - Account section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center border border-blue-900/30">
            <User className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <p className="text-white text-sm">Player123</p>
            <p className="text-slate-400 text-xs">Level 5</p>
          </div>
        </div>
        
        {/* Right side - TON Balance */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800/50 border border-blue-900/30 rounded-xl px-4 py-2 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-slate-300" />
            <span className="text-white text-sm">{tonBalance.toFixed(1)} TON</span>
            <button
              onClick={onTopUp}
              className="w-6 h-6 bg-blue-600/20 hover:bg-blue-600/30 rounded-full flex items-center justify-center transition-colors"
            >
              <Plus className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Toggle Buttons */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveCategory('paid')}
          className={`px-6 py-3 rounded-xl transition-all duration-200 text-center ${
            activeCategory === 'paid'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:text-white'
          }`}
          style={{
            boxShadow: activeCategory === 'paid' ? '0 0 20px rgba(6, 182, 212, 0.4)' : 'none'
          }}
        >
          Paid
        </button>
        <button
          onClick={() => setActiveCategory('free')}
          className={`px-6 py-3 rounded-xl transition-all duration-200 text-center ${
            activeCategory === 'free'
              ? 'bg-green-600 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:text-white'
          }`}
          style={{
            boxShadow: activeCategory === 'free' ? '0 0 20px rgba(34, 197, 94, 0.4)' : 'none'
          }}
        >
          Free
        </button>
      </div>

      {/* Cases Grid - 2 per row */}
      <div className="grid grid-cols-2 gap-4">
        {currentCases.map((caseItem) => (
          <button
            key={caseItem.id}
            onClick={() => handleCaseClick(caseItem)}
            className="aspect-square bg-slate-800/50 border border-blue-900/30 rounded-2xl p-4 transition-all duration-200 hover:border-cyan-500/50 active:scale-95 flex flex-col items-center justify-center text-center"
            style={{
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.2)'
            }}
          >
            <div className="text-4xl mb-3">{caseItem.icon}</div>
            <div className="text-center">
              <p className="text-white text-sm mb-1 text-center">{caseItem.name}</p>
              {caseItem.isFree ? (
                <p className="text-green-400 text-center">FREE</p>
              ) : (
                <p className="text-cyan-400 text-center">{caseItem.price} TON</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Case Opening Modal */}
      {selectedCase && (
        <CaseModal
          case={selectedCase}
          onClose={handleCloseModal}
          balance={tonBalance}
          onKeepGift={onKeepGift}
          onSellGift={onSellGift}
          onSpendBalance={onSpendTon}
        />
      )}
    </div>
  );
}