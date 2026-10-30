import { CheckinRecord, IntensityLevel } from '../types';

export type CapacityLevelKey = 'sangat_aman' | 'aman' | 'sedang' | 'tipis' | 'sangat_tipis';

export interface CapacityEvaluation {
  score: number;
  level: CapacityLevelKey;
  title: string;
  dots: number; // 1 to 5 dots
  dotColor: string;
  advice: string;
}

/**
 * Bobot Skor Intensitas Stres:
 * - Ringan: 12.5 (stres ringan, kapasitas prima)
 * - Sedang: 25.0 (stres sedang, kapasitas mulai berkurang)
 * - Kuat:   50.0 (stres berat, kapasitas terkuras)
 */
export const INTENSITY_WEIGHTS: Record<IntensityLevel, number> = {
  ringan: 12.5,
  sedang: 25.0,
  kuat: 50.0,
};

/**
 * Mengonversi skor numerik rata-rata (0-50) ke evaluasi tingkatan kapasitas emosi:
 * - Skor <= 15: Sangat Aman (5 titik terisi)
 * - Skor 15.1 - 22: Aman (4 titik terisi)
 * - Skor 22.1 - 32: Sedang (3 titik terisi)
 * - Skor 32.1 - 42: Cukup Tipis (2 titik terisi)
 * - Skor > 42 - 50: Sangat Tipis (1 titik terisi)
 */
export function evaluateScoreToCapacity(score: number): CapacityEvaluation {
  if (score <= 15) {
    return {
      score,
      level: 'sangat_aman',
      title: 'Sangat Aman',
      dots: 5,
      dotColor: '#355E3B',
      advice: 'Kapasitas emosimu sangat prima. Energi dan kesabaranmu melimpah hari ini.',
    };
  }

  if (score <= 22) {
    return {
      score,
      level: 'aman',
      title: 'Aman',
      dots: 4,
      dotColor: '#4A7C59',
      advice: 'Kapasitasmu masih stabil dan terjaga baik untuk beraktivitas.',
    };
  }

  if (score <= 32) {
    return {
      score,
      level: 'sedang',
      title: 'Sedang',
      dots: 3,
      dotColor: '#DEB352',
      advice: 'Kapasitasmu mulai berkurang. Beri jeda 2 menit sebelum mengambil keputusan.',
    };
  }

  if (score <= 42) {
    return {
      score,
      level: 'tipis',
      title: 'Cukup tipis',
      dots: 2,
      dotColor: '#E07A5F',
      advice: 'Hari ini, kurangi tuntutan kecil. Jeda sebelum merespons.',
    };
  }

  return {
    score,
    level: 'sangat_tipis',
    title: 'Sangat tipis',
    dots: 1,
    dotColor: '#CF7356',
    advice: 'Hari ini, kurangi tuntutan kecil. Jeda sebelum menjawab anak.',
  };
}

/**
 * Menghitung rata-rata skor beban intensitas seluruh check-in hari ini
 * dan memetakannya ke 5 tingkatan kapasitas emosi (Sangat Aman, Aman, Sedang, Tipis, Sangat Tipis).
 */
export function calculateEmotionalCapacity(todayRecords: CheckinRecord[]): CapacityEvaluation {
  if (todayRecords.length === 0) {
    return {
      score: 0,
      level: 'sangat_aman',
      title: 'Belum Check-in',
      dots: 5,
      dotColor: '#355E3B',
      advice: 'Mari luangkan 1 menit untuk mengenali kondisi tubuhmu.',
    };
  }

  // 1. Jumlahkan seluruh bobot intensitas lalu bagi dengan jumlah check-in (average)
  const totalWeight = todayRecords.reduce(
    (sum, r) => sum + (INTENSITY_WEIGHTS[r.intensity] || 25),
    0
  );
  const averageScore = totalWeight / todayRecords.length;

  return evaluateScoreToCapacity(averageScore);
}
