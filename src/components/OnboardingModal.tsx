import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Check, Plus, Trash2, Dumbbell, AlarmClock, ShieldAlert, Flame, Snowflake, BookOpen, EyeOff, Footprints, AlertTriangle, ArrowRight, Compass } from 'lucide-react';
import { ArcProfile, Vow } from '../types';
import { PRESET_AVATARS, PRESET_VOWS, getDefaultEndDate, getDefaultStartDate } from '../utils/storage';
import { soundEngine } from '../utils/audio';

interface OnboardingModalProps {
  onComplete: (profile: ArcProfile) => void;
  isOpen: boolean;
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

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, isOpen }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState('IRON NOMAD');
  const [selectedAvatar, setSelectedAvatar] = useState('wolf');
  const [selectedVows, setSelectedVows] = useState<Vow[]>([
    PRESET_VOWS[0],
    PRESET_VOWS[1],
    PRESET_VOWS[2],
    PRESET_VOWS[3]
  ]);
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [customVowName, setCustomVowName] = useState('');
  const [customVowFallback, setCustomVowFallback] = useState('');
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [oathAccepted, setOathAccepted] = useState(false);

  if (!isOpen) return null;

  const toggleVow = (vow: Vow) => {
    soundEngine.playIceShatter();
    const exists = selectedVows.some(v => v.id === vow.id);
    if (exists) {
      if (selectedVows.length <= 3) {
        // Can't go below 3
        soundEngine.playAlert();
        return;
      }
      setSelectedVows(selectedVows.filter(v => v.id !== vow.id));
    } else {
      if (selectedVows.length >= 5) {
        // Max 5 non-negotiable vows
        soundEngine.playAlert();
        return;
      }
      setSelectedVows([...selectedVows, vow]);
    }
  };

  const handleAddCustomVow = () => {
    if (!customVowName.trim()) return;
    if (selectedVows.length >= 5) {
      soundEngine.playAlert();
      return;
    }

    const newVow: Vow = {
      id: `custom_${Date.now()}`,
      name: customVowName.trim(),
      description: 'Personal non-negotiable discipline for the Winter Arc.',
      fallback5Min: customVowFallback.trim() || '5 minutes of pure focused execution.',
      category: 'grit',
      iconName: 'Flame'
    };

    setSelectedVows([...selectedVows, newVow]);
    setCustomVowName('');
    setCustomVowFallback('');
    setShowCustomBuilder(false);
    soundEngine.playEmberIgnite();
  };

  const handleFinish = () => {
    soundEngine.playFortressBlock();
    soundEngine.playEmberIgnite();
    setOathAccepted(true);

    setTimeout(() => {
      const finalProfile: ArcProfile = {
        name: name.trim().toUpperCase() || 'WINTER REAPER',
        avatar: selectedAvatar,
        difficulty: 'Standard 90-Day Arc',
        startDate,
        endDate: getDefaultEndDate(startDate, 90),
        totalDays: 90,
        vows: selectedVows,
        graceTokensAvailable: 1,
        graceTokensTotalEarned: 1,
        soundEnabled: true,
        isOnboarded: true,
        ambientSnowEnabled: true
      };
      onComplete(finalProfile);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0E1A]/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto">
        {/* Decorative corner ice frames */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[#7FB3D5]/60 pointer-events-none" />
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#7FB3D5]/60 pointer-events-none" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#7FB3D5]/60 pointer-events-none" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#7FB3D5]/60 pointer-events-none" />

        <div className="frost-card rounded-lg p-6 sm:p-10 border border-[#7FB3D5]/30 shadow-2xl relative overflow-hidden">
          {/* Subtle ice background glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#7FB3D5]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#1B2A4A]/40 rounded-full blur-3xl pointer-events-none" />

          {/* Header Step Counter */}
          <div className="flex items-center justify-between pb-6 border-b border-[#7FB3D5]/15 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7FB3D5] animate-pulse" />
              <span className="font-condensed text-xs tracking-widest text-[#7FB3D5]">
                PROTOCOL INITIALIZATION // STEP {step} OF 4
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 transition-all duration-300 rounded-sm ${
                    s === step
                      ? 'w-6 bg-[#7FB3D5]'
                      : s < step
                      ? 'w-3 bg-[#7FB3D5]/60'
                      : 'w-2 bg-[#1B2A4A]'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="font-condensed text-3xl sm:text-4xl text-[#E8F0F7] tracking-wider uppercase">
                    Enter The Arc
                  </h1>
                  <p className="text-sm text-[#7FB3D5]/80 mt-1">
                    90 days of absolute isolation and rebuilding. State your callsign and choose your sigil.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-wider text-[#E8F0F7]/70 font-mono-stat">
                    Callsign / Operator Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    maxLength={20}
                    placeholder="E.G. GHOST_90, APEX, NOMAD"
                    className="w-full bg-[#0A0E1A]/80 border border-[#7FB3D5]/30 rounded px-4 py-3 text-lg font-condensed tracking-wider text-[#E8F0F7] focus:outline-none focus:border-[#7FB3D5] focus:ring-1 focus:ring-[#7FB3D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#E8F0F7]/70 font-mono-stat mb-3">
                    Choose Sigil
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {PRESET_AVATARS.map((av) => {
                      const isSelected = selectedAvatar === av.id;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            setSelectedAvatar(av.id);
                            soundEngine.playIceShatter();
                          }}
                          className={`p-3 rounded border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-[#1B2A4A] border-[#7FB3D5] text-white shadow-lg shadow-[#7FB3D5]/20 scale-105'
                              : 'bg-[#0A0E1A]/50 border-[#7FB3D5]/20 text-[#E8F0F7]/60 hover:border-[#7FB3D5]/50'
                          }`}
                        >
                          <span className="text-2xl mb-1">{av.symbol}</span>
                          <span className="text-[10px] font-condensed tracking-wider uppercase truncate w-full">
                            {av.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playIceShatter();
                      setStep(2);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2A4A] hover:bg-[#7FB3D5] hover:text-[#0A0E1A] text-[#E8F0F7] font-condensed tracking-wider text-base uppercase rounded border border-[#7FB3D5]/40 transition-all cursor-pointer shadow-md"
                  >
                    <span>Define The Vows</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: VOW SELECTION */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="font-condensed text-2xl sm:text-3xl text-[#E8F0F7] tracking-wider uppercase">
                      Select 3–5 Non-Negotiables
                    </h2>
                    <p className="text-xs text-[#7FB3D5]/80 mt-0.5">
                      Missing ONE breaks the chain. Select with absolute conviction.
                    </p>
                  </div>
                  <div className="font-mono-stat text-xs px-3 py-1 rounded bg-[#0A0E1A] border border-[#7FB3D5]/30 text-[#7FB3D5] self-start sm:self-auto">
                    {selectedVows.length} / 5 SELECTED (MIN 3)
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {PRESET_VOWS.map((vow) => {
                    const isSelected = selectedVows.some((v) => v.id === vow.id);
                    return (
                      <div
                        key={vow.id}
                        onClick={() => toggleVow(vow)}
                        className={`p-3.5 rounded border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#1B2A4A]/80 border-[#7FB3D5] text-[#E8F0F7]'
                            : 'bg-[#0A0E1A]/40 border-[#7FB3D5]/15 text-[#E8F0F7]/60 hover:border-[#7FB3D5]/40 hover:bg-[#1B2A4A]/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded mt-0.5 ${isSelected ? 'bg-[#7FB3D5]/20 text-[#7FB3D5]' : 'bg-[#1B2A4A]/40 text-[#7FB3D5]/40'}`}>
                            {ICON_MAP[vow.iconName] || <Flame className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-condensed tracking-wider text-base text-[#E8F0F7] uppercase">
                              {vow.name}
                            </div>
                            <p className="text-xs text-[#E8F0F7]/70 mt-0.5">
                              {vow.description}
                            </p>
                            <div className="text-[11px] text-[#7FB3D5]/70 mt-1 font-mono-stat">
                              Emergency 5-min: {vow.fallback5Min}
                            </div>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-1 ${
                          isSelected ? 'bg-[#7FB3D5] border-[#7FB3D5] text-[#0A0E1A]' : 'border-[#7FB3D5]/30'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Vow option */}
                {!showCustomBuilder ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomBuilder(true)}
                    className="w-full py-2.5 px-4 border border-dashed border-[#7FB3D5]/30 rounded text-xs font-condensed tracking-wider uppercase text-[#7FB3D5] hover:border-[#7FB3D5] hover:bg-[#7FB3D5]/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Forge Custom Non-Negotiable</span>
                  </button>
                ) : (
                  <div className="p-4 bg-[#0A0E1A]/80 border border-[#7FB3D5]/40 rounded space-y-3">
                    <div className="font-condensed text-xs uppercase tracking-wider text-[#7FB3D5]">
                      Custom Discipline Builder
                    </div>
                    <input
                      type="text"
                      placeholder="Discipline Name (e.g. 50 Pullups daily)"
                      value={customVowName}
                      onChange={(e) => setCustomVowName(e.target.value)}
                      className="w-full bg-[#1B2A4A]/40 border border-[#7FB3D5]/30 rounded px-3 py-2 text-sm text-[#E8F0F7] focus:outline-none focus:border-[#7FB3D5]"
                    />
                    <input
                      type="text"
                      placeholder="5-Minute Fallback Minimum (e.g. 15 strict pullups)"
                      value={customVowFallback}
                      onChange={(e) => setCustomVowFallback(e.target.value)}
                      className="w-full bg-[#1B2A4A]/40 border border-[#7FB3D5]/30 rounded px-3 py-2 text-sm text-[#E8F0F7] focus:outline-none focus:border-[#7FB3D5]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCustomBuilder(false)}
                        className="px-3 py-1.5 text-xs text-[#E8F0F7]/60 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCustomVow}
                        className="px-4 py-1.5 bg-[#7FB3D5] text-[#0A0E1A] font-condensed text-xs tracking-wider uppercase rounded font-bold"
                      >
                        Add Vow
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs uppercase font-condensed tracking-wider text-[#E8F0F7]/60 hover:text-white cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={selectedVows.length < 3 || selectedVows.length > 5}
                    onClick={() => {
                      soundEngine.playIceShatter();
                      setStep(3);
                    }}
                    className={`inline-flex items-center gap-2 px-6 py-3 font-condensed tracking-wider text-base uppercase rounded border transition-all cursor-pointer ${
                      selectedVows.length >= 3 && selectedVows.length <= 5
                        ? 'bg-[#1B2A4A] hover:bg-[#7FB3D5] hover:text-[#0A0E1A] text-[#E8F0F7] border-[#7FB3D5]/40'
                        : 'opacity-40 cursor-not-allowed bg-[#1B2A4A]/20 border-transparent text-[#E8F0F7]/40'
                    }`}
                  >
                    <span>Confirm Vows</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: TIMELINE & CALENDAR */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-condensed text-2xl sm:text-3xl text-[#E8F0F7] tracking-wider uppercase">
                    The 90-Day Campaign
                  </h2>
                  <p className="text-sm text-[#7FB3D5]/80 mt-1">
                    Winter starts when you decree it. Dec 1 – Feb 28 is the ancestral window, or begin today.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0A0E1A]/60 border border-[#7FB3D5]/20 rounded">
                    <span className="block text-xs uppercase font-mono-stat text-[#7FB3D5] mb-2">
                      Start Date
                    </span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#1B2A4A]/30 border border-[#7FB3D5]/30 rounded px-3 py-2 text-sm text-[#E8F0F7] focus:outline-none focus:border-[#7FB3D5]"
                    />
                  </div>

                  <div className="p-4 bg-[#0A0E1A]/60 border border-[#7FB3D5]/20 rounded">
                    <span className="block text-xs uppercase font-mono-stat text-[#7FB3D5] mb-2">
                      Day 90 Endgame
                    </span>
                    <div className="text-sm font-mono-stat text-[#E8F0F7] py-2">
                      {getDefaultEndDate(startDate, 90)}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#1B2A4A]/30 border border-[#7FB3D5]/20 rounded space-y-2">
                  <div className="flex items-center gap-2 text-[#7FB3D5] text-xs font-condensed tracking-wider uppercase">
                    <Shield className="w-4 h-4" />
                    <span>The Unbreakable Code</span>
                  </div>
                  <ul className="text-xs text-[#E8F0F7]/80 space-y-1.5 list-disc list-inside">
                    <li>Missing ONE vow cracks your fortress. Zero excuses accepted.</li>
                    <li>One Grace Token per month (earned, never gifted freely).</li>
                    <li>If on the brink of failure, execute the 5-minute minimum protocol.</li>
                  </ul>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs uppercase font-condensed tracking-wider text-[#E8F0F7]/60 hover:text-white cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playIceShatter();
                      setStep(4);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2A4A] hover:bg-[#7FB3D5] hover:text-[#0A0E1A] text-[#E8F0F7] font-condensed tracking-wider text-base uppercase rounded border border-[#7FB3D5]/40 transition-all cursor-pointer"
                  >
                    <span>Proceed To Oath</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: THE CINEMATIC OATH */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center"
              >
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#1B2A4A]/50 border border-[#7FB3D5]/40 mx-auto">
                  <Snowflake className="w-10 h-10 text-[#7FB3D5] animate-pulse" />
                </div>

                <div>
                  <h2 className="font-condensed text-3xl sm:text-4xl text-[#E8F0F7] tracking-widest uppercase">
                    THE OATH OF WINTER
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-[#7FB3D5] font-mono-stat mt-1">
                    CALLSIGN: {name} · 90 DAYS · ZERO RETREAT
                  </p>
                </div>

                <div className="p-6 bg-[#0A0E1A]/80 border border-[#7FB3D5]/30 rounded-lg text-left relative overflow-hidden">
                  <div className="font-mono-stat text-xs text-[#7FB3D5]/90 leading-relaxed italic">
                    "I accept the cold. I renounce complacency, cheap dopamine, and unearned comfort. For the next 90 days, my vows are iron. The world can sleep; I will build my fortress brick by frozen brick."
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={oathAccepted}
                    className="w-full py-4 px-6 bg-[#7FB3D5] hover:bg-[#E8F0F7] text-[#0A0E1A] font-condensed tracking-widest text-lg uppercase rounded font-bold shadow-xl shadow-[#7FB3D5]/20 hover:shadow-[#7FB3D5]/40 transition-all cursor-pointer transform active:scale-98 flex items-center justify-center gap-3"
                  >
                    <Flame className="w-5 h-5 text-[#FF4D4D]" />
                    <span>{oathAccepted ? 'ENTERING THE FROST...' : 'I ACCEPT THE COLD'}</span>
                  </button>
                  <p className="text-[11px] text-[#7FB3D5]/60 mt-2 font-mono-stat">
                    NO REFUNDS. NO EXCUSES. DAY 1 COMMENCES NOW.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
