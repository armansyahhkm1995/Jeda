import { BodySignalKey, TechniqueId } from '../types/technique';

export interface BodySignalInfo {
  key: BodySignalKey;
  emoji: string;
  label: string;
  pillLabel: string;
  humanDescription: string;
  condition: string;
  targetNeurobiology: string;
  recommendedTechniques: TechniqueId[];
  primaryTechnique: TechniqueId;
  reason: string;
  iconName: string;
}

export const TANDA_TUBUH_MAPPING: Record<BodySignalKey, BodySignalInfo> = {
  // Kondisi 1: Fight or Flight (Hiperarousal / Sistem Simpatik Aktif)
  dada_sesak: {
    key: 'dada_sesak',
    emoji: '🫁',
    label: 'Dada sesak & jantung bergemuruh',
    pillLabel: 'Dada sesak',
    humanDescription: 'Jantung berdebar sangat cepat / dada bergemuruh, napas pendek, dangkal atau sesak, dada terasa panas atau berat.',
    condition: 'Kondisi 1: Fight or Flight (Hiperarousal / Simpatik Aktif)',
    targetNeurobiology: 'Merangsang saraf vagus (vagus nerve) untuk mengerem detak jantung.',
    recommendedTechniques: ['physiological_sigh', 'box_breathing'],
    primaryTechnique: 'physiological_sigh',
    reason: 'Tarikan napas ganda cepat menurunkan kadar CO2 dan embusan panjang seketika menurunkan detak jantung via saraf vagus.',
    iconName: 'heart-pulse',
  },

  // Kondisi 2: Energi Agresi Terjebak (Fight Response)
  rahang_tegang: {
    key: 'rahang_tegang',
    emoji: '🦷',
    label: 'Rahang tegang & tangan mengepal',
    pillLabel: 'Rahang tegang',
    humanDescription: 'Rahang mengeras / gigi gemeretak, otot bahu, leher, atau tangan menegang kaku, tangan tanpa sadar mengepal atau ada dorongan kuat memukul/melempar.',
    condition: 'Kondisi 2: Energi Agresi Terjebak (Fight Response)',
    targetNeurobiology: 'Menyalurkan (merilis) adrenalin dan kortisol secara fisik hingga tuntas agar otak merasa "pertarungan sudah selesai".',
    recommendedTechniques: ['wall_push', 'body_shaking'],
    primaryTechnique: 'wall_push',
    reason: 'Menyalurkan energi kinetik secara aman ke otot besar (kaki, lengan, dada) tanpa merusak atau melukai.',
    iconName: 'hand-fist',
  },

  // Kondisi 3: Disosiasi / Badai Pikiran (Cognitive Overload)
  pikiran_kalut: {
    key: 'pikiran_kalut',
    emoji: '🌪️',
    label: 'Pikiran kalut & kepala penuh',
    pillLabel: 'Pikiran kalut',
    humanDescription: 'Pikiran berputar liar (overthinking) / membayangkan skenario terburuk beruntun (catastrophizing), mata menatap kosong/linglung, kepala terasa penuh atau berdengung.',
    condition: 'Kondisi 3: Disosiasi / Badai Pikiran (Cognitive Overload)',
    targetNeurobiology: 'Menarik kembali kesadaran dari otak abstrak ke pemrosesan sensori fisik (here and now).',
    recommendedTechniques: ['grounding'],
    primaryTechnique: 'grounding',
    reason: 'Memaksa otak mengalihkan bandwidth kognitif dari pusaran pikiran ke input panca indra nyata 5-4-3-2-1 di sekitarnya.',
    iconName: 'brain',
  },

  // Kondisi 4: Kelelahan Tersembunyi (Depleted Capacity)
  kelelahan_ekstrem: {
    key: 'kelelahan_ekstrem',
    emoji: '🔋',
    label: 'Kelelahan ekstrem & sumbu pendek',
    pillLabel: 'Kelelahan ekstrem',
    humanDescription: 'Sangat mudah tersinggung (irritable) dan sumbu pendek oleh hal kecil, kepala pusing ringan/mata berat/perut perih mual, merasa terkuras habis & ingin menyendiri.',
    condition: 'Kondisi 4: Kelelahan Tersembunyi (Depleted Capacity)',
    targetNeurobiology: 'Evaluasi kognitif untuk memisahkan antara "emosi marah asli" dan "reaksi akibat kelelahan fisik/batin".',
    recommendedTechniques: ['halt_check'],
    primaryTechnique: 'halt_check',
    reason: 'Mengidentifikasi kebutuhan biologis mendasar yang belum terpenuhi: Hungry (Lapar), Angry (Marah laten), Lonely (Butuh didengarkan), atau Tired (Kurang istirahat).',
    iconName: 'battery-low',
  },

  // Kondisi 5: Entanglement (Kusut Emosional)
  emosi_kusut: {
    key: 'emosi_kusut',
    emoji: '🧶',
    label: 'Emosi kusut & tenggorokan mengganjal',
    pillLabel: 'Emosi kusut',
    humanDescription: 'Rasa mengganjal yang kuat di tenggorokan (lump in throat), dada sesak karena ingin menangis namun juga merasa marah, luapan emosi campur aduk tak terjelaskan.',
    condition: 'Kondisi 5: Entanglement (Kusut Emosional)',
    targetNeurobiology: 'Menggeser aktivitas otak dari sistem limbik (pusat rasa) ke korteks prefrontal (pusat bahasa dan rasio).',
    recommendedTechniques: ['name_it_tame_it'],
    primaryTechnique: 'name_it_tame_it',
    reason: 'Memberi nama spesifik pada apa yang dirasakan untuk meredam reaktivitas amigdala dan mengaktifkan korteks prefrontal.',
    iconName: 'message-heart',
  },

  // Kondisi 6: Panic Attack / Amarah Puncak (Puncak Sistem Simpatik)
  hampir_meledak: {
    key: 'hampir_meledak',
    emoji: '🌋',
    label: 'Hampir meledak & amarah memuncak',
    pillLabel: 'Hampir meledak',
    humanDescription: 'Wajah terasa sangat panas/memerah, napas memburu tak terkontrol (hiperventilasi), perasaan mau meledak, berteriak sekencang-kencangnya, atau kehilangan akal.',
    condition: 'Kondisi 6: Panic Attack / Amarah Puncak (Puncak Simpatik)',
    targetNeurobiology: 'Memicu Mammalian Dive Reflex untuk memaksa otak mengirimkan sinyal "rem darurat" ke saraf parasimpatik dan menurunkan detak jantung seketika.',
    recommendedTechniques: ['cold_water_reset', 'physiological_sigh'],
    primaryTechnique: 'cold_water_reset',
    reason: 'Membasuh wajah dengan air es memicu refleks menyelam mamalia yang secara instan menurunkan denyut jantung dan meredam kepanikan ekstrem.',
    iconName: 'flame',
  },

  // Aliases untuk backward-compatibility dengan check-in records lama
  jantung_berdebar: {} as any,
  otot_kaku: {} as any,
  pikiran_penuh: {} as any,
  mudah_tersinggung: {} as any,
  dada_mengganjal: {} as any,
};

