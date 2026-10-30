import * as Haptics from 'expo-haptics';
import { usePerformanceStore } from '../store/usePerformanceStore';

/**
 * Eco-aware haptic feedback hook.
 * Follows Rule 4.3 in UNIVERSAL_MOBILE_APP_ENGINEERING_RULES:
 * On low-end devices or in Eco Mode, continuous haptics can freeze the UI queue.
 * In Eco Mode, haptics are throttled to phase transitions only.
 */
export function useHaptics() {
  const performanceMode = usePerformanceStore((s) => s.performanceMode);
  const isEco = performanceMode === 'eco';

  const triggerBreathTick = async () => {
    // In Eco Mode, suppress continuous rhythmic ticks to avoid UI queue stutter
    if (isEco) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics unavailable on device/simulator
    }
  };

  const triggerPhaseChange = async () => {
    // Phase change triggers on both High and Eco mode
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // ignore
    }
  };

  const triggerButtonPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // ignore
    }
  };

  const triggerWarning = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // ignore
    }
  };

  return {
    triggerBreathTick,
    triggerPhaseChange,
    triggerButtonPress,
    triggerWarning,
    isEco,
  };
}
