import { create } from 'zustand';
import { TechniqueId, SessionPhase, BodySignalKey, IntensityLevel } from '../types';
import { TECHNIQUES_MAP } from '../constants/techniques';

interface SessionState {
  techniqueId: TechniqueId | null;
  currentPhase: SessionPhase;
  phaseTimer: number;
  currentCycle: number;
  totalCycles: number;
  isActive: boolean;
  isCompleted: boolean;
  origin: 'checkin' | 'library' | 'sos';
  bodySignal?: BodySignalKey;
  intensity?: IntensityLevel;
  startedAt: number;

  // Actions
  startSession: (
    techniqueId: TechniqueId,
    origin?: 'checkin' | 'library' | 'sos',
    bodySignal?: BodySignalKey,
    intensity?: IntensityLevel
  ) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  tickTimer: () => void;
  advanceCycle: () => void;
  nextPhase: () => void;
  completeSession: () => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  techniqueId: null,
  currentPhase: 'A',
  phaseTimer: 15,
  currentCycle: 1,
  totalCycles: 5,
  isActive: false,
  isCompleted: false,
  origin: 'library',
  startedAt: 0,

  startSession: (techniqueId, origin = 'library', bodySignal, intensity) => {
    const tech = TECHNIQUES_MAP[techniqueId];
    const phaseADuration = tech?.phases.A.duration || 15;
    const cycles = tech?.phases.B.breathingConfig?.cycles || 5;

    set({
      techniqueId,
      currentPhase: 'A',
      phaseTimer: phaseADuration,
      currentCycle: 1,
      totalCycles: cycles,
      isActive: true,
      isCompleted: false,
      origin,
      bodySignal,
      intensity,
      startedAt: Date.now(),
    });
  },

  pauseSession: () => {
    set({ isActive: false });
  },

  resumeSession: () => {
    if (!get().isCompleted) {
      set({ isActive: true });
    }
  },

  tickTimer: () => {
    const state = get();
    if (!state.isActive || state.isCompleted) return;

    if (state.phaseTimer > 1) {
      set({ phaseTimer: state.phaseTimer - 1 });
    } else {
      // Current phase timer reached 0, advance to next phase
      state.nextPhase();
    }
  },

  advanceCycle: () => {
    const { currentCycle, totalCycles } = get();
    if (currentCycle < totalCycles) {
      set({ currentCycle: currentCycle + 1 });
    } else {
      // All cycles completed in phase B, transition to phase C
      get().nextPhase();
    }
  },

  nextPhase: () => {
    const { currentPhase, techniqueId } = get();
    const tech = techniqueId ? TECHNIQUES_MAP[techniqueId] : null;

    if (currentPhase === 'A') {
      // Transition from A to B
      const phaseBDuration = tech?.phases.B.duration || 45;
      set({
        currentPhase: 'B',
        phaseTimer: phaseBDuration,
        currentCycle: 1,
      });
    } else if (currentPhase === 'B') {
      // Transition from B to C
      const phaseCDuration = tech?.phases.C.duration || 15;
      set({
        currentPhase: 'C',
        phaseTimer: phaseCDuration,
      });
    } else if (currentPhase === 'C') {
      // Selesai seluruh sesi
      get().completeSession();
    }
  },

  completeSession: () => {
    set({
      isActive: false,
      isCompleted: true,
      phaseTimer: 0,
    });
  },

  resetSession: () => {
    set({
      techniqueId: null,
      currentPhase: 'A',
      phaseTimer: 15,
      currentCycle: 1,
      isActive: false,
      isCompleted: false,
      startedAt: 0,
    });
  },
}));
