import { TechniqueId, BodySignalKey } from './technique';
import { IntensityLevel } from './checkin';

export interface SessionRecord {
  id: string;
  date: string;               // 'YYYY-MM-DD'
  time: string;               // 'HH:mm'
  timestamp: number;
  techniqueId: TechniqueId;
  bodySignal?: BodySignalKey;
  intensity?: IntensityLevel;
  trigger?: string;
  durationSeconds: number;
  completedFully: boolean;
}

export interface CalendarDayStatus {
  date: string;               // 'YYYY-MM-DD'
  hasCheckin: boolean;        // Dot hijau jika true, merah jika missed (hari lalu)
  sessionCount: number;
  records: SessionRecord[];
}

export interface TriggerStat {
  trigger: string;
  count: number;
  percentage: number;
}

export interface CapacityTrendPoint {
  key: string;
  dayName: string;           // Label pendek untuk X-Axis ('Sen', 'Mgu 1', 'Jan')
  fullDayName: string;       // Label panjang ('Hari Senin', 'Minggu ke-1', 'Bulan Januari')
  label: string;
  fullLabel: string;
  score: number;             // Skala 0 - 50 (bobot kapasitas emosi: ringan=12.5, sedang=25, kuat=50)
  checkinCount: number;
  records: any[];
  evaluation: any;
  ringanCount: number;
  sedangCount: number;
  kuatCount: number;
  date?: string;
  dayLabel?: string;
  totalScore?: number;
}

export interface WeeklyInsightSummary {
  mostFrequentSignal: BodySignalKey | null;
  mostFrequentSignalLabel: string;
  mostFrequentTime: string;   // '14:00' atau 'siang hari'
  thinnestCapacityDay: string; // 'Kamis'
  weekNumber: number;
  insightSentence: string;    // String template literal
  conclusionSentence: string; // String template literal kesimpulan mingguan
}
