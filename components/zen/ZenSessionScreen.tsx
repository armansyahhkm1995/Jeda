import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import ZenHumanIllustration from './ZenHumanIllustration';
import SessionComplete from './SessionComplete';
import { COLORS, SPACING, RADIUS, SERIF_FONT } from '../../constants/theme';
import { useSessionStore } from '../../store/useSessionStore';
import { TECHNIQUES_MAP } from '../../constants/techniques';
import { useHaptics } from '../../hooks/useHaptics';

export default function ZenSessionScreen() {
  const router = useRouter();
  const techniqueId = useSessionStore((s) => s.techniqueId);
  const currentPhase = useSessionStore((s) => s.currentPhase);
  const phaseTimer = useSessionStore((s) => s.phaseTimer);
  const isActive = useSessionStore((s) => s.isActive);
  const isCompleted = useSessionStore((s) => s.isCompleted);

  const tickTimer = useSessionStore((s) => s.tickTimer);
  const nextPhase = useSessionStore((s) => s.nextPhase);
  const pauseSession = useSessionStore((s) => s.pauseSession);
  const resumeSession = useSessionStore((s) => s.resumeSession);
  const completeSession = useSessionStore((s) => s.completeSession);
  const resetSession = useSessionStore((s) => s.resetSession);

  const { triggerPhaseChange, triggerButtonPress } = useHaptics();

  const technique = techniqueId ? TECHNIQUES_MAP[techniqueId] : null;

  // Interval hitungan mundur 1 detik
  useEffect(() => {
    if (!isActive || isCompleted) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isCompleted, tickTimer]);

  if (isCompleted) {
    return <SessionComplete />;
  }

  if (!technique) {
    return (
      <ScreenWrapper style={styles.screen}>
        <View style={styles.loadingContainer}>
          <Typography variant="body">Memuat sesi regulasi...</Typography>
        </View>
      </ScreenWrapper>
    );
  }

  const activePhaseConfig = technique.phases[currentPhase];

  const handleTogglePlay = () => {
    triggerButtonPress();
    if (isActive) {
      pauseSession();
    } else {
      resumeSession();
    }
  };

  const handleNextAction = () => {
    triggerPhaseChange();
    if (currentPhase === 'C') {
      completeSession();
    } else {
      nextPhase();
    }
  };

  const handleBack = () => {
    triggerButtonPress();
    resetSession();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/pustaka' as any);
    }
  };

  // Label langkah fase A/B/C
  const phaseBadgeLabel =
    currentPhase === 'A'
      ? 'Fase A • Persiapan'
      : currentPhase === 'B'
      ? 'Fase B • Aksi Inti'
      : 'Fase C • Pelepasan';

  // Penjelasan deskriptif sesuai mockup Figma
  const headline = activePhaseConfig.headline || activePhaseConfig.label;
  const copy = activePhaseConfig.copy;
  const subCopy = activePhaseConfig.subCopy || (
    currentPhase === 'A'
      ? 'Ambil waktu untuk bersiap.'
      : currentPhase === 'B'
      ? 'Tahan dan rasakan kekuatannya.'
      : 'Biarkan bahumu turun santai.'
  );

  return (
    <ScreenWrapper style={styles.screen}>
      {/* 
        Top Bar Bersih (Sesuai Permintaan #3): 
        - Tombol 'x tutup' dan timer di kanan atas TELAH DIHAPUS.
        - Hanya menyisakan navigasi kembali halus di kiri dan nama regulasi halus di tengah.
      */}
      <View style={styles.cleanTopBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Pustaka Regulasi"
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18L9 12L15 6"
              stroke="#4E5C53"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <Typography variant="captionMedium" style={styles.topBarTitle}>
          {technique.name}
        </Typography>

        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 
          1. ILUSTRASI (Di Tengah Layar - Sesuai Permintaan #2 & #5)
          - Model orang minimalis garis ala SketchUp scale figure
          - Lingkaran konsentris riak zen (sage green)
          - Fase A: Diam mematung
          - Fase B: Bergerak aksi inti
          - Fase C: Kembali diam rileks
        */}
        <View style={styles.illustrationWrapper}>
          <ZenHumanIllustration
            techniqueId={technique.id}
            phase={currentPhase}
            isActive={isActive}
            circleLabel={activePhaseConfig.circleLabel}
          />
        </View>

        {/* 
          2. FASE A/B/C BADGE (Tepat di Bawah Ilustrasi - Sesuai Permintaan #1 & #5)
        */}
        <View style={styles.phaseBadgeRow}>
          <View style={styles.phasePill}>
            <View
              style={[
                styles.phaseDot,
                currentPhase === 'A' && styles.phaseDotA,
                currentPhase === 'B' && styles.phaseDotB,
                currentPhase === 'C' && styles.phaseDotC,
              ]}
            />
            <Typography variant="captionMedium" style={styles.phasePillText}>
              {phaseBadgeLabel}
            </Typography>
          </View>
        </View>

        {/* 
          3. TIMER (Tepat di Bawah Fase A/B/C - Sesuai Permintaan #4 & #5)
          - Format angka langsung (10, 35, 15) tanpa 00:45
        */}
        <View style={styles.timerRow}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="13" r="8" stroke="#2D5A38" strokeWidth={2} />
            <Path d="M12 9v4l2.5 1.5" stroke="#2D5A38" strokeWidth={2} strokeLinecap="round" />
            <Path d="M10 2h4M12 2v3" stroke="#2D5A38" strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <Typography style={styles.timerNumber}>
            {phaseTimer}
          </Typography>
        </View>

        {/* 
          4. PENJELASAN DESKRIPTIF (Tepat di Bawah Timer - Sesuai Permintaan #5 & Mockup UI)
          - Judul besar Serif
          - Paragraf deskriptif
          - Catatan miring (italic)
        */}
        <View style={styles.descriptiveSection}>
          <Typography variant="h1" style={styles.headlineSerif}>
            {headline}
          </Typography>

          <Typography variant="body" style={styles.copyParagraph}>
            {copy}
          </Typography>

          {subCopy ? (
            <Typography variant="caption" style={styles.subCopyItalic}>
              {subCopy}
            </Typography>
          ) : null}
        </View>
      </ScrollView>

      {/* 
        5. BOTTOM BAR (Aksi Kontrol - Sesuai Permintaan #5)
        - Button Lanjut ke Fase Berikutnya / Saya Sudah Lebih Tenang
        - Button Jeda / Lanjutkan Sesi
      */}
      <View style={styles.bottomBar}>
        {/* Tombol Utama: Sesuai mockup "Saya Sudah Lebih Tenang" / Lanjut */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNextAction}
          style={styles.primaryPillButton}
          accessibilityRole="button"
          accessibilityLabel={
            currentPhase === 'C'
              ? 'Saya Sudah Lebih Tenang'
              : 'Lanjut ke fase berikutnya'
          }
        >
          <Typography variant="bodyLarge" style={styles.primaryPillText}>
            {currentPhase === 'C'
              ? 'Saya Sudah Lebih Tenang'
              : 'Lanjut ke Fase Berikutnya →'}
          </Typography>
        </TouchableOpacity>

        {/* Tombol Jeda / Lanjutkan Sesi */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleTogglePlay}
          style={styles.secondaryPauseButton}
          accessibilityRole="button"
          accessibilityLabel={isActive ? 'Jeda sesi' : 'Lanjutkan sesi'}
        >
          <Typography variant="captionMedium" style={styles.secondaryPauseText}>
            {isActive ? '⏸ Jeda Latihan' : '▶ Lanjutkan Latihan'}
          </Typography>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FAF8F5',
    flex: 1,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cleanTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 13,
    color: '#717D74',
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  topBarSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  phaseBadgeRow: {
    marginTop: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF5F0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8E8DC',
  },
  phaseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  phaseDotA: {
    backgroundColor: '#8FAFA0',
  },
  phaseDotB: {
    backgroundColor: '#2D5A38',
  },
  phaseDotC: {
    backgroundColor: '#437852',
  },
  phasePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D5A38',
    letterSpacing: 0.3,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 16,
  },
  timerNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D5A38',
    fontVariant: ['tabular-nums'],
  },
  descriptiveSection: {
    alignItems: 'center',
    maxWidth: 340,
    gap: 10,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  headlineSerif: {
    fontFamily: SERIF_FONT,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    color: '#1E2522',
    textAlign: 'center',
  },
  copyParagraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B554F',
    textAlign: 'center',
  },
  subCopyItalic: {
    fontSize: 13,
    lineHeight: 18,
    color: '#717D74',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 2,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 8,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    gap: 10,
  },
  primaryPillButton: {
    width: '100%',
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#7A9680',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D5A38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  primaryPillText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5A38',
  },
  secondaryPauseButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  secondaryPauseText: {
    fontSize: 13,
    color: '#717D74',
    fontWeight: '500',
  },
});
