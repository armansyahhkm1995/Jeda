import { BodySignalKey, TechniqueId } from './technique';

export type IntensityLevel = 'ringan' | 'sedang' | 'kuat';

export interface CheckinRecord {
  id: string;
  date: string;               // ISO date string 'YYYY-MM-DD'
  time: string;               // 'HH:mm'
  bodySignal: BodySignalKey;  // Sinyal tubuh yang dirasakan
  intensity: IntensityLevel;  // Ringan / Sedang / Kuat
  trigger?: string;           // Pemicu (opsional, free text)
  recommendedTechniqueId?: TechniqueId;
  completedTechniqueId?: TechniqueId;
  createdAt: number;          // Timestamp epoch ms
}

export interface DailyCheckinState {
  lastCheckinDate: string | null;
  todaySignal: BodySignalKey | null;
  todayIntensity: IntensityLevel | null;
  todayTrigger: string | null;
  isCompletedToday: boolean;
  history: CheckinRecord[];
}
