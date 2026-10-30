import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useSessionStore } from '../store/useSessionStore';

/**
 * Hook to pause timers and continuous animations when the app
 * is pushed into the background, preventing OS kill and battery drain.
 * (Rule 3.3 in UNIVERSAL_MOBILE_APP_ENGINEERING_RULES)
 */
export function useAppState() {
  const pauseSession = useSessionStore((s) => s.pauseSession);
  const resumeSession = useSessionStore((s) => s.resumeSession);
  const isActive = useSessionStore((s) => s.isActive);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState.match(/inactive|background/)) {
        pauseSession();
      } else if (nextAppState === 'active' && isActive) {
        resumeSession();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [pauseSession, resumeSession, isActive]);
}
