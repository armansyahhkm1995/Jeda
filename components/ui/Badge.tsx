import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { IntensityLevel } from '../../types';

export interface BadgeProps {
  label: string;
  intensity?: IntensityLevel;
  variant?: 'solid' | 'subtle' | 'outline';
  isSelected?: boolean;
}

export default function Badge({
  label,
  intensity,
  variant = 'subtle',
  isSelected = false,
}: BadgeProps) {
  const getBadgeColor = () => {
    if (intensity === 'ringan') return COLORS.emotion.ringan;
    if (intensity === 'sedang') return COLORS.emotion.sedang;
    if (intensity === 'kuat') return COLORS.emotion.kuat;
    return COLORS.sage[500];
  };

  const color = getBadgeColor();

  const containerStyles: ViewStyle[] = [styles.base];
  const textStyles: TextStyle[] = [styles.text];

  if (variant === 'solid' || isSelected) {
    containerStyles.push({ backgroundColor: color });
    textStyles.push({ color: COLORS.white });
  } else if (variant === 'subtle') {
    containerStyles.push({ backgroundColor: `${color}25` }); // 15% opacity hex
    textStyles.push({ color: COLORS.earth[900] });
  } else if (variant === 'outline') {
    containerStyles.push({ borderWidth: 1, borderColor: color, backgroundColor: 'transparent' });
    textStyles.push({ color: COLORS.earth[900] });
  }

  return (
    <View style={containerStyles}>
      <Text style={textStyles}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
