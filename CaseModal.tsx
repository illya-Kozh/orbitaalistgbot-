import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Gift } from '../App';

interface Case {
  id: number;
  name: string;
  price: number;
  icon: string;
  isFree: boolean;
}

interface CaseModalProps {
  case: Case;
  onClose: () => void;
  balance: number;
  onKeepGift: (gift: Gift) => void;
  onSellGift: (gift: Gift) => void;
  onSpendBalance: (amount: number) => boolean;
}

export function CaseModal({ 
  case: caseItem, 
  onClose, 
  balance, 
  onKeepGift, 
  onSellGift, 
  onSpendBalance 
}: CaseModalProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const gifts: Gift[] = [
    { id: '1', name: 'Common Gem', icon: '💎', value: 0.5 },
    { id: '2', name: 'Rare Coin', icon: '🪙', value: 1.2 },
    { id: '3', name: 'Epic Sword', icon: '⚔️', value: 2.5 },
    { id: '4', name: 'Legendary Crown', icon: '👑', value: 5.0 },
    { id: '5', name: 'Mystery Box', icon: '🎁', value: 1.8 },
    { id: '6', name: 'Golden Star', icon: '⭐', value: 3.2 },
    { id: '7', name: 'Magic Wand', icon: '🪄', value: 4.1 },
    { id: '8', name: 'Treasure Chest', icon: '💰', value: 6.0 },
  ];

  const duplicatedGifts = [...gifts, ...gifts, ...gifts]; // Triple for scrolling

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSpinning) {
      interval = setInterval(() => {
        setScrollPosition(prev => prev + 10);
      }, 50);
      
      // Stop after 3 seconds
      setTimeout(() => {
        setIsSpinning(false);
        // Select a random gift that would appear in center
        const finalPosition = Math.floor(Math.random() * gifts.length);
        const selectedGiftItem = gifts[finalPosition];
        setSelectedGift(selectedGiftItem);
        
        // Show result after a brief delay
        setTimeout(() => {
          setShowResult(true);
        }, 500);
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpinning]);

  const handleBuy = () => {
    if (caseItem.isFree || onSpendBalance(caseItem.price)) {
      setIsSpinning(true);
    }
  };

  const handleKeep = () => {
    if (selectedGift) {
      onKeepGift(selectedGift);
      onClose();
    }
  };

  const handleSell = () => {
    if (selectedGift) {
      onSellGift(selectedGift);
      onClose();
    }
  };

  const canAfford = caseItem.isFree || balance >= caseItem.price;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md bg-slate-900 rounded-3xl border border-blue-900/50 p-6 transition-all duration-500 ${
        showResult ? 'scale-105' : ''
      }`} style={{
        transform: showResult ? 'translateY(-20px)' : 'translateY(0)',
        filter: showResult ? 'blur(2px)' : 'none'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-white">{caseItem.name}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isSpinning && !selectedGift ? (
          // Initial state - show case
          <>
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4 border-4 border-blue-900/50">
                <span className="text-6xl">{caseItem.icon}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-slate-400 text-sm">Case Price</p>
                {caseItem.isFree ? (
                  <p className="text-2xl text-green-400">FREE</p>
                ) : (
                  <p className="text-2xl text-cyan-400">{caseItem.price} TON</p>
                )}
              </div>
              
              <button
                onClick={handleBuy}
                disabled={!canAfford}
                className={`w-full py-4 rounded-xl transition-all duration-200 text-center ${
                  canAfford
                    ? caseItem.isFree 
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
                style={{
                  boxShadow: canAfford 
                    ? caseItem.isFree 
                      ? '0 0 20px rgba(34, 197, 94, 0.4)' 
                      : '0 0 20px rgba(6, 182, 212, 0.4)' 
                    : 'none'
                }}
              >
                {caseItem.isFree 
                  ? 'Open Free Case' 
                  : canAfford 
                    ? 'Buy Case' 
                    : 'Insufficient Balance'
                }
              </button>
            </div>
          </>
        ) : (
          // Slot machine state
          <>
            <div className="mb-6">
              {/* Center line marker */}
              <div className="relative h-2 mb-4">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-cyan-400 rounded"></div>
              </div>
              
              {/* Scrolling gifts */}
              <div className="h-20 overflow-hidden relative">
                <div 
                  className="flex transition-transform duration-75 ease-linear"
                  style={{
                    transform: `translateX(-${scrollPosition}px)`,
                    width: `${duplicatedGifts.length * 80}px`
                  }}
                >
                  {duplicatedGifts.map((gift, index) => (
                    <div
                      key={`${gift.id}-${index}`}
                      className="w-20 h-20 flex items-center justify-center text-4xl bg-slate-800/50 rounded-lg mx-1 border border-blue-900/30"
                    >
                      {gift.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isSpinning && (
              <p className="text-center text-cyan-400 animate-pulse">Opening case...</p>
            )}
          </>
        )}
      </div>

      {/* Result Modal */}
      {showResult && selectedGift && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-blue-900/50 p-6 text-center max-w-sm w-full">
            <div className="text-8xl mb-4">{selectedGift.icon}</div>
            <h3 className="text-2xl text-white mb-2">{selectedGift.name}</h3>
            <p className="text-cyan-400 text-xl mb-6">{selectedGift.value} TON</p>
            
            <div className="flex gap-4">
              <button
                onClick={handleSell}
                className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl transition-all duration-200 text-center"
                style={{
                  boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)'
                }}
              >
                Sell
              </button>
              
              <button
                onClick={handleKeep}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl transition-all duration-200 text-center"
                style={{
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
                }}
              >
                Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}