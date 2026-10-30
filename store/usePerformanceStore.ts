import { create } from 'zustand';
import { storage } from '../utils/mmkv';

export type PerformanceMode = 'high' | 'eco';

interface PerformanceState {
  performanceMode: PerformanceMode;
  isLowEndDevice: boolean;
  hasSeenEcoPrompt: boolean;
  setPerformanceMode: (mode: PerformanceMode) => void;
  togglePerformanceMode: () => void;
  setIsLowEndDevice: (isLow: boolean) => void;
  markEcoPromptSeen: () => void;
}

const STORAGE_KEYS = {
  PERFORMANCE_MODE: 'jeda_performance_mode',
  HAS_SEEN_ECO_PROMPT: 'jeda_has_seen_eco_prompt',
};

// Initial read from MMKV
const initialMode = (storage.getString(STORAGE_KEYS.PERFORMANCE_MODE) as PerformanceMode) || 'high';
const initialHasSeenPrompt = storage.getBoolean(STORAGE_KEYS.HAS_SEEN_ECO_PROMPT) ?? false;

export const usePerformanceStore = create<PerformanceState>((set) => ({
  performanceMode: initialMode,
  isLowEndDevice: false,
  hasSeenEcoPrompt: initialHasSeenPrompt,

  setPerformanceMode: (mode: PerformanceMode) => {
    storage.set(STORAGE_KEYS.PERFORMANCE_MODE, mode);
    set({ performanceMode: mode });
  },

  togglePerformanceMode: () => {
    set((state) => {
      const nextMode = state.performanceMode === 'high' ? 'eco' : 'high';
      storage.set(STORAGE_KEYS.PERFORMANCE_MODE, nextMode);
      return { performanceMode: nextMode };
    });
  },

  setIsLowEndDevice: (isLow: boolean) => {
    set((state) => {
      // If low-end detected and user hasn't explicitly set high mode before, default to eco
      const savedMode = storage.getString(STORAGE_KEYS.PERFORMANCE_MODE);
      let modeToSet = state.performanceMode;
      if (isLow && !savedMode) {
        modeToSet = 'eco';
        storage.set(STORAGE_KEYS.PERFORMANCE_MODE, 'eco');
      }
      return { isLowEndDevice: isLow, performanceMode: modeToSet };
    });
  },

  markEcoPromptSeen: () => {
    storage.set(STORAGE_KEYS.HAS_SEEN_ECO_PROMPT, true);
    set({ hasSeenEcoPrompt: true });
  },
}));
