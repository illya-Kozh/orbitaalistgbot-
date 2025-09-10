import React, { useState } from 'react';
import { Wallet, Plus, Settings, Gift as GiftIcon } from 'lucide-react';
import { Gift } from '../App';

interface ProfileScreenProps {
  tonBalance: number;
  keptGifts: Gift[];
  onTopUp: () => void;
  onSellGift: (gift: Gift) => void;
  onSellAllGifts: () => void;
}

type Language = 'uk' | 'en';

const translations = {
  uk: {
    profile: 'Профіль',
    topUpWithGifts: 'Поповнити подарунками',
    topUpWithTon: 'Поповнити TON',
    inventory: 'Інвентар',
    sellAll: 'Продати все',
    referralPromo: 'Заробляйте 10% з депозитів друзів',
    conditions: 'Умови',
    sell: 'Продати',
    value: 'Вартість'
  },
  en: {
    profile: 'Profile',
    topUpWithGifts: 'Top Up with Gifts',
    topUpWithTon: 'Top Up with TON',
    inventory: 'Inventory',
    sellAll: 'Sell All',
    referralPromo: 'Earn 10% from your friends\' deposits',
    conditions: 'Conditions',
    sell: 'Sell',
    value: 'Value'
  }
};

const languageFlags = {
  uk: '🇺🇦',
  en: '🇬🇧'
};

export function ProfileScreen({ tonBalance, keptGifts, onTopUp, onSellGift, onSellAllGifts }: ProfileScreenProps) {
  const [language, setLanguage] = useState<Language>('uk');
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'uk' ? 'en' : 'uk');
  };

  const handleGiftClick = (gift: Gift) => {
    setSelectedGift(gift);
    setShowGiftModal(true);
  };

  const handleSellGift = () => {
    if (selectedGift) {
      onSellGift(selectedGift);
      setShowGiftModal(false);
      setSelectedGift(null);
    }
  };

  const totalInventoryValue = keptGifts.reduce((sum, gift) => sum + gift.value, 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(6, 182, 212, 0.1) 10px,
            rgba(6, 182, 212, 0.1) 20px
          )`
        }} />
      </div>

      <div className="relative z-10 p-4 space-y-6">
        {/* Top Row: Language Switcher (left) and Balance (right) */}
        <div className="flex items-start justify-between">
          {/* Language Switcher - Top Left */}
          <button
            onClick={toggleLanguage}
            className="text-3xl hover:scale-110 transition-transform"
          >
            {languageFlags[language]}
          </button>

          {/* Balance Display - Top Right */}
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

        {/* Centered Avatar Section */}
        <div className="flex flex-col items-center">
          {/* Avatar - Centered */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-blue-400/30 mb-3">
            <span className="text-3xl text-white">K</span>
          </div>
          
          {/* Nickname - Centered below avatar */}
          <h2 className="text-xl text-white mb-6">Kiril00</h2>
        </div>

        {/* Top Up Buttons - Side by Side */}
        <div className="flex gap-3">
          <button
            onClick={onTopUp}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-white transition-all duration-200 active:scale-95 text-center"
            style={{
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
            }}
          >
            {t.topUpWithGifts}
          </button>
          
          <button
            onClick={onTopUp}
            className="flex-1 bg-transparent border-2 border-blue-600 hover:bg-blue-600/10 py-4 rounded-xl text-blue-400 hover:text-white transition-all duration-200 active:scale-95 text-center"
          >
            {t.topUpWithTon}
          </button>
        </div>

        {/* Inventory Section */}
        <div className="bg-slate-800/30 rounded-xl p-4 border border-blue-900/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white text-lg">{t.inventory}</h3>
              <p className="text-slate-400 text-sm">{totalInventoryValue.toFixed(1)} TON</p>
            </div>
            {keptGifts.length > 0 && (
              <button
                onClick={onSellAllGifts}
                className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-white text-sm transition-colors text-center"
                style={{
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
                }}
              >
                {t.sellAll}
              </button>
            )}
          </div>

          {keptGifts.length === 0 ? (
            <div className="text-center py-8">
              <GiftIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No items in inventory</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {keptGifts.map((gift, index) => (
                <button
                  key={`${gift.id}-${index}`}
                  onClick={() => handleGiftClick(gift)}
                  className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-3 hover:border-cyan-500/50 transition-colors active:scale-95"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{gift.icon}</div>
                    <p className="text-slate-300 text-xs truncate">{gift.name}</p>
                    <p className="text-cyan-400 text-xs">{gift.value} TON</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Referral Section */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="text-white text-sm">{t.referralPromo}</p>
              </div>
            </div>
          </div>
          <button className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 px-4 py-2 rounded-lg text-purple-300 text-sm transition-colors text-center">
            {t.conditions}
          </button>
        </div>
      </div>

      {/* Gift Sell Modal */}
      {showGiftModal && selectedGift && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-blue-900/50 p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-600/50">
                <span className="text-4xl">{selectedGift.icon}</span>
              </div>
              <h3 className="text-xl text-white mb-2">{selectedGift.name}</h3>
              <p className="text-cyan-400">{t.value}: {selectedGift.value} TON</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowGiftModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl text-white transition-colors text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSellGift}
                className="flex-1 bg-orange-600 hover:bg-orange-700 py-3 rounded-xl text-white transition-colors text-center"
                style={{
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
                }}
              >
                {t.sell}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}