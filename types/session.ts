import { TechniqueId, BodySignalKey } from './technique';
import { IntensityLevel } from './checkin';

export type SessionPhase = 'A' | 'B' | 'C';

export interface ActiveSession {
  techniqueId: TechniqueId;
  currentPhase: SessionPhase;
  phaseTimer: number;           // Detik tersisa di fase aktif
  currentCycle: number;         // Siklus napas atau loop grounding
  totalCycles: number;          // Target total siklus
  isActive: boolean;            // true saat berjalan, false saat paused/background
  isCompleted: boolean;         // true saat fase C selesai
  origin: 'checkin' | 'library' | 'sos'; // Dari mana user masuk ke sesi
  bodySignal?: BodySignalKey;
  intensity?: IntensityLevel;
  startedAt: number;
}
