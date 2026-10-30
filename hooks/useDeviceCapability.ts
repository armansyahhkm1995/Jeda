import { useEffect } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { usePerformanceStore } from '../store/usePerformanceStore';

/**
 * Hook to inspect device hardware capability on app startup.
 * If RAM < 3GB or Android < Android 9 (API 28), sets isLowEndDevice = true.
 * (Rule 3.1 & 4.A in Jeda Requirements)
 */
export function useDeviceCapability() {
  const setIsLowEndDevice = usePerformanceStore((s) => s.setIsLowEndDevice);
  const isLowEndDevice = usePerformanceStore((s) => s.isLowEndDevice);
  const hasSeenEcoPrompt = usePerformanceStore((s) => s.hasSeenEcoPrompt);
  const markEcoPromptSeen = usePerformanceStore((s) => s.markEcoPromptSeen);

  useEffect(() => {
    async function checkHardware() {
      try {
        if (Platform.OS === 'android') {
          const totalMemoryBytes = await DeviceInfo.getTotalMemory();
          const totalMemoryGB = totalMemoryBytes / (1024 * 1024 * 1024);
          const apiLevel = await DeviceInfo.getApiLevel();

          // Rule: RAM < 3GB or Android < 9 (API < 28)
          const isLowEnd = totalMemoryGB < 3.0 || apiLevel < 28;
          setIsLowEndDevice(isLowEnd);
        } else {
          setIsLowEndDevice(false);
        }
      } catch {
        // Fallback safe assumption: not low-end
        setIsLowEndDevice(false);
      }
    }

    checkHardware();
  }, [setIsLowEndDevice]);

  return {
    isLowEndDevice,
    shouldShowGentleNudge: isLowEndDevice && !hasSeenEcoPrompt,
    dismissGentleNudge: markEcoPromptSeen,
  };
}
