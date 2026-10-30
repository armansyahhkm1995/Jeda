import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useHaptics } from '../../hooks/useHaptics';
import { getTodayIsoString, formatTime } from '../../utils/date';

export default function SessionComplete() {
  const router = useRouter();
  const [partnerNotified, setPartnerNotified] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const techniqueId = useSessionStore((s) => s.techniqueId);
  const bodySignal = useSessionStore((s) => s.bodySignal);
  const intensity = useSessionStore((s) => s.intensity);
  const resetSession = useSessionStore((s) => s.resetSession);
  const addSessionRecord = useAnalyticsStore((s) => s.addSessionRecord);
  const { triggerPhaseChange } = useHaptics();

  const isPartnerLinked = user?.partnerLinked;
  const partnerName = user?.partnerName || 'Pasangan';

  const handleFinish = () => {
    // 1. Record session to Analytics Store
    if (techniqueId) {
      addSessionRecord({
        date: getTodayIsoString(),
        time: formatTime(),
        techniqueId,
        bodySignal,
        intensity: intensity || 'sedang',
        durationSeconds: 120,
        completedFully: true,
      });
    }

    triggerPhaseChange();
    resetSession();

    // 2. Return to Beranda if authenticated, or Welcome screen if not
    if (isAuthenticated) {
      router.replace('/(tabs)' as any);
    } else {
      router.replace('/(auth)' as any);
    }
  };

  const handleNotifyPartner = () => {
    triggerPhaseChange();
    setPartnerNotified(true);
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.content}>
        {/* Zen Completion Icon */}
        <View style={styles.iconCircle}>
          <Typography variant="h1" color={COLORS.sage[600]} style={styles.iconText}>
            🌸
          </Typography>
        </View>

        <Typography variant="h1" align="center" style={styles.title}>
          Jeda Selesai
        </Typography>

        <Typography variant="bodyLarge" color={COLORS.sage[700]} align="center" style={styles.tagline}>
          Tubuhmu Telah Kembali Tenang
        </Typography>

        <Typography variant="body" color={COLORS.earth[500]} align="center" style={styles.description}>
          Amati sensasi rileks di dadamu. Korteks prefrontal kini kembali memegang kendali pikiranmu.
        </Typography>

        {/* Partner Notification Card (if partner linked) */}
        {isPartnerLinked && (
          <Card variant="sage" padding="md" style={styles.partnerCard}>
            <View style={styles.partnerInfo}>
              <Typography variant="bodyMedium" color={COLORS.sage[900]}>
                Mode Pasangan Aktif
              </Typography>
              <Typography variant="caption" color={COLORS.sage[700]}>
                {partnerNotified
                  ? `Sinyal kapasitasmu telah terkirim ke ${partnerName}.`
                  : `Kabari ${partnerName} bahwa kamu baru saja mengambil jeda emosi.`}
              </Typography>
            </View>

            <TouchableOpacity
              disabled={partnerNotified}
              onPress={handleNotifyPartner}
              style={[styles.notifyBtn, partnerNotified && styles.notifyBtnDone]}
              accessibilityRole="button"
            >
              <Typography
                variant="captionMedium"
                color={partnerNotified ? COLORS.sage[600] : COLORS.white}
              >
                {partnerNotified ? '✓ Terkirim' : 'Kabari Pasangan'}
              </Typography>
            </TouchableOpacity>
          </Card>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          label="Saya Sudah Lebih Tenang"
          variant="primary"
          onPress={handleFinish}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.cream[50],
    borderWidth: 2,
    borderColor: COLORS.sage[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  iconText: {
    fontSize: 40,
    lineHeight: 46,
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  tagline: {
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  description: {
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
    textAlign: 'center',
  },
  partnerCard: {
    marginTop: SPACING.xl,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partnerInfo: {
    flex: 1,
    gap: 2,
    marginRight: SPACING.sm,
  },
  notifyBtn: {
    backgroundColor: COLORS.sage[500],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyBtnDone: {
    backgroundColor: COLORS.cream[100],
    borderWidth: 1,
    borderColor: COLORS.sage[300],
  },
  footer: {
    paddingVertical: SPACING.lg,
  },
});
