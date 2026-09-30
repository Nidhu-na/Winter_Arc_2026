import { ArcProfile, DayLog, SquadRoom, Vow } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'winter_arc_profile_v1',
  DAY_LOGS: 'winter_arc_day_logs_v1',
  SQUAD: 'winter_arc_squad_v1',
};

export const PRESET_VOWS: Vow[] = [
  {
    id: 'gym',
    name: 'Heavy Iron / 1hr Gym',
    description: 'Relentless physical exertion. No skipping sets, no half-reps.',
    fallback5Min: '100 push-ups & 100 bodyweight squats in 5 mins flat.',
    category: 'body',
    iconName: 'Dumbbell'
  },
  {
    id: 'wake_early',
    name: '05:00 AM Cold Wake',
    description: 'Feet on the floor before the sun. Zero snooze button excuses.',
    fallback5Min: 'Zero snooze. Immediately jump out of bed and drink 500ml ice water.',
    category: 'grit',
    iconName: 'AlarmClock'
  },
  {
    id: 'no_sugar',
    name: 'Zero Added Sugar & Clean Fuel',
    description: 'No junk, no processed poisons, pure metabolic clarity.',
    fallback5Min: 'Log everything consumed today; zero processed snacks or soda.',
    category: 'restraint',
    iconName: 'ShieldAlert'
  },
  {
    id: 'deep_work',
    name: '2 Hours Deep Work (Off-Grid)',
    description: 'Phones locked away. Deep flow state on your highest leverage pursuit.',
    fallback5Min: '25-minute Pomodoro sprint with zero browser tabs or notifications.',
    category: 'focus',
    iconName: 'Flame'
  },
  {
    id: 'cold_shower',
    name: 'Cold Shower (3 Minutes)',
    description: 'Turn the knob fully cold. Control your breathing. Slay the comfort demon.',
    fallback5Min: '60 seconds of pure freezing cold water at the end of shower.',
    category: 'grit',
    iconName: 'Snowflake'
  },
  {
    id: 'reading',
    name: 'Read 20 Pages Non-Fiction',
    description: 'Philosophy, warfare, skill mastery, or engineering. No pulp fiction.',
    fallback5Min: '5 pages of intensive reading with 1 takeaway written down.',
    category: 'mind',
    iconName: 'BookOpen'
  },
  {
    id: 'no_social',
    name: 'Zero Mindless Scrolling',
    description: 'Delete social media apps or lock them to 0 mins. Protect your attention.',
    fallback5Min: 'Immediate app timer lockdown; zero algorithmic feeds for the day.',
    category: 'restraint',
    iconName: 'EyeOff'
  },
  {
    id: 'steps',
    name: '10,000 Steps in the Cold',
    description: 'Get outside. Breathe the freezing air. Move your frame.',
    fallback5Min: '15-minute brisk walk outside regardless of weather conditions.',
    category: 'body',
    iconName: 'Footprints'
  }
];

export const PRESET_AVATARS = [
  { id: 'wolf', name: 'Dire Wolf', symbol: '🐺', tag: 'Lone Hunter' },
  { id: 'ice_skull', name: 'Iron Frost', symbol: '💀', tag: 'Unforgiving' },
  { id: 'mountain', name: 'Peak', symbol: '⛰️', tag: 'Immovable' },
  { id: 'falcon', name: 'Cold Falcon', symbol: '🦅', tag: 'Apex Vision' },
  { id: 'sword', name: 'Katana of Will', symbol: '⚔️', tag: 'Bushido' },
  { id: 'ember', name: 'Dark Ember', symbol: '🔥', tag: 'Inner Flame' },
];

export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getDefaultStartDate(): string {
  // If today is within or near Winter, start today; otherwise Dec 1st
  const today = new Date();
  const y = today.getFullYear();
  const dec1 = new Date(y, 11, 1);
  if (today >= dec1) {
    return dec1.toISOString().split('T')[0];
  }
  return today.toISOString().split('T')[0];
}

export function getDefaultEndDate(startDateStr: string, days: number = 90): string {
  const start = new Date(startDateStr);
  const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
  return end.toISOString().split('T')[0];
}

