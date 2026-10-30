import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS } from '../../constants/theme';
import { CheckinRecord, IntensityLevel } from '../../types';
import { formatIndonesianDate } from '../../utils/date';
import { normalizeSignalKey } from '../../utils/ranking-algorithm';
import { TANDA_TUBUH_MAPPING } from '../../constants/body-signals';

export function getSingleRecordConclusion(signalName: string, intensity: IntensityLevel): string {
  let statusText = 'kapasitas tipis';
  let adviceText = 'Kurangi tuntutan dan jeda sebelum merespons.';

  if (intensity === 'kuat') {
    statusText = 'kapasitas tipis';
    adviceText = 'Kurangi tuntutan dan jeda sebelum merespons.';
  } else if (intensity === 'sedang') {
    statusText = 'kapasitas mulai berkurang';
    adviceText = 'Beri jeda sejenak sebelum mengambil keputusan.';
  } else {
    statusText = 'kapasitas masih lapang';
    adviceText = 'Jaga ritme tenangmu untuk melanjutkan hari.';
  }

  return `${signalName} dengan intensitas ${intensity} menandakan ${statusText}. ${adviceText}`;
}

export default function SingleCheckinCard({ record }: { record: CheckinRecord }) {
  const canonical = normalizeSignalKey(record.bodySignal);
  const signalInfo = (TANDA_TUBUH_MAPPING as Record<string, any>)[canonical];
  const signalLabel = signalInfo?.pillLabel || canonical;
  const formattedDate = formatIndonesianDate(record.date);
  const triggerText =
    record.trigger && record.trigger.trim().length > 0 ? record.trigger.trim() : 'Rumah berantakan';
  const conclusionText = getSingleRecordConclusion(signalLabel, record.intensity);

  return (
    <View style={styles.card}>
      {/* Date & Time Header */}
      <View style={styles.cardTopRow}>
        <Typography variant="caption" color="#717671">
          {formattedDate}
        </Typography>
        <Typography variant="caption" color="#717671">
          {record.time}
        </Typography>
      </View>

      {/* Sinyal Tubuh: HANYA SATU SINYAL TUBUH PER CARD */}
      <View style={styles.detailRow}>
        <Typography variant="caption" color="#717671" style={styles.rowLabel}>
          Sinyal tubuh
        </Typography>
        <View style={styles.signalPill}>
          <Typography variant="caption" color={COLORS.brand.primary} style={styles.signalPillText}>
            {signalLabel}
          </Typography>
        </View>
      </View>

      {/* Intensitas */}
      <View style={styles.detailRow}>
        <Typography variant="caption" color="#717671" style={styles.rowLabel}>
          Intensitas
        </Typography>
        <View
          style={[
            styles.intensityBadge,
            record.intensity === 'kuat' && styles.intensityBadgeStrong,
            record.intensity === 'sedang' && styles.intensityBadgeMedium,
            record.intensity === 'ringan' && styles.intensityBadgeLight,
          ]}
        >
          <Typography
            variant="caption"
            style={[
              styles.intensityText,
              record.intensity === 'kuat' && styles.intensityTextStrong,
              record.intensity === 'sedang' && styles.intensityTextMedium,
              record.intensity === 'ringan' && styles.intensityTextLight,
            ]}
          >
            {record.intensity === 'kuat' ? 'Kuat' : record.intensity === 'sedang' ? 'Sedang' : 'Ringan'}
          </Typography>
        </View>
      </View>

      {/* Pemicu */}
      <View style={styles.detailRow}>
        <Typography variant="caption" color="#717671" style={styles.rowLabel}>
          Pemicu
        </Typography>
        <Typography variant="bodyMedium" style={styles.triggerValue}>
          {triggerText}
        </Typography>
      </View>

      {/* Subtle Divider */}
      <View style={styles.divider} />

      {/* Kesimpulan Jeda */}
      <View style={styles.conclusionSection}>
        <Typography variant="caption" color="#717671" style={styles.conclusionLabel}>
          Kesimpulan Jeda
        </Typography>
        <Typography variant="caption" style={styles.conclusionBody}>
          {conclusionText}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E8ECE8',
    padding: 18,
    gap: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  rowLabel: {
    fontSize: 13,
    color: '#717671',
    width: 100,
  },
  signalPill: {
    backgroundColor: '#EDF5EE',
    borderWidth: 1,
    borderColor: '#C6DEC6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
  },
  signalPillText: {
    fontWeight: '600',
    fontSize: 12,
  },
  intensityBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3.5,
    borderWidth: 1,
  },
  intensityBadgeStrong: {
    backgroundColor: '#FEF4EA',
    borderColor: '#F6C18E',
  },
  intensityBadgeMedium: {
    backgroundColor: '#FEF9EA',
    borderColor: '#E8D58A',
  },
  intensityBadgeLight: {
    backgroundColor: '#EDF5EE',
    borderColor: '#C6DEC6',
  },
  intensityText: {
    fontWeight: '700',
    fontSize: 12,
  },
  intensityTextStrong: {
    color: '#C46514',
  },
  intensityTextMedium: {
    color: '#947118',
  },
  intensityTextLight: {
    color: '#2D5A38',
  },
  triggerValue: {
    fontWeight: '700',
    fontSize: 13.5,
    color: '#1E2922',
    textAlign: 'right',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F2F0',
    marginVertical: 2,
  },
  conclusionSection: {
    gap: 3,
  },
  conclusionLabel: {
    fontSize: 12,
    color: '#717671',
  },
  conclusionBody: {
    fontSize: 13,
    lineHeight: 18.5,
    color: '#2D5A38',
    fontWeight: '500',
  },
});
