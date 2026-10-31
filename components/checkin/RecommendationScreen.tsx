import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useCheckinStore } from '../../store/useCheckinStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useRecommendation } from '../../hooks/useRecommendation';
import { TANDA_TUBUH_MAPPING } from '../../constants/body-signals';
import { useHaptics } from '../../hooks/useHaptics';

export default function RecommendationScreen() {
  const router = useRouter();
  const todaySignal = useCheckinStore((s) => s.todaySignal);
  const todayIntensity = useCheckinStore((s) => s.todayIntensity);
  const startSession = useSessionStore((s) => s.startSession);
  const recommendation = useRecommendation();
  const { triggerPhaseChange } = useHaptics();

  const isMild = todayIntensity === 'ringan';
  const signalInfo = todaySignal ? TANDA_TUBUH_MAPPING[todaySignal] : null;
  const primaryTech = recommendation?.primary;

  const handleStartZenSession = () => {
    if (!primaryTech) return;
    triggerPhaseChange();
    startSession(primaryTech.id, 'checkin', todaySignal || undefined, todayIntensity || undefined);
    router.push('/(checkin)/session' as any);
  };

  const handleSkipToHome = () => {
    router.replace('/(tabs)' as any);
  };

  if (!primaryTech) {
    return (
      <ScreenWrapper style={styles.container}>
        <Typography variant="body">Memuat rekomendasi...</Typography>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable style={styles.container}>
      <View style={styles.content}>
        {/* Header Tag */}
        <View style={styles.badgeRow}>
          <Badge
            label={isMild ? 'Intensitas Ringan' : 'Intensitas ' + (todayIntensity === 'kuat' ? 'Kuat' : 'Sedang')}
            intensity={todayIntensity || 'sedang'}
            variant="solid"
          />
        </View>

        <Typography variant="h1" style={styles.title}>
          {isMild ? 'Kapasitasmu Masih Baik' : 'Rekomendasi Jeda Saraf'}
        </Typography>

        <Typography variant="body" color={COLORS.earth[500]} style={styles.subtitle}>
          {isMild
            ? 'Sistem sarafmu berada dalam zona stabil. Kamu bisa mengambil jeda pemeliharaan singkat atau langsung melanjutkan harimu.'
            : signalInfo?.condition || 'Sistem sarafmu membutuhkan jeda untuk meredakan ketegangan akut.'}
        </Typography>

        {/* Recommended Technique Card */}
        <Card variant="sage" padding="lg" style={styles.techCard}>
          <View style={styles.cardHeader}>
            <View>
              <Typography variant="captionMedium" color={COLORS.sage[700]}>
                TEKNIK YANG DISARANKAN
              </Typography>
              <Typography variant="h2" color={COLORS.sage[900]} style={styles.techName}>
                {primaryTech.name}
              </Typography>
              <Typography variant="bodyMedium" color={COLORS.sage[800]}>
                {primaryTech.subtitle}
              </Typography>
            </View>
          </View>

          <Typography variant="body" color={COLORS.earth[800]} style={styles.techDescription}>
            {primaryTech.description}
          </Typography>

          <View style={styles.neuroBlock}>
            <Typography variant="captionMedium" color={COLORS.sage[900]}>
              🧠 Mengapa ini bekerja:
            </Typography>
            <Typography variant="caption" color={COLORS.earth[700]} style={styles.neuroText}>
              {primaryTech.neuroBio}
            </Typography>
          </View>

          <View style={styles.durationPill}>
            <Typography variant="captionMedium" color={COLORS.sage[800]}>
              ⏱ Durasi: ~{primaryTech.durationEstimateMinutes} Menit
            </Typography>
          </View>
        </Card>
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Button
          label={isMild ? 'Ambil Jeda Singkat (2 Menit)' : 'Mulai Latihan Sekarang'}
          variant="primary"
          onPress={handleStartZenSession}
        />

        {isMild ? (
          <Button
            label="Lanjut ke Beranda"
            variant="ghost"
            onPress={handleSkipToHome}
          />
        ) : (
          <TouchableOpacity
            onPress={handleSkipToHome}
            style={styles.laterButton}
            accessibilityRole="button"
          >
            <Typography variant="captionMedium" color={COLORS.earth[500]} align="center">
              Nanti saja, langsung ke Beranda
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
  },
  content: {
    paddingTop: SPACING.md,
  },
  badgeRow: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 26,
    marginBottom: 4,
  },
  subtitle: {
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  techCard: {
    gap: SPACING.md,
    borderRadius: RADIUS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  techName: {
    marginTop: 2,
  },
  techDescription: {
    lineHeight: 22,
  },
  neuroBlock: {
    backgroundColor: COLORS.cream[50],
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.sage[200],
    gap: 2,
  },
  neuroText: {
    lineHeight: 18,
  },
  durationPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.cream[100],
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  footer: {
    marginTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    gap: SPACING.xs,
  },
  laterButton: {
    paddingVertical: SPACING.sm,
  },
});
