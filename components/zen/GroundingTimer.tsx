import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { GroundingConfig } from '../../types';
import { useHaptics } from '../../hooks/useHaptics';

export interface GroundingTimerProps {
  config: GroundingConfig;
  isActive: boolean;
  onAllStepsComplete: () => void;
}

export default function GroundingTimer({
  config,
  isActive,
  onAllStepsComplete,
}: GroundingTimerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(config.steps[0].durationSeconds);
  const [currentLoop, setCurrentLoop] = useState(1);
  const { triggerBreathTick, triggerPhaseChange } = useHaptics();

  const currentStep = config.steps[currentStepIndex];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentSeconds((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Current step duration finished -> move to next step
        triggerBreathTick();

        if (currentStepIndex < config.steps.length - 1) {
          const nextIndex = currentStepIndex + 1;
          setCurrentStepIndex(nextIndex);
          return config.steps[nextIndex].durationSeconds;
        } else {
          // Reached end of 5-4-3-2-1
          triggerPhaseChange();
          if (currentLoop < config.loopCount) {
            // Loop again as requested
            setCurrentLoop((l) => l + 1);
            setCurrentStepIndex(0);
            return config.steps[0].durationSeconds;
          } else {
            // Finished all loops
            onAllStepsComplete();
            return 0;
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentStepIndex, currentLoop, config, triggerBreathTick, triggerPhaseChange, onAllStepsComplete]);

  const progressPercentage = ((currentStepIndex + 1) / config.steps.length) * 100;

  return (
    <View style={styles.container}>
      {/* Loop & Step Indicator */}
      <View style={styles.badgeRow}>
        <View style={styles.stepBadge}>
          <Typography variant="captionMedium" color={COLORS.sage[800]}>
            Langkah {currentStepIndex + 1} dari {config.steps.length}
          </Typography>
        </View>

        <Typography variant="caption" color={COLORS.earth[500]}>
          Putaran {currentLoop} • {currentSeconds}s
        </Typography>
      </View>

      {/* Sensory Instruction Card */}
      <View style={styles.card}>
        <View style={styles.numberCircle}>
          <Typography variant="h1" color={COLORS.white} style={styles.numberText}>
            {currentStep.count}
          </Typography>
        </View>

        <Typography variant="captionMedium" color={COLORS.sage[700]}>
          INDRA {currentStep.sense.toUpperCase()}
        </Typography>

        <Typography variant="h2" align="center" style={styles.instruction}>
          {currentStep.instruction}
        </Typography>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  stepBadge: {
    backgroundColor: COLORS.cream[50],
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.cream[300],
  },
  card: {
    backgroundColor: COLORS.cream[50],
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: COLORS.sage[200],
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    minHeight: 240,
  },
  numberCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.sage[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  numberText: {
    fontSize: 32,
    lineHeight: 38,
  },
  instruction: {
    lineHeight: 28,
    paddingHorizontal: SPACING.sm,
  },
  progressBarBg: {
    height: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.cream[300],
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.sage[500],
    borderRadius: RADIUS.pill,
  },
});
