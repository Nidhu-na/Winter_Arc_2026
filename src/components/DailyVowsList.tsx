import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Flame, Snowflake, Clock, ShieldCheck, Dumbbell, AlarmClock, ShieldAlert, BookOpen, EyeOff, Footprints, AlertCircle, Sparkles } from 'lucide-react';
import { DayLog, Vow } from '../types';
import { soundEngine } from '../utils/audio';

interface DailyVowsListProps {
  vows: Vow[];
  currentDayLog: DayLog;
  currentDayNumber: number;
  onToggleVow: (vowId: string, useFallback?: boolean) => void;
  onOpenProofModal: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  AlarmClock: <AlarmClock className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Snowflake: <Snowflake className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  EyeOff: <EyeOff className="w-5 h-5" />,
  Footprints: <Footprints className="w-5 h-5" />,
};

export const DailyVowsList: React.FC<DailyVowsListProps> = ({
  vows,
  currentDayLog,
  currentDayNumber,
  onToggleVow,
  onOpenProofModal,
}) => {
  const [animatingVowId, setAnimatingVowId] = useState<string | null>(null);
  const [expandedFallbackId, setExpandedFallbackId] = useState<string | null>(null);

  const completedCount = currentDayLog.completedVowIds.length + currentDayLog.fallbackVowIds.length;
  const isAllDone = completedCount >= vows.length && vows.length > 0;

  const handleVowClick = (vowId: string, isFallback: boolean = false) => {
    setAnimatingVowId(vowId);
    if (isFallback) {
      soundEngine.playEmberIgnite();
    } else {
      soundEngine.playIceShatter();
    }
    setTimeout(() => {
      onToggleVow(vowId, isFallback);
      setAnimatingVowId(null);
    }, 200);
  };

  return (
    <div className="space-y-4">
      {/* Vow Header with counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#7FB3D5]/20 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-condensed text-2xl sm:text-3xl text-[#E8F0F7] tracking-wider uppercase">
              Today's Non-Negotiables
            </h2>
            {isAllDone && (
              <span className="flex items-center gap-1 text-[11px] font-mono-stat px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                CONQUERED
              </span>
            )}
          </div>
          <p className="text-xs text-[#7FB3D5]/80 font-mono-stat mt-0.5">
            DAY {currentDayNumber} · MISSING ONE SHATTERS THE CHAIN
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-mono-stat text-[#7FB3D5]/80 uppercase">Vows Forged</div>
            <div className="font-mono-stat text-lg font-bold text-[#E8F0F7]">
              {completedCount} / {vows.length}
            </div>
          </div>
        </div>
      </div>

      {/* List of Vows */}
      <div className="space-y-3">
        {vows.map((vow) => {
          const isFull = currentDayLog.completedVowIds.includes(vow.id);
          const isFallback = currentDayLog.fallbackVowIds.includes(vow.id);
          const isDone = isFull || isFallback;
          const isAnimating = animatingVowId === vow.id;
          const isFallbackExpanded = expandedFallbackId === vow.id;

          return (
            <motion.div
              key={vow.id}
              layout
              className={`rounded-lg border transition-all relative overflow-hidden ${
                isFull
                  ? 'bg-[#1B2A4A]/50 border-[#7FB3D5]/60 shadow-md shadow-[#7FB3D5]/10'
                  : isFallback
                  ? 'bg-[#2A2315]/50 border-amber-500/50 shadow-md'
                  : 'bg-[#0A0E1A]/60 border-[#7FB3D5]/20 hover:border-[#7FB3D5]/40'
              }`}
            >
              {/* Shatter / Ignite flash effect */}
              {isAnimating && (
                <div className="absolute inset-0 bg-[#7FB3D5]/20 animate-ping pointer-events-none" />
              )}

              <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Category Icon */}
                  <div
                    className={`p-2.5 rounded border shrink-0 transition-colors ${
                      isFull
                        ? 'bg-[#7FB3D5] border-[#E8F0F7] text-[#0A0E1A]'
                        : isFallback
                        ? 'bg-amber-400 border-amber-200 text-[#0A0E1A]'
                        : 'bg-[#1B2A4A]/40 border-[#7FB3D5]/30 text-[#7FB3D5]'
                    }`}
                  >
                    {ICON_MAP[vow.iconName] || <Flame className="w-5 h-5" />}
                  </div>

                  {/* Vow Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-condensed text-lg sm:text-xl tracking-wider uppercase truncate ${
                          isDone ? 'line-through text-[#E8F0F7]/70' : 'text-[#E8F0F7]'
                        }`}
                      >
                        {vow.name}
                      </span>

                      {isFallback && (
                        <span className="text-[10px] font-mono-stat px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                          5-MIN PROTOCOL
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#E8F0F7]/70 mt-1 line-clamp-2">
                      {vow.description}
                    </p>

                    {/* No Zero Days 5-minute fallback trigger */}
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedFallbackId(isFallbackExpanded ? null : vow.id)
                        }
                        className="text-[11px] font-mono-stat text-[#7FB3D5]/80 hover:text-[#7FB3D5] flex items-center gap-1 cursor-pointer"
                      >
                        <Clock className="w-3 h-3" />
                        <span>No Zero Days Fallback</span>
                      </button>
                    </div>

                    {/* Expanded 5-min drawer */}
                    {isFallbackExpanded && (
                      <div className="mt-2 p-2.5 bg-[#0A0E1A]/80 border border-[#7FB3D5]/30 rounded text-xs space-y-2">
                        <div className="text-[#7FB3D5] font-mono-stat text-[11px] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>5-Minute Emergency Minimum:</span>
                        </div>
                        <p className="text-[#E8F0F7]/90 font-mono-stat text-[11px]">
                          {vow.fallback5Min}
                        </p>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              handleVowClick(vow.id, true);
                              setExpandedFallbackId(null);
                            }}
                            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[11px] font-mono-stat cursor-pointer"
                          >
                            Mark 5-Min Fallback Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Complete Action Button */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleVowClick(vow.id, false)}
                    className={`w-12 h-12 rounded border flex items-center justify-center transition-all cursor-pointer transform active:scale-95 ${
                      isFull
                        ? 'bg-[#7FB3D5] border-[#E8F0F7] text-[#0A0E1A] shadow-lg shadow-[#7FB3D5]/30'
                        : isFallback
                        ? 'bg-amber-400 border-amber-200 text-[#0A0E1A]'
                        : 'bg-[#1B2A4A]/30 border-[#7FB3D5]/30 text-[#7FB3D5]/40 hover:border-[#7FB3D5] hover:text-[#7FB3D5]'
                    }`}
                    title={isDone ? 'Mark as incomplete' : 'Complete Vow'}
                  >
                    {isDone ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : (
                      <div className="w-4 h-4 rounded-xs border border-dashed border-[#7FB3D5]/60" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isAllDone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-lg bg-gradient-to-r from-[#1B2A4A] via-[#15233E] to-[#1B2A4A] border border-[#7FB3D5]/40 text-center space-y-3 shadow-xl"
        >
          <div className="flex items-center justify-center gap-2 text-[#7FB3D5]">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="font-condensed tracking-widest text-lg uppercase text-white">
              TODAY'S FORGE IS COMPLETE
            </span>
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <p className="text-xs text-[#7FB3D5]/90 font-mono-stat max-w-md mx-auto">
            The fortress adds another stone. Your word is law. Lock in your proof of work before the clock strikes midnight.
          </p>
          <button
            type="button"
            onClick={onOpenProofModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7FB3D5] hover:bg-[#E8F0F7] text-[#0A0E1A] font-condensed tracking-wider text-sm uppercase rounded font-bold transition-all cursor-pointer shadow-md shadow-[#7FB3D5]/20"
          >
            <Flame className="w-4 h-4 text-[#FF4D4D]" />
            <span>Deposit Daily Proof of Work</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