export function calculateCurrentDayNumber(startDateStr: string, totalDays: number = 90): number {
  const start = new Date(startDateStr);
  const today = new Date();
  // Strip time components
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.floor((todayUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(totalDays, diffDays));
}

export function getDateForDayNumber(startDateStr: string, dayNumber: number): string {
  const start = new Date(startDateStr);
  const target = new Date(start.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000);
  return target.toISOString().split('T')[0];
}

export function getInitialProfile(): ArcProfile {
  const startDate = getDefaultStartDate();
  const endDate = getDefaultEndDate(startDate, 90);
  return {
    name: 'IRON NOMAD',
    avatar: 'wolf',
    difficulty: 'Standard 90-Day Arc',
    startDate,
    endDate,
    totalDays: 90,
    vows: [PRESET_VOWS[0], PRESET_VOWS[1], PRESET_VOWS[2], PRESET_VOWS[3]],
    graceTokensAvailable: 1, // 1 token per month
    graceTokensTotalEarned: 1,
    soundEnabled: true,
    isOnboarded: false,
    ambientSnowEnabled: true
  };
}

export function loadProfile(): ArcProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return getInitialProfile();
    const parsed = JSON.parse(raw);
    return { ...getInitialProfile(), ...parsed };
  } catch {
    return getInitialProfile();
  }
}

export function saveProfile(profile: ArcProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function loadDayLogs(profile: ArcProfile): Record<number, DayLog> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAY_LOGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load day logs', e);
  }

  // Create empty 90 days scaffold
  const initialLogs: Record<number, DayLog> = {};
  for (let i = 1; i <= profile.totalDays; i++) {
    initialLogs[i] = {
      date: getDateForDayNumber(profile.startDate, i),
      dayNumber: i,
      completedVowIds: [],
      fallbackVowIds: [],
      status: 'pending',
      graceUsed: false,
    };
  }
  return initialLogs;
}

export function saveDayLogs(logs: Record<number, DayLog>): void {
  localStorage.setItem(STORAGE_KEYS.DAY_LOGS, JSON.stringify(logs));
}

export interface ArcStats {
  currentStreak: number;
  longestStreak: number;
  completedDaysCount: number;
  fallbackDaysCount: number;
  graceDaysCount: number;
  brokenDaysCount: number;
  fortressIntegrity: number; // 0 - 100
  vowCompletionRates: Record<string, number>; // vowId -> %
  totalPossibleVows: number;
  totalVowsCompleted: number;
}

