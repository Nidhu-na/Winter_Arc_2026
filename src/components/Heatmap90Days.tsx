import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, AlertTriangle, Shield, Clock, Flame, Info } from 'lucide-react';
import { ArcProfile, DayLog } from '../types';
import { ArcStats } from '../utils/storage';
import { soundEngine } from '../utils/audio';

interface Heatmap90DaysProps {
  logs: Record<number, DayLog>;
  profile: ArcProfile;
  stats: ArcStats;
  currentDay: number;
  onUpdateDayLog?: (dayNumber: number, updatedLog: Partial<DayLog>) => void;
}

export const Heatmap90Days: React.FC<Heatmap90DaysProps> = ({
  logs,
  profile,
  stats,
  currentDay,
  onUpdateDayLog,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(currentDay);

  const selectedLog = logs[selectedDayNumber];
  const totalDays = profile.totalDays || 90;

  // We can layout days in columns of 7 (representing weeks)
  const weeksCount = Math.ceil(totalDays / 7);
  const weeks = Array.from({ length: weeksCount }, (_, w) => {
    return Array.from({ length: 7 }, (_, d) => {
      const dayNum = w * 7 + d + 1;
      return dayNum <= totalDays ? dayNum : null;
    });
  });

  const getHeatmapColor = (dayNum: number | null) => {
    if (!dayNum) return 'bg-transparent border-transparent';
    const log = logs[dayNum];
    const isPast = dayNum < currentDay;
    const isCurrent = dayNum === currentDay;

    if (!log) {
      return isPast ? 'bg-[#FF4D4D]/60 border-[#FF4D4D]' : 'bg-[#1B2A4A]/20 border-[#7FB3D5]/10';
    }

    if (log.status === 'full') {
      return 'bg-[#7FB3D5] border-[#E8F0F7] shadow-xs shadow-[#7FB3D5]/30';
    }
    if (log.status === 'fallback') {
      return 'bg-amber-400 border-amber-300';
    }
    if (log.status === 'grace_protected' || log.graceUsed) {
      return 'bg-indigo-400 border-indigo-300';
    }
    if (log.status === 'broken' || (isPast && log.status === 'pending')) {
      return 'bg-[#FF4D4D] border-[#FF4D4D]/70 animate-pulse';
    }

    if (isCurrent) {
      return 'bg-[#1B2A4A] border-[#7FB3D5] ring-1 ring-[#7FB3D5]';
    }

    return 'bg-[#1B2A4A]/20 border-[#7FB3D5]/10';
  };

  return (
    <div className="space-y-6">
      {/* 90-Day Contribution Heatmap Card */}
      <div className="frost-card rounded-lg p-5 sm:p-6 border border-[#7FB3D5]/25 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#7FB3D5]/15 gap-2">
          <div>
            <h3 className="font-condensed text-xl sm:text-2xl text-[#E8F0F7] tracking-wider uppercase">
              The 90-Day Campaign Heatmap
            </h3>
            <p className="text-xs text-[#7FB3D5]/80 font-mono-stat mt-0.5">
              13 WEEKS OF COLD ISOLATION · TAP ANY TILE TO AUDIT
            </p>
          </div>

          {/* Quick Heatmap Legend */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono-stat text-[#E8F0F7]/70">
            <span className="text-[#7FB3D5]/60">LEGEND:</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#7FB3D5]" /> Flawless
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" /> 5-Min Fallback
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-400" /> Grace Protected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#FF4D4D]" /> Broken
            </span>
          </div>
        </div>

        {/* Heatmap Grid (Scrollable on small screens) */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[640px] flex gap-1.5 p-3 bg-[#0A0E1A]/80 rounded border border-[#7FB3D5]/15">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5 flex-1">
                <span className="text-[9px] font-mono-stat text-[#7FB3D5]/50 text-center uppercase">
                  W{wIdx + 1}
                </span>
                {week.map((dayNum, dIdx) => {
                  if (!dayNum) return <div key={dIdx} className="h-6 rounded-xs" />;
                  const isSelected = selectedDayNumber === dayNum;
                  const isCurrent = dayNum === currentDay;

                  return (
                    <button
                      key={dIdx}
                      type="button"
                      onClick={() => {
                        setSelectedDayNumber(dayNum);
                        soundEngine.playIceShatter();
                      }}
                      className={`h-6 sm:h-7 rounded-xs border text-[9px] font-mono-stat flex items-center justify-center transition-all cursor-pointer hover:scale-115 relative ${getHeatmapColor(
                        dayNum
                      )} ${
                        isSelected
                          ? 'ring-2 ring-white z-10 scale-105'
                          : ''
                      }`}
                      title={`Day ${dayNum}`}
                    >
                      <span className={dayNum < currentDay && logs[dayNum]?.status === 'full' ? 'text-[#0A0E1A] font-bold' : 'text-[#E8F0F7]'}>
                        {dayNum}
                      </span>
                      {isCurrent && (
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#FF4D4D]" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Inspector Drawer */}
        {selectedLog && (
          <div className="p-4 bg-[#0A0E1A]/90 border border-[#7FB3D5]/30 rounded space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#7FB3D5]/15 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-condensed text-lg text-white tracking-wider uppercase">
                  AUDIT: DAY {selectedDayNumber} OF 90
                </span>
                <span className="text-xs font-mono-stat text-[#7FB3D5]/80">
                  [{selectedLog.date}]
                </span>
              </div>
              <div className="text-xs font-mono-stat text-[#7FB3D5]">
                STATUS:{' '}
                <span className="font-bold text-white uppercase">
                  {selectedLog.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Vows completed breakdown for selected day */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-stat">
              {profile.vows.map((vow) => {
                const isCompleted = selectedLog.completedVowIds.includes(vow.id);
                const isFallback = selectedLog.fallbackVowIds.includes(vow.id);
                return (
                  <div
                    key={vow.id}
                    className={`p-2.5 rounded border flex items-center justify-between ${
                      isCompleted
                        ? 'bg-[#1B2A4A]/40 border-[#7FB3D5]/40 text-[#E8F0F7]'
                        : isFallback
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : 'bg-[#0A0E1A] border-[#7FB3D5]/15 text-[#E8F0F7]/40'
                    }`}
                  >
                    <span className="truncate">{vow.name}</span>
                    <span className="text-[11px] font-bold">
                      {isCompleted ? '✓ DONE' : isFallback ? '⚡ 5-MIN' : '✗ MISSED'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Proof of work note if present */}
            {selectedLog.proofOfWork && (
              <div className="p-3 bg-[#1B2A4A]/20 border border-[#7FB3D5]/20 rounded text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#7FB3D5] font-mono-stat">
                  <Flame className="w-3.5 h-3.5 text-[#FF4D4D]" />
                  <span>Proof of Work Deposited:</span>
                </div>
                <p className="text-[#E8F0F7]/90 italic">
                  "{selectedLog.proofOfWork.content}"
                </p>
                {selectedLog.proofOfWork.tags.length > 0 && (
                  <div className="flex gap-2 text-[10px] font-mono-stat text-[#7FB3D5]/70 pt-1">
                    {selectedLog.proofOfWork.tags.map((t, i) => (
                      <span key={i}>#{t}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disciplinary Analytics & Vow Completion Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Core Metrics */}
        <div className="frost-card rounded-lg p-5 border border-[#7FB3D5]/25 space-y-4">
          <div className="font-condensed text-lg text-[#E8F0F7] tracking-wider uppercase border-b border-[#7FB3D5]/15 pb-2">
            Discipline Metrics
          </div>

          <div className="space-y-3 font-mono-stat">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#7FB3D5]/80 uppercase">Days Conquered</span>
              <span className="text-white font-bold">{stats.completedDaysCount} / {currentDay}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#7FB3D5]/80 uppercase">5-Min Fallbacks Kept</span>
              <span className="text-amber-400 font-bold">{stats.fallbackDaysCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#7FB3D5]/80 uppercase">Grace Days Used</span>
              <span className="text-indigo-400 font-bold">{stats.graceDaysCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#7FB3D5]/80 uppercase">Broken Days</span>
              <span className="text-[#FF4D4D] font-bold">{stats.brokenDaysCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#7FB3D5]/80 uppercase">Fortress Integrity</span>
              <span className="text-[#7FB3D5] font-bold">{stats.fortressIntegrity}%</span>
            </div>
          </div>
        </div>

        {/* Per-Vow Success Rates */}
        <div className="frost-card rounded-lg p-5 border border-[#7FB3D5]/25 lg:col-span-2 space-y-4">
          <div className="font-condensed text-lg text-[#E8F0F7] tracking-wider uppercase border-b border-[#7FB3D5]/15 pb-2">
            Non-Negotiable Consistency Breakdown
          </div>

          <div className="space-y-3.5">
            {profile.vows.map((vow) => {
              const rate = stats.vowCompletionRates[vow.id] || 0;
              return (
                <div key={vow.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono-stat">
                    <span className="text-[#E8F0F7] truncate max-w-[240px] uppercase font-condensed tracking-wide">
                      {vow.name}
                    </span>
                    <span className="text-[#7FB3D5] font-bold">{rate}%</span>
                  </div>
                  <div className="h-2 bg-[#0A0E1A] rounded overflow-hidden border border-[#7FB3D5]/20">
                    <div
                      className={`h-full transition-all duration-500 ${
                        rate >= 80
                          ? 'bg-[#7FB3D5]'
                          : rate >= 60
                          ? 'bg-amber-400'
                          : 'bg-[#FF4D4D]'
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
