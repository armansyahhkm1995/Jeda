import { useMemo } from 'react';
import { useCheckinStore } from '../store/useCheckinStore';
import { getRecommendedTechnique } from '../utils/recommendation';

export function useRecommendation() {
  const todaySignal = useCheckinStore((s) => s.todaySignal);
  const todayIntensity = useCheckinStore((s) => s.todayIntensity);

  const recommendation = useMemo(() => {
    if (!todaySignal) {
      return null;
    }
    return getRecommendedTechnique(todaySignal, todayIntensity || 'sedang');
  }, [todaySignal, todayIntensity]);

  return recommendation;
}
