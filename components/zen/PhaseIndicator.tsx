import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { SessionPhase } from '../../types';

export interface PhaseIndicatorProps {
  currentPhase: SessionPhase;
}

const PHASES: Array<{ key: SessionPhase; label: string; number: string }> = [
  { key: 'A', label: 'Persiapan', number: 'A' },
  { key: 'B', label: 'Aksi Inti', number: 'B' },
  { key: 'C', label: 'Pelepasan', number: 'C' },
];

export default function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  return (
    <View style={styles.container}>
      {PHASES.map((phase, idx) => {
        const isActive = currentPhase === phase.key;
        const isPast =
          (phase.key === 'A' && (currentPhase === 'B' || currentPhase === 'C')) ||
          (phase.key === 'B' && currentPhase === 'C');

        return (
          <React.Fragment key={phase.key}>
            <View style={[styles.pill, isActive && styles.pillActive, isPast && styles.pillPast]}>
              <Typography
                variant="captionMedium"
                color={isActive ? COLORS.white : isPast ? COLORS.sage[800] : COLORS.earth[400]}
              >
                Fase {phase.number}: {phase.label}
              </Typography>
            </View>

            {idx < PHASES.length - 1 && (
              <View style={[styles.line, (isPast || isActive) && styles.lineActive]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.sm,
  },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.cream[50],
    borderWidth: 1,
    borderColor: COLORS.cream[300],
  },
  pillActive: {
    backgroundColor: COLORS.sage[500],
    borderColor: COLORS.sage[500],
  },
  pillPast: {
    backgroundColor: COLORS.sage[100],
    borderColor: COLORS.sage[300],
  },
  line: {
    width: 14,
    height: 1.5,
    backgroundColor: COLORS.cream[300],
  },
  lineActive: {
    backgroundColor: COLORS.sage[400],
  },
});
