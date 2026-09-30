import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, Snowflake, Sparkles, Eye, Info } from 'lucide-react';
import { DayLog } from '../types';

interface FortressVisualizerProps {
  logs: Record<number, DayLog>;
  currentDay: number;
  fortressIntegrity: number;
  totalDays?: number;
  onSelectDay?: (dayNumber: number) => void;
}

export const FortressVisualizer: React.FC<FortressVisualizerProps> = ({
  logs,
  currentDay,
  fortressIntegrity,
  totalDays = 90,
  onSelectDay,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Group 90 days into architectural tiers:
  // Tier 1: Foundation (Days 1 - 30) - 30 blocks
  // Tier 2: Ramparts (Days 31 - 60) - 30 blocks
  // Tier 3: High Citadel & Spire (Days 61 - 90) - 30 blocks
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  const getIntegrityTitle = (integrity: number) => {
    if (integrity >= 95) return 'UNBREAKABLE CITADEL';
    if (integrity >= 80) return 'FORTIFIED STRONGHOLD';
    if (integrity >= 65) return 'FROST-BITTEN WALLS';
    return 'CRACKED BASTION (CRITICAL)';
  };

  const getIntegrityColor = (integrity: number) => {
    if (integrity >= 95) return 'text-[#7FB3D5]';
    if (integrity >= 80) return 'text-[#E8F0F7]';
    if (integrity >= 65) return 'text-amber-400';
    return 'text-[#FF4D4D]';
  };

  return (
    <div className="frost-card rounded-lg p-5 sm:p-6 border border-[#7FB3D5]/25 relative overflow-hidden">
      {/* Background radial frost texture */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#7FB3D5]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Fortress Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#7FB3D5]/15 gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded bg-[#1B2A4A]/60 border border-[#7FB3D5]/30 ${getIntegrityColor(fortressIntegrity)}`}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-condensed text-xl sm:text-2xl text-[#E8F0F7] tracking-wider uppercase">
                THE ICE CITADEL
              </h3>
              <span className={`text-[11px] font-mono-stat px-2 py-0.5 rounded border border-[#7FB3D5]/30 bg-[#0A0E1A] ${getIntegrityColor(fortressIntegrity)}`}>
                {fortressIntegrity}% INTEGRITY
              </span>
            </div>
            <p className="text-xs text-[#7FB3D5]/70 font-mono-stat mt-0.5">
              {getIntegrityTitle(fortressIntegrity)} · 90-BLOCK MONOLITH
            </p>
          </div>
        </div>

        {/* Structural integrity bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="flex justify-between text-[10px] font-mono-stat uppercase text-[#7FB3D5]/80">
            <span>Core Stability</span>
            <span className={getIntegrityColor(fortressIntegrity)}>{fortressIntegrity}%</span>
          </div>
          <div className="h-2 bg-[#0A0E1A] rounded overflow-hidden border border-[#7FB3D5]/20">
            <div
              className={`h-full transition-all duration-700 ${
                fortressIntegrity >= 80
                  ? 'bg-gradient-to-r from-[#1B2A4A] to-[#7FB3D5]'
                  : fortressIntegrity >= 65
                  ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                  : 'bg-gradient-to-r from-[#FF4D4D]/70 to-[#FF4D4D]'
              }`}
              style={{ width: `${fortressIntegrity}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Visual Fortress Arena */}
      <div className="py-6">
        {/* Visual Architecture Representation */}
        <div className="max-w-xl mx-auto space-y-2">
          {/* TIER 3: SPIRE & HIGH CITADEL (Days 61-90) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono-stat text-[#7FB3D5]/60 uppercase px-1">
              <span>Tier 3: Spire & Apex Citadel (Days 61–90)</span>
              <span>{Math.min(30, Math.max(0, currentDay - 60))}/30</span>
            </div>
            <div className="grid grid-cols-10 gap-1 sm:gap-1.5 p-2 bg-[#0A0E1A]/60 rounded border border-[#7FB3D5]/15">
              {daysArray.slice(60, 90).map((day) => renderBlock(day))}
            </div>
          </div>

          {/* TIER 2: RAMPARTS (Days 31-60) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono-stat text-[#7FB3D5]/60 uppercase px-1">
              <span>Tier 2: Permafrost Ramparts (Days 31–60)</span>
              <span>{Math.min(30, Math.max(0, currentDay - 30))}/30</span>
            </div>
            <div className="grid grid-cols-10 gap-1 sm:gap-1.5 p-2 bg-[#0A0E1A]/60 rounded border border-[#7FB3D5]/15">
              {daysArray.slice(30, 60).map((day) => renderBlock(day))}
            </div>
          </div>

          {/* TIER 1: FOUNDATION (Days 1-30) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono-stat text-[#7FB3D5]/60 uppercase px-1">
              <span>Tier 1: Bedrock Foundation (Days 1–30)</span>
              <span>{Math.min(30, currentDay)}/30</span>
            </div>
            <div className="grid grid-cols-10 gap-1 sm:gap-1.5 p-2 bg-[#0A0E1A]/60 rounded border border-[#7FB3D5]/15">
              {daysArray.slice(0, 30).map((day) => renderBlock(day))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Hover Status */}
      <div className="pt-3 border-t border-[#7FB3D5]/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-stat">
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#E8F0F7]/70">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#7FB3D5] shadow-xs shadow-[#7FB3D5]" />
            <span>Solid Ice (Done)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
            <span>5-Min Fallback</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-400" />
            <span>Grace Shield</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#FF4D4D] animate-pulse" />
            <span>Fissure / Crack</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#1B2A4A]/40 border border-[#7FB3D5]/20" />
            <span>Uncut Stone</span>
          </div>
        </div>

        {hoveredDay && (
          <div className="text-[11px] text-[#7FB3D5] bg-[#0A0E1A] px-2.5 py-1 rounded border border-[#7FB3D5]/30">
            DAY {hoveredDay}: {getDayStatusLabel(hoveredDay)}
          </div>
        )}
      </div>
    </div>
  );

  function getDayStatusLabel(day: number): string {
    const log = logs[day];
    if (day === currentDay) return 'CURRENT IN-PROGRESS';
    if (!log || log.status === 'pending') {
      return day < currentDay ? 'MISSED (FISSURE)' : 'FUTURE BLOCK';
    }
    if (log.status === 'full') return 'SOLIDIFIED CRYSTAL';
    if (log.status === 'fallback') return '5-MIN REINFORCED';
    if (log.status === 'grace_protected' || log.graceUsed) return 'GRACE SHIELDED';
    if (log.status === 'broken') return 'STRUCTURAL FRACTURE';
    return 'PENDING';
  }

  function renderBlock(day: number) {
    const log = logs[day];
    const isCurrent = day === currentDay;
    const isPast = day < currentDay;
    const isFuture = day > currentDay;

    let blockStyle = 'bg-[#1B2A4A]/25 border-[#7FB3D5]/10 text-transparent'; // default future

    if (log) {
      if (log.status === 'full') {
        blockStyle = 'bg-[#7FB3D5] border-[#E8F0F7] shadow-xs shadow-[#7FB3D5]/40 text-[#0A0E1A] font-bold';
      } else if (log.status === 'fallback') {
        blockStyle = 'bg-amber-400 border-amber-200 text-[#0A0E1A] font-bold';
      } else if (log.status === 'grace_protected' || log.graceUsed) {
        blockStyle = 'bg-indigo-400 border-indigo-200 text-white font-bold';
      } else if (log.status === 'broken' || (isPast && log.status === 'pending')) {
        blockStyle = 'bg-[#FF4D4D]/80 border-[#FF4D4D] text-white animate-pulse';
      }
    }

    if (isCurrent && (!log || log.status === 'pending')) {
      blockStyle = 'bg-[#1B2A4A] border-[#7FB3D5] ring-1 ring-[#7FB3D5] text-[#7FB3D5] animate-pulse';
    }

    return (
      <button
        key={day}
        type="button"
        onMouseEnter={() => setHoveredDay(day)}
        onMouseLeave={() => setHoveredDay(null)}
        onClick={() => onSelectDay?.(day)}
        className={`h-7 sm:h-8 rounded-xs border text-[10px] font-mono-stat flex items-center justify-center transition-all cursor-pointer hover:scale-110 hover:z-10 relative ${blockStyle}`}
        title={`Day ${day}`}
      >
        {isPast && (log?.status === 'broken' || (!log || log.status === 'pending')) ? (
          <span className="text-[11px] leading-none">⚡</span>
        ) : (
          <span>{day}</span>
        )}
      </button>
    );
  }
};
