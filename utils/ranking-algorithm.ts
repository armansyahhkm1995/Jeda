import { BodySignalKey, CheckinRecord, TechniqueId } from '../types';
import {
  TANDA_TUBUH_MAPPING,
  SIX_AUTONOMIC_SIGNALS,
  BodySignalInfo,
} from '../constants/body-signals';

export interface RankedSignal {
  key: BodySignalKey;
  emoji: string;
  pillLabel: string;
  label: string;
  condition: string;
  targetNeurobiology: string;
  primaryTechnique: TechniqueId;
  strongCount: number;
  totalCount: number;
  lastOccurredAt: number;
  rank: number;
}

// Menormalkan kunci lama ke 6 sinyal utama sistem saraf otonom
export function normalizeSignalKey(key: BodySignalKey): BodySignalKey {
  switch (key) {
    case 'jantung_berdebar':
      return 'dada_sesak';
    case 'otot_kaku':
      return 'rahang_tegang';
    case 'pikiran_penuh':
      return 'pikiran_kalut';
    case 'mudah_tersinggung':
      return 'kelelahan_ekstrem';
    case 'dada_mengganjal':
      return 'emosi_kusut';
    default:
      return key;
  }
}

const DEFAULT_ORDER: BodySignalKey[] = [
  'hampir_meledak',
  'dada_sesak',
  'rahang_tegang',
  'pikiran_kalut',
  'kelelahan_ekstrem',
  'emosi_kusut',
];

/**
 * Algoritma Ranking Non-AI Berbasis Frekuensi Intensitas Kuat (Rolling 7 Hari)
 * Menghitung kemunculan reaksi tubuh pengguna dalam 7 hari terakhir.
 * Urutan teratas adalah sinyal tubuh dengan frekuensi 'kuat' terbanyak.
 */
export function getTop6EmergencySignals(
  history: CheckinRecord[] = [],
  referenceTime: number = Date.now()
): RankedSignal[] {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const cutoffTime = referenceTime - ONE_WEEK_MS;

  // Filter riwayat 7 hari terakhir
  const recentRecords = history.filter((record) => {
    const recordTime = record.createdAt || (record.date ? new Date(record.date).getTime() : 0);
    return recordTime >= cutoffTime;
  });

  // Hitung frekuensi per sinyal
  const statsMap: Record<
    string,
    { strongCount: number; mediumCount: number; lightCount: number; lastOccurredAt: number }
  > = {};

  SIX_AUTONOMIC_SIGNALS.forEach((key) => {
    statsMap[key] = { strongCount: 0, mediumCount: 0, lightCount: 0, lastOccurredAt: 0 };
  });

  recentRecords.forEach((record) => {
    const canonicalKey = normalizeSignalKey(record.bodySignal);
    if (!statsMap[canonicalKey]) {
      statsMap[canonicalKey] = { strongCount: 0, mediumCount: 0, lightCount: 0, lastOccurredAt: 0 };
    }

    const recordTime = record.createdAt || (record.date ? new Date(record.date).getTime() : 0);
    if (recordTime > statsMap[canonicalKey].lastOccurredAt) {
      statsMap[canonicalKey].lastOccurredAt = recordTime;
    }

    if (record.intensity === 'kuat') {
      statsMap[canonicalKey].strongCount += 1;
    } else if (record.intensity === 'sedang') {
      statsMap[canonicalKey].mediumCount += 1;
    } else {
      statsMap[canonicalKey].lightCount += 1;
    }
  });

  // Susun daftar 6 sinyal dengan statistik lengkap
  const rankedList: RankedSignal[] = SIX_AUTONOMIC_SIGNALS.map((key) => {
    const info: BodySignalInfo = TANDA_TUBUH_MAPPING[key];
    const stats = statsMap[key] || { strongCount: 0, mediumCount: 0, lightCount: 0, lastOccurredAt: 0 };
    const totalCount = stats.strongCount + stats.mediumCount + stats.lightCount;

    return {
      key,
      emoji: info.emoji,
      pillLabel: info.pillLabel,
      label: info.label,
      condition: info.condition,
      targetNeurobiology: info.targetNeurobiology,
      primaryTechnique: info.primaryTechnique,
      strongCount: stats.strongCount,
      totalCount,
      lastOccurredAt: stats.lastOccurredAt,
      rank: 0,
    };
  });

  // Aturan Pengurutan Deterministik:
  // 1. Jumlah reaksi dengan intensitas 'kuat' terbanyak dalam 7 hari
  // 2. Jumlah total reaksi dalam 7 hari
  // 3. Waktu terakhir kali dilaporkan (paling baru lebih atas)
  // 4. Default urutan sistematis sistem saraf
  rankedList.sort((a, b) => {
    if (b.strongCount !== a.strongCount) {
      return b.strongCount - a.strongCount;
    }
    if (b.totalCount !== a.totalCount) {
      return b.totalCount - a.totalCount;
    }
    if (b.lastOccurredAt !== a.lastOccurredAt) {
      return b.lastOccurredAt - a.lastOccurredAt;
    }
    return DEFAULT_ORDER.indexOf(a.key) - DEFAULT_ORDER.indexOf(b.key);
  });

  // Tetapkan nomor rank 1 - 6
  return rankedList.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}
