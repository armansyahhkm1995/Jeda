import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import NumericKeypad from './NumericKeypad';
import { COLORS, SPACING, SERIF_FONT } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function CreatePinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const setTempPin = useAuthStore((s) => s.setTempPin);
  const { triggerPhaseChange } = useHaptics();

  const handleDigit = (digit: string) => {
    if (pin.length >= 6) return;
    const nextPin = pin + digit;
    setPin(nextPin);

    if (nextPin.length === 6) {
      setTempPin(nextPin);
      triggerPhaseChange();
      // Smooth auto-advance to confirmation screen
      setTimeout(() => {
        router.push('/(auth)/confirm-pin' as any);
      }, 200);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  return (
    <ScreenWrapper style={styles.screen}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topSection}>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(auth)' as any);
              }
            }}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Typography variant="h2" style={styles.backChevron}>
              ‹
            </Typography>
          </TouchableOpacity>

          <Typography variant="h1" style={styles.title}>
            Buat PIN Keamanan
          </Typography>

          <Typography variant="body" color={COLORS.brand.textMuted} style={styles.subtitle}>
            Agar lebih cepat masuk di kemudian hari, buat 6 digit PIN rahasia Anda.
          </Typography>

          {/* 6 Circular Outline Dots */}
          <View style={styles.dotsRow}>
            {Array.from({ length: 6 }).map((_, index) => {
              const isFilled = index < pin.length;
              return (
                <View
                  key={index}
                  style={[styles.dot, isFilled ? styles.dotFilled : styles.dotEmpty]}
                />
              );
            })}
          </View>
        </View>

        {/* On-screen Numeric Keypad */}
        <View style={styles.keypadWrapper}>
          <NumericKeypad
            onPressDigit={handleDigit}
            onPressDelete={handleDelete}
            disabled={pin.length >= 6}
          />
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
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingTop: SPACING.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    marginLeft: -4,
  },
  backChevron: {
    fontSize: 32,
    color: COLORS.brand.textDark,
    lineHeight: 32,
  },
  title: {
    fontSize: 26,
    fontFamily: SERIF_FONT,
    color: COLORS.brand.textDark,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: SPACING.lg,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotEmpty: {
    borderWidth: 1.5,
    borderColor: COLORS.brand.primary,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: COLORS.brand.primary,
    borderWidth: 1.5,
    borderColor: COLORS.brand.primary,
  },
  keypadWrapper: {
    paddingBottom: SPACING.sm,
  },
});