export function calculateArcStats(
  logs: Record<number, DayLog>,
  profile: ArcProfile,
  currentDay: number
): ArcStats {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let completedDaysCount = 0;
  let fallbackDaysCount = 0;
  let graceDaysCount = 0;
  let brokenDaysCount = 0;

  const vowSuccessCount: Record<string, number> = {};
  profile.vows.forEach(v => {
    vowSuccessCount[v.id] = 0;
  });

  let totalVowsCompleted = 0;

  // We evaluate days up to currentDay
  for (let day = 1; day <= currentDay; day++) {
    const log = logs[day];
    if (!log) continue;

    // Check vow completions
    log.completedVowIds.forEach(id => {
      vowSuccessCount[id] = (vowSuccessCount[id] || 0) + 1;
      totalVowsCompleted++;
    });

    const isDayFull = log.status === 'full' || (log.completedVowIds.length >= profile.vows.length && profile.vows.length > 0);
    const isFallback = log.status === 'fallback';
    const isGrace = log.status === 'grace_protected' || log.graceUsed;
    const isBroken = log.status === 'broken';

    if (isDayFull) {
      completedDaysCount++;
      tempStreak++;
    } else if (isFallback) {
      fallbackDaysCount++;
      tempStreak++; // Fallback protects streak
    } else if (isGrace) {
      graceDaysCount++;
      tempStreak++; // Grace token protects streak
    } else if (isBroken) {
      brokenDaysCount++;
      tempStreak = 0;
    } else {
      // Pending
      if (day < currentDay) {
        // Past day uncompleted = broken
        brokenDaysCount++;
        tempStreak = 0;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  currentStreak = tempStreak;

  // Calculate fortress integrity
  // Starts at 100. Each broken day takes 8%. Fallbacks take 1%. Max 100, min 5.
  const pastDaysEvaluated = Math.max(1, currentDay - 1);
  const damage = (brokenDaysCount * 9) + (fallbackDaysCount * 1.5);
  const fortressIntegrity = Math.max(10, Math.min(100, Math.round(100 - damage)));

  const vowCompletionRates: Record<string, number> = {};
  profile.vows.forEach(v => {
    vowCompletionRates[v.id] = pastDaysEvaluated > 0
      ? Math.round((vowSuccessCount[v.id] / pastDaysEvaluated) * 100)
      : 0;
  });

  return {
    currentStreak,
    longestStreak,
    completedDaysCount,
    fallbackDaysCount,
    graceDaysCount,
    brokenDaysCount,
    fortressIntegrity,
    vowCompletionRates,
    totalPossibleVows: pastDaysEvaluated * profile.vows.length,
    totalVowsCompleted
  };
}

export function getInitialSquad(): SquadRoom {
  return {
    code: 'FROST-90',
    name: 'VALHALLA PROTOCOL',
    createdAt: new Date().toISOString(),
    members: [
      {
        id: 'me',
        name: 'You (Nomad)',
        avatar: 'wolf',
        currentStreak: 12,
        fortressIntegrity: 98,
        todayCompletedCount: 3,
        todayTotalVows: 4,
        todayStatus: 'in_progress',
        lastActive: 'Just now',
        isCurrentUser: true,
      },
      {
        id: 'member_1',
        name: 'GHOST-7',
        avatar: 'falcon',
        currentStreak: 21,
        fortressIntegrity: 100,
        todayCompletedCount: 4,
        todayTotalVows: 4,
        todayStatus: 'completed',
        lastActive: '12m ago',
      },
      {
        id: 'member_2',
        name: 'IRON_CLAD',
        avatar: 'sword',
        currentStreak: 19,
        fortressIntegrity: 92,
        todayCompletedCount: 4,
        todayTotalVows: 4,
        todayStatus: 'completed',
        lastActive: '1h ago',
      },
      {
        id: 'member_3',
        name: 'BERSERKER',
        avatar: 'ice_skull',
        currentStreak: 4,
        fortressIntegrity: 74,
        todayCompletedCount: 1,
        todayTotalVows: 5,
        todayStatus: 'danger',
        lastActive: '5h ago',
      },
      {
        id: 'member_4',
        name: 'NORDIC_WILL',
        avatar: 'mountain',
        currentStreak: 27,
        fortressIntegrity: 100,
        todayCompletedCount: 5,
        todayTotalVows: 5,
        todayStatus: 'completed',
        lastActive: '2h ago',
      },
    ]
  };
}

export function loadSquad(): SquadRoom {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SQUAD);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load squad', e);
  }
  return getInitialSquad();
}

export function saveSquad(squad: SquadRoom): void {
  localStorage.setItem(STORAGE_KEYS.SQUAD, JSON.stringify(squad));
}

// Generate demo/sample past days for instant visualization if user wants to seed their progress
export function seedSampleProgress(profile: ArcProfile, daysToSimulate: number = 18): Record<number, DayLog> {
  const logs: Record<number, DayLog> = {};
  for (let i = 1; i <= profile.totalDays; i++) {
    const date = getDateForDayNumber(profile.startDate, i);
    if (i < daysToSimulate) {
      // Completed day with high discipline
      const isFallback = i === 7;
      const isGrace = i === 13;
      logs[i] = {
        date,
        dayNumber: i,
        completedVowIds: isFallback ? profile.vows.slice(0, 2).map(v => v.id) : profile.vows.map(v => v.id),
        fallbackVowIds: isFallback ? profile.vows.slice(2).map(v => v.id) : [],
        status: isGrace ? 'grace_protected' : (isFallback ? 'fallback' : 'full'),
        graceUsed: isGrace,
        proofOfWork: {
          content: `Day ${i} conquered. Sprinted through freezing headwinds, locked away excuses.`,
          timestamp: '21:30',
          tags: ['No Excuses', 'Iron Focus']
        }
      };
    } else if (i === daysToSimulate) {
      // Today in progress
      logs[i] = {
        date,
        dayNumber: i,
        completedVowIds: [profile.vows[0]?.id].filter(Boolean),
        fallbackVowIds: [],
        status: 'pending',
        graceUsed: false,
      };
    } else {
      logs[i] = {
        date,
        dayNumber: i,
        completedVowIds: [],
        fallbackVowIds: [],
        status: 'pending',
        graceUsed: false,
      };
    }
  }
  return logs;
}
