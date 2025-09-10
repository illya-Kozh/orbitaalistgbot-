import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface TonInputProps {
  maxAmount: number;
  onBack: () => void;
  onConfirm: (amount: number) => void;
}

export function TonInput({ maxAmount, onBack, onConfirm }: TonInputProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError('');
    
    const numValue = parseFloat(value);
    if (value && (isNaN(numValue) || numValue <= 0)) {
      setError('Please enter a valid amount');
    } else if (numValue > maxAmount) {
      setError(`Maximum available: ${maxAmount.toFixed(1)} TON`);
    }
  };

  const handleConfirm = () => {
    const numValue = parseFloat(amount);
    if (!isNaN(numValue) && numValue > 0 && numValue <= maxAmount) {
      onConfirm(numValue);
    }
  };

  const canConfirm = amount && !error && parseFloat(amount) > 0 && parseFloat(amount) <= maxAmount;

  const quickAmounts = [0.1, 1, 5, 10].filter(amt => amt <= maxAmount);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-blue-900/30">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl text-white">Use TON</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Available Balance */}
        <div className="text-center py-4">
          <p className="text-slate-400 text-sm mb-1">Available TON</p>
          <h2 className="text-2xl text-white">{maxAmount.toFixed(1)} TON</h2>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <label className="text-white text-sm">Enter amount to use:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.0"
            step="0.1"
            min="0.1"
            max={maxAmount}
            className="w-full bg-slate-800 border border-blue-900/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="space-y-2">
          <p className="text-slate-400 text-sm">Quick amounts:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => handleAmountChange(quickAmount.toString())}
                className="bg-slate-800/50 border border-blue-900/30 rounded-lg py-2 px-4 text-white hover:border-cyan-500/50 transition-colors"
              >
                {quickAmount} TON
              </button>
            ))}
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
          <h4 className="text-cyan-400 mb-2">💱 Exchange Rate</h4>
          <p className="text-slate-300 text-sm">
            1 TON = $50 USD (example rate)
          </p>
          {amount && !error && (
            <p className="text-white text-sm mt-2">
              {amount} TON = ${(parseFloat(amount) * 50).toFixed(2)} USD
            </p>
          )}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={`w-full py-4 rounded-xl transition-all duration-200 ${
            canConfirm
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
          style={{
            boxShadow: canConfirm ? '0 0 20px rgba(147, 51, 234, 0.4)' : 'none'
          }}
        >
          {canConfirm ? 'Confirm Exchange' : 'Enter Valid Amount'}
        </button>
      </div>
    </div>
  );
}