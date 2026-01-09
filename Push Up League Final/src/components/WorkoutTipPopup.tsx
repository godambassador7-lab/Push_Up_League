'use client';

import { X, Lightbulb } from 'lucide-react';
import { WorkoutTip, getCategoryColor, getCategoryBg } from '@/lib/workoutTips';

interface WorkoutTipPopupProps {
  tip: WorkoutTip;
  onClose: () => void;
}

export const WorkoutTipPopup = ({ tip, onClose }: WorkoutTipPopupProps) => {
  const categoryColor = getCategoryColor(tip.category);
  const categoryBg = getCategoryBg(tip.category);

  const getCategoryLabel = (category: WorkoutTip['category']): string => {
    switch (category) {
      case 'form':
        return 'Form & Technique';
      case 'recovery':
        return 'Recovery';
      case 'nutrition':
        return 'Nutrition';
      case 'motivation':
        return 'Motivation';
      case 'technique':
        return 'Training Technique';
      default:
        return 'Tip';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-sm animate-fade-in">
      <div className="max-w-lg w-full glass glass-border rounded-2xl overflow-hidden transform transition-all animate-scale-in">
        {/* Header */}
        <div className={`p-6 border-b border-dark-border ${categoryBg}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="text-4xl">{tip.icon}</div>
              <div className="flex-1">
                <div className={`text-xs font-display uppercase tracking-wider mb-1 ${categoryColor}`}>
                  {getCategoryLabel(tip.category)}
                </div>
                <h3 className="text-xl font-black text-hero text-white leading-tight">
                  {tip.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition active:scale-95 flex-shrink-0"
              aria-label="Close tip"
            >
              <X size={20} className="text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-300 leading-relaxed">
            {tip.content}
          </p>

          {/* Footer with lightbulb icon */}
          <div className="flex items-center gap-2 pt-4 border-t border-dark-border">
            <Lightbulb size={16} className="text-warning" />
            <p className="text-xs text-gray-500">
              Tip {tip.id} of 50 • Keep coming back for more tips!
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-lg font-display font-bold uppercase tracking-wider transition hover:shadow-lg ${categoryColor} ${categoryBg} border hover:brightness-110`}
          >
            Got it!
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
