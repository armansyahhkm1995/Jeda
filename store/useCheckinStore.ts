import { create } from 'zustand';
import { BodySignalKey, IntensityLevel, CheckinRecord } from '../types';
import { storage } from '../utils/mmkv';
import { getTodayIsoString, formatTime, isToday } from '../utils/date';
import { calculateEmotionalCapacity } from '../utils/emotional-capacity';
import { TANDA_TUBUH_MAPPING } from '../constants/body-signals';
import { usePartnerStore } from './usePartnerStore';

interface CheckinState {
  lastCheckinDate: string | null;
  todaySignal: BodySignalKey | null;
  todayIntensity: IntensityLevel | null;
  todayTrigger: string;
  isCompletedToday: boolean;
  history: CheckinRecord[];

  // Actions
  setSignal: (signal: BodySignalKey) => void;
  setIntensity: (intensity: IntensityLevel) => void;
  setTrigger: (trigger: string) => void;
  submitCheckin: () => CheckinRecord;
  checkAndResetIfNewDay: () => void;
  clearHistory: () => void;
  getTodayRecords: () => CheckinRecord[];
}

const STORAGE_KEYS = {
  LAST_CHECKIN_DATE: 'jeda_last_checkin_date',
  TODAY_SIGNAL: 'jeda_today_signal',
  TODAY_INTENSITY: 'jeda_today_intensity',
  TODAY_TRIGGER: 'jeda_today_trigger',
  HISTORY: 'jeda_checkin_history',
  IS_CLEARED: 'jeda_checkin_history_cleared',
};

function getInitialSeedHistory(): CheckinRecord[] {
  const today = getTodayIsoString();
  return [
    {
      id: 'chk_today_1',
      date: today,
      time: '19:15',
      bodySignal: 'rahang_tegang',
      intensity: 'sedang',
      trigger: 'Kelelahan Fisik & Kurang Tidur',
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'chk_seed_oct09_1',
      date: '2026-10-09',
      time: '19:15',
      bodySignal: 'rahang_tegang',
      intensity: 'sedang',
      trigger: 'Sensory Overload (Banjir Sensorik)',
      createdAt: 1791550500000,
    },
    {
      id: 'chk_seed_oct09_2',
      date: '2026-10-09',
      time: '21:30',
      bodySignal: 'otot_kaku',
      intensity: 'kuat',
      trigger: 'Kelelahan Fisik & Kurang Tidur',
      createdAt: 1791558600000,
    },
    {
      id: 'chk_seed_oct02',
      date: '2026-10-02',
      time: '14:20',
      bodySignal: 'jantung_berdebar',
      intensity: 'sedang',
      trigger: 'Decision Fatigue (Kelelahan Keputusan)',
      createdAt: 1790940000000,
    },
    {
      id: 'chk_seed_oct05',
      date: '2026-10-05',
      time: '08:45',
      bodySignal: 'mudah_tersinggung',
      intensity: 'ringan',
      trigger: 'Lapar & Dehidrasi',
      createdAt: 1791200000000,
    },
    {
      id: 'chk_seed_oct07',
      date: '2026-10-07',
      time: '18:50',
      bodySignal: 'rahang_tegang',
      intensity: 'kuat',
      trigger: 'Sensory Overload (Banjir Sensorik)',
      createdAt: 1791370000000,
    },
    {
      id: 'chk_seed_oct12',
      date: '2026-10-12',
      time: '10:30',
      bodySignal: 'otot_kaku',
      intensity: 'sedang',
      trigger: 'Badai Pikiran (Overthinking)',
      createdAt: 1791800000000,
    },
    {
      id: 'chk_seed_oct14',
      date: '2026-10-14',
      time: '16:15',
      bodySignal: 'pikiran_penuh',
      intensity: 'kuat',
      trigger: 'Decision Fatigue (Kelelahan Keputusan)',
      createdAt: 1791980000000,
    },
    {
      id: 'chk_seed_oct16',
      date: '2026-10-16',
      time: '19:10',
      bodySignal: 'rahang_tegang',
      intensity: 'kuat',
      trigger: 'Kehilangan Kendali',
      createdAt: 1792150000000,
    },
    {
      id: 'chk_seed_oct19',
      date: '2026-10-19',
      time: '17:40',
      bodySignal: 'hampir_meledak',
      intensity: 'sedang',
      trigger: 'Sensory Overload (Banjir Sensorik)',
      createdAt: 1792410000000,
    },
    {
      id: 'chk_seed_oct21',
      date: '2026-10-21',
      time: '21:00',
      bodySignal: 'kelelahan_ekstrem',
      intensity: 'ringan',
      trigger: 'Kelelahan Fisik & Kurang Tidur',
      createdAt: 1792590000000,
    },
    {
      id: 'chk_seed_oct23',
      date: '2026-10-23',
      time: '18:30',
      bodySignal: 'rahang_tegang',
      intensity: 'kuat',
      trigger: 'Sensory Overload (Banjir Sensorik)',
      createdAt: 1792760000000,
    },
    {
      id: 'chk_seed_oct26',
      date: '2026-10-26',
      time: '19:00',
      bodySignal: 'jantung_berdebar',
      intensity: 'sedang',
      trigger: 'Merasa Tidak Dihargai atau Diabaikan',
      createdAt: 1793020000000,
    },
    {
      id: 'chk_seed_oct28',
      date: '2026-10-28',
      time: '11:15',
      bodySignal: 'dada_sesak',
      intensity: 'ringan',
      trigger: 'Badai Pikiran (Overthinking)',
      createdAt: 1793190000000,
    },
  ];
}

