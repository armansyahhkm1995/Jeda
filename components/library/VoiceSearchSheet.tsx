import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from '../ui/BottomSheet';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';

export interface VoiceSearchSheetProps {
  visible: boolean;
  onRecognized: (query: string) => void;
  onClose: () => void;
}

export default function VoiceSearchSheet({
  visible,
  onRecognized,
  onClose,
}: VoiceSearchSheetProps) {
  const [dots, setDots] = useState('.');
  const { triggerBreathTick, triggerPhaseChange } = useHaptics();

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [visible]);

  const handleSimulateSample = (sampleText: string) => {
    triggerPhaseChange();
    onRecognized(sampleText);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.micCircle}>
          <Typography variant="h1" style={styles.micIcon}>
            🎙
          </Typography>
        </View>

        <Typography variant="h2" align="center" style={styles.title}>
          Mendengarkan{dots}
        </Typography>

        <Typography variant="body" color={COLORS.earth[500]} align="center" style={styles.subtitle}>
          Katakan apa yang paling kamu rasakan saat ini, dan kami akan menemukan teknik yang sesuai.
        </Typography>

        <View style={styles.sampleSuggestions}>
          <Typography variant="captionMedium" color={COLORS.earth[400]} align="center">
            Atau ketuk contoh kalimat:
          </Typography>

          <View style={styles.chipsRow}>
            <TouchableOpacity
              onPress={() => handleSimulateSample('Jantung berdebar cepat')}
              style={styles.sampleChip}
            >
              <Typography variant="caption" color={COLORS.sage[800]}>
                “Jantungku berdebar kencang”
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSimulateSample('Pikiran overthinking')}
              style={styles.sampleChip}
            >
              <Typography variant="caption" color={COLORS.sage[800]}>
                “Pikiranku berlarian kemana-mana”
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSimulateSample('Marah dan tegang')}
              style={styles.sampleChip}
            >
              <Typography variant="caption" color={COLORS.sage[800]}>
                “Rahangku kaku dan ingin memukul”
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Typography variant="bodyMedium" color={COLORS.earth[500]}>
            Batal
          </Typography>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  micCircle: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.sage[50],
    borderWidth: 2,
    borderColor: COLORS.sage[400],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  micIcon: {
    fontSize: 34,
  },
  title: {
    fontSize: 22,
  },
  subtitle: {
    lineHeight: 20,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sampleSuggestions: {
    width: '100%',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: 4,
  },
  sampleChip: {
    backgroundColor: COLORS.cream[50],
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.sage[200],
  },
  cancelButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.xs,
  },
});
