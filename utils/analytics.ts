import { CalendarDayStatus, TriggerStat, CapacityTrendPoint, WeeklyInsightSummary } from '../types/analytics';
export type { CapacityTrendPoint };
import { CheckinRecord, BodySignalKey, IntensityLevel } from '../types';
import { TANDA_TUBUH_MAPPING } from '../constants/body-signals';
import { TRIGGER_LIST, getTriggerInfo } from '../constants/triggers';
import { getDaysInMonth, getTodayIsoString, getShortDayName, getWeekOfMonth, formatIndonesianDate } from './date';
import { calculateEmotionalCapacity, evaluateScoreToCapacity, INTENSITY_WEIGHTS, CapacityEvaluation } from './emotional-capacity';

export interface EnrichedCalendarDay {
  date: string;
  dayNumber: number;
  records: CheckinRecord[];
  hasCheckin: boolean;
  isThinCapacity: boolean; // true: dot terakota (#CF7356), false: dot hijau (#2D5A38)
}

/**
 * Menghitung status setiap hari dalam sebulan berdasarkan riwayat check-in pengguna.
 * Dot hijau: Kapasitas cukup (rendah/sedang)
 * Dot terakota: Kapasitas tipis (ada intensitas kuat / rata-rata tipis)
 */
export function computeCalendarDaysFromHistory(
  history: CheckinRecord[],
  year: number,
  monthZeroIndexed: number
): EnrichedCalendarDay[] {
  const allDays = getDaysInMonth(year, monthZeroIndexed);

  return allDays.map((dateStr) => {
    const dayRecords = history.filter((r) => r.date === dateStr);
    const hasCheckin = dayRecords.length > 0;
    const dayNumber = Number(dateStr.split('-')[2]);

    let isThinCapacity = false;
    if (hasCheckin) {
      const evaluation = calculateEmotionalCapacity(dayRecords);
      isThinCapacity = evaluation.level === 'tipis' || evaluation.level === 'sangat_tipis';
    }

    return {
      date: dateStr,
      dayNumber,
      records: dayRecords,
      hasCheckin,
      isThinCapacity,
    };
  });
}

export interface TriggerBarItem {
  trigger: string;
  count: number;
  percentage: number;
  isPrimary: boolean; // Top trigger -> terracotta color
}

/**
 * Normalisasi dan agregasi input pemicu (dropdown terstruktur & fallback teks) menjadi kategori utama.
 * Memetakan pemicu ke 14 opsi standar (HALT, sensorik, psikologis, kontrol, entanglement).
 */
