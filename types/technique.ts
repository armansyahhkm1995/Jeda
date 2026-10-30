// ─── Technique Types ──────────────────────────────────────────────────────────

export type TechniqueId =
  | 'physiological_sigh'
  | 'box_breathing'
  | 'wall_push'
  | 'body_shaking'
  | 'cold_water_reset'
  | 'grounding'
  | 'halt_check'
  | 'name_it_tame_it'
  | 'foot_press'
  | 'grip_release';

export type PhaseType =
  | 'breathing_metronome'  // SVG kembang-kempis (Physiological Sigh, Box Breathing)
  | 'grounding_timer'      // Auto-timer 5-4-3-2-1 looping
  | 'halt_card'            // HALT card dengan floating letters
  | 'name_it_card'         // Name It card dengan floating emotions
  | 'physical_guide'       // Panduan gerakan fisik (Wall Push, Body Shaking)
  | 'cold_water_guide'     // Panduan cold water reset
  | 'rest';                // Fase istirahat/kesadaran

export type HapticPattern =
  | 'asymmetric'   // Napas ganda — getaran asimetris (inhale-inhale-exhale)
  | 'symmetric'    // Box breathing — getaran simetris (4-4-4-4)
  | 'phase_only'   // Eco mode — getaran hanya saat ganti fase
  | 'none';        // Tidak ada haptic (fase istirahat)

export type EcoFallback =
  | 'simple_timer'       // Teks countdown menggantikan SVG animasi
  | 'text_guide'         // Panduan teks murni
  | 'static_card';       // Kartu statis (tanpa floating animation)

export interface BreathingConfig {
  inhale: number;    // detik
  hold1?: number;    // detik (setelah inhale, opsional)
  exhale: number;    // detik
  hold2?: number;    // detik (setelah exhale, opsional)
  cycles: number;    // jumlah siklus sebelum pindah fase
}

export interface GroundingConfig {
  steps: GroundingStep[];
  loopCount: number; // berapa kali loop sebelum selesai
}

export interface GroundingStep {
  count: number;       // 5, 4, 3, 2, 1
  sense: string;       // "lihat", "sentuh", "dengar", "cium", "rasakan"
  instruction: string; // instruksi lengkap
  durationSeconds: number; // waktu per item sensori
}

export interface TechniquePhase {
  label: string;
  copy: string;        // teks afirmasi/instruksi untuk user
  duration?: number;   // durasi total dalam detik (untuk fase rest/guide)
  type: PhaseType;
  breathingConfig?: BreathingConfig;
  groundingConfig?: GroundingConfig;
  headline?: string;   // Judul besar fase (misal "Dorong tembok sekuat tenaga...")
  subCopy?: string;    // Catatan miring panduan (misal "Tahan dan rasakan kekuatannya.")
  circleLabel?: string; // Teks di dalam lingkaran ilustrasi (misal "DORONG SEKUAT TENAGA")
}

export interface TechniquePhases {
  A: TechniquePhase; // Persiapan
  B: TechniquePhase; // Puncak Aksi
  C: TechniquePhase; // Pelepasan / Sadar
}

export interface Technique {
  id: TechniqueId;
  name: string;
  subtitle: string;           // deskripsi singkat
  description: string;        // deskripsi neurobiologis untuk user
  bodySignalKeys: BodySignalKey[]; // dapat direkomendasikan dari sinyal tubuh ini
  suitableSignals?: string[]; // label sinyal tubuh yang cocok: misal ['Dada sesak', 'Napas pendek', 'Jantung berdebar']
  impact?: 'kuat' | 'sedang' | 'ringan'; // level dampak neurobiologis
  durationLabel?: string;     // label durasi ramah pengguna misal "60 detik"
  iconKey?: 'breath' | 'foot' | 'hand' | 'wall' | 'shake' | 'water' | 'sensory' | 'halt' | 'name';
  recommendedIntensity: Array<'ringan' | 'sedang' | 'kuat'>;
  figmaCardNodeId: string;    // Figma node ID untuk referensi desain
  neuroBio: string;           // penjelasan singkat mengapa teknik ini bekerja
  phases: TechniquePhases;
  hapticPattern: HapticPattern;
  ecoFallback: EcoFallback;
  category: TechniqueCategory;
  durationEstimateMinutes: number; // estimasi durasi total sesi
}

export type TechniqueCategory =
  | 'breathing'    // Teknik pernapasan
  | 'physical'     // Gerakan fisik
  | 'cognitive'    // Kognitif / labeling
  | 'sensory';     // Sensori / grounding

export type BodySignalKey =
  // 6 Sinyal Sistem Saraf Otonom
  | 'hampir_meledak'     // Kondisi 6: Puncak Sistem Simpatik / Amarah Meledak-ledak
  | 'dada_sesak'         // Kondisi 1: Fight or Flight (Hiperarousal)
  | 'rahang_tegang'      // Kondisi 2: Energi Agresi Terjebak (Fight Response)
  | 'pikiran_kalut'      // Kondisi 3: Disosiasi / Badai Pikiran (Cognitive Overload)
  | 'kelelahan_ekstrem'  // Kondisi 4: Kelelahan Tersembunyi (Depleted Capacity)
  | 'emosi_kusut'        // Kondisi 5: Entanglement (Kusut Emosional)
  // Aliases untuk kompatibilitas data lama
  | 'jantung_berdebar'
  | 'otot_kaku'
  | 'pikiran_penuh'
  | 'mudah_tersinggung'
  | 'dada_mengganjal';
