import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Typography from '../ui/Typography';
import { COLORS, RADIUS } from '../../constants/theme';
import { useCheckinStore } from '../../store/useCheckinStore';
import { getTodayIsoString, formatIndonesianDate } from '../../utils/date';
import { calculateEmotionalCapacity } from '../../utils/emotional-capacity';

export default function EmotionCapacityWidget() {
  const router = useRouter();
  const history = useCheckinStore((s) => s.history);
  const isCompletedToday = useCheckinStore((s) => s.isCompletedToday);

  const todayIso = getTodayIsoString();
  const todayRecords = history.filter((r) => r.date === todayIso);
  const hasCheckedIn = isCompletedToday && todayRecords.length > 0;

  const formattedDate = formatIndonesianDate(todayIso);

  // If user has NOT checked in today -> Screenshot 1 (CHECK-IN HARIAN card)
  if (!hasCheckedIn) {
    return (
      <View style={styles.cardUnchecked}>
        <Typography variant="caption" color={COLORS.brand.primary} style={styles.captionTag}>
          CHECK-IN HARIAN
        </Typography>

        <Typography variant="body" color="#4A554D" style={styles.uncheckedDesc}>
          Mari luangkan 1 menit untuk mengenali kondisi tubuhmu.
        </Typography>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(checkin)' as any)}
          style={styles.primaryCheckinButton}
          accessibilityRole="button"
          accessibilityLabel="Mulai Check-in Sekarang"
        >
          <Typography variant="bodyMedium" color={COLORS.white} style={styles.primaryCheckinText}>
            Mulai Check-in Sekarang
          </Typography>
        </TouchableOpacity>
      </View>
    );
  }

  // User HAS checked in today -> Screenshot 2 (KAPASITAS EMOSI card)
  // Evaluasi dari rata-rata bobot intensitas seluruh check-in hari ini
  const capacity = calculateEmotionalCapacity(todayRecords);

  return (
    <View style={styles.cardChecked}>
      {/* Top Meta: Label & Date */}
      <View style={styles.topRow}>
        <Typography variant="caption" color={COLORS.brand.primary} style={styles.captionTag}>
          KAPASITAS EMOSI
        </Typography>
        <Typography variant="caption" color="#717671">
          {formattedDate}
        </Typography>
      </View>

      {/* Main Capacity Status Title */}
      <Typography variant="h2" style={styles.capacityTitle}>
        {capacity.title}
      </Typography>

      {/* 5 Battery / Capacity Dots */}
      <View style={styles.dotsRow}>
        {[1, 2, 3, 4, 5].map((dotIndex) => {
          const isFilled = dotIndex <= capacity.dots;
          return (
            <View
              key={dotIndex}
              style={[
                styles.dot,
                { backgroundColor: isFilled ? capacity.dotColor : '#E5DFD5' },
              ]}
            />
          );
        })}
      </View>

      {/* Gentle Daily Advice */}
      <Typography variant="body" color="#4A554D" style={styles.adviceText}>
        {capacity.advice}
      </Typography>

      {/* Button Tambah Check-in Sinyal Lain Hari Ini */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/(checkin)' as any)}
        style={styles.primaryCheckinButton}
        accessibilityRole="button"
        accessibilityLabel="Tambah Check-in Sinyal Lain Hari Ini"
      >
        <Typography variant="bodyMedium" color={COLORS.white} style={styles.primaryCheckinText}>
          Tambah Check-in Sinyal Lain Hari Ini
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardUnchecked: {
    backgroundColor: '#EDF5EE',
    borderWidth: 1.2,
    borderColor: '#D4E5D6',
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  cardChecked: {
    backgroundColor: '#EDF5EE',
    borderWidth: 1.2,
    borderColor: '#D4E5D6',
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  captionTag: {
    fontWeight: '700',
    letterSpacing: 0.6,
    fontSize: 11.5,
  },
  uncheckedDesc: {
    fontSize: 14.5,
    lineHeight: 21,
    marginTop: 2,
  },
  primaryCheckinButton: {
    backgroundColor: '#355E3B',
    borderRadius: RADIUS.pill,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryCheckinText: {
    fontWeight: '600',
    fontSize: 15,
  },
  capacityTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E2922',
    marginTop: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  adviceText: {
    fontSize: 13.5,
    lineHeight: 19,
    color: '#4A554D',
    marginTop: 2,
  },
});
