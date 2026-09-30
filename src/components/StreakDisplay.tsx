import React from 'react';
import { motion } from 'motion/react';
import { Flame, Shield, Award, Calendar, Snowflake, RefreshCw, Quote as QuoteIcon } from 'lucide-react';
import { DailyQuote } from '../types';
import { soundEngine } from '../utils/audio';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  currentDay: number;
  totalDays: number;
  graceTokensAvailable: number;
  quote: DailyQuote;
  onOpenGraceModal: () => void;
  onRefreshQuote?: () => void;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  currentDay,
  totalDays,
  graceTokensAvailable,
  quote,
  onOpenGraceModal,
  onRefreshQuote,
}) => {
  const daysRemaining = Math.max(0, totalDays - currentDay);
  const progressPercent = Math.min(100, Math.round((currentDay / totalDays) * 100));

  return (
    <div className="space-y-4">
      {/* Front & Center Streak Hero Card */}
      <div className="frost-card rounded-lg p-6 sm:p-8 border border-[#7FB3D5]/30 relative overflow-hidden text-center sm:text-left shadow-2xl">
        {/* Ambient atmospheric backdrop */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#7FB3D5]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-[#1B2A4A]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Main Streak Counter */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gradient-to-br from-[#1B2A4A] to-[#0A0E1A] border-2 border-[#7FB3D5]/60 flex flex-col items-center justify-center shadow-lg shadow-[#7FB3D5]/20 animate-cold-glow">
                <Flame className="w-8 h-8 text-[#FF4D4D] animate-pulse" />
                <span className="font-mono-stat text-2xl sm:text-3xl font-bold text-white leading-none mt-0.5">
                  {currentStreak}
                </span>
              </div>
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-mono-stat px-2 py-0.5 rounded bg-[#0A0E1A] border border-[#7FB3D5]/40 text-[#7FB3D5] uppercase tracking-wider whitespace-nowrap">
                STREAK
              </span>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7FB3D5] animate-ping" />
                <span className="text-xs uppercase font-condensed tracking-widest text-[#7FB3D5]">
                  OFF-GRID DISCIPLINE STREAK
                </span>
              </div>
              <h1 className="font-condensed text-3xl sm:text-4xl lg:text-5xl text-[#E8F0F7] tracking-wider uppercase font-bold">
                {currentStreak === 0 ? 'DAY ZERO' : `${currentStreak} DAYS OF IRON`}
              </h1>
              <p className="text-xs text-[#7FB3D5]/80 font-mono-stat">
                DAY {currentDay} OF {totalDays} · {daysRemaining} DAYS REMAIN UNTIL THE THAW
              </p>
            </div>
          </div>

          {/* Quick Metrics & Streak Protection */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Longest Streak */}
            <div className="p-3 bg-[#0A0E1A]/70 border border-[#7FB3D5]/20 rounded min-w-[120px] text-center">
              <span className="text-[10px] uppercase font-mono-stat text-[#7FB3D5]/70 block">
                Peak Streak
              </span>
              <span className="font-mono-stat text-xl font-bold text-[#E8F0F7]">
                {longestStreak} <span className="text-xs font-normal text-[#7FB3D5]">DAYS</span>
              </span>
            </div>

            {/* Campaign Progress */}
            <div className="p-3 bg-[#0A0E1A]/70 border border-[#7FB3D5]/20 rounded min-w-[120px] text-center">
              <span className="text-[10px] uppercase font-mono-stat text-[#7FB3D5]/70 block">
                Arc Elapsed
              </span>
              <span className="font-mono-stat text-xl font-bold text-[#7FB3D5]">
                {progressPercent}%
              </span>
            </div>

            {/* Grace Token Quick Action */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playGraceTokenUse();
                onOpenGraceModal();
              }}
              className="p-3 bg-[#1B2A4A]/50 hover:bg-[#1B2A4A] border border-indigo-400/40 hover:border-indigo-400 rounded min-w-[130px] text-center transition-all cursor-pointer group shadow-md"
              title="Click to manage Grace Protection"
            >
              <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-mono-stat text-indigo-300">
                <Shield className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Grace Token</span>
              </div>
              <div className="font-mono-stat text-xl font-bold text-white mt-0.5">
                {graceTokensAvailable} <span className="text-xs font-normal text-indigo-300/80">AVAILABLE</span>
              </div>
            </button>
          </div>
        </div>

        {/* Campaign Progress Timeline Bar */}
        <div className="mt-6 pt-4 border-t border-[#7FB3D5]/15 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono-stat text-[#7FB3D5]/70">
            <span>START (DAY 1)</span>
            <span className="text-[#E8F0F7] font-bold">DAY {currentDay}</span>
            <span>DAY 90 (THE THAW)</span>
          </div>
          <div className="h-2 w-full bg-[#0A0E1A] rounded-full overflow-hidden border border-[#7FB3D5]/20">
            <div
              className="h-full bg-gradient-to-r from-[#1B2A4A] via-[#7FB3D5] to-[#E8F0F7] transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Stoic / Mentor Quote Card */}
      <div className="p-4 sm:p-5 bg-[#0A0E1A]/80 border border-[#7FB3D5]/20 rounded-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-[#1B2A4A]/40 text-[#7FB3D5] shrink-0 mt-0.5">
            <QuoteIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-condensed text-base sm:text-lg text-[#E8F0F7] tracking-wide uppercase leading-snug">
              "{quote.quote}"
            </p>
            <div className="text-xs font-mono-stat text-[#7FB3D5] mt-1">
              — {quote.author} <span className="text-[#E8F0F7]/40">· {quote.source}</span>
            </div>
          </div>
        </div>

        {onRefreshQuote && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playIceShatter();
              onRefreshQuote();
            }}
            className="shrink-0 p-2 text-[#7FB3D5]/60 hover:text-[#7FB3D5] hover:bg-[#1B2A4A]/40 rounded transition-colors cursor-pointer"
            title="Cycle Mentor Transmission"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
