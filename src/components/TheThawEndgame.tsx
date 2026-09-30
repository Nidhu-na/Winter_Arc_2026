import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Shield, Share2, Flame, Award, Sparkles, RefreshCw, Check, ArrowRight, Zap } from 'lucide-react';
import { ArcDifficulty, ArcProfile, DayLog } from '../types';
import { ArcStats } from '../utils/storage';
import { soundEngine } from '../utils/audio';

interface TheThawEndgameProps {
  profile: ArcProfile;
  stats: ArcStats;
  logs: Record<number, DayLog>;
  onStartNewArc: (difficulty: ArcDifficulty) => void;
  onClose?: () => void;
}

export const TheThawEndgame: React.FC<TheThawEndgameProps> = ({
  profile,
  stats,
  logs,
  onStartNewArc,
  onClose,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ArcDifficulty>('Nightmare Arc');

  useEffect(() => {
    soundEngine.playVictoryThaw();

    // Trigger icy crystalline confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7FB3D5', '#E8F0F7', '#1B2A4A', '#FFFFFF', '#FFD700'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  // Gather journal highlights
  const journalHighlights: string[] = [];
  for (let i = 1; i <= profile.totalDays; i++) {
    if (logs[i]?.proofOfWork?.content) {
      journalHighlights.push(logs[i].proofOfWork!.content);
    }
  }

  const handleShareCard = () => {
    soundEngine.playIceShatter();
    const shareText = `❄️ I SURVIVED THE WINTER ARC ❄️\n\nCallsign: ${profile.name}\nCompleted: ${stats.completedDaysCount}/90 Days\nLongest Streak: ${stats.longestStreak} Days\nFortress Integrity: ${stats.fortressIntegrity}%\nVows Forged: ${stats.totalVowsCompleted}\n\nThe world was sleeping. I was in the forge.\n#WinterArc #NoZeroDays #Discipline`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0E1A]/95 backdrop-blur-2xl p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto">
        <div className="frost-card-glow rounded-xl p-6 sm:p-10 border border-[#7FB3D5]/40 shadow-2xl relative overflow-hidden space-y-8">
          {/* Top Thaw Header */}
          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7FB3D5]/10 border border-[#7FB3D5]/40 text-[#7FB3D5] text-xs font-mono-stat uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#7FB3D5]" />
              <span>THE THAW HAS ARRIVED · DAY 90 CONQUERED</span>
            </div>

            <h1 className="font-condensed text-4xl sm:text-5xl lg:text-6xl text-white tracking-widest uppercase font-bold drop-shadow-md">
              THE UNBREAKABLE CITADEL
            </h1>
            <p className="text-sm text-[#7FB3D5]/90 font-mono-stat max-w-lg mx-auto">
              Winter came. The winds howled. You did not flinch. Your fortress stands permanent.
            </p>
          </div>

          {/* Shareable Card Graphic Preview */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#1B2A4A] via-[#0A0E1A] to-[#15233E] rounded-xl border-2 border-[#7FB3D5]/60 shadow-2xl relative overflow-hidden">
            {/* Visual watermarks & stamps */}
            <div className="absolute top-4 right-4 text-right">
              <div className="text-[10px] font-mono-stat text-[#7FB3D5]/60 uppercase tracking-widest">
                OFFICIAL CERTIFICATE
              </div>
              <div className="text-xs font-condensed tracking-wider text-white">
                WINTER ARC SURVIVOR
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-[#0A0E1A] border border-[#7FB3D5] flex items-center justify-center text-3xl shadow-lg">
                🛡️
              </div>
              <div>
                <span className="text-[10px] font-mono-stat uppercase tracking-wider text-[#7FB3D5]">
                  OPERATOR CALLSIGN
                </span>
                <h3 className="font-condensed text-2xl sm:text-3xl text-white tracking-wider uppercase font-bold">
                  {profile.name}
                </h3>
                <span className="text-xs font-mono-stat text-[#E8F0F7]/60">
                  {profile.startDate} → {profile.endDate}
                </span>
              </div>
            </div>

            {/* Core Achievement Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#7FB3D5]/20 font-mono-stat text-center">
              <div className="p-3 bg-[#0A0E1A]/60 rounded border border-[#7FB3D5]/15">
                <span className="text-[10px] text-[#7FB3D5]/70 uppercase block">Total Days</span>
                <span className="text-xl font-bold text-white">{stats.completedDaysCount}/90</span>
              </div>
              <div className="p-3 bg-[#0A0E1A]/60 rounded border border-[#7FB3D5]/15">
                <span className="text-[10px] text-[#7FB3D5]/70 uppercase block">Fortress</span>
                <span className="text-xl font-bold text-[#7FB3D5]">{stats.fortressIntegrity}%</span>
              </div>
              <div className="p-3 bg-[#0A0E1A]/60 rounded border border-[#7FB3D5]/15">
                <span className="text-[10px] text-[#7FB3D5]/70 uppercase block">Longest Streak</span>
                <span className="text-xl font-bold text-amber-400">{stats.longestStreak} D</span>
              </div>
              <div className="p-3 bg-[#0A0E1A]/60 rounded border border-[#7FB3D5]/15">
                <span className="text-[10px] text-[#7FB3D5]/70 uppercase block">Vows Conquered</span>
                <span className="text-xl font-bold text-emerald-400">{stats.totalVowsCompleted}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-stat text-[#7FB3D5]/80">
              <span>CANON: "WINTER IS NOT A PUNISHMENT. IT IS THE FORGE."</span>
              <button
                type="button"
                onClick={handleShareCard}
                className="w-full sm:w-auto px-4 py-2 bg-[#7FB3D5] hover:bg-[#E8F0F7] text-[#0A0E1A] font-condensed tracking-wider uppercase font-bold rounded flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-950" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedShare ? 'COPIED CARD SUMMARY!' : 'SHARE SURVIVOR CARD'}</span>
              </button>
            </div>
          </div>

          {/* Highlights from the Proof of Work Ledger */}
          {journalHighlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-condensed text-base text-[#7FB3D5] tracking-wider uppercase font-bold">
                Highlights From The Ledger
              </h4>
              <div className="p-4 bg-[#0A0E1A]/80 border border-[#7FB3D5]/20 rounded-lg max-h-32 overflow-y-auto space-y-2 text-xs font-mono-stat italic text-[#E8F0F7]/90">
                {journalHighlights.slice(0, 3).map((h, i) => (
                  <p key={i}>"{h}"</p>
                ))}
              </div>
            </div>
          )}

          {/* Offer Next Difficulty Arc */}
          <div className="p-5 bg-[#0A0E1A]/90 border border-[#7FB3D5]/30 rounded-lg space-y-4">
            <div>
              <span className="text-[11px] font-mono-stat text-[#FF4D4D] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <Flame className="w-4 h-4" />
                <span>THE NEXT ASCENSION // SELECT NEW DIFFICULTY</span>
              </span>
              <h3 className="font-condensed text-xl text-white tracking-wider uppercase mt-1">
                Do Not Return To Comfort. Ascend.
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedDifficulty('Nightmare Arc')}
                className={`p-3.5 rounded border text-left transition-all cursor-pointer ${
                  selectedDifficulty === 'Nightmare Arc'
                    ? 'bg-[#1B2A4A] border-[#FF4D4D] text-white shadow-md'
                    : 'bg-[#0A0E1A] border-[#7FB3D5]/20 text-[#E8F0F7]/60 hover:border-[#7FB3D5]/50'
                }`}
              >
                <div className="font-condensed text-base text-[#FF4D4D] tracking-wider uppercase font-bold">
                  NIGHTMARE ARC
                </div>
                <p className="text-[11px] font-mono-stat text-[#E8F0F7]/80 mt-1">
                  5 Vows. Zero Grace Tokens. Zero Fallbacks Permitted. Flawless execution only.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDifficulty('Permafrost Protocol')}
                className={`p-3.5 rounded border text-left transition-all cursor-pointer ${
                  selectedDifficulty === 'Permafrost Protocol'
                    ? 'bg-[#1B2A4A] border-[#7FB3D5] text-white shadow-md'
                    : 'bg-[#0A0E1A] border-[#7FB3D5]/20 text-[#E8F0F7]/60 hover:border-[#7FB3D5]/50'
                }`}
              >
                <div className="font-condensed text-base text-[#7FB3D5] tracking-wider uppercase font-bold">
                  PERMAFROST PROTOCOL
                </div>
                <p className="text-[11px] font-mono-stat text-[#E8F0F7]/80 mt-1">
                  Extreme regime. 04:30 AM wake, freezing immersion, 10 miles in the cold.
                </p>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-condensed tracking-wider uppercase text-[#E8F0F7]/60 hover:text-white"
                >
                  Return to Dashboard
                </button>
              )}

              <button
                type="button"
                onClick={() => onStartNewArc(selectedDifficulty)}
                className="w-full sm:w-auto px-6 py-3 bg-[#FF4D4D] hover:bg-rose-500 text-white font-condensed tracking-wider text-base uppercase font-bold rounded shadow-lg shadow-[#FF4D4D]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>COMMENCE {selectedDifficulty.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
