import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import EmotionCapacityWidget from '../checkin/EmotionCapacityWidget';
import SosPills from './SosPills';
import CheckinSummaryCard from './CheckinSummaryCard';
import PartnerStatusCard from './PartnerStatusCard';
import PartnerModePreview from './PartnerModePreview';
import { COLORS, SPACING, SERIF_FONT } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useCheckinStore } from '../../store/useCheckinStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useHaptics } from '../../hooks/useHaptics';
import { normalizeSignalKey } from '../../utils/ranking-algorithm';
import { TANDA_TUBUH_MAPPING } from '../../constants/body-signals';
import { BodySignalKey } from '../../types';
import { getTodayIsoString } from '../../utils/date';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const history = useCheckinStore((s) => s.history);
  const isCompletedToday = useCheckinStore((s) => s.isCompletedToday);
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

  const todayIso = getTodayIsoString();
  const todayRecords = history.filter((r) => r.date === todayIso);
  const hasCheckedIn = isCompletedToday && todayRecords.length > 0;

  const getGreetingTime = () => {
    const hours = new Date().getHours();
    if (hours < 11) return 'SELAMAT PAGI';
    if (hours < 15) return 'SELAMAT SIANG';
    if (hours < 18) return 'SELAMAT SORE';
    return 'SELAMAT MALAM';
  };

  const userName = user?.name ? user.name.split(' ')[0].toUpperCase() : 'RANI';

  return (
    <ScreenWrapper scrollable style={styles.container}>
      {/* 1. Top Greeting Section */}
      <View style={styles.greetingHeader}>
        <Typography variant="caption" color={COLORS.brand.primary} style={styles.greetingTime}>
          {getGreetingTime()}, {userName}
        </Typography>
        <Typography variant="h1" style={styles.greetingTitle}>
          {'Bagaimana sisa\nkesabaranmu hari ini?'}
        </Typography>
      </View>

      {/* 2. Top Card: CHECK-IN HARIAN (Unchecked) or KAPASITAS EMOSI (Checked) */}
      <View style={styles.section}>
        <EmotionCapacityWidget />
      </View>

      {/* 3. Butuh Bantuan Cepat? Pills List */}
      <View style={styles.section}>
        <SosPills onSelectSignal={handleSelectSignal} />
      </View>

      {/* 4. Ringkasan Check-in (Shown only when user has checked in today) */}
      {hasCheckedIn && (
        <View style={styles.section}>
          <CheckinSummaryCard />
        </View>
      )}

      {/* 4B. Status Pasangan Terhubung (Realtime Sync) */}
      <View style={styles.section}>
        <PartnerStatusCard />
      </View>

      {/* 5. Mode Pasangan + Analitik (PRO Feature Card - Hilang otomatis jika sudah PRO) */}
      {!user?.isPro && (
        <View style={styles.section}>
          <PartnerModePreview />
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  greetingHeader: {
    marginBottom: SPACING.lg,
    paddingHorizontal: 2,
  },
  greetingTime: {
    fontWeight: '700',
    letterSpacing: 0.8,
    fontSize: 12,
    marginBottom: 6,
  },
  greetingTitle: {
    fontFamily: SERIF_FONT,
    fontSize: 27,
    lineHeight: 33,
    color: '#1E2922',
    fontWeight: '700',
  },
  section: {
    marginBottom: SPACING.lg,
  },
});
