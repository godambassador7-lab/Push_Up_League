'use client';

import { useState } from 'react';
import { useEnhancedStore } from '@/lib/enhancedStore';
import { TITLE_CATALOG, Title, getCategoryColor, getCategoryLabel } from '@/lib/titleShop';
import { ShoppingBag, Star, Check, Lock, Coins } from 'lucide-react';

export const TitleShop = () => {
  const [selectedCategory, setSelectedCategory] = useState<Title['category'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessage, setShowMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const coins = useEnhancedStore((state) => state.coins);
  const purchasedTitles = useEnhancedStore((state) => state.purchasedTitles);
  const activeTitle = useEnhancedStore((state) => state.activeTitle);
  const purchaseTitle = useEnhancedStore((state) => state.purchaseTitle);
  const equipTitle = useEnhancedStore((state) => state.equipTitle);

  // Filter titles
  const filteredTitles = TITLE_CATALOG.filter((title) => {
    const matchesCategory = selectedCategory === 'all' || title.category === selectedCategory;
    const matchesSearch = title.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         title.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedFilteredTitles = [...filteredTitles].sort((a, b) => b.price - a.price);

  // Group by category
  const groupedTitles = sortedFilteredTitles.reduce((acc, title) => {
    if (!acc[title.category]) {
      acc[title.category] = [];
    }
    acc[title.category].push(title);
    return acc;
  }, {} as Record<Title['category'], Title[]>);

  const handlePurchase = (title: Title) => {
    const result = purchaseTitle(title.id, title.price);
    setShowMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
    setTimeout(() => setShowMessage(null), 3000);
  };

  const handleEquip = (titleId: string | null) => {
    equipTitle(titleId);
    setShowMessage({
      type: 'success',
      text: titleId ? 'Title equipped!' : 'Title unequipped!',
    });
    setTimeout(() => setShowMessage(null), 2000);
  };

  const isPurchased = (titleId: string) => purchasedTitles.includes(titleId);
  const isEquipped = (titleId: string) => activeTitle === titleId;
  const canAfford = (price: number) => coins >= price;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-hero text-accent">Title Shop</h2>
          <p className="text-gray-400 mt-1">Purchase unique titles with your coins</p>
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

      {/* Search Bar */}
      <div className="glass glass-border rounded-lg p-4">
        <input
          type="text"
          placeholder="Search titles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-white outline-none focus:border-accent transition"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-display font-bold uppercase text-sm whitespace-nowrap transition ${
            selectedCategory === 'all'
              ? 'bg-accent text-dark'
              : 'glass-light border border-dark-border text-gray-400 hover:border-accent/50'
          }`}
        >
          All ({TITLE_CATALOG.length})
        </button>
        {(['legendary', 'epic', 'rare', 'uncommon', 'common'] as Title['category'][]).map((cat) => {
          const count = TITLE_CATALOG.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-display font-bold uppercase text-sm whitespace-nowrap transition ${
                selectedCategory === cat
                  ? getCategoryColor(cat)
                  : 'glass-light border border-dark-border text-gray-400 hover:border-accent/50'
              }`}
            >
              {getCategoryLabel(cat)} ({count})
            </button>
          );
        })}
      </div>

      {/* Active Title Display */}
      {activeTitle && (
        <div className="glass glass-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Currently Equipped</div>
              <div className="flex items-center gap-3">
                <Star size={24} className="text-accent" fill="currentColor" />
                <div>
                  <div className="text-xl font-black text-hero text-accent">
                    {TITLE_CATALOG.find((t) => t.id === activeTitle)?.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {TITLE_CATALOG.find((t) => t.id === activeTitle)?.description}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleEquip(null)}
              className="px-4 py-2 glass-light border border-dark-border rounded-lg text-sm font-display hover:border-red-500 hover:text-red-400 transition"
            >
              Unequip
            </button>
          </div>
        </div>
      )}

      {/* Titles Grid */}
      {selectedCategory === 'all' ? (
        // Show grouped by category
        <div className="space-y-8">
          {(['legendary', 'epic', 'rare', 'uncommon', 'common'] as Title['category'][]).map((cat) => {
            const titles = groupedTitles[cat];
            if (!titles || titles.length === 0) return null;

            return (
              <div key={cat} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`text-lg font-black text-hero uppercase tracking-wider ${getCategoryColor(cat).split(' ')[0]}`}>
                    {getCategoryLabel(cat)} Titles
                  </div>
                  <div className="flex-1 h-px bg-dark-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {titles.map((title) => (
                    <TitleCard
                      key={title.id}
                      title={title}
                      isPurchased={isPurchased(title.id)}
                      isEquipped={isEquipped(title.id)}
                      canAfford={canAfford(title.price)}
                      onPurchase={() => handlePurchase(title)}
                      onEquip={() => handleEquip(title.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Show selected category only
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFilteredTitles.map((title) => (
            <TitleCard
              key={title.id}
              title={title}
              isPurchased={isPurchased(title.id)}
              isEquipped={isEquipped(title.id)}
              canAfford={canAfford(title.price)}
              onPurchase={() => handlePurchase(title)}
              onEquip={() => handleEquip(title.id)}
            />
          ))}
        </div>
      )}

      {filteredTitles.length === 0 && (
        <div className="text-center py-12 glass glass-border rounded-lg">
          <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
          <div className="text-xl font-bold text-gray-400">No titles found</div>
          <div className="text-sm text-gray-500 mt-2">Try a different search or category</div>
        </div>
      )}
    </div>
  );
};

interface TitleCardProps {
  title: Title;
  isPurchased: boolean;
  isEquipped: boolean;
  canAfford: boolean;
  onPurchase: () => void;
  onEquip: () => void;
}

const TitleCard = ({ title, isPurchased, isEquipped, canAfford, onPurchase, onEquip }: TitleCardProps) => {
  return (
    <div className={`glass-light rounded-lg border ${getCategoryColor(title.category).split(' ')[1]} p-4 space-y-3 transition hover:scale-105`}>
      {/* Category Badge */}
      <div className="flex items-center justify-between">
        <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${getCategoryColor(title.category)}`}>
          {getCategoryLabel(title.category)}
        </div>
        {isEquipped && (
          <div className="flex items-center gap-1 text-xs text-accent font-bold">
            <Star size={14} fill="currentColor" />
            Equipped
          </div>
        )}
      </div>

      {/* Title Name */}
      <div className="min-h-[3rem]">
        <div className={`text-lg font-black text-hero ${getCategoryColor(title.category).split(' ')[0]}`}>
          {title.name}
        </div>
        <div className="text-xs text-gray-400 mt-1">{title.description}</div>
      </div>

      {/* Price & Action */}
      <div className="pt-3 border-t border-dark-border">
        {!isPurchased ? (
          <button
            onClick={onPurchase}
            disabled={!canAfford}
            className={`w-full py-2 rounded-lg font-display font-bold flex items-center justify-center gap-2 transition ${
              canAfford
                ? 'bg-gradient-to-r from-accent to-electric-blue text-dark hover:shadow-lg hover:shadow-accent/50'
                : 'glass-light border border-dark-border text-gray-500 cursor-not-allowed'
            }`}
          >
            {canAfford ? (
              <>
                <Coins size={16} />
                <span>{title.price}</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>{title.price} (Not enough coins)</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onEquip}
            disabled={isEquipped}
            className={`w-full py-2 rounded-lg font-display font-bold flex items-center justify-center gap-2 transition ${
              isEquipped
                ? 'bg-success/20 border border-success text-success cursor-default'
                : 'glass-light border border-accent text-accent hover:bg-accent/10'
            }`}
          >
            {isEquipped ? (
              <>
                <Check size={16} />
                <span>Equipped</span>
              </>
            ) : (
              <span>Equip</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
