import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import BodySignalSheet from './BodySignalSheet';
import TriggerSelectorSheet from './TriggerSelectorSheet';
import IntensitySelector from './IntensitySelector';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useCheckinStore } from '../../store/useCheckinStore';
import { TANDA_TUBUH_MAPPING } from '../../constants/body-signals';
import { getTriggerInfo } from '../../constants/triggers';
import { normalizeSignalKey } from '../../utils/ranking-algorithm';
import { BodySignalKey, IntensityLevel } from '../../types';
import { useHaptics } from '../../hooks/useHaptics';

export default function CheckinFormScreen() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isTriggerSheetOpen, setIsTriggerSheetOpen] = useState(false);

  const todaySignal = useCheckinStore((s) => s.todaySignal);
  const todayIntensity = useCheckinStore((s) => s.todayIntensity);
  const todayTrigger = useCheckinStore((s) => s.todayTrigger);

  const setSignal = useCheckinStore((s) => s.setSignal);
  const setIntensity = useCheckinStore((s) => s.setIntensity);
  const setTrigger = useCheckinStore((s) => s.setTrigger);
  const submitCheckin = useCheckinStore((s) => s.submitCheckin);
  const { triggerPhaseChange } = useHaptics();

  const canonicalKey = todaySignal ? normalizeSignalKey(todaySignal) : null;
  const selectedSignalInfo = canonicalKey ? TANDA_TUBUH_MAPPING[canonicalKey] : null;

  const selectedTriggerInfo = getTriggerInfo(todayTrigger);

  const handleSubmit = () => {
    if (!todaySignal || !todayIntensity) return;

    submitCheckin();
    triggerPhaseChange();

    // Selesai check-in harian, langsung kembali ke beranda
    router.replace('/(tabs)' as any);
  };

  const handleCancel = () => {
    router.replace('/(tabs)' as any);
  };

  return (
    <ScreenWrapper scrollable style={styles.container}>
      <View style={styles.header}>
        <Typography variant="captionMedium" color={COLORS.sage[700]}>
          CHECK-IN HARIAN
        </Typography>
        <Typography variant="h1" style={styles.title}>
          Sinyal Tubuh Saat Ini
        </Typography>
        <Typography variant="body" color={COLORS.earth[500]} style={styles.subtitle}>
          Beri jeda 1 menit untuk memeriksa keadaan sistem sarafmu sebelum melanjutkan hari.
        </Typography>
      </View>

      <View style={styles.formSection}>
        {/* Step 1: Body Signal Selector */}
        <View style={styles.fieldBlock}>
          <Typography variant="bodyMedium" color={COLORS.earth[900]} style={styles.fieldLabel}>
            1. Apa yang paling dominan kamu rasakan di tubuhmu?
          </Typography>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsSheetOpen(true)}
            style={[styles.pickerButton, selectedSignalInfo && styles.pickerButtonFilled]}
            accessibilityRole="button"
            accessibilityLabel="Pilih reaksi tubuh"
          >
            {selectedSignalInfo ? (
              <Typography variant="bodyMedium" style={styles.selectedLabelText}>
                {selectedSignalInfo.label}
              </Typography>
            ) : (
              <Typography variant="body" color={COLORS.earth[400]}>
                Ketuk untuk memilih reaksi tubuh...
              </Typography>
            )}

            <Typography
              variant="bodyMedium"
              color={COLORS.brand.primary}
              style={styles.pickerActionText}
            >
              {selectedSignalInfo ? 'Ubah ▾' : 'Pilih ▾'}
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Step 2: Intensity Level */}
        <View style={styles.fieldBlock}>
          <IntensitySelector
            value={todayIntensity}
            onChange={(level: IntensityLevel) => setIntensity(level)}
          />
        </View>

        {/* Step 3: Trigger Selector (Dropdown / Sheet berbasis kategori HALT & emosi) */}
        <View style={styles.fieldBlock}>
          <Typography variant="bodyMedium" color={COLORS.earth[900]} style={styles.fieldLabel}>
            3. Apa yang memicu rasa ini? (Opsional)
          </Typography>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsTriggerSheetOpen(true)}
            style={[styles.pickerButton, selectedTriggerInfo && styles.pickerButtonFilled]}
            accessibilityRole="button"
            accessibilityLabel="Pilih pemicu emosi"
          >
            {selectedTriggerInfo ? (
              <Typography variant="bodyMedium" style={styles.selectedLabelText}>
                {selectedTriggerInfo.label}
              </Typography>
            ) : (
              <Typography variant="body" color={COLORS.earth[400]}>
                {todayTrigger ? todayTrigger : 'Ketuk untuk memilih pemicu...'}
              </Typography>
            )}

            <Typography
              variant="bodyMedium"
              color={COLORS.brand.primary}
              style={styles.pickerActionText}
            >
              {selectedTriggerInfo || todayTrigger ? 'Ubah ▾' : 'Pilih ▾'}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Simpan Check-in"
          variant="primary"
          disabled={!todaySignal || !todayIntensity}
          onPress={handleSubmit}
        />

        {/* Tombol secondary "Nanti" tepat di bawah tombol Simpan Check-in */}
        <Button
          label="Nanti"
          variant="ghost"
          onPress={handleCancel}
          style={styles.laterButton}
        />
      </View>

      {/* Body Signal Selection Sheet */}
      <BodySignalSheet
        visible={isSheetOpen}
        selectedSignal={todaySignal}
        onSelect={(sig: BodySignalKey) => setSignal(sig)}
        onClose={() => setIsSheetOpen(false)}
      />

      {/* Trigger Selection Sheet */}
      <TriggerSelectorSheet
        visible={isTriggerSheetOpen}
        selectedTrigger={todayTrigger}
        onSelect={(t) => setTrigger(t.label)}
        onClose={() => setIsTriggerSheetOpen(false)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    paddingTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 26,
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    lineHeight: 22,
  },
  formSection: {
    gap: SPACING.lg,
  },
  fieldBlock: {
    gap: SPACING.xs,
  },
  fieldLabel: {
    marginBottom: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.cream[300],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  pickerButtonFilled: {
    borderColor: COLORS.brand.primary,
    backgroundColor: '#F5F9F6',
  },
  selectedLabelText: {
    fontWeight: '600',
    color: COLORS.brand.textDark,
    fontSize: 15,
    flex: 1,
    marginRight: SPACING.sm,
  },
  pickerActionText: {
    fontWeight: '600',
  },
  footer: {
    marginTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    gap: 12,
  },
  laterButton: {
    minHeight: 46,
  },
});
