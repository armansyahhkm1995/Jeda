import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from './BottomSheet';
import Typography from './Typography';
import Button from './Button';
import { COLORS, SPACING } from '../../constants/theme';
import { usePerformanceStore } from '../../store/usePerformanceStore';

export interface GentleNudgeBannerProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function GentleNudgeBanner({
  visible,
  onDismiss,
}: GentleNudgeBannerProps) {
  const setPerformanceMode = usePerformanceStore((s) => s.setPerformanceMode);
  const markEcoPromptSeen = usePerformanceStore((s) => s.markEcoPromptSeen);

  const handleActivateEco = () => {
    setPerformanceMode('eco');
    markEcoPromptSeen();
    onDismiss();
  };

  const handleKeepHigh = () => {
    setPerformanceMode('high');
    markEcoPromptSeen();
    onDismiss();
  };

  return (
    <BottomSheet visible={visible} onClose={handleKeepHigh}>
      <View style={styles.content}>
        <Typography variant="h2" style={styles.title}>
          Saran Performa Ringan
        </Typography>

        <Typography variant="body" color={COLORS.earth[500]} style={styles.description}>
          Sistem kami mendeteksi perangkatmu agar aplikasi tetap berjalan lancar 60fps tanpa jeda, kami menyarankan mengaktifkan{' '}
          <Typography variant="bodyMedium" color={COLORS.sage[700]}>
            Mode Hemat (Eco Mode)
          </Typography>
          .
        </Typography>

        <Typography variant="caption" color={COLORS.earth[400]} style={styles.note}>
          Kamu selalu bisa mengubah pengaturan ini kapan saja di menu Profil.
        </Typography>

        <View style={styles.actions}>
          <Button
            label="Aktifkan Mode Hemat"
            variant="primary"
            onPress={handleActivateEco}
          />
          <Button
            label="Tetap Gunakan Animasi Penuh"
            variant="ghost"
            onPress={handleKeepHigh}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    lineHeight: 22,
  },
  note: {
    marginTop: 4,
    marginBottom: SPACING.sm,
  },
  actions: {
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
});
