import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Gift } from '../App';

interface GiftsCollectionProps {
  gifts: Gift[];
  onBack: () => void;
  onSellGift?: (gift: Gift) => void;
}

export function GiftsCollection({ gifts, onBack, onSellGift }: GiftsCollectionProps) {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);

  const handleGiftClick = (gift: Gift) => {
    if (onSellGift) {
      setSelectedGift(gift);
      setShowSellModal(true);
    }
  };

  const handleSellConfirm = () => {
    if (selectedGift && onSellGift) {
      onSellGift(selectedGift);
      setShowSellModal(false);
      setSelectedGift(null);
    }
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
        <h1 className="text-xl text-white">Your Gift Collection</h1>
      </div>

      <div className="p-4">
        {gifts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-xl text-white mb-2">No Gifts Yet</h2>
            <p className="text-slate-400">Open some cases to start collecting gifts!</p>
          </div>
        ) : (
          <>
            <div className="text-center py-4 mb-6">
              <p className="text-slate-400 text-sm mb-1">Total Gifts</p>
              <h2 className="text-2xl text-white">{gifts.length}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {gifts.map((gift, index) => (
                <div
                  key={`${gift.id}-${index}`}
                  className="bg-slate-800/50 border border-blue-900/30 rounded-xl p-4 cursor-pointer hover:border-cyan-500/50 transition-colors"
                  style={{
                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.1)'
                  }}
                  onClick={() => handleGiftClick(gift)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{gift.icon}</div>
                    <p className="text-white text-sm mb-1">{gift.name}</p>
                    <p className="text-cyan-400 text-xs">{gift.value} TON</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Value */}
            <div className="mt-8 bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Total Collection Value</p>
                <p className="text-2xl text-cyan-400">
                  {gifts.reduce((sum, gift) => sum + gift.value, 0).toFixed(1)} TON
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sell Gift Modal */}
      {showSellModal && selectedGift && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-blue-900/50 p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-600/50">
                <span className="text-4xl">{selectedGift.icon}</span>
              </div>
              <h3 className="text-xl text-white mb-2">{selectedGift.name}</h3>
              <p className="text-cyan-400 mb-4">Sell for {selectedGift.value} TON?</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowSellModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl text-white transition-colors text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSellConfirm}
                className="flex-1 bg-orange-600 hover:bg-orange-700 py-3 rounded-xl text-white transition-colors text-center"
                style={{
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
                }}
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}