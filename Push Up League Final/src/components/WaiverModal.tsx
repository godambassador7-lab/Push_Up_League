'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useEnhancedStore } from '@/lib/enhancedStore';

interface WaiverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaiverModal = ({ isOpen, onClose }: WaiverModalProps) => {
  const [accepted, setAccepted] = useState(false);
  const acceptWaiver = useEnhancedStore((state) => state.acceptWaiver);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (accepted) {
      acceptWaiver();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/90 backdrop-blur-sm p-4">
      <div className="max-w-2xl w-full glass glass-border rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle size={32} className="text-warning" />
          <div>
            <h2 className="text-3xl font-black text-hero text-accent">Safety Waiver</h2>
            <p className="text-gray-400 text-sm mt-1">Please read carefully before proceeding</p>
          </div>
        </div>

        {/* Waiver Content */}
        <div className="space-y-4 mb-6 glass-light rounded-lg p-6 border border-dark-border max-h-96 overflow-y-auto">
          <div className="space-y-3 text-sm text-gray-300">
            <p className="font-bold text-accent text-base">ASSUMPTION OF RISK AND LIABILITY WAIVER</p>

            <p>
              By using the Push-Up League application, you acknowledge and understand that physical exercise,
              including but not limited to push-up exercises, carries inherent risks of injury.
            </p>

            <div className="space-y-2">
              <p className="font-semibold text-white">You acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Physical exercise can be strenuous and may cause injury if performed incorrectly</li>
                <li>You should consult with a physician before beginning any exercise program</li>
                <li>You are responsible for knowing your own physical limitations</li>
                <li>Proper form and technique are essential to prevent injury</li>
                <li>Adequate warm-up and cool-down are important for safe exercise</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-white">You agree that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Push-Up League and its creators are NOT responsible for any injuries, accidents, or physical harm</li>
                <li>You will research and practice proper push-up form and cadence before attempting exercises</li>
                <li>You will listen to your body and stop immediately if you experience pain or discomfort</li>
                <li>You assume all risks associated with using this application</li>
                <li>You release Push-Up League from any and all liability for injury or harm</li>
              </ul>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg mt-4">
              <p className="font-bold text-warning mb-2">⚠️ STRONGLY RECOMMENDED:</p>
              <ul className="list-disc pl-6 space-y-1 text-xs">
                <li>Watch instructional videos on proper push-up form</li>
                <li>Start with modified push-ups if you're a beginner (knee push-ups, wall push-ups)</li>
                <li>Maintain proper alignment: hands shoulder-width apart, body in a straight line</li>
                <li>Control your descent and push-up - avoid rushing</li>
                <li>Take rest days to allow muscle recovery</li>
                <li>Stop immediately if you feel joint pain, muscle strain, or dizziness</li>
              </ul>
            </div>

            <p className="pt-4 text-xs text-gray-500 italic">
              This application is for fitness tracking and gamification purposes only. It is not a substitute
              for professional medical or fitness advice. Always prioritize your health and safety over
              achieving goals or maintaining streaks in the app.
            </p>
          </div>
        </div>

        {/* Checkbox Agreement */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-accent bg-dark-card appearance-none cursor-pointer checked:bg-accent checked:border-accent transition"
              />
              {accepted && (
                <CheckCircle
                  size={20}
                  className="absolute text-dark pointer-events-none"
                  style={{ left: '0px', top: '0px' }}
                />
              )}
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition">
              I have read and understand this waiver. I accept full responsibility for my safety and
              acknowledge that Push-Up League is not liable for any injuries or harm. I commit to
              researching proper exercise form and technique.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            disabled={!accepted}
            className={`flex-1 py-3 rounded-lg font-display font-bold uppercase tracking-wider transition ${
              accepted
                ? 'bg-gradient-to-r from-accent to-electric-blue text-dark hover:shadow-lg hover:shadow-accent/50'
                : 'glass-light border border-dark-border text-gray-500 cursor-not-allowed'
            }`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
