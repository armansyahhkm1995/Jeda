import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { usePerformanceStore } from '../../store/usePerformanceStore';

export interface CardProps extends ViewProps {
  variant?: 'elevated' | 'flat' | 'outline' | 'sage';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Card({
  variant = 'flat',
  padding = 'md',
  style,
  children,
  ...rest
}: CardProps) {
  const isEco = usePerformanceStore((s) => s.performanceMode === 'eco');

  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    // Padding
    if (padding === 'sm') list.push(styles.padSm);
    if (padding === 'md') list.push(styles.padMd);
    if (padding === 'lg') list.push(styles.padLg);

    // Variants (Eco mode gracefully drops heavy elevation / drop shadows)
    if (variant === 'elevated') {
      list.push(isEco ? styles.flat : styles.elevated);
    } else if (variant === 'flat') {
      list.push(styles.flat);
    } else if (variant === 'outline') {
      list.push(styles.outline);
    } else if (variant === 'sage') {
      list.push(styles.sage);
    }

    return list;
  };

  return (
    <View style={[getContainerStyle(), style as ViewStyle]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cream[100],
    overflow: 'hidden',
  },
  padSm: {
    padding: SPACING.sm,
  },
  padMd: {
    padding: SPACING.md,
  },
  padLg: {
    padding: SPACING.lg,
  },
  flat: {
    borderWidth: 1,
    borderColor: COLORS.cream[300],
  },
  elevated: {
    borderWidth: 1,
    borderColor: COLORS.cream[300],
    shadowColor: COLORS.earth[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.sage[300],
  },
  sage: {
    backgroundColor: COLORS.sage[50],
    borderWidth: 1,
    borderColor: COLORS.sage[200],
  },
});