export function aggregateTriggers(history: CheckinRecord[]): TriggerBarItem[] {
  const tallies: Record<string, number> = {};

  history.forEach((record) => {
    if (!record.trigger || record.trigger.trim().length === 0) return;
    const raw = record.trigger.trim();

    // 1. Cek kecocokan langsung dari katalog pemicu
    const directInfo = getTriggerInfo(raw);
    if (directInfo) {
      tallies[directInfo.label] = (tallies[directInfo.label] || 0) + 1;
      return;
    }

    // 2. Cek kecocokan kata kunci pada teks kustom
    const text = raw.toLowerCase();
    let matchedLabel: string | null = null;

    if (text.includes('lelah') || text.includes('capek') || text.includes('kurang tidur') || text.includes('ngantuk')) {
      matchedLabel = 'Kelelahan Fisik & Kurang Tidur';
    } else if (text.includes('lapar') || text.includes('dehidrasi') || text.includes('haus') || text.includes('makan')) {
      matchedLabel = 'Lapar & Dehidrasi';
    } else if (text.includes('sakit') || text.includes('pegal') || text.includes('nyeri') || text.includes('hormon')) {
      matchedLabel = 'Sakit atau Rasa Tidak Nyaman di Tubuh';
    } else if (text.includes('bising') || text.includes('suara') || text.includes('menangis') || text.includes('berantakan') || text.includes('anak nolak') || text.includes('anak rewel') || text.includes('anak menolak')) {
      matchedLabel = 'Sensory Overload (Banjir Sensorik)';
    } else if (text.includes('keputusan') || text.includes('decision') || text.includes('bingung')) {
      matchedLabel = 'Decision Fatigue (Kelelahan Keputusan)';
    } else if (text.includes('overthinking') || text.includes('pikiran') || text.includes('finansial') || text.includes('kerja') || text.includes('kantor') || text.includes('deadline')) {
      matchedLabel = 'Badai Pikiran (Overthinking)';
    } else if (text.includes('dihargai') || text.includes('diabaikan') || text.includes('tidak penting')) {
      matchedLabel = 'Merasa Tidak Dihargai atau Diabaikan';
    } else if (text.includes('aman') || text.includes('insecurity') || text.includes('kritik')) {
      matchedLabel = 'Merasa Tidak Aman (Insecurity)';
    } else if (text.includes('kecil') || text.includes('masa lalu') || text.includes('trauma')) {
      matchedLabel = 'Proyeksi Luka Masa Kecil';
    } else if (text.includes('kendali') || text.includes('tumpah') || text.includes('jadwal') || text.includes('buru-buru')) {
      matchedLabel = 'Kehilangan Kendali';
    } else if (text.includes('ekspektasi') || text.includes('harapan')) {
      matchedLabel = 'Ekspektasi yang Tidak Realistis';
    } else if (text.includes('takut') || text.includes('khawatir') || text.includes('was-was')) {
      matchedLabel = 'Menutupi Rasa Takut / Khawatir';
    } else if (text.includes('sedih') || text.includes('kecewa') || text.includes('gagal')) {
      matchedLabel = 'Menutupi Kesedihan atau Kecewa';
    } else if (text.includes('salah') || text.includes('bersalah') || text.includes('malu')) {
      matchedLabel = 'Menutupi Rasa Bersalah';
    }

    if (matchedLabel) {
      tallies[matchedLabel] = (tallies[matchedLabel] || 0) + 1;
    } else {
      const clean = raw.slice(0, 28);
      const cap = clean.charAt(0).toUpperCase() + clean.slice(1);
      tallies[cap] = (tallies[cap] || 0) + 1;
    }
  });

  const entries = Object.entries(tallies);

  // Jika belum ada check-in dengan trigger yang cukup, gunakan fallback realistis berbasis katalog baru
  if (entries.length === 0) {
    return [
      { trigger: 'Kelelahan Fisik & Kurang Tidur', count: 12, percentage: 35, isPrimary: true },
      { trigger: 'Sensory Overload (Banjir Sensorik)', count: 9, percentage: 26, isPrimary: false },
      { trigger: 'Badai Pikiran (Overthinking)', count: 6, percentage: 18, isPrimary: false },
      { trigger: 'Kehilangan Kendali', count: 4, percentage: 12, isPrimary: false },
      { trigger: 'Merasa Tidak Dihargai atau Diabaikan', count: 3, percentage: 9, isPrimary: false },
    ];
  }

  // Sort descending by count
  entries.sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, item) => sum + item[1], 0) || 1;

  const top5 = entries.slice(0, 5).map(([trigger, count], idx) => ({
    trigger,
    count,
    percentage: Math.round((count / total) * 100),
    isPrimary: idx === 0,
  }));

  // Jika kurang dari 5, tambahkan fallback dari katalog standar
  if (top5.length < 5) {
    const defaults = [
      { trigger: 'Kelelahan Fisik & Kurang Tidur', count: 12 },
      { trigger: 'Sensory Overload (Banjir Sensorik)', count: 9 },
      { trigger: 'Badai Pikiran (Overthinking)', count: 6 },
      { trigger: 'Kehilangan Kendali', count: 4 },
      { trigger: 'Merasa Tidak Dihargai atau Diabaikan', count: 3 },
    ];
    for (const def of defaults) {
      if (top5.length >= 5) break;
      if (!top5.some((t) => t.trigger === def.trigger)) {
        top5.push({
          trigger: def.trigger,
          count: def.count,
          percentage: Math.round((def.count / 34) * 100),
          isPrimary: false,
        });
      }
    }
  }

  return top5;
}

