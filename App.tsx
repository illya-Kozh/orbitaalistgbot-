import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { CasesScreen } from './components/CasesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { DepositScreen } from './components/DepositScreen';
import { GiftsCollection } from './components/GiftsCollection';
import { TonInput } from './components/TonInput';
import { BottomNavigation } from './components/BottomNavigation';

export interface Gift {
  id: string;
  name: string;
  icon: string;
  value: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showDeposit, setShowDeposit] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [showTonInput, setShowTonInput] = useState(false);
  const [balance, setBalance] = useState(1250.45);
  const [tonBalance, setTonBalance] = useState(100); // Demo mode: 100 TON
  const [keptGifts, setKeptGifts] = useState<Gift[]>([]);
  const [currentBet, setCurrentBet] = useState(0);
  const [betDirection, setBetDirection] = useState<'long' | 'short' | null>(null);

  const handleTopUp = () => {
    setShowDeposit(true);
  };

  const handleBackToMain = () => {
    setShowDeposit(false);
    setShowGifts(false);
    setShowTonInput(false);
  };

  const handleKeepGift = (gift: Gift) => {
    setKeptGifts(prev => [...prev, { ...gift, id: Date.now().toString() }]);
  };

  const handleSellGift = (gift: Gift) => {
    setTonBalance(prev => prev + gift.value);
    // Remove the gift from kept gifts
    setKeptGifts(prev => {
      const giftIndex = prev.findIndex(g => g.id === gift.id);
      if (giftIndex !== -1) {
        return prev.filter((_, index) => index !== giftIndex);
      }
      return prev;
    });
  };

  const handleSellAllGifts = () => {
    const totalValue = keptGifts.reduce((sum, gift) => sum + gift.value, 0);
    setTonBalance(prev => prev + totalValue);
    setKeptGifts([]);
  };

  const handleSpendBalance = (amount: number) => {
    if (amount <= balance) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  const handlePlaceBet = (amount: number) => {
    if (amount <= tonBalance) {
      setTonBalance(prev => prev - amount);
      setCurrentBet(amount);
      return true;
    }
    return false;
  };

  const handleWinBet = (multiplier: number) => {
    if (currentBet > 0) {
      const winnings = currentBet * multiplier;
      setTonBalance(prev => prev + winnings);
      setCurrentBet(0);
    }
  };

  const handleLoseBet = () => {
    // Bet is already deducted, just reset
    setCurrentBet(0);
  };

  const handleSpendTon = (amount: number) => {
    if (amount <= tonBalance) {
      setTonBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  if (showDeposit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-black text-white">
        <DepositScreen onBack={handleBackToMain} />
      </div>
    );
  }

  if (showGifts) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-black text-white">
        <GiftsCollection gifts={keptGifts} onBack={handleBackToMain} onSellGift={handleSellGift} />
      </div>
    );
  }

  if (showTonInput) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-black text-white">
        <TonInput 
          maxAmount={tonBalance} 
          onBack={handleBackToMain}
          onConfirm={(amount) => {
            if (amount <= tonBalance) {
              setTonBalance(prev => prev - amount);
              setBalance(prev => prev + amount * 50); // 1 TON = 50 USD example rate
              handleBackToMain();
            }
          }}
        />
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'cases':
        return (
          <CasesScreen 
            tonBalance={tonBalance} 
            onKeepGift={handleKeepGift}
            onSellGift={handleSellGift}
            onSpendTon={handleSpendTon}
            onTopUp={handleTopUp}
          />
        );
      case 'home':
        return (
          <HomeScreen 
            balance={balance} 
            tonBalance={tonBalance}
            keptGifts={keptGifts}
            currentBet={currentBet}
            onTopUp={handleTopUp}
            onShowGifts={() => setShowGifts(true)}
            onShowTonInput={() => setShowTonInput(true)}
            onKeepGift={handleKeepGift}
            onSellGift={handleSellGift}
            onPlaceBet={handlePlaceBet}
            onWinBet={handleWinBet}
            onLoseBet={handleLoseBet}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            tonBalance={tonBalance}
            keptGifts={keptGifts}
            onTopUp={handleTopUp}
            onSellGift={handleSellGift}
            onSellAllGifts={handleSellAllGifts}
          />
        );
      case 'settings':
        return (
          <div className="p-4 text-center">
            <h1 className="text-2xl mb-4">Settings</h1>
            <p className="text-slate-400">Settings panel coming soon...</p>
          </div>
        );
      default:
        return (
          <HomeScreen 
            balance={balance} 
            tonBalance={tonBalance}
            keptGifts={keptGifts}
            currentBet={currentBet}
            onTopUp={handleTopUp}
            onShowGifts={() => setShowGifts(true)}
            onShowTonInput={() => setShowTonInput(true)}
            onKeepGift={handleKeepGift}
            onSellGift={handleSellGift}
            onPlaceBet={handlePlaceBet}
            onWinBet={handleWinBet}
            onLoseBet={handleLoseBet}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-black text-white relative">
      <div className="pb-20">
        {renderActiveScreen()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}