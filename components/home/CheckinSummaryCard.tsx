import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useCheckinStore } from '../../store/useCheckinStore';
import { getTodayIsoString } from '../../utils/date';
import SingleCheckinCard from '../shared/SingleCheckinCard';
import { CheckinRecord } from '../../types';

export default function CheckinSummaryCard() {
  const router = useRouter();
  const history = useCheckinStore((s) => s.history);
  const isCompletedToday = useCheckinStore((s) => s.isCompletedToday);

  const todayIso = getTodayIsoString();
  const todayRecords = history.filter((r) => r.date === todayIso);

  if (!isCompletedToday || todayRecords.length === 0) {
    return null;
  }

  // Maksimal 5 kartu ringkasan check-in di menu Home / Beranda
  const displayedRecords = todayRecords.slice(0, 5);
  const hasMoreThanFive = todayRecords.length > 5;
  const remainingCount = todayRecords.length - 5;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Typography variant="bodyLarge" style={styles.sectionTitle}>
          Ringkasan check-in
        </Typography>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/analitik' as any)}
          accessibilityRole="button"
          accessibilityLabel="Lihat riwayat"
        >
          <Typography variant="captionMedium" color="#556B59" style={styles.linkText}>
            Lihat riwayat
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Satu Card per Reaksi Tubuh / Entry Daily Check-in (Maksimal 5) */}
      <View style={styles.cardsList}>
        {displayedRecords.map((record: CheckinRecord) => (
          <SingleCheckinCard key={record.id} record={record} />
        ))}
      </View>

      {/* Tombol Lihat Lebih Banyak jika check-in hari ini lebih dari 5 */}
      {hasMoreThanFive && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/analitik' as any)}
          style={styles.moreButton}
          accessibilityRole="button"
          accessibilityLabel="Lihat lebih banyak check-in di menu analitik"
        >
          <Typography variant="captionMedium" color={COLORS.brand.primary} style={styles.moreButtonText}>
            Lihat Lebih Banyak ({remainingCount} lainnya) →
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#1E2922',
  },
  linkText: {
    fontWeight: '500',
    fontSize: 13.5,
  },
  cardsList: {
    gap: 12,
  },
  moreButton: {
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: '#F5F9F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#C8DEC7',
  },
  moreButtonText: {
    fontWeight: '700',
    fontSize: 13.5,
  },
});