function loadSavedHistory(): CheckinRecord[] {
  const isCleared = storage.getBoolean(STORAGE_KEYS.IS_CLEARED) ?? false;
  if (isCleared) {
    return [];
  }

  const json = storage.getString(STORAGE_KEYS.HISTORY);
  if (!json) {
    const seed = getInitialSeedHistory();
    storage.set(STORAGE_KEYS.HISTORY, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(json) as CheckinRecord[];
    return parsed;
  } catch {
    return [];
  }
}

const savedHistory = loadSavedHistory();
const savedLastDate = storage.getString(STORAGE_KEYS.LAST_CHECKIN_DATE) || null;
const isAlreadyDoneToday = savedHistory.some((r) => isToday(r.date)) || isToday(savedLastDate);

export const useCheckinStore = create<CheckinState>((set, get) => ({
  lastCheckinDate: savedLastDate,
  todaySignal: null,
  todayIntensity: null,
  todayTrigger: '',
  isCompletedToday: isAlreadyDoneToday,
  history: savedHistory,

  setSignal: (signal: BodySignalKey) => {
    set({ todaySignal: signal });
  },

  setIntensity: (intensity: IntensityLevel) => {
    set({ todayIntensity: intensity });
  },

  setTrigger: (trigger: string) => {
    set({ todayTrigger: trigger });
  },

  getTodayRecords: () => {
    const today = getTodayIsoString();
    return get().history.filter((r) => r.date === today);
  },

  submitCheckin: () => {
    const today = getTodayIsoString();
    const time = formatTime();
    const signal = get().todaySignal || 'dada_sesak';
    const intensity = get().todayIntensity || 'sedang';
    const trigger = get().todayTrigger;

    const record: CheckinRecord = {
      id: 'chk_' + Date.now(),
      date: today,
      time,
      bodySignal: signal,
      intensity,
      trigger: trigger.trim().length > 0 ? trigger.trim() : undefined,
      createdAt: Date.now(),
    };

    const newHistory = [record, ...get().history];

    // Persist to MMKV
    storage.delete(STORAGE_KEYS.IS_CLEARED);
    storage.set(STORAGE_KEYS.LAST_CHECKIN_DATE, today);
    storage.set(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
    storage.delete(STORAGE_KEYS.TODAY_SIGNAL);
    storage.delete(STORAGE_KEYS.TODAY_INTENSITY);
    storage.delete(STORAGE_KEYS.TODAY_TRIGGER);

    // Kirim pembaruan status ke pasangan jika akun sudah terhubung
    try {
      const evaluation = calculateEmotionalCapacity([record]);
      const capacityMap: Record<string, string> = {
        aman: 'Aman',
        sangat_aman: 'Sangat Aman',
        sedang: 'Sedang',
        tipis: 'Tipis',
        sangat_tipis: 'Sangat Tipis',
      };
      const capacityLabel = capacityMap[evaluation.level] || 'Sedang';
      const signalLabel = TANDA_TUBUH_MAPPING[signal]?.label || 'Sinyal Tubuh';

      usePartnerStore.getState().updateMyStatusToPartner(capacityLabel, signalLabel);
    } catch (err) {
      console.warn('[PARTNER BROADCAST ERROR]:', err);
    }

    set({
      lastCheckinDate: today,
      isCompletedToday: true,
      todaySignal: null,
      todayIntensity: null,
      todayTrigger: '',
      history: newHistory,
    });

    return record;
  },

  checkAndResetIfNewDay: () => {
    const todayRecords = get().getTodayRecords();
    if (todayRecords.length === 0) {
      set({
        isCompletedToday: false,
        todaySignal: null,
        todayIntensity: null,
        todayTrigger: '',
      });
    } else {
      set({ isCompletedToday: true });
    }
  },

  clearHistory: () => {
    storage.set(STORAGE_KEYS.IS_CLEARED, true);
    storage.delete(STORAGE_KEYS.HISTORY);
    storage.delete(STORAGE_KEYS.LAST_CHECKIN_DATE);
    storage.delete(STORAGE_KEYS.TODAY_SIGNAL);
    storage.delete(STORAGE_KEYS.TODAY_INTENSITY);
    storage.delete(STORAGE_KEYS.TODAY_TRIGGER);
    set({
      lastCheckinDate: null,
      todaySignal: null,
      todayIntensity: null,
      todayTrigger: '',
      isCompletedToday: false,
      history: [],
    });
  },
}));
