import { create } from 'zustand';
import {
  SessionRecord,
  CalendarDayStatus,
  TriggerStat,
  CapacityTrendPoint,
  WeeklyInsightSummary,
} from '../types';
import { storage } from '../utils/mmkv';
import {
  computeCalendarDays,
  computeTopTriggers,
  computeCapacityTrend,
  generateWeeklyInsight,
} from '../utils/analytics';
import { getTodayIsoString, formatTime } from '../utils/date';

interface AnalyticsState {
  sessions: SessionRecord[];
  addSessionRecord: (record: Omit<SessionRecord, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;

  // Selectors
  getCalendarDays: (year: number, monthZeroIndexed: number) => CalendarDayStatus[];
  getTopTriggers: () => TriggerStat[];
  getCapacityTrend: () => CapacityTrendPoint[];
  getWeeklyInsight: () => WeeklyInsightSummary;
}

const STORAGE_KEYS = {
  SESSIONS: 'jeda_analytics_sessions',
  IS_CLEARED: 'jeda_analytics_sessions_cleared',
};

function loadSessions(): SessionRecord[] {
  const isCleared = storage.getBoolean(STORAGE_KEYS.IS_CLEARED) ?? false;
  if (isCleared) {
    return [];
  }

  const json = storage.getString(STORAGE_KEYS.SESSIONS);
  if (!json) {
    // Generate initial sample seed history for demonstration so analytics is never empty
    const today = getTodayIsoString();
    return [
      {
        id: 'seed_1',
        date: today,
        time: '14:30',
        timestamp: Date.now() - 3600000,
        techniqueId: 'physiological_sigh',
        bodySignal: 'jantung_berdebar',
        intensity: 'sedang',
        trigger: 'Beban pekerjaan menumpuk',
        durationSeconds: 120,
        completedFully: true,
      },
      {
        id: 'seed_2',
        date: today,
        time: '10:15',
        timestamp: Date.now() - 18000000,
        techniqueId: 'grounding',
        bodySignal: 'pikiran_penuh',
        intensity: 'ringan',
        trigger: 'Overthinking masa depan',
        durationSeconds: 180,
        completedFully: true,
      },
    ];
  }
  try {
    return JSON.parse(json) as SessionRecord[];
  } catch {
    return [];
  }
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  sessions: loadSessions(),

  addSessionRecord: (recordData) => {
    const newRecord: SessionRecord = {
      ...recordData,
      id: 'sess_' + Date.now(),
      timestamp: Date.now(),
    };

    const updated = [newRecord, ...get().sessions];
    storage.delete(STORAGE_KEYS.IS_CLEARED);
    storage.set(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    set({ sessions: updated });
  },

  clearHistory: () => {
    storage.set(STORAGE_KEYS.IS_CLEARED, true);
    storage.delete(STORAGE_KEYS.SESSIONS);
    set({ sessions: [] });
  },

  getCalendarDays: (year, monthZeroIndexed) => {
    return computeCalendarDays(get().sessions, year, monthZeroIndexed);
  },

  getTopTriggers: () => {
    return computeTopTriggers(get().sessions);
  },

  getCapacityTrend: () => {
    return computeCapacityTrend(get().sessions);
  },

  getWeeklyInsight: () => {
    return generateWeeklyInsight(get().sessions);
  },
}));
