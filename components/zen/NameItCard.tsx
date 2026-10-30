import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../ui/Typography';
import FloatingLabel from '../ui/FloatingLabel';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { EMOTION_LABELS } from '../../constants/phases';

export default function NameItCard() {
  return (
    <View style={styles.container}>
      {/* Floating emotion reminder badges (non-clickable) */}
      <View style={styles.floatingGrid}>
        <View style={styles.floatingRow}>
          <FloatingLabel label="• Cemas" delayMs={0} offsetY={6} />
          <FloatingLabel label="• Kewalahan" delayMs={400} offsetY={8} />
          <FloatingLabel label="• Marah" delayMs={200} offsetY={5} />
        </View>
        <View style={styles.floatingRow}>
          <FloatingLabel label="• Takut" delayMs={600} offsetY={7} />
          <FloatingLabel label="• Sedih" delayMs={300} offsetY={6} />
          <FloatingLabel label="• Lelah Batin" delayMs={800} offsetY={8} />
        </View>
      </View>

      {/* Main Guided Reflection Card */}
      <View style={styles.card}>
        <Typography variant="captionMedium" color={COLORS.sage[700]}>
          TEKNIK NAME IT TO TAME IT
        </Typography>

        <Typography variant="h2" style={styles.title}>
          Urai benang kusut di kepalamu dengan kata-kata
        </Typography>

        <Typography variant="body" color={COLORS.earth[700]} style={styles.instruction}>
          Letakkan satu tangan di dada atau perutmu. Tarik napas perlahan dan ucapkan dalam hati:
        </Typography>

        <View style={styles.quoteBox}>
          <Typography variant="bodyLarge" color={COLORS.sage[900]} align="center" style={styles.quoteText}>
            “Saat ini, tubuhku sedang merasakan... dan itu wajar.”
          </Typography>
        </View>

        <Typography variant="caption" color={COLORS.earth[500]} style={styles.neuroNote}>
          🧠 Mengucapkan nama emosi secara sadar mengalihkan sinyal listrik dari amigdala ke korteks prefrontal.
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  floatingGrid: {
    gap: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  floatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.cream[50],
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: COLORS.sage[200],
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  title: {
    lineHeight: 28,
  },
  instruction: {
    lineHeight: 22,
  },
  quoteBox: {
    backgroundColor: COLORS.sage[50],
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.sage[200],
    padding: SPACING.md,
    marginVertical: SPACING.xs,
  },
  quoteText: {
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 24,
  },
  neuroNote: {
    lineHeight: 18,
  },
});
