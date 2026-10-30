import { BodySignalKey, Technique, TechniqueId } from '../types/technique';
import { IntensityLevel } from '../types/checkin';
import { TANDA_TUBUH_MAPPING } from '../constants/body-signals';
import { TECHNIQUES_MAP, TECHNIQUES } from '../constants/techniques';

export interface RecommendationResult {
  primary: Technique;
  alternative?: Technique;
  reason: string;
  isUrgent: boolean;
}

/**
 * Recommends the neurobiologically appropriate regulation technique
 * based on body signal and intensity level.
 */
export function getRecommendedTechnique(
  bodySignal: BodySignalKey,
  intensity: IntensityLevel = 'sedang'
): RecommendationResult {
  const signalInfo = TANDA_TUBUH_MAPPING[bodySignal];

  if (!signalInfo) {
    // Fallback to physiological sigh if unspecified
    return {
      primary: TECHNIQUES_MAP['physiological_sigh'] || TECHNIQUES[0],
      reason: 'Menyeimbangkan kembali sistem saraf otonom secara teratur.',
      isUrgent: false,
    };
  }

  // If intensity is 'kuat', check for acute rescue options
  let primaryId: TechniqueId = signalInfo.primaryTechnique;

  if (intensity === 'kuat') {
    if (bodySignal === 'jantung_berdebar') {
      // Acute tachycardia: Physiological sigh is first priority
      primaryId = 'physiological_sigh';
    } else if (bodySignal === 'otot_kaku') {
      // High physical aggression: Wall push releases large muscle adrenaline
      primaryId = 'wall_push';
    }
  }

  const primaryTechnique = TECHNIQUES_MAP[primaryId] || TECHNIQUES[0];

  // Pick alternative technique if available in the recommendation list
  const alternativeId = signalInfo.recommendedTechniques.find((id) => id !== primaryId);
  const alternativeTechnique = alternativeId ? TECHNIQUES_MAP[alternativeId] : undefined;

  return {
    primary: primaryTechnique,
    alternative: alternativeTechnique,
    reason: signalInfo.reason,
    isUrgent: intensity === 'kuat' || intensity === 'sedang',
  };
}
