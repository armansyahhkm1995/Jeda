import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import BotanicalIllustration from './BotanicalIllustration';
import LucideMailIcon from '../ui/LucideMailIcon';
import SomaticSignalIcon from '../ui/SomaticSignalIcon';
import { COLORS, SPACING, RADIUS, SERIF_FONT } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useCheckinStore } from '../../store/useCheckinStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useHaptics } from '../../hooks/useHaptics';
import { getTop6EmergencySignals, normalizeSignalKey } from '../../utils/ranking-algorithm';
import { TANDA_TUBUH_MAPPING } from '../../constants/body-signals';
import { CheckinRecord, BodySignalKey } from '../../types';

// WhatsApp icon
function WhatsAppIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.44 19.65L5.27 16.61L5.07 16.29C4.24 14.98 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.04 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15ZM16.56 14.39C16.31 14.27 15.09 13.67 14.86 13.58C14.64 13.5 14.47 13.46 14.31 13.71C14.14 13.96 13.66 14.52 13.51 14.69C13.37 14.85 13.22 14.87 12.97 14.75C12.72 14.62 11.93 14.37 10.99 13.53C10.26 12.87 9.76 12.07 9.62 11.82C9.47 11.57 9.6 11.44 9.73 11.31C9.84 11.2 9.98 11.02 10.1 10.88C10.23 10.73 10.27 10.63 10.35 10.46C10.43 10.3 10.39 10.15 10.33 10.03C10.27 9.9 9.78 8.7 9.58 8.21C9.38 7.73 9.18 7.79 9.03 7.78C8.89 7.78 8.72 7.77 8.56 7.77C8.39 7.77 8.13 7.83 7.9 8.08C7.67 8.33 7.03 8.93 7.03 10.15C7.03 11.37 7.92 12.55 8.04 12.71C8.16 12.88 9.78 15.37 12.27 16.44C12.86 16.7 13.32 16.85 13.68 16.96C14.27 17.15 14.81 17.12 15.24 17.06C15.71 16.99 16.69 16.46 16.9 15.89C17.1 15.32 17.1 14.83 17.04 14.73C16.98 14.62 16.81 14.52 16.56 14.39Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const deleteAccountPermanently = useAuthStore((s) => s.deleteAccountPermanently);
  const history = useCheckinStore((s) => s.history);
  const pinLoginEnabled = useAuthStore((s) => s.pinLoginEnabled);

  // Jika sudah terotentikasi, langsung arahkan ke Beranda
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)' as any);
    }
  }, [isAuthenticated, router]);

  const [resetDone, setResetDone] = useState(false);
  const [showSimMenu, setShowSimMenu] = useState(false);
  const startSession = useSessionStore((s) => s.startSession);
  const { triggerPhaseChange } = useHaptics();

  const handleSelectSignal = (signalKey: BodySignalKey) => {
    const canonical = normalizeSignalKey(signalKey);
    const signalInfo = TANDA_TUBUH_MAPPING[canonical];
    const techId = signalInfo?.primaryTechnique || 'physiological_sigh';

    triggerPhaseChange();
    startSession(techId, 'sos', canonical, 'kuat');
    router.push('/(checkin)/session' as any);
  };

  // Algoritma Non-AI: Mengurutkan 6 Sinyal Berdasarkan Frekuensi Intensitas Kuat (7 Hari Terakhir)
  const rankedSignals = useMemo(() => {
    return getTop6EmergencySignals(history);
  }, [history]);

  const handleEmailAuth = () => {
    router.push('/(auth)/email' as any);
  };

  const handleReset = async () => {
    await deleteAccountPermanently();
    useCheckinStore.getState().clearHistory();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  // Simulasi Algoritma: Skenario 1 (6x Hampir Meledak, 5x Dada Sesak)
  const handleSimulateScenario1 = () => {
    const mockHistory: CheckinRecord[] = [];
    const now = Date.now();
    for (let i = 0; i < 6; i++) {
      mockHistory.push({
        id: `mock_mel_${i}`,
        date: new Date(now - i * 3600000 * 8).toISOString().split('T')[0],
        time: '10:00',
        bodySignal: 'hampir_meledak',
        intensity: 'kuat',
        createdAt: now - i * 3600000 * 8,
      });
    }
    for (let i = 0; i < 5; i++) {
      mockHistory.push({
        id: `mock_ses_${i}`,
        date: new Date(now - i * 3600000 * 10).toISOString().split('T')[0],
        time: '12:00',
        bodySignal: 'dada_sesak',
        intensity: 'kuat',
        createdAt: now - i * 3600000 * 10,
      });
    }
    useCheckinStore.setState({ history: mockHistory });
  };

  // Simulasi Algoritma: Skenario 2 (7x Rahang Tegang naik ke nomor 1!)
  const handleSimulateScenario2 = () => {
    const mockHistory: CheckinRecord[] = [];
    const now = Date.now();
    for (let i = 0; i < 7; i++) {
      mockHistory.push({
        id: `mock_rah_${i}`,
        date: new Date(now - i * 3600000 * 6).toISOString().split('T')[0],
        time: '09:00',
        bodySignal: 'rahang_tegang',
        intensity: 'kuat',
        createdAt: now - i * 3600000 * 6,
      });
    }
    for (let i = 0; i < 4; i++) {
      mockHistory.push({
        id: `mock_mel_${i}`,
        date: new Date(now - i * 3600000 * 12).toISOString().split('T')[0],
        time: '14:00',
        bodySignal: 'hampir_meledak',
        intensity: 'kuat',
        createdAt: now - i * 3600000 * 12,
      });
    }
    useCheckinStore.setState({ history: mockHistory });
  };

  return (
    <ScreenWrapper style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Branding */}
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            Jeda.
          </Typography>
          <Typography variant="body" color={COLORS.brand.textMuted} style={styles.subtitle}>
            Ruang aman sebelum emosi mengambil alih.
          </Typography>
        </View>

        {/* Botanical Illustration Card */}
        <View style={styles.illustrationWrapper}>
          <BotanicalIllustration />
        </View>

        {/* Emergency Quick Help Section (Algoritma Non-AI Top 6) */}
        <View style={styles.quickHelpSection}>
          <View style={styles.quickHelpHeader}>
            <Typography variant="caption" color={COLORS.brand.textMuted} style={styles.quickHelpTitle}>
              Butuh bantuan cepat?
            </Typography>
            <TouchableOpacity
              onPress={() => setShowSimMenu((prev) => !prev)}
              accessibilityRole="button"
            >
              <Typography variant="caption" color={COLORS.brand.primary} style={styles.simToggle}>
                {showSimMenu ? '▲ Tutup Tes Algoritma' : '⚙️ Tes Algoritma'}
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Dev Simulation Bar for Testing Ranking Changes */}
          {showSimMenu && (
            <View style={styles.simBar}>
              <Typography variant="caption" color={COLORS.brand.textMuted} style={styles.simDesc}>
                Uji perubahan urutan otomatis berbasis riwayat mingguan:
              </Typography>
              <View style={styles.simButtonsRow}>
                <TouchableOpacity
                  onPress={handleSimulateScenario1}
                  style={styles.simBtn}
                  accessibilityRole="button"
                >
                  <Typography variant="captionMedium" color={COLORS.brand.primaryDark}>
                    1. Set 6x Meledak (Top 1)
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSimulateScenario2}
                  style={styles.simBtn}
                  accessibilityRole="button"
                >
                  <Typography variant="captionMedium" color={COLORS.brand.primaryDark}>
                    2. Set 7x Rahang (Top 1)
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Dynamic Top 6 Somatic Signal Pills */}
          <View style={styles.pillsContainer}>
            {rankedSignals.map((signal) => (
              <TouchableOpacity
                key={signal.key}
                activeOpacity={0.8}
                onPress={() => handleSelectSignal(signal.key)}
                style={styles.pill}
                accessibilityRole="button"
                accessibilityLabel={signal.pillLabel}
              >
                <View style={styles.pillLeft}>
                  <View style={styles.pillIconWrapper}>
                    <SomaticSignalIcon signalKey={signal.key} size={20} color={COLORS.brand.primary} />
                  </View>
                  <Typography
                    variant="captionMedium"
                    color={COLORS.brand.primary}
                    style={styles.pillText}
                  >
                    {signal.pillLabel}
                  </Typography>
                </View>

                {signal.strongCount > 0 && (
                  <View style={styles.pillBadge}>
                    <Typography variant="caption" color={COLORS.brand.primaryDark} style={styles.pillBadgeText}>
                      {signal.strongCount}x kuat
                    </Typography>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Actions: Pilihan login lewat Email dan PIN */}
        <View style={styles.footer}>
          {/* Lanjutkan dengan Email */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleEmailAuth}
            style={styles.primaryEmailButton}
            accessibilityRole="button"
          >
            <LucideMailIcon size={18} color={COLORS.white} strokeWidth={1.8} />
            <Typography variant="bodyMedium" color={COLORS.white} style={styles.btnText}>
              Lanjutkan dengan Email
            </Typography>
          </TouchableOpacity>

          {/* Masuk dengan PIN (Opsi ketiga jika PIN diaktifkan) */}
          {pinLoginEnabled && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/(auth)/confirm-pin' as any)}
              style={styles.pinOptionButton}
              accessibilityRole="button"
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="#2D5A38"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M9 12l2 2 4-4"
                  stroke="#2D5A38"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Typography variant="bodyMedium" color="#2D5A38" style={styles.btnText}>
                Masuk dengan PIN
              </Typography>
            </TouchableOpacity>
          )}

          {/* Book Caption */}
          <Typography variant="caption" color={COLORS.brand.textPlaceholder} align="center" style={styles.bookCaption}>
            Pendamping buku "Jeda Sebelum Luka"
          </Typography>

          {/* Dev Reset Option */}
          <TouchableOpacity
            onPress={handleReset}
            style={styles.resetButton}
            accessibilityRole="button"
          >
            <Typography
              variant="caption"
              color={resetDone ? COLORS.status.success : COLORS.brand.textPlaceholder}
              align="center"
            >
              {resetDone ? '✓ Riwayat & Sesi Berhasil Direset' : '🔄 Reset Data Uji (Mulai dari Awal)'}
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.brand.bg,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 32,
    fontFamily: SERIF_FONT,
    color: COLORS.brand.textDark,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.sm,
  },
  quickHelpSection: {
    marginVertical: SPACING.sm,
  },
  quickHelpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickHelpTitle: {
    fontSize: 12,
  },
  simToggle: {
    fontSize: 11,
    fontWeight: '600',
  },
  simBar: {
    backgroundColor: '#FAF5ED',
    borderWidth: 1,
    borderColor: '#E6D7C3',
    borderRadius: 12,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    gap: 6,
  },
  simDesc: {
    fontSize: 11,
  },
  simButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  simBtn: {
    flex: 1,
    backgroundColor: '#EAF1E8',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C4DDC1',
  },
  pillsContainer: {
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.brand.chipBg,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.brand.chipBorder,
  },
  pillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  pillIconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 13,
  },
  pillBadge: {
    backgroundColor: '#D7E8D5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    marginTop: SPACING.md,
    gap: 10,
  },
  primaryEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.brand.primary,
    gap: 10,
  },
  pinOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#EDF5EE',
    borderWidth: 1.2,
    borderColor: '#C8DEC8',
    gap: 10,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookCaption: {
    fontSize: 11,
    marginTop: 4,
  },
  resetButton: {
    paddingVertical: 2,
    alignItems: 'center',
  },
});
