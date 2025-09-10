import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Users, TrendingUp, Play, Square, X } from 'lucide-react';
import { CandlestickChart } from './CandlestickChart';
import { Gift } from '../App';

interface HomeScreenProps {
  balance: number;
  tonBalance: number;
  keptGifts: Gift[];
  currentBet: number;
  onTopUp: () => void;
  onShowGifts: () => void;
  onShowTonInput: () => void;
  onKeepGift: (gift: Gift) => void;
  onSellGift: (gift: Gift) => void;
  onPlaceBet: (amount: number) => boolean;
  onWinBet: (multiplier: number) => void;
  onLoseBet: () => void;
}

interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
}

interface OrbitingCandle {
  id: string;
  multiplier: number;
  startTime: number;
}

interface Player {
  id: string;
  nickname: string;
  avatar: string;
  bet: number;
  isLocalPlayer: boolean;
  cashOutMultiplier?: number;
  winnings?: number;
  status: 'betting' | 'playing' | 'cashed_out' | 'lost';
}

type GameState = 'waiting' | 'rising' | 'crashed';
type PlayerState = 'idle' | 'betting' | 'playing' | 'won' | 'lost';

// Multiplier History Component - Tiny scrollable chips
function MultiplierHistory({ history }: { history: number[] }) {
  return (
    <div className="mb-3">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2 px-1" style={{ scrollSnapType: 'x mandatory' }}>
        {history.slice(-10).map((multiplier, index) => (
          <div
            key={`${index}-${multiplier}`}
            className={`flex-shrink-0 w-7 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${ 
              multiplier >= 10 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
              multiplier >= 5 ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' :
              multiplier >= 2 ? 'bg-green-500/80 text-white' :
              'bg-slate-500/60 text-slate-200'
            }`}
            style={{
              scrollSnapAlign: 'start',
              animation: index === history.length - 1 ? 'slideInFromRight 0.3s ease-out' : undefined
            }}
          >
            {multiplier.toFixed(1)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Betting Modal Component
function BettingModal({ 
  isOpen, 
  onClose, 
  tonBalance, 
  keptGifts, 
  onPlaceBet 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  tonBalance: number; 
  keptGifts: Gift[]; 
  onPlaceBet: (amount: number) => boolean; 
}) {
  const [activeTab, setActiveTab] = useState<'ton' | 'gifts'>('ton');
  const [betAmount, setBetAmount] = useState('');
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const handleTonBet = () => {
    const amount = parseFloat(betAmount);
    if (amount > 0 && amount <= tonBalance) {
      if (onPlaceBet(amount)) {
        onClose();
        setBetAmount('');
      }
    }
  };

  const handleGiftBet = () => {
    if (selectedGift) {
      if (onPlaceBet(selectedGift.value)) {
        onClose();
        setSelectedGift(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-slate-800 rounded-t-2xl border-t border-blue-900/30 h-[50vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <span className="text-white text-lg">BUY</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-slate-600/50"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-4 pb-0">
          <button
            onClick={() => setActiveTab('ton')}
            className={`flex-1 py-3 rounded-lg text-center transition-all duration-200 ${
              activeTab === 'ton' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
            }`}
          >
            TON
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`flex-1 py-3 rounded-lg text-center transition-all duration-200 ml-2 ${
              activeTab === 'gifts' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
            }`}
          >
            Gifts
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {activeTab === 'ton' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Bet Amount</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="Enter TON amount"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  min="0"
                  max={tonBalance}
                  step="0.1"
                />
                <div className="text-xs text-slate-500 mt-1">
                  Available: {tonBalance.toFixed(1)} TON
                </div>
              </div>
              <button
                onClick={handleTonBet}
                disabled={!betAmount || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > tonBalance}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed py-4 rounded-xl text-white text-lg transition-all duration-200"
              >
                BUY
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-slate-400 text-sm mb-3">Select a gift to bet:</div>
              <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                {keptGifts.map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => setSelectedGift(gift)}
                    className={`aspect-square rounded-lg p-3 border-2 transition-all duration-200 ${
                      selectedGift?.id === gift.id
                        ? 'border-blue-500 bg-blue-900/30'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{gift.icon}</div>
                    <div className="text-xs text-slate-400">{gift.value}T</div>
                  </button>
                ))}
              </div>
              {keptGifts.length === 0 && (
                <div className="text-center text-slate-500 py-8">
                  No gifts available
                </div>
              )}
              <button
                onClick={handleGiftBet}
                disabled={!selectedGift}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed py-4 rounded-xl text-white text-lg transition-all duration-200"
              >
                BUY
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Player List Component - Compact version for minimal UI
function PlayersList({ players, currentMultiplier }: { players: Player[]; currentMultiplier: number }) {
  if (players.length === 0) return null;

  return (
    <div className="bg-slate-800/30 rounded-xl p-3 border border-blue-900/30 mt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-slate-400 text-xs">Players ({players.length})</h4>
      </div>
      
      <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-hide">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              player.isLocalPlayer 
                ? 'bg-blue-900/30 border border-blue-700/50' 
                : 'bg-slate-700/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-600/50 flex items-center justify-center text-xs">
                {player.avatar}
              </div>
              <div className="min-w-0">
                <p className={`text-xs truncate ${player.isLocalPlayer ? 'text-cyan-400' : 'text-slate-200'}`}>
                  {player.nickname}
                </p>
                <p className="text-xs text-slate-500">{player.bet}T</p>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              {player.status === 'betting' && (
                <span className="text-xs text-orange-400">•••</span>
              )}
              {player.status === 'playing' && (
                <div className="text-xs text-green-400">
                  {(player.bet * currentMultiplier).toFixed(1)}T
                </div>
              )}
              {player.status === 'cashed_out' && player.winnings && (
                <div>
                  <div className="text-xs text-green-400">
                    +{player.winnings.toFixed(1)}T
                  </div>
                  <div className="text-xs text-slate-500">
                    {player.cashOutMultiplier?.toFixed(1)}x
                  </div>
                </div>
              )}
              {player.status === 'lost' && (
                <div className="text-xs text-red-400">Lost</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Orbiting Candle Component
function OrbitingCandle({ candle, onComplete }: { candle: OrbitingCandle; onComplete: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(candle.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [candle.id, onComplete]);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        animation: 'orbitAndFade 3s ease-out forwards'
      }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className={`rounded-full w-8 h-8 flex items-center justify-center shadow-lg ${
          candle.multiplier >= 50 ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600' :
          candle.multiplier >= 20 ? 'bg-gradient-to-r from-orange-400 via-red-500 to-orange-600' :
          'bg-gradient-to-r from-yellow-400 to-orange-500'
        }`}>
          <span className="text-white text-xs">{candle.multiplier.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
}

export function HomeScreen({ 
  tonBalance, 
  keptGifts,
  currentBet,
  onTopUp, 
  onShowGifts,
  onKeepGift,
  onSellGift,
  onPlaceBet,
  onWinBet,
  onLoseBet
}: HomeScreenProps) {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [gameStartPrice, setGameStartPrice] = useState(100);
  const [currentPrice, setCurrentPrice] = useState(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [multiplierHistory, setMultiplierHistory] = useState<number[]>([]);
  const [orbitingCandles, setOrbitingCandles] = useState<OrbitingCandle[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [timeUntilCrash, setTimeUntilCrash] = useState(0);

  const onlineUsers = 1247;

  // Generate mock player names and avatars
  const mockPlayers = [
    { nickname: 'CryptoKing', avatar: '👑' },
    { nickname: 'MoonLambo', avatar: '🚀' },
    { nickname: 'DiamondHands', avatar: '💎' },
    { nickname: 'ToTheMoon', avatar: '🌙' },
    { nickname: 'HODLer', avatar: '💪' },
    { nickname: 'BullRun', avatar: '🐂' },
    { nickname: 'SatoshisFan', avatar: '⚡' },
    { nickname: 'DegenTrader', avatar: '🎯' }
  ];

  // Generate random crash time
  const generateCrashTime = () => {
    const random = Math.random();
    
    // 5% chance of instant crash (0.1 - 1 second)
    if (random < 0.05) {
      return 100 + Math.random() * 900; // 0.1 - 1 second
    }
    
    // Higher probability around 1.5x (30% chance between 1.2x and 2x)
    if (random < 0.35) {
      return 800 + Math.random() * 1200; // 0.8 - 2.0 seconds (much faster)
    }
    
    // Medium probability for 2-5x (40% chance)
    if (random < 0.75) {
      return 2000 + Math.random() * 3000; // 2 - 5 seconds (much faster)
    }
    
    // Lower probability for high multipliers (25% chance)
    return 5000 + Math.random() * 3000; // 5 - 8 seconds (much faster to reach 10x)
  };

  // Generate new round players
  const generateRoundPlayers = () => {
    const playerCount = Math.floor(Math.random() * 6) + 2; // 2-7 players
    const selectedPlayers = mockPlayers
      .sort(() => Math.random() - 0.5)
      .slice(0, playerCount)
      .map((player, index) => ({
        id: `player-${index}`,
        ...player,
        bet: Math.floor(Math.random() * 10) + 1, // 1-10 TON bet
        isLocalPlayer: false,
        status: 'playing' as const
      }));
    
    setPlayers(selectedPlayers);
  };

  const startNewRound = () => {
    setGameState('waiting');
    setPlayerState('idle');
    setMultiplier(1.0);
    
    // Clear local player from previous round
    setPlayers(prev => prev.filter(p => !p.isLocalPlayer));
    
    // Generate initial candle data
    const initialPrice = 95 + Math.random() * 10; // 95-105
    setGameStartPrice(initialPrice);
    setCurrentPrice(initialPrice);
    
    const initialCandles: CandleData[] = Array.from({ length: 15 }, (_, i) => {
      const basePrice = initialPrice + (Math.random() - 0.5) * 2;
      return {
        open: basePrice,
        close: basePrice + (Math.random() - 0.5) * 1,
        high: basePrice + Math.random() * 1.5,
        low: basePrice - Math.random() * 1.5
      };
    });
    
    setCandleData(initialCandles);
    
    // Generate new players for this round
    generateRoundPlayers();
    
    // Set crash time for this round
    const crashTime = generateCrashTime();
    setTimeUntilCrash(crashTime);
    
    // Wait 2 seconds before starting the rise (faster pace)
    setTimeout(() => {
      setGameState('rising');
      setGameStartPrice(initialPrice);
    }, 2000);
  };

  // Initialize the game
  useEffect(() => {
    startNewRound();
  }, []);

  // Game loop
  useEffect(() => {
    let gameInterval: NodeJS.Timeout;
    let crashTimeout: NodeJS.Timeout;

    if (gameState === 'rising') {
      const startTime = Date.now();
      
      gameInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        setCandleData(prev => {
          const lastCandle = prev[prev.length - 1];
          
          // Much faster and smoother movement - 3-5x faster growth
          let movement;
          if (elapsed < 1000) {
            movement = Math.random() * 8 + 3; // Strong upward movement initially
          } else {
            movement = (Math.random() - 0.15) * 6; // Can vary but still biased upward
          }
          
          const newPrice = Math.max(gameStartPrice * 0.9, lastCandle.close + movement);
          setCurrentPrice(newPrice);
          
          // Much faster multiplier growth - reaches 10x in few seconds
          const priceIncrease = (newPrice - gameStartPrice) / gameStartPrice;
          const newMultiplier = Math.max(1.0, Math.min(10.0, 1 + priceIncrease * 5)); // 5x multiplier instead of 3x
          setMultiplier(newMultiplier);
          
          const newCandle: CandleData = {
            open: lastCandle.close,
            close: newPrice,
            high: Math.max(lastCandle.close, newPrice) + Math.random() * 1.5,
            low: Math.min(lastCandle.close, newPrice) - Math.random() * 0.8
          };

          return [...prev.slice(-14), newCandle];
        });
        
        // Simulate other players cashing out more frequently due to faster pace
        setPlayers(prev => prev.map(player => {
          if (player.status === 'playing' && !player.isLocalPlayer && Math.random() < 0.035) {
            const cashOutMultiplier = Math.max(1.0, multiplier - Math.random() * 0.5);
            return {
              ...player,
              status: 'cashed_out',
              cashOutMultiplier,
              winnings: player.bet * cashOutMultiplier
            };
          }
          return player;
        }));
      }, 100); // Much faster update interval for smoother animation

      // Set crash timeout
      crashTimeout = setTimeout(() => {
        setGameState('crashed');
        
        // Add crashed multiplier to history
        setMultiplierHistory(prev => [...prev, multiplier]);
        
        // Mark all still-playing players as lost
        setPlayers(prev => prev.map(player => ({
          ...player,
          status: player.status === 'playing' ? 'lost' : player.status
        })));
        
        // Check if local player lost
        if (playerState === 'playing') {
          setPlayerState('lost');
          onLoseBet();
        }
        
        // Auto start new round after 2.5 seconds (faster pace)
        setTimeout(() => {
          setPlayerState('idle');
          startNewRound();
        }, 2500);
      }, timeUntilCrash);
    }

    return () => {
      if (gameInterval) clearInterval(gameInterval);
      if (crashTimeout) clearTimeout(crashTimeout);
    };
  }, [gameState, gameStartPrice, timeUntilCrash, multiplier, playerState, onLoseBet]);

  const handlePlayClick = () => {
    if (gameState === 'waiting' || (gameState === 'rising' && playerState === 'idle')) {
      setShowBettingModal(true);
    }
  };

  const handleBetPlaced = (amount: number) => {
    if (onPlaceBet(amount)) {
      setPlayerState('playing');
      
      // Add local player to the players list
      setPlayers(prev => [
        ...prev,
        {
          id: 'local-player',
          nickname: 'You',
          avatar: '👤',
          bet: amount,
          isLocalPlayer: true,
          status: 'playing'
        }
      ]);
      return true;
    }
    return false;
  };

  const handleWithdraw = () => {
    if (playerState === 'playing' && gameState === 'rising') {
      setPlayerState('won');
      
      // Trigger orbit effect for high multipliers
      if (multiplier >= 10) {
        const orbitCandle: OrbitingCandle = {
          id: Date.now().toString(),
          multiplier,
          startTime: Date.now()
        };
        setOrbitingCandles(prev => [...prev, orbitCandle]);
      }
      
      // Update local player in players list
      setPlayers(prev => prev.map(player => 
        player.isLocalPlayer ? {
          ...player,
          status: 'cashed_out',
          cashOutMultiplier: multiplier,
          winnings: player.bet * multiplier
        } : player
      ));
      
      onWinBet(multiplier);
    }
  };

  const handleOrbitComplete = (id: string) => {
    setOrbitingCandles(prev => prev.filter(candle => candle.id !== id));
  };

  return (
    <div className="p-4 space-y-4 relative min-h-screen">
      {/* Transparent Grid Background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 116, 139, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 116, 139, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px'
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <span className="text-slate-300">{tonBalance.toFixed(1)} TON</span>
          </div>
          <button
            onClick={onTopUp}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Top Up TON
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-green-400">
          <Users className="w-4 h-4" />
          <span className="text-sm">{onlineUsers.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="bg-slate-800/50 rounded-xl border border-blue-900/30 relative">
        {/* Candlestick Chart */}
        <div className="h-48 p-4 pb-0">
          <CandlestickChart data={candleData} width={300} height={192} />
        </div>

        {/* Multiplier History - Tiny chips row */}
        {multiplierHistory.length > 0 && (
          <div className="px-4">
            <MultiplierHistory history={multiplierHistory} />
          </div>
        )}

        {/* Game Status Overlay */}
        {gameState === 'waiting' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 rounded-lg px-4 py-2 border border-blue-500/50">
            <div className="text-lg text-blue-400 text-center">Starting...</div>
          </div>
        )}

        {gameState === 'crashed' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900/90 rounded-lg px-4 py-2 border border-red-500/50">
            <div className="text-lg text-red-400 text-center">CRASHED @ {multiplier.toFixed(2)}x</div>
          </div>
        )}

        {playerState === 'won' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-900/90 rounded-lg px-4 py-2 border border-green-500/50">
            <div className="text-lg text-green-400 text-center">WON! +{(currentBet * multiplier).toFixed(1)} TON</div>
          </div>
        )}

        {/* Game Multiplier Display - Centered at bottom of chart */}
        {gameState === 'rising' && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-slate-900/90 rounded-lg px-4 py-2 border border-green-500/50">
              <div className="text-2xl text-green-400 text-center">{multiplier.toFixed(2)}x</div>
              {playerState === 'playing' && currentBet > 0 && (
                <div className="text-xs text-green-300 text-center">
                  Win: {(currentBet * multiplier).toFixed(1)} TON
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cash Out Button - Only shown when player is playing */}
        {playerState === 'playing' && gameState === 'rising' && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleWithdraw}
              className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-white transition-all duration-200"
              style={{
                animation: 'pulse-orange 0.8s infinite alternate'
              }}
            >
              Cash Out
            </button>
          </div>
        )}
      </div>

      {/* Large PLAY Button */}
      {(gameState === 'waiting' || (gameState === 'rising' && playerState === 'idle')) && (
        <div className="mt-4">
          <button
            onClick={handlePlayClick}
            disabled={tonBalance <= 0}
            className={`w-full py-4 rounded-2xl text-xl transition-all duration-200 active:scale-95 ${
              tonBalance > 0 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-slate-600 cursor-not-allowed text-slate-400'
            }`}
            style={{
              boxShadow: tonBalance > 0 ? '0 0 30px rgba(59, 130, 246, 0.5)' : 'none'
            }}
          >
            PLAY
          </button>
        </div>
      )}

      {/* Players List - positioned below PLAY button */}
      <PlayersList players={players} currentMultiplier={multiplier} />

      {/* Kept Gifts Display */}
      {keptGifts.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-blue-900/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-sm">Your Collection</h3>
            <button
              onClick={onShowGifts}
              className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {keptGifts.slice(-8).map((gift, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600/50"
              >
                <span className="text-lg">{gift.icon}</span>
              </div>
            ))}
            {keptGifts.length > 8 && (
              <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600/50">
                <span className="text-slate-400 text-xs">+{keptGifts.length - 8}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Betting Modal */}
      <BettingModal
        isOpen={showBettingModal}
        onClose={() => setShowBettingModal(false)}
        tonBalance={tonBalance}
        keptGifts={keptGifts}
        onPlaceBet={handleBetPlaced}
      />

      {/* Orbiting Candles */}
      {orbitingCandles.map(candle => (
        <OrbitingCandle 
          key={candle.id} 
          candle={candle} 
          onComplete={handleOrbitComplete} 
        />
      ))}
    </div>
  );
}