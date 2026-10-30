import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { BreathingConfig } from '../../types';

export interface EcoBreathingViewProps {
  config: BreathingConfig;
  isActive: boolean;
  onCycleComplete: () => void;
}

export default function EcoBreathingView({
  config,
  isActive,
  onCycleComplete,
}: EcoBreathingViewProps) {
  const [phaseText, setPhaseText] = useState('Tarik Napas');
  const [currentSeconds, setCurrentSeconds] = useState(config.inhale);

  const { inhale, hold1 = 0, exhale, hold2 = 0 } = config;

  useEffect(() => {
    if (!isActive) return;

    let timer: any;
    let cycleCount = 0;

    const runSequence = () => {
      // 1. Inhale
      setPhaseText('Tarik Napas');
      setCurrentSeconds(inhale);

      timer = setTimeout(() => {
        // 2. Hold1
        if (hold1 > 0) {
          setPhaseText('Tahan Napas');
          setCurrentSeconds(hold1);

          timer = setTimeout(() => {
            // 3. Exhale
            setPhaseText('Hembuskan Perlahan');
            setCurrentSeconds(exhale);

            timer = setTimeout(() => {
              // 4. Hold2
              if (hold2 > 0) {
                setPhaseText('Jeda Sejenak');
                setCurrentSeconds(hold2);

                timer = setTimeout(() => {
                  cycleCount += 1;
                  onCycleComplete();
                  if (cycleCount < config.cycles) {
                    runSequence();
                  }
                }, hold2 * 1000);
              } else {
                cycleCount += 1;
                onCycleComplete();
                if (cycleCount < config.cycles) {
                  runSequence();
                }
              }
            }, exhale * 1000);
          }, hold1 * 1000);
        } else {
          // 3. Exhale
          setPhaseText('Hembuskan Perlahan');
          setCurrentSeconds(exhale);

          timer = setTimeout(() => {
            cycleCount += 1;
            onCycleComplete();
            if (cycleCount < config.cycles) {
              runSequence();
            }
          }, exhale * 1000);
        }
      }, inhale * 1000);
    };

    runSequence();

    return () => {
      clearTimeout(timer);
    };
  }, [isActive, config, inhale, hold1, exhale, hold2, onCycleComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.ecoBox}>
        <Typography variant="captionMedium" color={COLORS.sage[700]}>
          MODE HEMAT PERFORMA (ECO)
        </Typography>

        <Typography variant="h1" color={COLORS.sage[900]} align="center" style={styles.mainText}>
          {phaseText}
        </Typography>

        <Typography variant="body" color={COLORS.earth[600]} align="center">
          Ikuti ritme di atas dengan tenang.
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  ecoBox: {
    width: '100%',
    backgroundColor: COLORS.cream[50],
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: COLORS.sage[300],
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  mainText: {
    fontSize: 26,
    marginVertical: SPACING.xs,
  },
});
