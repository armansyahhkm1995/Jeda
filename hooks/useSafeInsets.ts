import { useSafeAreaInsets as useNativeSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Ergonomic wrapper for SafeAreaInsets.
 * Follows Rule 4.2 in UNIVERSAL_MOBILE_APP_ENGINEERING_RULES:
 * Never hardcode top/bottom padding; guarantee minimum safe margins.
 */
export function useSafeInsets() {
  const insets = useNativeSafeAreaInsets();

  return {
    top: Math.max(insets.top, 16),
    bottom: Math.max(insets.bottom, 16),
    left: Math.max(insets.left, 16),
    right: Math.max(insets.right, 16),
    rawInsets: insets,
  };
}
