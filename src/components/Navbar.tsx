import React from 'react';
import { Shield, Flame, BarChart3, Users, BookOpen, Volume2, VolumeX, Snowflake, Trophy, RotateCcw } from 'lucide-react';
import { ArcProfile } from '../types';
import { soundEngine } from '../utils/audio';

export type NavTab = 'command' | 'citadel' | 'squad' | 'ledger';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  profile: ArcProfile;
  currentDay: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  snowEnabled: boolean;
  onToggleSnow: () => void;
  onOpenThawPreview: () => void;
  onResetArc: () => void;
  onSimulateProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  currentDay,
  soundEnabled,
  onToggleSound,
  snowEnabled,
  onToggleSnow,
  onOpenThawPreview,
  onResetArc,
  onSimulateProgress,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#7FB3D5]/20 bg-[#0A0E1A]/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Callsign */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#1B2A4A] border border-[#7FB3D5]/40 flex items-center justify-center text-lg shadow-sm">
            ❄️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-condensed text-xl sm:text-2xl text-white tracking-widest uppercase font-bold">
                WINTER ARC
              </span>
              <span className="text-[10px] font-mono-stat px-2 py-0.5 rounded bg-[#1B2A4A] text-[#7FB3D5] border border-[#7FB3D5]/30">
                DAY {currentDay}/90
              </span>
            </div>
            <div className="text-[10px] font-mono-stat text-[#7FB3D5]/70 uppercase tracking-wider hidden sm:block">
              OPERATOR: {profile.name} · {profile.difficulty}
            </div>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-[#0A0E1A] rounded-lg border border-[#7FB3D5]/20 font-mono-stat text-xs">
          <button
            type="button"
            onClick={() => {
              soundEngine.playIceShatter();
              setActiveTab('command');
            }}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'command'
                ? 'bg-[#1B2A4A] text-white font-bold border border-[#7FB3D5]/40'
                : 'text-[#E8F0F7]/60 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#FF4D4D]" />
            <span>COMMAND</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playIceShatter();
              setActiveTab('citadel');
            }}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'citadel'
                ? 'bg-[#1B2A4A] text-white font-bold border border-[#7FB3D5]/40'
                : 'text-[#E8F0F7]/60 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#7FB3D5]" />
            <span>CITADEL & 90-DAY MAP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playIceShatter();
              setActiveTab('squad');
            }}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'squad'
                ? 'bg-[#1B2A4A] text-white font-bold border border-[#7FB3D5]/40'
                : 'text-[#E8F0F7]/60 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#7FB3D5]" />
            <span>COLD ROOM</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playIceShatter();
              setActiveTab('ledger');
            }}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-[#1B2A4A] text-white font-bold border border-[#7FB3D5]/40'
                : 'text-[#E8F0F7]/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#7FB3D5]" />
            <span>PROOF LOG</span>
          </button>
        </nav>

        {/* Quick Utility Actions */}
        <div className="flex items-center gap-1.5">
          {/* Audio toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-[#1B2A4A]/60 border-[#7FB3D5]/30 text-[#7FB3D5]'
                : 'bg-[#0A0E1A] border-[#7FB3D5]/15 text-[#E8F0F7]/30'
            }`}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Snow toggle */}
          <button
            type="button"
            onClick={onToggleSnow}
            className={`p-2 rounded border transition-colors cursor-pointer ${
              snowEnabled
                ? 'bg-[#1B2A4A]/60 border-[#7FB3D5]/30 text-[#7FB3D5]'
                : 'bg-[#0A0E1A] border-[#7FB3D5]/15 text-[#E8F0F7]/30'
            }`}
            title={snowEnabled ? 'Pause Ambient Snow' : 'Resume Ambient Snow'}
          >
            <Snowflake className="w-4 h-4" />
          </button>

          {/* Preview / Endgame Thaw button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playVictoryThaw();
              onOpenThawPreview();
            }}
            className="px-2.5 py-1.5 bg-[#1B2A4A]/70 hover:bg-[#7FB3D5] hover:text-[#0A0E1A] text-[#7FB3D5] border border-[#7FB3D5]/30 rounded text-xs font-condensed tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all"
            title="Preview The Day 90 Thaw & Certificate"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DAY 90 THAW</span>
          </button>

          {/* Seed demo / reset dropdown */}
          <button
            type="button"
            onClick={onSimulateProgress}
            className="p-2 text-xs font-mono-stat text-[#7FB3D5]/60 hover:text-white rounded hover:bg-[#1B2A4A]/30 transition-colors cursor-pointer"
            title="Fast-forward / Simulate 18 days of discipline"
          >
            ⚡
          </button>

          <button
            type="button"
            onClick={onResetArc}
            className="p-2 text-xs font-mono-stat text-[#FF4D4D]/60 hover:text-[#FF4D4D] rounded hover:bg-[#1B2A4A]/30 transition-colors cursor-pointer"
            title="Reset Arc & Re-enter the Forge"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden border-t border-[#7FB3D5]/15 bg-[#0A0E1A] px-2 py-1.5 flex items-center justify-around font-mono-stat text-[11px]">
        <button
          type="button"
          onClick={() => {
            soundEngine.playIceShatter();
            setActiveTab('command');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded ${
            activeTab === 'command' ? 'text-[#7FB3D5] font-bold' : 'text-[#E8F0F7]/50'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>VOWS</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playIceShatter();
            setActiveTab('citadel');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded ${
            activeTab === 'citadel' ? 'text-[#7FB3D5] font-bold' : 'text-[#E8F0F7]/50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>CITADEL</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playIceShatter();
            setActiveTab('squad');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded ${
            activeTab === 'squad' ? 'text-[#7FB3D5] font-bold' : 'text-[#E8F0F7]/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>SQUAD</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playIceShatter();
            setActiveTab('ledger');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded ${
            activeTab === 'ledger' ? 'text-[#7FB3D5] font-bold' : 'text-[#E8F0F7]/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>PROOF</span>
        </button>
      </div>
    </header>
  );
};
