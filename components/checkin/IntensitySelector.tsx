import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { IntensityLevel } from '../../types';
import { useHaptics } from '../../hooks/useHaptics';

export interface IntensitySelectorProps {
  value: IntensityLevel | null;
  onChange: (level: IntensityLevel) => void;
}

const INTENSITY_OPTIONS: Array<{
  level: IntensityLevel;
  label: string;
  desc: string;
  color: string;
}> = [
  {
    level: 'ringan',
    label: 'Ringan',
    desc: 'Masih bisa berpikir jernih, hanya sedikit tegang.',
    color: COLORS.emotion.ringan,
  },
  {
    level: 'sedang',
    label: 'Sedang',
    desc: 'Mulai sulit fokus, emosi mulai mengambil alih kendali.',
    color: COLORS.emotion.sedang,
  },
  {
    level: 'kuat',
    label: 'Kuat',
    desc: 'Sangat kewalahan, dada sesak atau dorongan reaktif tinggi.',
    color: COLORS.emotion.kuat,
  },
];

export default function IntensitySelector({ value, onChange }: IntensitySelectorProps) {
  const { triggerBreathTick } = useHaptics();

  const handleSelect = (level: IntensityLevel) => {
    triggerBreathTick();
    onChange(level);
  };

  return (
    <View style={styles.container}>
      <Typography variant="bodyMedium" color={COLORS.earth[900]} style={styles.header}>
        2. Seberapa kuat terasa saat ini?
      </Typography>

      <View style={styles.optionsRow}>
        {INTENSITY_OPTIONS.map((item) => {
          const isSelected = value === item.level;

          return (
            <TouchableOpacity
              key={item.level}
              activeOpacity={0.8}
              onPress={() => handleSelect(item.level)}
              style={[
                styles.optionCard,
                isSelected && { borderColor: item.color, backgroundColor: `${item.color}15` },
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${item.label}, ${item.desc}`}
            >
              <View style={styles.topRow}>
                <View
                  style={[
                    styles.radioDot,
                    isSelected && { backgroundColor: item.color, borderColor: item.color },
                  ]}
                />
                <Typography
                  variant="bodyLarge"
                  style={[styles.label, isSelected && { color: item.color, fontWeight: '700' }]}
                >
                  {item.label}
                </Typography>
              </View>

              <Typography variant="caption" color={COLORS.earth[500]} style={styles.desc}>
                {item.desc}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  header: {
    marginBottom: 4,
  },
  optionsRow: {
    gap: SPACING.sm,
  },
  optionCard: {
    backgroundColor: COLORS.cream[100],
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.cream[300],
    padding: SPACING.md,
    minHeight: 52, // Ergonomic minimum touch target
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    borderColor: COLORS.cream[400],
    backgroundColor: 'transparent',
  },
  label: {
    fontWeight: '600',
    color: COLORS.earth[900],
  },
  desc: {
    marginLeft: 22,
    lineHeight: 16,
  },
});
