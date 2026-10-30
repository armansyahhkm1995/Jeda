import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS, SERIF_FONT } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';
import { secureStorage } from '../../utils/secure-store';

export default function OtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(58);
  const inputRef = useRef<TextInput>(null);

  const tempPhone = useAuthStore((s) => s.tempPhone);
  const tempEmail = useAuthStore((s) => s.tempEmail);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const { triggerWarning, triggerPhaseChange, triggerBreathTick } = useHaptics();

  const isEmail = Boolean(tempEmail && !tempPhone);
  const destination = tempPhone || tempEmail || '+62 812-3456-7890';

  // Resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleVerify = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6) return;

    setError(null);
    const isValid = await verifyOtp(codeToVerify);

    if (isValid) {
      triggerPhaseChange();
      // Periksa apakah pengguna sudah memiliki PIN (Alur Login seperti Flip/Bank: cukup 1x PIN)
      const userHasPin = await secureStorage.hasPin();
      if (userHasPin) {
        useAuthStore.setState({ tempPin: null });
        router.push('/(auth)/confirm-pin' as any);
      } else {
        // Pengguna baru (Daftar): Buat PIN baru lalu konfirmasi ulang (2x PIN)
        router.push('/(auth)/create-pin' as any);
      }
    } else {
      triggerWarning();
      setError('Kode yang Anda masukkan salah. Coba lagi.');
      // Keep entered digits in red as shown in Figma screenshot
    }
  };

  const handleOtpChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
    if (error) setError(null);
    if (cleaned.length > otp.length) {
      triggerBreathTick();
    }
    if (cleaned.length === 6) {
      handleVerify(cleaned);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setCountdown(58);
    setError(null);
    setOtp('');
    await sendOtp();
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <ScreenWrapper style={styles.screen}>
      <View style={styles.container}>
        {/* Top Content */}
        <View style={styles.topSection}>
          {/* Back Chevron */}
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
            {isEmail ? 'Cek Email Anda' : 'Cek WhatsApp Anda'}
          </Typography>

          <Typography variant="body" color={COLORS.brand.textMuted} style={styles.subtitle}>
            Kami baru saja mengirimkan 6 digit kode keamanan ke{' '}
            <Typography variant="bodyMedium" color={COLORS.brand.primary} style={styles.destinationHighlight}>
              {destination}.
            </Typography>
          </Typography>

          {/* 6 Digit OTP Boxes with full touch target */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            style={styles.boxesContainer}
            accessibilityRole="none"
          >
            {/* Hidden native input */}
            <TextInput
              ref={inputRef}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              style={styles.hiddenInput}
              caretHidden
            />

            <View style={styles.boxesRow}>
              {Array.from({ length: 6 }).map((_, index) => {
                const char = otp[index] || '';
                const isCurrent = index === otp.length;
                const hasChar = Boolean(char);

                return (
                  <View
                    key={index}
                    style={[
                      styles.box,
                      isCurrent && !error ? styles.boxCurrent : null,
                      hasChar && !error ? styles.boxFilled : null,
                      error ? styles.boxError : null,
                    ]}
                  >
                    <Typography
                      variant="h2"
                      style={[styles.boxText, error ? styles.boxTextError : null]}
                    >
                      {char}
                    </Typography>
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>

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

          {/* Resend Link */}
          <View style={styles.resendRow}>
            <Typography variant="caption" color={COLORS.brand.textMuted}>
              Belum menerima kode?{' '}
            </Typography>
            <TouchableOpacity
              disabled={countdown > 0}
              onPress={handleResend}
              accessibilityRole="button"
            >
              <Typography
                variant="captionMedium"
                color={COLORS.brand.primary}
                style={countdown > 0 ? styles.resendDisabled : null}
              >
                Kirim ulang {countdown > 0 ? `(${formatCountdown(countdown)})` : ''}
              </Typography>
            </TouchableOpacity>
          </View>
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
  destinationHighlight: {
    fontWeight: '700',
  },
  boxesContainer: {
    position: 'relative',
    marginVertical: SPACING.md,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.0001,
    fontSize: 1,
    color: 'transparent',
    zIndex: 10,
  },
  boxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box: {
    width: 46,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: COLORS.brand.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxCurrent: {
    borderColor: COLORS.brand.primary,
  },
  boxFilled: {
    borderColor: COLORS.brand.border,
    backgroundColor: '#FFFFFF',
  },
  boxError: {
    borderColor: COLORS.brand.errorBorder,
    backgroundColor: '#FFFFFF',
  },
  boxText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.brand.textDark,
  },
  boxTextError: {
    color: COLORS.brand.textDark,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    marginBottom: SPACING.xs,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  resendDisabled: {
    fontWeight: '600',
  },
});
