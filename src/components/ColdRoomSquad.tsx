import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, User, Shield, AlertTriangle, Flame, Bell, Copy, Check, Plus, Radio, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { ArcProfile, SquadMember, SquadRoom } from '../types';
import { PRESET_AVATARS, loadSquad, saveSquad } from '../utils/storage';
import { soundEngine } from '../utils/audio';

interface ColdRoomSquadProps {
  profile: ArcProfile;
  currentStreak: number;
  fortressIntegrity: number;
  todayCompletedCount: number;
  todayTotalVows: number;
}

export const ColdRoomSquad: React.FC<ColdRoomSquadProps> = ({
  profile,
  currentStreak,
  fortressIntegrity,
  todayCompletedCount,
  todayTotalVows,
}) => {
  const [mode, setMode] = useState<'solo' | 'squad'>('squad');
  const [squad, setSquad] = useState<SquadRoom>(() => loadSquad());
  const [copiedCode, setCopiedCode] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [showAddComrade, setShowAddComrade] = useState(false);
  const [pingedMemberId, setPingedMemberId] = useState<string | null>(null);

  // Sync current user status into squad
  const updatedMembers: SquadMember[] = squad.members.map((m) => {
    if (m.isCurrentUser) {
      const isCompleted = todayCompletedCount >= todayTotalVows && todayTotalVows > 0;
      return {
        ...m,
        name: `${profile.name} (YOU)`,
        avatar: profile.avatar,
        currentStreak,
        fortressIntegrity,
        todayCompletedCount,
        todayTotalVows,
        todayStatus: isCompleted ? 'completed' : 'in_progress',
        lastActive: 'Active now',
      };
    }
    return m;
  });

  const handleCopyInvite = () => {
    soundEngine.playIceShatter();
    navigator.clipboard.writeText(
      `Join my Winter Arc Squad [${squad.name}] with room code: ${squad.code}. 90 days. Zero excuses.`
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    if (squad.members.length >= 5) {
      soundEngine.playAlert();
      return;
    }

    soundEngine.playEmberIgnite();
    const newMember: SquadMember = {
      id: `member_${Date.now()}`,
      name: newMemberName.trim().toUpperCase(),
      avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)].id,
      currentStreak: 1,
      fortressIntegrity: 100,
      todayCompletedCount: 0,
      todayTotalVows: profile.vows.length,
      todayStatus: 'in_progress',
      lastActive: 'Just joined',
    };

    const updated = {
      ...squad,
      members: [...squad.members, newMember],
    };
    setSquad(updated);
    saveSquad(updated);
    setNewMemberName('');
    setShowAddComrade(false);
  };

  const handleSendWarHorn = (member: SquadMember) => {
    soundEngine.playAlert();
    setPingedMemberId(member.id);
    setTimeout(() => setPingedMemberId(null), 2500);
  };

  const anyMemberInDanger = updatedMembers.some(
    (m) => m.todayStatus === 'danger' || m.todayStatus === 'broken'
  );

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-[#7FB3D5]/20">
        <div>
          <h2 className="font-condensed text-2xl sm:text-3xl text-[#E8F0F7] tracking-wider uppercase">
            The Cold Room
          </h2>
          <p className="text-xs text-[#7FB3D5]/80 font-mono-stat mt-0.5">
            ACCOUNTABILITY CHAMBER · MAXIMUM 5 OPERATORS
          </p>
        </div>

        {/* Segmented Mode Button */}
        <div className="flex items-center bg-[#0A0E1A] p-1 rounded-lg border border-[#7FB3D5]/20 font-mono-stat text-xs">
          <button
            type="button"
            onClick={() => {
              soundEngine.playIceShatter();
              setMode('solo');
            }}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'solo'
                ? 'bg-[#1B2A4A] text-white font-bold shadow-xs'
                : 'text-[#E8F0F7]/50 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>SOLO MODE</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playIceShatter();
              setMode('squad');
            }}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'squad'
                ? 'bg-[#1B2A4A] text-[#7FB3D5] font-bold shadow-xs'
                : 'text-[#E8F0F7]/50 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>SQUAD MODE (5)</span>
          </button>
        </div>
      </div>

      {mode === 'solo' ? (
        /* SOLO MODE VIEW */
        <div className="frost-card rounded-lg p-8 sm:p-12 border border-[#7FB3D5]/25 text-center space-y-6 relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-[#1B2A4A]/40 border border-[#7FB3D5]/30 flex items-center justify-center mx-auto text-[#7FB3D5]">
            <User className="w-10 h-10" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <span className="font-mono-stat text-xs uppercase tracking-widest text-[#7FB3D5]">
              SOLITARY PROTOCOL ACTIVE
            </span>
            <h3 className="font-condensed text-3xl sm:text-4xl text-[#E8F0F7] tracking-wider uppercase">
              Just You Vs. The Calendar
            </h3>
            <p className="text-sm text-[#7FB3D5]/80 font-mono-stat leading-relaxed">
              No audience to validate you. No applause. No excuses. If you break, only you and the cold will know. The purest form of iron discipline.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="p-4 bg-[#0A0E1A]/80 border border-[#7FB3D5]/20 rounded min-w-[160px]">
              <span className="text-[10px] font-mono-stat text-[#7FB3D5]/70 uppercase block">
                Your Streak
              </span>
              <span className="text-2xl font-mono-stat font-bold text-white">
                {currentStreak} DAYS
              </span>
            </div>
            <div className="p-4 bg-[#0A0E1A]/80 border border-[#7FB3D5]/20 rounded min-w-[160px]">
              <span className="text-[10px] font-mono-stat text-[#7FB3D5]/70 uppercase block">
                Fortress Health
              </span>
              <span className="text-2xl font-mono-stat font-bold text-[#7FB3D5]">
                {fortressIntegrity}%
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                soundEngine.playIceShatter();
                setMode('squad');
              }}
              className="text-xs font-condensed tracking-wider uppercase text-[#7FB3D5] hover:text-white underline cursor-pointer"
            >
              Need mutual accountability? Switch to Squad Mode (Up to 5)
            </button>
          </div>
        </div>
      ) : (
        /* SQUAD MODE VIEW */
        <div className="space-y-6">
          {/* Squad Header Bar */}
          <div className="frost-card rounded-lg p-5 border border-[#7FB3D5]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono-stat text-xs text-[#7FB3D5] uppercase tracking-wider">
                  SQUAD ROOM // CODE: {squad.code}
                </span>
              </div>
              <h3 className="font-condensed text-2xl text-white tracking-wider uppercase">
                {squad.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyInvite}
                className="px-3.5 py-2 bg-[#1B2A4A] hover:bg-[#7FB3D5] hover:text-[#0A0E1A] text-[#E8F0F7] rounded border border-[#7FB3D5]/30 text-xs font-mono-stat uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'COPIED TO CLIPBOARD' : 'INVITE COMRADE'}</span>
              </button>

              {updatedMembers.length < 5 && (
                <button
                  type="button"
                  onClick={() => setShowAddComrade(!showAddComrade)}
                  className="px-3.5 py-2 bg-[#7FB3D5] hover:bg-[#E8F0F7] text-[#0A0E1A] font-bold rounded text-xs font-condensed uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD MEMBER</span>
                </button>
              )}
            </div>
          </div>

          {/* Add Comrade form drawer */}
          {showAddComrade && (
            <form
              onSubmit={handleAddMember}
              className="p-4 bg-[#0A0E1A]/90 border border-[#7FB3D5]/40 rounded-lg flex flex-col sm:flex-row gap-3 items-center"
            >
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value.toUpperCase())}
                placeholder="ENTER COMRADE CALLSIGN (E.G. TITAN, VALKYRIE)"
                className="flex-1 bg-[#1B2A4A]/30 border border-[#7FB3D5]/30 rounded px-3 py-2 text-xs font-mono-stat text-white focus:outline-none focus:border-[#7FB3D5]"
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowAddComrade(false)}
                  className="px-3 py-2 text-xs text-[#E8F0F7]/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7FB3D5] text-[#0A0E1A] font-bold text-xs uppercase font-condensed tracking-wider rounded"
                >
                  Induct Into Arc
                </button>
              </div>
            </form>
          )}

          {/* Danger Beacon Alert if someone is slacking */}
          {anyMemberInDanger && (
            <div className="frost-card-alert rounded-lg p-4 border border-[#FF4D4D]/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-[#FF4D4D] animate-pulse shrink-0" />
                <div>
                  <div className="font-condensed text-base text-[#FF4D4D] tracking-wider uppercase font-bold">
                    CRITICAL SQUAD S.O.S. // CHAIN INTEGRITY BREACHED
                  </div>
                  <p className="text-xs text-[#E8F0F7]/80 font-mono-stat">
                    A comrade is slipping. Sound the war horn to summon them back to the iron standard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Squad Member Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {updatedMembers.map((member) => {
              const avatarObj = PRESET_AVATARS.find((a) => a.id === member.avatar);
              const isPinged = pingedMemberId === member.id;

              return (
                <div
                  key={member.id}
                  className={`rounded-lg border p-5 transition-all relative overflow-hidden ${
                    member.isCurrentUser
                      ? 'bg-[#1B2A4A]/40 border-[#7FB3D5]/50 shadow-md shadow-[#7FB3D5]/10'
                      : member.todayStatus === 'danger'
                      ? 'frost-card-alert'
                      : 'bg-[#0A0E1A]/70 border-[#7FB3D5]/20 hover:border-[#7FB3D5]/40'
                  }`}
                >
                  {/* Ping shockwave */}
                  {isPinged && (
                    <div className="absolute inset-0 bg-[#FF4D4D]/20 animate-pulse pointer-events-none flex items-center justify-center font-condensed text-lg text-white font-bold">
                      WAR HORN SOUNDED!
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-[#0A0E1A] border border-[#7FB3D5]/30 flex items-center justify-center text-2xl shrink-0">
                        {avatarObj?.symbol || '🐺'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-condensed text-lg text-white tracking-wider uppercase font-bold truncate max-w-[150px]">
                            {member.name}
                          </span>
                          {member.isCurrentUser && (
                            <span className="text-[9px] font-mono-stat px-1.5 py-0.5 rounded bg-[#7FB3D5] text-[#0A0E1A] font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono-stat text-[#7FB3D5]/70 block">
                          {member.lastActive}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill-free badge */}
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-mono-stat uppercase px-2 py-0.5 rounded border ${
                          member.todayStatus === 'completed'
                            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                            : member.todayStatus === 'danger'
                            ? 'bg-rose-950/80 border-rose-500/50 text-[#FF4D4D] animate-pulse'
                            : 'bg-[#1B2A4A] border-[#7FB3D5]/30 text-[#7FB3D5]'
                        }`}
                      >
                        {member.todayStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Vow completion bar */}
                  <div className="mt-4 pt-3 border-t border-[#7FB3D5]/15 space-y-2">
                    <div className="flex justify-between text-xs font-mono-stat">
                      <span className="text-[#7FB3D5]/70">Today's Vows</span>
                      <span className="text-white font-bold">
                        {member.todayCompletedCount} / {member.todayTotalVows} FORGED
                      </span>
                    </div>

                    <div className="h-2 bg-[#0A0E1A] rounded overflow-hidden border border-[#7FB3D5]/20">
                      <div
                        className={`h-full transition-all duration-500 ${
                          member.todayCompletedCount >= member.todayTotalVows
                            ? 'bg-[#7FB3D5]'
                            : 'bg-[#1B2A4A]'
                        }`}
                        style={{
                          width: `${(member.todayCompletedCount / Math.max(1, member.todayTotalVows)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Streak & Fortress Stats */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono-stat">
                    <div className="p-2 bg-[#0A0E1A]/80 rounded border border-[#7FB3D5]/10">
                      <span className="text-[10px] text-[#7FB3D5]/60 uppercase block">Streak</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#FF4D4D]" />
                        {member.currentStreak} Days
                      </span>
                    </div>
                    <div className="p-2 bg-[#0A0E1A]/80 rounded border border-[#7FB3D5]/10">
                      <span className="text-[10px] text-[#7FB3D5]/60 uppercase block">Fortress</span>
                      <span className="text-sm font-bold text-[#7FB3D5]">
                        {member.fortressIntegrity}%
                      </span>
                    </div>
                  </div>

                  {/* War horn accountability button */}
                  {!member.isCurrentUser && (
                    <div className="mt-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSendWarHorn(member)}
                        className="w-full py-1.5 px-3 bg-[#0A0E1A] hover:bg-[#1B2A4A] border border-[#7FB3D5]/20 hover:border-[#7FB3D5]/60 rounded text-[11px] font-mono-stat text-[#7FB3D5] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Bell className="w-3 h-3 text-[#FF4D4D]" />
                        <span>Sound War Horn (Alert Comrade)</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Squad Live Log */}
          <div className="p-4 bg-[#0A0E1A]/80 border border-[#7FB3D5]/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-xs font-condensed tracking-wider uppercase text-[#7FB3D5]">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#FF4D4D]" />
              <span>Squad Radio & Breach Log</span>
            </div>
            <div className="space-y-1.5 font-mono-stat text-[11px] text-[#E8F0F7]/70">
              <div className="flex items-center justify-between">
                <span>[21:14] GHOST-7 locked in Day 21 proof of work. Fortress intact.</span>
                <span className="text-[#7FB3D5]/50">14m ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[19:40] IRON_CLAD completed all 4 daily vows.</span>
                <span className="text-[#7FB3D5]/50">1h ago</span>
              </div>
              <div className="flex items-center justify-between text-amber-300">
                <span>[17:05] BERSERKER flagged 5-min minimum protocol for deep work.</span>
                <span className="text-[#7FB3D5]/50">4h ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
