import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, AlertCircle, Check, X } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface GraceTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  graceTokensAvailable: number;
  onUseToken: () => void;
  isTodayAtRisk: boolean;
}

export const GraceTokenModal: React.FC<GraceTokenModalProps> = ({
  isOpen,
  onClose,
  graceTokensAvailable,
  onUseToken,
  isTodayAtRisk,
}) => {
  if (!isOpen) return null;

  const handleActivate = () => {
    if (graceTokensAvailable <= 0) return;
    soundEngine.playGraceTokenUse();
    onUseToken();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0E1A]/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md">
        <div className="frost-card rounded-xl p-6 sm:p-8 border border-indigo-400/40 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle shield ambient aura */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between pb-3 border-b border-[#7FB3D5]/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded bg-indigo-950/80 border border-indigo-400/40 text-indigo-300">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-condensed text-xl text-white tracking-wider uppercase">
                  Grace Token Chamber
                </h3>
                <span className="text-[11px] font-mono-stat text-[#7FB3D5]/80">
                  STREAK PRESERVATION PROTOCOL
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-[#7FB3D5]/60 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 font-mono-stat text-xs text-[#E8F0F7]/90 leading-relaxed">
            <div className="p-4 bg-[#0A0E1A]/80 border border-indigo-400/30 rounded-lg text-center space-y-1">
              <span className="text-[10px] text-[#7FB3D5] uppercase block">
                Available Grace Tokens
              </span>
              <span className="text-3xl font-bold text-white">
                {graceTokensAvailable} <span className="text-sm font-normal text-indigo-300">/ 1 MAX</span>
              </span>
              <p className="text-[11px] text-[#7FB3D5]/70 pt-1">
                Limit: 1 token per 30-day block. Earned through unbroken execution.
              </p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Shield The Chain:</strong> Absorbs an unavoidable life catastrophe without cracking your streak.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Earned, Not Given:</strong> Refreshed only after completing 15 continuous disciplined days in each 30-day phase.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No Lazy Escapes:</strong> If you can move your limbs, execute the 5-Minute Fallback instead.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              disabled={graceTokensAvailable <= 0}
              onClick={handleActivate}
              className={`w-full py-3 px-4 font-condensed tracking-wider text-base uppercase rounded font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                graceTokensAvailable > 0
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-[#1B2A4A]/40 text-[#E8F0F7]/30 cursor-not-allowed border border-transparent'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>
                {graceTokensAvailable > 0
                  ? 'ACTIVATE GRACE SHIELD FOR TODAY'
                  : 'NO GRACE TOKENS REMAINING'}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-center text-xs font-condensed tracking-wider uppercase text-[#E8F0F7]/50 hover:text-white py-1"
            >
              Cancel & Keep Fighting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