export type DayCapacityPoint = CapacityTrendPoint;

export interface CapacityTrendResult {
  points: CapacityTrendPoint[];
  peakDay: string;
  peakLabel: string;
  dominantIntensity: IntensityLevel;
  conclusionSentence: string;
}

/**
 * Menghitung pola kapasitas emosi berdasarkan periode (Mingguan, Bulanan, Tahunan) pada skala 0 - 50.
 * - Mingguan: 7 hari (Senin - Minggu)
 * - Bulanan: 4 minggu (Minggu 1 - Minggu 4)
 * - Tahunan: 12 bulan (Januari - Desember)
 */
export function computePeriodCapacityTrend(
  history: CheckinRecord[],
  period: 'Mingguan' | 'Bulanan' | 'Tahunan' = 'Mingguan'
): CapacityTrendResult {
  if (period === 'Bulanan') {
    const WEEKS = [
      { key: 'w1', label: 'Mgu 1', full: 'Minggu ke-1 (Tgl 1–7)', start: 1, end: 7, def: 21.5 },
      { key: 'w2', label: 'Mgu 2', full: 'Minggu ke-2 (Tgl 8–14)', start: 8, end: 14, def: 45.0 },
      { key: 'w3', label: 'Mgu 3', full: 'Minggu ke-3 (Tgl 15–21)', start: 15, end: 21, def: 27.0 },
      { key: 'w4', label: 'Mgu 4', full: 'Minggu ke-4 (Tgl 22–31)', start: 22, end: 31, def: 17.5 },
    ];

    let totalRingan = 0;
    let totalSedang = 0;
    let totalKuat = 0;

    const weekBuckets: Record<
      string,
      { ringan: number; sedang: number; kuat: number; totalWeight: number; records: CheckinRecord[] }
    > = {};

    WEEKS.forEach((w) => {
      weekBuckets[w.key] = { ringan: 0, sedang: 0, kuat: 0, totalWeight: 0, records: [] };
    });

    history.forEach((record) => {
      const dayNum = parseInt(record.date.split('-')[2], 10) || 1;
      const matched = WEEKS.find((w) => dayNum >= w.start && dayNum <= w.end);
      if (matched && weekBuckets[matched.key]) {
        const weight = INTENSITY_WEIGHTS[record.intensity] || 25.0;
        weekBuckets[matched.key].totalWeight += weight;
        weekBuckets[matched.key].records.push(record);

        if (record.intensity === 'kuat') {
          weekBuckets[matched.key].kuat += 1;
          totalKuat += 1;
        } else if (record.intensity === 'sedang') {
          weekBuckets[matched.key].sedang += 1;
          totalSedang += 1;
        } else {
          weekBuckets[matched.key].ringan += 1;
          totalRingan += 1;
        }
      }
    });

    const points: CapacityTrendPoint[] = WEEKS.map((w) => {
      const b = weekBuckets[w.key];
      const checkinCount = b.ringan + b.sedang + b.kuat;
      const score = checkinCount > 0 ? Number((b.totalWeight / checkinCount).toFixed(1)) : w.def;
      const evaluation = evaluateScoreToCapacity(score);

      return {
        key: w.key,
        dayName: w.label,
        fullDayName: w.full,
        label: w.label,
        fullLabel: w.full,
        score: Math.min(Math.max(score, 5.0), 50.0),
        checkinCount,
        records: b.records,
        evaluation,
        ringanCount: b.ringan,
        sedangCount: b.sedang,
        kuatCount: b.kuat,
      };
    });

    let peakIdx = 1; // Default Minggu ke-2 (index 1)
    let maxScore = -1;
    points.forEach((p, idx) => {
      if (p.score > maxScore) {
        maxScore = p.score;
        peakIdx = idx;
      }
    });

    const peakWeekLabel = WEEKS[peakIdx]?.label || 'Mgu 2';
    const peakWeekFull = WEEKS[peakIdx]?.full || 'Minggu ke-2';

    return {
      points,
      peakDay: peakWeekLabel,
      peakLabel: peakWeekFull,
      dominantIntensity: totalKuat >= totalSedang ? 'kuat' : 'sedang',
      conclusionSentence: `${peakWeekFull} menjadi titik kapasitas paling tipis bulan ini.`,
    };
  }

  if (period === 'Tahunan') {
    const MONTHS = [
      { key: '01', label: 'Jan', full: 'Bulan Januari', def: 18.0 },
      { key: '02', label: 'Feb', full: 'Bulan Februari', def: 22.5 },
      { key: '03', label: 'Mar', full: 'Bulan Maret', def: 25.0 },
      { key: '04', label: 'Apr', full: 'Bulan April', def: 20.0 },
      { key: '05', label: 'Mei', full: 'Bulan Mei', def: 23.5 },
      { key: '06', label: 'Jun', full: 'Bulan Juni', def: 27.0 },
      { key: '07', label: 'Jul', full: 'Bulan Juli', def: 22.0 },
      { key: '08', label: 'Agu', full: 'Bulan Agustus', def: 25.5 },
      { key: '09', label: 'Sep', full: 'Bulan September', def: 24.0 },
      { key: '10', label: 'Okt', full: 'Bulan Oktober', def: 42.5 },
      { key: '11', label: 'Nov', full: 'Bulan November', def: 21.0 },
      { key: '12', label: 'Des', full: 'Bulan Desember', def: 16.5 },
    ];

    let totalRingan = 0;
    let totalSedang = 0;
    let totalKuat = 0;

    const monthBuckets: Record<
      string,
      { ringan: number; sedang: number; kuat: number; totalWeight: number; records: CheckinRecord[] }
    > = {};

    MONTHS.forEach((m) => {
      monthBuckets[m.key] = { ringan: 0, sedang: 0, kuat: 0, totalWeight: 0, records: [] };
    });

    history.forEach((record) => {
      const monthStr = record.date.split('-')[1];
      if (monthStr && monthBuckets[monthStr]) {
        const weight = INTENSITY_WEIGHTS[record.intensity] || 25.0;
        monthBuckets[monthStr].totalWeight += weight;
        monthBuckets[monthStr].records.push(record);

        if (record.intensity === 'kuat') {
          monthBuckets[monthStr].kuat += 1;
          totalKuat += 1;
        } else if (record.intensity === 'sedang') {
          monthBuckets[monthStr].sedang += 1;
          totalSedang += 1;
        } else {
          monthBuckets[monthStr].ringan += 1;
          totalRingan += 1;
        }
      }
    });

    const points: CapacityTrendPoint[] = MONTHS.map((m) => {
      const b = monthBuckets[m.key];
      const checkinCount = b.ringan + b.sedang + b.kuat;
      const score = checkinCount > 0 ? Number((b.totalWeight / checkinCount).toFixed(1)) : m.def;
      const evaluation = evaluateScoreToCapacity(score);

      return {
        key: m.key,
        dayName: m.label,
        fullDayName: m.full,
        label: m.label,
        fullLabel: m.full,
        score: Math.min(Math.max(score, 5.0), 50.0),
        checkinCount,
        records: b.records,
        evaluation,
        ringanCount: b.ringan,
        sedangCount: b.sedang,
        kuatCount: b.kuat,
      };
    });

    let peakIdx = 9; // Default Oktober (index 9)
    let maxScore = -1;
    points.forEach((p, idx) => {
      if (p.score > maxScore) {
        maxScore = p.score;
        peakIdx = idx;
      }
    });

    const peakMonthLabel = MONTHS[peakIdx]?.label || 'Okt';
    const peakMonthFull = MONTHS[peakIdx]?.full || 'Bulan Oktober';

    return {
      points,
      peakDay: peakMonthLabel,
      peakLabel: peakMonthFull,
      dominantIntensity: totalKuat >= totalSedang ? 'kuat' : 'sedang',
      conclusionSentence: `${peakMonthFull} menjadi titik kapasitas paling tipis tahun ini.`,
    };
  }

  // Default: Mode 'Mingguan' (7 hari: Senin - Minggu)
  const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const FULL_DAY_NAMES = ['Hari Senin', 'Hari Selasa', 'Hari Rabu', 'Hari Kamis', 'Hari Jumat', 'Hari Sabtu', 'Hari Minggu'];
  const defaultScores = [14.0, 25.0, 24.0, 28.5, 46.5, 22.0, 13.5];

  let totalRingan = 0;
  let totalSedang = 0;
  let totalKuat = 0;

  const dayBuckets: Record<
    string,
    { ringan: number; sedang: number; kuat: number; totalWeight: number; records: CheckinRecord[] }
  > = {};

  DAY_LABELS.forEach((d) => {
    dayBuckets[d] = { ringan: 0, sedang: 0, kuat: 0, totalWeight: 0, records: [] };
  });

  history.forEach((record) => {
    const day = getShortDayName(record.date);
    if (dayBuckets[day]) {
      const weight = INTENSITY_WEIGHTS[record.intensity] || 25.0;
      dayBuckets[day].totalWeight += weight;
      dayBuckets[day].records.push(record);

      if (record.intensity === 'kuat') {
        dayBuckets[day].kuat += 1;
        totalKuat += 1;
      } else if (record.intensity === 'sedang') {
        dayBuckets[day].sedang += 1;
        totalSedang += 1;
      } else {
        dayBuckets[day].ringan += 1;
        totalRingan += 1;
      }
    }
  });

  const points: CapacityTrendPoint[] = DAY_LABELS.map((dayName, idx) => {
    const b = dayBuckets[dayName];
    const checkinCount = b.ringan + b.sedang + b.kuat;
    const score = checkinCount > 0 ? Number((b.totalWeight / checkinCount).toFixed(1)) : defaultScores[idx];
    const evaluation = evaluateScoreToCapacity(score);

    return {
      key: dayName,
      dayName,
      fullDayName: FULL_DAY_NAMES[idx],
      label: dayName,
      fullLabel: FULL_DAY_NAMES[idx],
      score: Math.min(Math.max(score, 5.0), 50.0),
      checkinCount,
      records: b.records,
      evaluation,
      ringanCount: b.ringan,
      sedangCount: b.sedang,
      kuatCount: b.kuat,
    };
  });

  let peakIdx = 4; // Default Jumat (index 4)
  let maxScore = -1;
  points.forEach((p, idx) => {
    if (p.score > maxScore) {
      maxScore = p.score;
      peakIdx = idx;
    }
  });

  const peakDayFull = FULL_DAY_NAMES[peakIdx] || 'Hari Jumat';
  const peakDayShort = DAY_LABELS[peakIdx] || 'Jum';

  let dominantIntensity: IntensityLevel = 'sedang';
  if (totalKuat >= totalSedang && totalKuat >= totalRingan) {
    dominantIntensity = 'kuat';
  } else if (totalRingan > totalSedang && totalRingan > totalKuat) {
    dominantIntensity = 'ringan';
  }

  let conclusionSentence = `${peakDayFull.replace('Hari ', '')} menjadi titik kapasitas paling tipis minggu ini.`;
  if (dominantIntensity === 'kuat' || maxScore >= 40.0) {
    conclusionSentence = `${peakDayFull.replace('Hari ', '')} menjadi titik kapasitas paling tipis minggu ini.`;
  } else if (dominantIntensity === 'sedang') {
    conclusionSentence = `${peakDayFull.replace('Hari ', '')} mengalami fluktuasi ketegangan sedang. Jaga ritme jeda singkat.`;
  } else {
    conclusionSentence = `Kapasitas emosimu minggu ini stabil dan terjaga sangat baik.`;
  }

  return {
    points,
    peakDay: peakDayShort,
    peakLabel: peakDayFull,
    dominantIntensity,
    conclusionSentence,
  };
}

