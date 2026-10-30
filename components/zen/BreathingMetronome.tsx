import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { BreathingConfig } from '../../types';
import { useHaptics } from '../../hooks/useHaptics';

export interface BreathingMetronomeProps {
  config: BreathingConfig;
  isActive: boolean;
  onCycleComplete: () => void;
}

export default function BreathingMetronome({
  config,
  isActive,
  onCycleComplete,
}: BreathingMetronomeProps) {
  const [breathState, setBreathState] = useState<'Tarik Napas' | 'Tahan' | 'Hembuskan'>('Tarik Napas');
  const scale = useSharedValue<number>(1);
  const { triggerBreathTick } = useHaptics();

  const { inhale, hold1 = 0, exhale, hold2 = 0 } = config;

  useEffect(() => {
    if (!isActive) {
      scale.value = withTiming(1, { duration: 300 });
      return;
    }

    // Animation sequences calculated in milliseconds
    const inhaleMs = inhale * 1000;
    const hold1Ms = hold1 * 1000;
    const exhaleMs = exhale * 1000;
    const hold2Ms = hold2 * 1000;

    const handleCycleDone = () => {
      triggerBreathTick();
      onCycleComplete();
    };

    // Construct Reanimated worklet sequence for 60fps UI thread execution
    const sequenceItems: number[] = [
      // 1. Inhale: expand
      withTiming(1.65, { duration: inhaleMs, easing: Easing.inOut(Easing.ease) }),
    ];

    if (hold1Ms > 0) {
      // 2. Hold after inhale
      sequenceItems.push(withTiming(1.65, { duration: hold1Ms }));
    }

    // 3. Exhale: contract
    sequenceItems.push(withTiming(1.0, { duration: exhaleMs, easing: Easing.inOut(Easing.ease) }));

    if (hold2Ms > 0) {
      // 4. Hold after exhale
      sequenceItems.push(withTiming(1.0, { duration: hold2Ms }));
    }

    scale.value = withRepeat(
      withSequence(
        ...(sequenceItems as [number, ...number[]])
      ),
      config.cycles,
      false,
      () => {
        runOnJS(handleCycleDone)();
      }
    );

    // Synchronize JS label timer with breath cycle
    let isMounted = true;
    const runCycleText = () => {
      if (!isMounted || !isActive) return;
      setBreathState('Tarik Napas');

      setTimeout(() => {
        if (!isMounted) return;
        if (hold1Ms > 0) {
          setBreathState('Tahan');
          setTimeout(() => {
            if (!isMounted) return;
            setBreathState('Hembuskan');
          }, hold1Ms);
        } else {
          setBreathState('Hembuskan');
        }
      }, inhaleMs);
    };

    runCycleText();
    const cycleTotalMs = inhaleMs + hold1Ms + exhaleMs + hold2Ms;
    const interval = setInterval(runCycleText, cycleTotalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isActive, config, inhale, hold1, exhale, hold2, onCycleComplete, scale, triggerBreathTick]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Outer Ripple Circle */}
      <Animated.View style={[styles.outerCircle, animatedCircleStyle]} />

      {/* Core Zen Circle */}
      <View style={styles.coreCircle}>
        <Typography variant="h2" color={COLORS.white} align="center" style={styles.breathText}>
          {breathState}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: RADIUS.pill,
    backgroundColor: `${COLORS.sage[300]}35`,
    borderWidth: 2,
    borderColor: `${COLORS.sage[400]}50`,
  },
  coreCircle: {
    width: 140,
    height: 140,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.sage[500],
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    shadowColor: COLORS.sage[900],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  breathText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
