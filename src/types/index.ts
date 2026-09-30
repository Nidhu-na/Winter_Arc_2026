export type VowCategory = 'body' | 'mind' | 'focus' | 'restraint' | 'grit';

export interface Vow {
  id: string;
  name: string;
  description: string;
  fallback5Min: string;
  category: VowCategory;
  iconName: string;
}

export type DayStatus = 'full' | 'fallback' | 'grace_protected' | 'broken' | 'pending';

export interface ProofOfWork {
  content: string;
  timestamp: string;
  tags: string[];
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 90
  completedVowIds: string[];
  fallbackVowIds: string[]; // Vows maintained through 5-min minimum
  status: DayStatus;
  graceUsed: boolean;
  proofOfWork?: ProofOfWork;
}

export type ArcDifficulty = 'Standard 90-Day Arc' | 'Nightmare Arc' | 'Permafrost Protocol';

export interface ArcProfile {
  name: string;
  avatar: string; // Sigil ID
  difficulty: ArcDifficulty;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  vows: Vow[];
  graceTokensAvailable: number;
  graceTokensTotalEarned: number;
  soundEnabled: boolean;
  isOnboarded: boolean;
  ambientSnowEnabled: boolean;
}

export interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  currentStreak: number;
  fortressIntegrity: number;
  todayCompletedCount: number;
  todayTotalVows: number;
  todayStatus: 'completed' | 'in_progress' | 'danger' | 'broken';
  lastActive: string;
  isCurrentUser?: boolean;
}

export interface SquadRoom {
  code: string;
  name: string;
  createdAt: string;
  members: SquadMember[];
}

export interface DailyQuote {
  id: number;
  quote: string;
  author: string;
  source: string;
}
