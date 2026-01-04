'use client';

import { useState } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { POWER_UPS, PowerUpType } from '@/lib/powerUps';
import { Zap, Coins, ShoppingCart, Check } from 'lucide-react';

export const PowerUpsShop = () => {
  const [showMessage, setShowMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const coins = useEnhancedStore((state) => state.coins);
  const streakFreezes = useEnhancedStore((state) => state.streakFreezes);
  const activePowerUps = useEnhancedStore((state) => state.activePowerUps);
  const purchasePowerUp = useEnhancedStore((state) => state.purchasePowerUp);

  const handlePurchase = (powerUpType: PowerUpType) => {
    const result = purchasePowerUp(powerUpType);
    setShowMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
    setTimeout(() => setShowMessage(null), 3000);
  };

  const canAfford = (price: number) => coins >= price;

  const getPowerUpCount = (type: PowerUpType) => {
    if (type === 'streak_freeze') return streakFreezes;
    return activePowerUps.filter(p => p.type === type && !p.used).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-hero text-accent">Power-Ups Shop</h2>
          <p className="text-gray-400 mt-1">Boost your performance and protect your streak</p>
        </div>
        <div className="flex items-center gap-2 glass glass-border rounded-lg px-4 py-2">
          <Coins size={20} className="text-warning" />
          <span className="text-xl font-bold text-white">{coins}</span>
        </div>
      </div>

      {/* Message Toast */}
      {showMessage && (
        <div className={`glass-light rounded-lg p-4 border ${showMessage.type === 'success' ? 'border-success text-success' : 'border-red-500 text-red-400'} animate-fade-in`}>
          {showMessage.text}
        </div>
      )}

      {/* Power-Ups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(POWER_UPS).map((powerUp) => {
          const owned = getPowerUpCount(powerUp.id);
          const affordable = canAfford(powerUp.price);
          const maxedOut = powerUp.maxPurchase && owned >= powerUp.maxPurchase;

          return (
            <div
              key={powerUp.id}
              className="glass-light rounded-lg border border-accent/30 p-6 space-y-4 hover:border-accent transition"
            >
              {/* Icon & Name */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{powerUp.icon}</div>
                  <div>
                    <div className="text-xl font-black text-hero text-accent">{powerUp.name}</div>
                    {powerUp.duration && (
                      <div className="text-xs text-gray-400 mt-1">Duration: {powerUp.duration}</div>
                    )}
                  </div>
                </div>
                {owned > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 glass border border-success/50 rounded-lg text-success text-sm font-bold">
                    <Check size={14} />
                    <span>{owned}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300">{powerUp.description}</p>

              {/* Purchase Button */}
              <div className="pt-4 border-t border-dark-border">
                {maxedOut ? (
                  <div className="w-full py-3 rounded-lg bg-dark-border text-gray-500 text-center font-bold">
                    Max Owned ({powerUp.maxPurchase})
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchase(powerUp.id)}
                    disabled={!affordable}
                    className={`w-full py-3 rounded-lg font-display font-bold flex items-center justify-center gap-2 transition ${
                      affordable
                        ? 'bg-gradient-to-r from-accent to-electric-blue text-dark hover:shadow-lg hover:shadow-accent/50'
                        : 'glass-light border border-dark-border text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {affordable ? (
                      <>
                        <ShoppingCart size={18} />
                        <span>Buy for {powerUp.price}</span>
                        <Coins size={16} className="text-warning" />
                      </>
                    ) : (
                      <>
                        <span>Need {powerUp.price - coins} more coins</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Additional Info */}
              {powerUp.maxPurchase && !maxedOut && (
                <div className="text-xs text-gray-500 text-center">
                  Max: {powerUp.maxPurchase} | Owned: {owned}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="glass glass-border rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2 text-accent">
          <Zap size={20} />
          <span className="font-bold text-hero">How Power-Ups Work</span>
        </div>
        <ul className="text-sm text-gray-300 space-y-2 pl-4">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span><strong>Streak Freeze:</strong> Protects your streak if you miss a day. Use it proactively before breaking your streak!</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span><strong>Double XP:</strong> Automatically activates on your next workout for 2x XP gains.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span><strong>Challenge Reroll:</strong> Instantly rerolls your current daily challenge.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span><strong>Goal Reducer:</strong> Reduces today's goal by 25% for a recovery day.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
