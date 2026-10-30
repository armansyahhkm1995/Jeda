import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS, SERIF_FONT } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function PhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setTempPhone = useAuthStore((s) => s.setTempPhone);
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const { triggerWarning, triggerPhaseChange } = useHaptics();

  const handlePhoneChange = (text: string) => {
    const clean = text.replace(/\D/g, '');
    setPhoneNumber(clean);
    if (error) {
      setError(null);
    }
  };

  const handleSendOtp = async () => {
    const clean = phoneNumber.trim();
    if (clean.length < 9) {
      triggerWarning();
      setError('Nomor WhatsApp tidak ditemukan. Periksa kembali nomor yang Anda masukkan.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const fullPhone = '+62 ' + (clean.startsWith('0') ? clean.slice(1) : clean);
    setTempPhone(fullPhone);

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
            Masukkan nomor WhatsApp Anda untuk menyimpan riwayat perjalanan jeda Anda.
          </Typography>

          {/* Form Area */}
          <View style={styles.formArea}>
            <Typography variant="caption" color={COLORS.brand.textMuted} style={styles.inputLabel}>
              Nomor WhatsApp
            </Typography>

            <View style={[styles.inputContainer, error ? styles.inputError : null]}>
              <View style={styles.prefixWrapper}>
                <Typography variant="bodyMedium" color={COLORS.brand.textDark} style={styles.prefixText}>
                  +62
                </Typography>
              </View>

              <View style={styles.divider} />

              <TextInput
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                placeholder="812 3456 7890"
                placeholderTextColor={COLORS.brand.textPlaceholder}
                keyboardType="phone-pad"
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
              {isLoading ? 'Mengirim...' : 'Kirim Kode ke Handphone Saya'}
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
  prefixWrapper: {
    paddingRight: SPACING.sm,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: '500',
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
