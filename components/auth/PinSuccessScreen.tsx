import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS, SERIF_FONT } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';

export default function PinSuccessScreen() {
  const router = useRouter();
  const { triggerPhaseChange } = useHaptics();

  const handleStartApp = () => {
    triggerPhaseChange();
    router.replace('/(checkin)' as any);
  };

  return (
    <ScreenWrapper style={styles.screen}>
      <View style={styles.container}>
        {/* Centered Celebration Content */}
        <View style={styles.centerContent}>
          {/* Success Checkmark Circle Badge */}
          <View style={styles.iconCircle}>
            <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
              <Circle
                cx="22"
                cy="22"
                r="18"
                stroke={COLORS.brand.primary}
                strokeWidth="2"
                fill="none"
              />
              <Path
                d="M14 22L19.5 27.5L30 17"
                stroke={COLORS.brand.primary}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <Typography variant="h1" align="center" style={styles.title}>
            PIN Berhasil Dibuat
          </Typography>

          <Typography variant="body" color={COLORS.brand.textMuted} align="center" style={styles.subtitle}>
            PIN keamanan Anda sudah aktif. Akun Anda kini terlindungi lebih aman.
          </Typography>
        </View>

        {/* Bottom Area */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleStartApp}
            style={styles.primaryButton}
            accessibilityRole="button"
          >
            <Typography variant="bodyMedium" color={COLORS.white} style={styles.buttonText}>
              Mulai Perjalanan Jeda
            </Typography>
          </TouchableOpacity>

          <Typography variant="caption" color={COLORS.brand.textPlaceholder} align="center" style={styles.bottomCaption}>
            Jaga PIN Anda tetap rahasia dan hanya untuk Anda.
          </Typography>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.brand.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.brand.chipBg,
    borderWidth: 1.5,
    borderColor: COLORS.brand.chipBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: SERIF_FONT,
    color: COLORS.brand.textDark,
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 290,
  },
  footer: {
    gap: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.brand.primary,
    borderRadius: RADIUS.pill,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  bottomCaption: {
    fontSize: 12,
  },
});
