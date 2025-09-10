import React, { useState, useEffect } from 'react';
import { Gift } from '../App';

interface GiftRollerProps {
  isRolling: boolean;
  onGiftSelected: (gift: Gift) => void;
  onRollComplete: () => void;
}

const AVAILABLE_GIFTS: Gift[] = [
  { id: '1', name: 'Diamond', icon: '💎', value: 100 },
  { id: '2', name: 'Gold Coin', icon: '🪙', value: 50 },
  { id: '3', name: 'Ruby', icon: '💍', value: 75 },
  { id: '4', name: 'Emerald', icon: '💚', value: 80 },
  { id: '5', name: 'Crown', icon: '👑', value: 120 },
  { id: '6', name: 'Star', icon: '⭐', value: 60 },
  { id: '7', name: 'Crystal', icon: '🔮', value: 90 },
  { id: '8', name: 'Trophy', icon: '🏆', value: 110 },
];

export function GiftRoller({ isRolling, onGiftSelected, onRollComplete }: GiftRollerProps) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [offset, setOffset] = useState(0);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  // Generate extended gift array for rolling effect
  useEffect(() => {
    const extendedGifts = [];
    for (let i = 0; i < 20; i++) {
      extendedGifts.push(...AVAILABLE_GIFTS);
    }
    setGifts(extendedGifts);
  }, []);

  useEffect(() => {
    if (!isRolling) return;

    let animationId: number;
    let startTime: number;
    const duration = 3000; // 3 seconds
    const finalOffset = -(Math.random() * 500 + 800); // Random stop position

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for natural deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentOffset = finalOffset * easeOut;
      
      setOffset(currentOffset);
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Calculate which gift is at center
        const giftWidth = 80; // 64px + 16px margin
        const centerPosition = Math.abs(currentOffset) + 160; // Adjust for container center
        const giftIndex = Math.floor(centerPosition / giftWidth) % AVAILABLE_GIFTS.length;
        const selectedGift = AVAILABLE_GIFTS[giftIndex];
        
        setSelectedGift(selectedGift);
        onGiftSelected(selectedGift);
        onRollComplete();
      }
    };

    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isRolling, onGiftSelected, onRollComplete]);

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-blue-900/30 mb-4">
      <div className="relative overflow-hidden h-20">
        {/* Center line marker */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-cyan-400 z-10 transform -translate-x-0.5">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full"></div>
        </div>
        
        {/* Gifts container */}
        <div 
          className="flex gap-4 py-2 transition-none"
          style={{ 
            transform: `translateX(${offset}px)`,
            willChange: 'transform'
          }}
        >
          {gifts.map((gift, index) => (
            <div
              key={`${gift.id}-${index}`}
              className={`flex-shrink-0 w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600/50 ${
                selectedGift?.id === gift.id && !isRolling ? 'border-cyan-400 bg-cyan-900/30' : ''
              }`}
            >
              <span className="text-2xl">{gift.icon}</span>
            </div>
          ))}
        </div>
      </div>
      
      {selectedGift && !isRolling && (
        <div className="text-center mt-3">
          <p className="text-cyan-400 text-sm">You got: {selectedGift.name}</p>
          <p className="text-slate-400 text-xs">Value: {selectedGift.value} TON</p>
        </div>
      )}
    </div>
  );
}