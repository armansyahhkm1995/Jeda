import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS, RADIUS } from '../../constants/theme';
import { useCheckinStore } from '../../store/useCheckinStore';
import { getTop6EmergencySignals, RankedSignal } from '../../utils/ranking-algorithm';
import { BodySignalKey } from '../../types';
import SomaticSignalIcon from '../ui/SomaticSignalIcon';
import { useHaptics } from '../../hooks/useHaptics';

interface SosPillsProps {
  onSelectSignal: (signalKey: BodySignalKey) => void;
  initialCount?: number;
}

export default function SosPills({ onSelectSignal, initialCount }: SosPillsProps) {
  const history = useCheckinStore((s) => s.history);
  const isCompletedToday = useCheckinStore((s) => s.isCompletedToday);
  const { triggerButtonPress } = useHaptics();

  // If user has already checked in today, default to showing top 3 (Screenshot 2);
  // If not checked in, default to showing all 6 (Screenshot 1).
  const defaultLimit = initialCount || (isCompletedToday ? 3 : 6);
  const [showAll, setShowAll] = useState(false);

  // Dynamic ranking based on rolling 7 days of kuat check-in history
  const rankedSignals: RankedSignal[] = getTop6EmergencySignals(history);
  const displayedSignals = showAll ? rankedSignals : rankedSignals.slice(0, defaultLimit);

  const handlePillPress = (key: BodySignalKey) => {
    triggerButtonPress();
    onSelectSignal(key);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Typography variant="bodyLarge" style={styles.sectionTitle}>
          Butuh bantuan cepat?
        </Typography>
        <TouchableOpacity
          onPress={() => setShowAll((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={showAll ? 'Persempit bantuan' : 'Lihat semua bantuan'}
        >
          <Typography variant="captionMedium" color="#556B59" style={styles.linkText}>
            {showAll ? 'Tutup bantuan' : 'Lihat bantuan'}
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Vertical List of Full-Width Capsule Pills */}
      <View style={styles.pillsList}>
        {displayedSignals.map((signal) => (
          <TouchableOpacity
            key={signal.key}
            activeOpacity={0.8}
            onPress={() => handlePillPress(signal.key)}
            style={styles.pillCard}
            accessibilityRole="button"
            accessibilityLabel={signal.pillLabel}
          >
            <View style={styles.pillLeft}>
              <View style={styles.iconWrapper}>
                <SomaticSignalIcon
                  signalKey={signal.key}
                  size={20}
                  color={COLORS.brand.primary}
                />
              </View>
              <Typography
                variant="bodyMedium"
                color={COLORS.brand.primary}
                style={styles.pillLabel}
              >
                {signal.pillLabel}
              </Typography>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
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
  pillsList: {
    gap: 10,
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7FAF7',
    borderRadius: RADIUS.pill,
    borderWidth: 1.2,
    borderColor: '#C8DEC7',
    paddingVertical: 12.5,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  pillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    fontWeight: '600',
    fontSize: 14.5,
    color: '#2D5A38',
  },
});
