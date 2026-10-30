import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import NumericKeypad from './NumericKeypad';
import { COLORS, SPACING, SERIF_FONT } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function ConfirmPinScreen() {
  const router = useRouter();
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const setupPin = useAuthStore((s) => s.setupPin);
  const tempPin = useAuthStore((s) => s.tempPin);
  const verifySecurityPin = useAuthStore((s) => s.verifySecurityPin);
  const loginWithSecurityPin = useAuthStore((s) => s.loginWithSecurityPin);
  const { triggerWarning, triggerPhaseChange } = useHaptics();

  // Jika tempPin tidak ada, berarti pengguna sedang dalam mode LOGIN dengan PIN
  const isLoginMode = !tempPin;

  const handleDigit = async (digit: string) => {
    if (confirmPin.length >= 6 || isSaving) return;
    const nextPin = confirmPin + digit;
    setConfirmPin(nextPin);
    if (error) setError(null);

    if (nextPin.length === 6) {
      if (isLoginMode) {
        // Mode Login: Verifikasi PIN yang tersimpan (1 kali saja)
        setIsSaving(true);
        const isValid = await loginWithSecurityPin(nextPin);
        setIsSaving(false);

        if (isValid) {
          triggerPhaseChange();
          router.replace('/(checkin)' as any);
        } else {
          triggerWarning();
          setError('PIN salah. Silakan coba kembali.');
          setTimeout(() => {
            setConfirmPin('');
          }, 600);
        }
      } else {
        // Mode Setup/Onboarding: Konfirmasi PIN Baru
        if (nextPin !== tempPin) {
          triggerWarning();
          setError('PIN tidak cocok. Silakan masukkan ulang.');
          setTimeout(() => {
            setConfirmPin('');
          }, 600);
          return;
        }

        // Valid match: save securely
        setIsSaving(true);
        const success = await setupPin(nextPin);
        setIsSaving(false);

        if (success) {
          triggerPhaseChange();
          router.push('/(auth)/pin-success' as any);
        } else {
          triggerWarning();
          setError('Gagal menyimpan PIN. Silakan coba kembali.');
        }
      }
    }
  };

  const handleDelete = () => {
    if (confirmPin.length > 0 && !isSaving) {
      setConfirmPin((prev) => prev.slice(0, -1));
      if (error) setError(null);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)' as any);
    }
  };

  return (
    <ScreenWrapper style={styles.screen}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topSection}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Typography variant="h2" style={styles.backChevron}>
              ‹
            </Typography>
          </TouchableOpacity>

          <Typography variant="h1" style={styles.title}>
            {isLoginMode ? 'Masukkan PIN Keamanan' : 'Ulangi PIN Anda'}
          </Typography>

          <Typography variant="body" color={COLORS.brand.textMuted} style={styles.subtitle}>
            {isLoginMode
              ? 'Masukkan 6 digit PIN rahasiamu untuk masuk ke Jeda.'
              : 'Masukkan kembali 6 digit PIN untuk memastikan Anda mengingatnya.'}
          </Typography>

          {/* 6 Circular Outline Dots */}
          <View style={styles.dotsRow}>
            {Array.from({ length: 6 }).map((_, index) => {
              const isFilled = index < confirmPin.length;
              const hasError = Boolean(error);

              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    isFilled ? styles.dotFilled : styles.dotEmpty,
                    hasError ? styles.dotError : null,
                  ]}
                />
              );
            })}
          </View>

          {/* Error Message */}
          {error && (
            <Typography
              variant="caption"
              color={COLORS.brand.error}
              align="center"
              style={styles.errorText}
            >
              {error}
            </Typography>
          )}
        </View>

        {/* On-screen Numeric Keypad */}
        <View style={styles.keypadWrapper}>
          <NumericKeypad
            onPressDigit={handleDigit}
            onPressDelete={handleDelete}
            disabled={confirmPin.length >= 6 || isSaving}
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
  dotError: {
    borderColor: COLORS.brand.errorBorder,
    backgroundColor: COLORS.brand.errorBg,
  },
  errorText: {
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
  keypadWrapper: {
    paddingBottom: SPACING.sm,
  },
});
