import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../ui/Typography';
import FloatingLabel from '../ui/FloatingLabel';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { HALT_ITEMS } from '../../constants/phases';

export default function HaltCard() {
  return (
    <View style={styles.container}>
      {/* Floating H-A-L-T non-clickable reminder badges */}
      <View style={styles.floatingRow}>
        <FloatingLabel label="H • Lapar?" delayMs={0} offsetY={6} />
        <FloatingLabel label="A • Marah?" delayMs={300} offsetY={8} />
        <FloatingLabel label="L • Sepi?" delayMs={600} offsetY={6} />
        <FloatingLabel label="T • Lelah?" delayMs={900} offsetY={7} />
      </View>

      {/* Main Introspective Card */}
      <View style={styles.card}>
        <Typography variant="captionMedium" color={COLORS.sage[700]}>
          EVALUASI 4 KEBUTUHAN DASAR
        </Typography>

        <Typography variant="h2" style={styles.title}>
          Apakah ini emosi asli, atau tubuhmu yang kehabisan daya?
        </Typography>

        <View style={styles.itemsList}>
          {HALT_ITEMS.map((item) => (
            <View key={item.key} style={styles.itemRow}>
              <View style={styles.letterCircle}>
                <Typography variant="bodyMedium" color={COLORS.white} style={styles.letterText}>
                  {item.key}
                </Typography>
              </View>

              <View style={styles.itemContent}>
                <Typography variant="bodyMedium" color={COLORS.earth[900]}>
                  {item.label}
                </Typography>
                <Typography variant="caption" color={COLORS.earth[500]} style={styles.itemQuestion}>
                  {item.question}
                </Typography>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  floatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.xs,
    minHeight: 44,
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
  itemsList: {
    gap: SPACING.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.sage[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    fontWeight: '700',
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemQuestion: {
    lineHeight: 18,
  },
});
