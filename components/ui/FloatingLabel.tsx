import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Typography from './Typography';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { usePerformanceStore } from '../../store/usePerformanceStore';

export interface FloatingLabelProps {
  label: string;
  delayMs?: number;
  offsetY?: number;
}

export default function FloatingLabel({
  label,
  delayMs = 0,
  offsetY = 8,
}: FloatingLabelProps) {
  const isEco = usePerformanceStore((s) => s.performanceMode === 'eco');
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isEco) {
      translateY.value = 0;
      return;
    }

    const timer = setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-offsetY, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
          withTiming(offsetY, { duration: 1800, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    }, delayMs);

    return () => clearTimeout(timer);
  }, [isEco, delayMs, offsetY, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (isEco) {
    return (
      <View style={styles.badge}>
        <Typography variant="captionMedium" color={COLORS.sage[800]}>
          {label}
        </Typography>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.badge, animatedStyle]}>
      <Typography variant="captionMedium" color={COLORS.sage[800]}>
        {label}
      </Typography>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.cream[50],
    borderColor: COLORS.sage[200],
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
    shadowColor: COLORS.sage[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
});
