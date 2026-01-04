'use client';

import { useState } from 'react';
import { useUserStore } from '@/lib/store';
import {
  ALL_TRAINING_PLANS,
  getPlansByDuration,
  type PlanDuration,
  type PlanDifficulty
} from '@/lib/trainingPlans';
import { Calendar, Zap, Award, CheckCircle, X } from 'lucide-react';

interface PlanSelectorProps {
  onClose: () => void;
}

export const PlanSelector = ({ onClose }: PlanSelectorProps) => {
  const { setActivePlan, activePlanId } = useUserStore();
  const [selectedDuration, setSelectedDuration] = useState<PlanDuration>(7);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(activePlanId);

  const availablePlans = getPlansByDuration(selectedDuration);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleConfirm = () => {
    if (selectedPlanId) {
      setActivePlan(selectedPlanId);
      onClose();
    }
  };

  const handleRemovePlan = () => {
    setActivePlan(null);
    setSelectedPlanId(null);
    onClose();
  };

  const getDifficultyColor = (difficulty: PlanDifficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-success border-success bg-success/10';
      case 'intermediate':
        return 'text-warning border-warning bg-warning/10';
      case 'advanced':
        return 'text-error border-error bg-error/10';
    }
  };

  const getDifficultyIcon = (difficulty: PlanDifficulty) => {
    switch (difficulty) {
      case 'beginner':
        return <Zap size={16} />;
      case 'intermediate':
        return <Calendar size={16} />;
      case 'advanced':
        return <Award size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto glass glass-border rounded-lg">
        {/* Header */}
        <div className="sticky top-0 bg-dark-card/95 backdrop-blur-sm border-b glass-border p-4 sm:p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-hero bg-gradient-to-r from-accent to-electric-blue bg-clip-text text-transparent">
              SELECT TRAINING PLAN
            </h2>
            <p className="text-sm text-gray-400 mt-1">Choose your program duration and difficulty</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent/10 rounded-lg transition"
            aria-label="Close"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Duration Selection */}
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Plan Duration
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[7, 14, 30].map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration as PlanDuration)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedDuration === duration
                      ? 'bg-accent/20 border-accent'
                      : 'glass-light border-dark-border hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Calendar size={20} className={selectedDuration === duration ? 'text-accent' : 'text-gray-400'} />
                    <span className={`font-bold ${selectedDuration === duration ? 'text-accent' : 'text-white'}`}>
                      {duration} Days
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Plan Cards */}
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Select Difficulty Level
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availablePlans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isActive = activePlanId === plan.id;

                return (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`p-5 rounded-lg border-2 transition text-left relative ${
                      isSelected
                        ? 'bg-accent/20 border-accent shadow-lg shadow-accent/20'
                        : 'glass-light border-dark-border hover:border-accent/50'
                    }`}
                  >
                    {/* Active Badge */}
                    {isActive && (
                      <div className="absolute top-2 right-2">
                        <div className="px-2 py-1 bg-success/20 border border-success rounded text-xs font-bold text-success flex items-center gap-1">
                          <CheckCircle size={12} />
                          ACTIVE
                        </div>
                      </div>
                    )}

                    {/* Difficulty Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase flex items-center gap-1.5 ${getDifficultyColor(plan.difficulty)}`}>
                        {getDifficultyIcon(plan.difficulty)}
                        {plan.difficulty}
                      </div>
                    </div>

                    {/* Plan Name */}
                    <div className={`text-lg font-black mb-2 ${isSelected ? 'text-accent' : 'text-white'}`}>
                      {plan.name}
                    </div>

                    {/* Description */}
                    <div className="text-sm text-gray-400 mb-4">
                      {plan.description}
                    </div>

                    {/* Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-bold text-white">{plan.duration} Days</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Workouts</span>
                        <span className="font-bold text-white">{plan.weeklySchedule.length} Sessions</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Frequency</span>
                        <span className="font-bold text-white">
                          {Math.round((plan.weeklySchedule.length / plan.duration) * 7)} per week
                        </span>
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-accent/30 flex items-center justify-center text-accent text-sm font-bold">
                        <CheckCircle size={16} className="mr-2" />
                        SELECTED
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t glass-border">
            {activePlanId && (
              <button
                onClick={handleRemovePlan}
                className="flex-1 py-3 glass-light border border-error/50 rounded-lg font-bold text-error hover:bg-error/10 transition"
              >
                Remove Active Plan
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 glass-light border border-dark-border rounded-lg font-bold hover:border-accent transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedPlanId}
              className={`flex-1 py-3 rounded-lg font-bold transition ${
                selectedPlanId
                  ? 'bg-gradient-to-r from-accent to-electric-blue text-dark hover:shadow-lg hover:shadow-accent/50'
                  : 'glass-light text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
