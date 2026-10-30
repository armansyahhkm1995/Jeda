import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import LucideMailIcon from '../ui/LucideMailIcon';
import { COLORS, SPACING, RADIUS, SERIF_FONT } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setTempEmail = useAuthStore((s) => s.setTempEmail);
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const { triggerWarning, triggerPhaseChange } = useHaptics();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) {
      setError(null);
    }
  };

  const handleSendOtp = async () => {
    const trimmed = email.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(trimmed)) {
      triggerWarning();
      setError('Format email tidak valid. Periksa kembali alamat email Anda.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTempEmail(trimmed);
    await sendOtp();
    setIsLoading(false);
    triggerPhaseChange();
    router.push('/(auth)/otp' as any);
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
            Masuk atau Daftar
          </Typography>

          <Typography variant="body" color={COLORS.brand.textMuted} style={styles.subtitle}>
            Masukkan alamat email Anda untuk menyimpan riwayat perjalanan jeda Anda.
          </Typography>

          {/* Form Area */}
          <View style={styles.formArea}>
            <Typography variant="caption" color={COLORS.brand.textMuted} style={styles.inputLabel}>
              Alamat Email
            </Typography>

            <View style={[styles.inputContainer, error ? styles.inputError : null]}>
              <View style={styles.iconWrapper}>
                <LucideMailIcon size={18} color={COLORS.brand.textMuted} strokeWidth={1.6} />
              </View>

              <View style={styles.divider} />

              <TextInput
                value={email}
                onChangeText={handleEmailChange}
                placeholder="namaanda@gmail.com"
                placeholderTextColor={COLORS.brand.textPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                style={styles.input}
              />
            </View>

            {error && (
              <Typography variant="caption" color={COLORS.brand.error} style={styles.errorText}>
                {error}
              </Typography>
            )}
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSendOtp}
            disabled={isLoading}
            style={[styles.primaryButton, isLoading ? styles.buttonLoading : null]}
            accessibilityRole="button"
          >
            <Typography variant="bodyMedium" color={COLORS.white} style={styles.buttonText}>
              {isLoading ? 'Mengirim...' : 'Kirim Kode ke Email Saya'}
            </Typography>
          </TouchableOpacity>
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
  formArea: {
    marginTop: SPACING.xs,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: COLORS.brand.border,
    paddingHorizontal: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.brand.errorBorder,
  },
  iconWrapper: {
    paddingRight: SPACING.xs,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.brand.border,
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: COLORS.brand.textDark,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    paddingBottom: SPACING.sm,
  },
  primaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