// Hubungkan alias ke 6 sinyal utama
TANDA_TUBUH_MAPPING.jantung_berdebar = TANDA_TUBUH_MAPPING.dada_sesak;
TANDA_TUBUH_MAPPING.otot_kaku = TANDA_TUBUH_MAPPING.rahang_tegang;
TANDA_TUBUH_MAPPING.pikiran_penuh = TANDA_TUBUH_MAPPING.pikiran_kalut;
TANDA_TUBUH_MAPPING.mudah_tersinggung = TANDA_TUBUH_MAPPING.kelelahan_ekstrem;
TANDA_TUBUH_MAPPING.dada_mengganjal = TANDA_TUBUH_MAPPING.emosi_kusut;

// 6 Sinyal Standar Berdasarkan Sistem Saraf Otonom (Kondisi 1 s/d 6)
export const SIX_AUTONOMIC_SIGNALS: BodySignalKey[] = [
  'dada_sesak',        // Kondisi 1: Fight or Flight (Hiperarousal / Sistem Simpatik Aktif)
  'rahang_tegang',     // Kondisi 2: Energi Agresi Terjebak (Fight Response)
  'pikiran_kalut',     // Kondisi 3: Disosiasi / Badai Pikiran (Cognitive Overload)
  'kelelahan_ekstrem', // Kondisi 4: Kelelahan Tersembunyi (Depleted Capacity)
  'emosi_kusut',       // Kondisi 5: Entanglement (Kusut Emosional)
  'hampir_meledak',    // Kondisi 6: Panic Attack / Amarah Puncak (Puncak Sistem Simpatik)
];

export const BODY_SIGNAL_LIST: BodySignalInfo[] = SIX_AUTONOMIC_SIGNALS.map(
  (k) => TANDA_TUBUH_MAPPING[k]
);
