import { StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets as useNativeSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Ergonomic wrapper for SafeAreaInsets.
 * Follows Rule 4.2 in UNIVERSAL_MOBILE_APP_ENGINEERING_RULES:
 * Never hardcode top/bottom padding; guarantee minimum safe margins.
 */
export function useSafeInsets() {
  const insets = useNativeSafeAreaInsets();
  const androidBar = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 28) : 0;
  const safeTop = Platform.OS === 'android'
    ? Math.max(insets.top, androidBar, 28)
    : Math.max(insets.top, 20);

  return {
    top: safeTop,
    bottom: Math.max(insets.bottom, 16),
    left: Math.max(insets.left, 0),
    right: Math.max(insets.right, 0),
    rawInsets: insets,
  };
}
