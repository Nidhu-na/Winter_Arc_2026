/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArcDifficulty, ArcProfile, DayLog, DailyQuote } from './types';
import {
  calculateArcStats,
  calculateCurrentDayNumber,
  getInitialProfile,
  loadDayLogs,
  loadProfile,
  saveDayLogs,
  saveProfile,
  seedSampleProgress,
  getTodayDateString,
  getDateForDayNumber,
} from './utils/storage';
import { getQuoteForDay } from './utils/quotes';
import { soundEngine } from './utils/audio';

// Components
import { AmbientSnow } from './components/AmbientSnow';
import { Navbar, NavTab } from './components/Navbar';
import { OnboardingModal } from './components/OnboardingModal';
import { StreakDisplay } from './components/StreakDisplay';
import { DailyVowsList } from './components/DailyVowsList';
import { FortressVisualizer } from './components/FortressVisualizer';
import { Heatmap90Days } from './components/Heatmap90Days';
import { ColdRoomSquad } from './components/ColdRoomSquad';
import { ProofOfWorkLog } from './components/ProofOfWorkLog';
import { GraceTokenModal } from './components/GraceTokenModal';
import { TheThawEndgame } from './components/TheThawEndgame';

export default function App() {
  const [profile, setProfile] = useState<ArcProfile>(() => loadProfile());
  const [logs, setLogs] = useState<Record<number, DayLog>>(() => loadDayLogs(profile));
  const [activeTab, setActiveTab] = useState<NavTab>('command');
  const [quoteIndexOffset, setQuoteIndexOffset] = useState<number>(0);

  // Modals
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!profile.isOnboarded);
  const [showGraceModal, setShowGraceModal] = useState<boolean>(false);
  const [showProofModal, setShowProofModal] = useState<boolean>(false);
  const [showThawEndgame, setShowThawEndgame] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync sound engine enabled state
  useEffect(() => {
    soundEngine.enabled = profile.soundEnabled;
  }, [profile.soundEnabled]);

  // Current day in the 90-day arc
  const currentDay = calculateCurrentDayNumber(profile.startDate, profile.totalDays);
  const stats = calculateArcStats(logs, profile, currentDay);
  const quote = getQuoteForDay(currentDay + quoteIndexOffset);

  // Ensure current day log exists
  const currentDayLog: DayLog = logs[currentDay] || {
    date: getDateForDayNumber(profile.startDate, currentDay),
    dayNumber: currentDay,
    completedVowIds: [],
    fallbackVowIds: [],
    status: 'pending',
    graceUsed: false,
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle vow action
  const handleToggleVow = (vowId: string, isFallback: boolean = false) => {
    const updatedLogs = { ...logs };
    const day = currentDayLog;

    let newCompleted = [...day.completedVowIds];
    let newFallback = [...day.fallbackVowIds];

    if (isFallback) {
      if (newFallback.includes(vowId)) {
        newFallback = newFallback.filter((id) => id !== vowId);
      } else {
        newFallback.push(vowId);
        newCompleted = newCompleted.filter((id) => id !== vowId);
      }
    } else {
      if (newCompleted.includes(vowId)) {
        newCompleted = newCompleted.filter((id) => id !== vowId);
      } else {
        newCompleted.push(vowId);
        newFallback = newFallback.filter((id) => id !== vowId);
      }
    }

    const totalConquered = newCompleted.length + newFallback.length;
    const isAllDone = totalConquered >= profile.vows.length && profile.vows.length > 0;
    const hasFallbacks = newFallback.length > 0;

    let newStatus = day.status;
    if (day.graceUsed) {
      newStatus = 'grace_protected';
    } else if (isAllDone) {
      newStatus = hasFallbacks ? 'fallback' : 'full';
      if (!hasFallbacks && !day.completedVowIds.includes(vowId)) {
        triggerToast('VOW FORGED IN FROST. THE CHAIN HOLDS.');
      }
    } else {
      newStatus = 'pending';
    }

    updatedLogs[currentDay] = {
      ...day,
      completedVowIds: newCompleted,
      fallbackVowIds: newFallback,
      status: newStatus,
    };

    setLogs(updatedLogs);
    saveDayLogs(updatedLogs);
  };

  // Use Grace Token
  const handleUseGraceToken = () => {
    if (profile.graceTokensAvailable <= 0) return;

    const updatedProfile = {
      ...profile,
      graceTokensAvailable: profile.graceTokensAvailable - 1,
    };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);

    const updatedLogs = { ...logs };
    updatedLogs[currentDay] = {
      ...currentDayLog,
      status: 'grace_protected',
      graceUsed: true,
    };
    setLogs(updatedLogs);
    saveDayLogs(updatedLogs);

    triggerToast('GRACE SHIELD DEPLOYED. CHAIN PROTECTED FROM SHATTERING.');
  };

  // Save Proof of Work journal entry
  const handleSaveProof = (dayNumber: number, content: string, tags: string[]) => {
    const updatedLogs = { ...logs };
    const day = updatedLogs[dayNumber] || currentDayLog;

    updatedLogs[dayNumber] = {
      ...day,
      proofOfWork: {
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tags,
      },
    };

    setLogs(updatedLogs);
    saveDayLogs(updatedLogs);
    triggerToast('PROOF OF WORK RECORDED IN CITADEL LEDGER.');
  };

  // Complete onboarding
  const handleOnboardingComplete = (newProfile: ArcProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
    setShowOnboarding(false);

    // Initialize clean day logs
    const initialLogs = loadDayLogs(newProfile);
    setLogs(initialLogs);
    saveDayLogs(initialLogs);

    triggerToast('THE ARC IS INITIATED. EMBRACE THE COLD.');
  };

  // Fast-Forward / Seed Demo Simulation (18 days of grit)
  const handleSimulateProgress = () => {
    soundEngine.playFortressBlock();
    const seeded = seedSampleProgress(profile, 18);
    setLogs(seeded);
    saveDayLogs(seeded);
    triggerToast('SIMULATED 18 DAYS OF PROTOCOL. AUDIT THE CITADEL & HEATMAP.');
  };

  // Full reset back to onboarding
  const handleResetArc = () => {
    if (window.confirm('Reset your entire Winter Arc? This will wipe progress and re-enter the forge.')) {
      soundEngine.playIceShatter();
      const fresh = getInitialProfile();
      setProfile(fresh);
      saveProfile(fresh);
      const cleanLogs = loadDayLogs(fresh);
      setLogs(cleanLogs);
      saveDayLogs(cleanLogs);
      setShowOnboarding(true);
    }
  };

  // Start next difficulty from endgame
  const handleStartNewArc = (difficulty: ArcDifficulty) => {
    soundEngine.playFortressBlock();
    const nextProfile: ArcProfile = {
      ...profile,
      difficulty,
      startDate: getTodayDateString(),
      graceTokensAvailable: difficulty === 'Nightmare Arc' ? 0 : 1,
      graceTokensTotalEarned: 0,
      totalDays: 90,
    };
    setProfile(nextProfile);
    saveProfile(nextProfile);

    const freshLogs = loadDayLogs(nextProfile);
    setLogs(freshLogs);
    saveDayLogs(freshLogs);
    setShowThawEndgame(false);

    triggerToast(`COMMENCED ${difficulty.toUpperCase()}. THE FROST DEEPENS.`);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#E8F0F7] selection:bg-[#7FB3D5]/30 relative flex flex-col antialiased">
      {/* Ambient Falling Snow & Frost Canvas */}
      <AmbientSnow enabled={profile.ambientSnowEnabled} />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        currentDay={currentDay}
        soundEnabled={profile.soundEnabled}
        onToggleSound={() => {
          const next = !profile.soundEnabled;
          const updated = { ...profile, soundEnabled: next };
          setProfile(updated);
          saveProfile(updated);
        }}
        snowEnabled={profile.ambientSnowEnabled}
        onToggleSnow={() => {
          const next = !profile.ambientSnowEnabled;
          const updated = { ...profile, ambientSnowEnabled: next };
          setProfile(updated);
          saveProfile(updated);
        }}
        onOpenThawPreview={() => setShowThawEndgame(true)}
        onResetArc={handleResetArc}
        onSimulateProgress={handleSimulateProgress}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded bg-[#1B2A4A]/90 border border-[#7FB3D5]/50 text-white font-mono-stat text-xs tracking-wider uppercase shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#7FB3D5] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 space-y-8">
        {/* TAB 1: DAILY COMMAND CENTER */}
        {activeTab === 'command' && (
          <motion.div
            key="command"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Front & Center Streak Hero with Quote */}
            <StreakDisplay
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
              currentDay={currentDay}
              totalDays={profile.totalDays}
              graceTokensAvailable={profile.graceTokensAvailable}
              quote={quote}
              onOpenGraceModal={() => setShowGraceModal(true)}
              onRefreshQuote={() => setQuoteIndexOffset((prev) => prev + 1)}
            />

            {/* Daily Vows Checklist */}
            <DailyVowsList
              vows={profile.vows}
              currentDayLog={currentDayLog}
              currentDayNumber={currentDay}
              onToggleVow={handleToggleVow}
              onOpenProofModal={() => setShowProofModal(true)}
            />

            {/* Compact Citadel Preview (Tap opens full citadel tab) */}
            <div className="pt-2">
              <FortressVisualizer
                logs={logs}
                currentDay={currentDay}
                fortressIntegrity={stats.fortressIntegrity}
                totalDays={profile.totalDays}
                onSelectDay={() => setActiveTab('citadel')}
              />
            </div>
          </motion.div>
        )}

        {/* TAB 2: CITADEL & 90-DAY MAP */}
        {activeTab === 'citadel' && (
          <motion.div
            key="citadel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <FortressVisualizer
              logs={logs}
              currentDay={currentDay}
              fortressIntegrity={stats.fortressIntegrity}
              totalDays={profile.totalDays}
            />

            <Heatmap90Days
              logs={logs}
              profile={profile}
              stats={stats}
              currentDay={currentDay}
            />
          </motion.div>
        )}

        {/* TAB 3: THE COLD ROOM (SQUAD & ACCOUNTABILITY) */}
        {activeTab === 'squad' && (
          <motion.div
            key="squad"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ColdRoomSquad
              profile={profile}
              currentStreak={stats.currentStreak}
              fortressIntegrity={stats.fortressIntegrity}
              todayCompletedCount={currentDayLog.completedVowIds.length + currentDayLog.fallbackVowIds.length}
              todayTotalVows={profile.vows.length}
            />
          </motion.div>
        )}

        {/* TAB 4: PROOF OF WORK LOG */}
        {activeTab === 'ledger' && (
          <motion.div
            key="ledger"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ProofOfWorkLog
              logs={logs}
              currentDay={currentDay}
              onSaveProof={handleSaveProof}
            />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#7FB3D5]/10 py-6 text-center text-xs font-mono-stat text-[#7FB3D5]/60 relative z-10 bg-[#0A0E1A]/80">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>WINTER ARC // 90-DAY DISCIPLINE PROTOCOL · ZERO FLUFF</div>
          <div className="flex items-center gap-4">
            <span className="text-[#E8F0F7]/40">OFF-GRID PERSISTENCE</span>
            <span>·</span>
            <button
              type="button"
              onClick={handleSimulateProgress}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Simulate 18 Days
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setShowThawEndgame(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Day 90 Endgame
            </button>
          </div>
        </div>
      </footer>

      {/* Onboarding Ritual Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {/* Grace Token Modal */}
      <GraceTokenModal
        isOpen={showGraceModal}
        onClose={() => setShowGraceModal(false)}
        graceTokensAvailable={profile.graceTokensAvailable}
        onUseToken={handleUseGraceToken}
        isTodayAtRisk={currentDayLog.status === 'broken' || currentDayLog.status === 'pending'}
      />

      {/* Proof of Work Modal */}
      {showProofModal && (
        <ProofOfWorkLog
          logs={logs}
          currentDay={currentDay}
          onSaveProof={handleSaveProof}
          isOpenAsModal={true}
          onCloseModal={() => setShowProofModal(false)}
        />
      )}

      {/* Day 90 The Thaw Endgame Modal */}
      {showThawEndgame && (
        <TheThawEndgame
          profile={profile}
          stats={stats}
          logs={logs}
          onStartNewArc={handleStartNewArc}
          onClose={() => setShowThawEndgame(false)}
        />
      )}
    </div>
  );
}