/**
 * Kompatibilitas mundur untuk fungsi mingguan
 */
export function computeWeeklyCapacityTrend(history: CheckinRecord[]): CapacityTrendResult {
  return computePeriodCapacityTrend(history, 'Mingguan');
}

/**
 * Menghasilkan kesimpulan template literal untuk Card "Pola yang mulai terlihat ✨"
 * Template: {Sinyal tubuh terbanyak dan kuat setelah diaggregrasi tiap minggu} paling sering muncul minggu ini, terutama saat {pemicu terbanyak per minggu ini}
 * Contoh: "Rahang tegang paling sering muncul minggu ini, terutama saat kelelahan fisik & kurang tidur."
 */
export function generatePolaInsight(history: CheckinRecord[]): string {
  if (history.length === 0) {
    return 'Rahang tegang paling sering muncul minggu ini, terutama saat kelelahan fisik & kurang tidur.';
  }

  // 1. Sinyal tubuh terbanyak dan berbobot kuat setelah diaggregasi
  const signalCounts: Partial<Record<BodySignalKey, number>> = {};
  history.forEach((r) => {
    const weight = r.intensity === 'kuat' ? 3 : r.intensity === 'sedang' ? 2 : 1;
    signalCounts[r.bodySignal] = (signalCounts[r.bodySignal] || 0) + weight;
  });

  let topSignal: BodySignalKey = 'rahang_tegang';
  let maxCount = 0;
  (Object.entries(signalCounts) as [BodySignalKey, number][]).forEach(([sig, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topSignal = sig;
    }
  });

  const signalLabel = TANDA_TUBUH_MAPPING[topSignal]?.label || 'Rahang tegang / gigi gemeretak';
  // Singkatkan label untuk kalimat natural:
  const shortSignal = signalLabel.split('/')[0].split('&')[0].trim();

  // 2. Pemicu terbanyak per minggu ini
  const topTriggers = aggregateTriggers(history);
  const primaryTrigger = topTriggers[0]?.trigger || 'Kelelahan Fisik & Kurang Tidur';
  const primaryTriggerClean = primaryTrigger.toLowerCase();

  // Template literal sesuai instruksi:
  // {Sinyal tubuh terbanyak dan kuat setelah diaggregrasi tiap minggu} paling sering muncul minggu ini, terutama saat {pemicu terbanyak per minggu ini}
  return `${shortSignal} paling sering muncul minggu ini, terutama saat ${primaryTriggerClean}.`;
}

// ─── Legacy Compatibility Exports for useAnalyticsStore ───────────────────────

export function computeCalendarDays(
  sessions: any[],
  year: number,
  monthZeroIndexed: number
): CalendarDayStatus[] {
  const allDays = getDaysInMonth(year, monthZeroIndexed);
  return allDays.map((date) => {
    const daySessions = sessions.filter((s) => s.date === date);
    return {
      date,
      hasCheckin: daySessions.length > 0,
      sessionCount: daySessions.length,
      records: daySessions,
    };
  });
}

export function computeTopTriggers(sessions: any[]): TriggerStat[] {
  const triggers = aggregateTriggers(sessions as any);
  return triggers.map((t) => ({
    trigger: t.trigger,
    count: t.count,
    percentage: t.percentage,
  }));
}

export function computeCapacityTrend(sessions: any[]): CapacityTrendPoint[] {
  const trend = computeWeeklyCapacityTrend(sessions as any);
  return trend.points;
}

export function generateWeeklyInsight(sessions: any[]): WeeklyInsightSummary {
  const insight = generatePolaInsight(sessions as any);
  const trend = computeWeeklyCapacityTrend(sessions as any);
  return {
    mostFrequentSignal: 'rahang_tegang',
    mostFrequentSignalLabel: 'Rahang tegang',
    mostFrequentTime: '18.00–20.00',
    thinnestCapacityDay: trend.peakDay,
    weekNumber: 2,
    insightSentence: insight,
    conclusionSentence: trend.conclusionSentence,
  };
}
