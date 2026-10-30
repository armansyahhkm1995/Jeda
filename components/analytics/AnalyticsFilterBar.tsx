import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { BodySignalKey, IntensityLevel } from '../../types';
import { BODY_SIGNAL_LIST } from '../../constants/body-signals';
import { useHaptics } from '../../hooks/useHaptics';

export interface AnalyticsFilterBarProps {
  selectedSignal: BodySignalKey | 'all';
  selectedIntensity: IntensityLevel | 'all';
  onSelectSignal: (signal: BodySignalKey | 'all') => void;
  onSelectIntensity: (intensity: IntensityLevel | 'all') => void;
  onReset: () => void;
}

const INTENSITY_OPTIONS: { key: IntensityLevel | 'all'; label: string; sub: string }[] = [
  { key: 'all', label: 'Semua Intensitas', sub: 'Tampilkan semua tingkat ketegangan' },
  { key: 'ringan', label: 'Ringan (Bobot 12.5)', sub: 'Kapasitas emosi masih prima & aman' },
  { key: 'sedang', label: 'Sedang (Bobot 25.0)', sub: 'Kapasitas mulai berkurang butuh jeda' },
  { key: 'kuat', label: 'Kuat (Bobot 50.0)', sub: 'Kapasitas tipis, butuh rilis fisik segera' },
];

export default function AnalyticsFilterBar({
  selectedSignal,
  selectedIntensity,
  onSelectSignal,
  onSelectIntensity,
  onReset,
}: AnalyticsFilterBarProps) {
  const [isSignalModalOpen, setIsSignalModalOpen] = useState(false);
  const [isIntensityModalOpen, setIsIntensityModalOpen] = useState(false);
  const { triggerBreathTick, triggerButtonPress } = useHaptics();

  const isFilterActive = selectedSignal !== 'all' || selectedIntensity !== 'all';

  // Label tampilan ringkas sinyal tubuh
  const getSignalLabel = () => {
    if (selectedSignal === 'all') return 'Semua Sinyal';
    const found = BODY_SIGNAL_LIST.find((s) => s.key === selectedSignal);
    return found ? found.label.split('/')[0].split('&')[0].trim() : selectedSignal;
  };

  const getIntensityLabel = () => {
    if (selectedIntensity === 'all') return 'Semua Intensitas';
    if (selectedIntensity === 'ringan') return 'Ringan';
    if (selectedIntensity === 'sedang') return 'Sedang';
    if (selectedIntensity === 'kuat') return 'Kuat';
    return selectedIntensity;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Typography variant="captionMedium" style={styles.filterTitle}>
          🔍 FILTER RIWAYAT CHECK-IN
        </Typography>

        {isFilterActive && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              triggerButtonPress();
              onReset();
            }}
            style={styles.resetBtn}
          >
            <Typography variant="caption" color="#CF7356" style={styles.resetText}>
              ✕ Reset Filter
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.pillsRow}>
        {/* Pill 1: Filter Sinyal Tubuh */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            triggerBreathTick();
            setIsSignalModalOpen(true);
          }}
          style={[
            styles.filterPill,
            selectedSignal !== 'all' && styles.filterPillActive,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Filter sinyal tubuh: ${getSignalLabel()}`}
        >
          <Typography
            variant="captionMedium"
            style={[
              styles.pillText,
              selectedSignal !== 'all' && styles.pillTextActive,
            ]}
          >
            Sinyal: {getSignalLabel()} ▾
          </Typography>
        </TouchableOpacity>

        {/* Pill 2: Filter Intensitas */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            triggerBreathTick();
            setIsIntensityModalOpen(true);
          }}
          style={[
            styles.filterPill,
            selectedIntensity !== 'all' && styles.filterPillActive,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Filter intensitas: ${getIntensityLabel()}`}
        >
          <Typography
            variant="captionMedium"
            style={[
              styles.pillText,
              selectedIntensity !== 'all' && styles.pillTextActive,
            ]}
          >
            Intensitas: {getIntensityLabel()} ▾
          </Typography>
        </TouchableOpacity>
      </View>

      {/* MODAL 1: Pemilihan Sinyal Tubuh */}
      <Modal
        visible={isSignalModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSignalModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSignalModalOpen(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <Typography variant="bodyLarge" style={styles.modalTitle}>
              Filter Sinyal Tubuh
            </Typography>
            <Typography variant="caption" color="#717671" style={styles.modalSubtitle}>
              Pilih sinyal tubuh yang ingin kamu telusuri riwayatnya.
            </Typography>

            <ScrollView style={styles.optionsScroll} showsVerticalScrollIndicator={false}>
              {/* Opsi Semua Sinyal */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  triggerButtonPress();
                  onSelectSignal('all');
                  setIsSignalModalOpen(false);
                }}
                style={[
                  styles.optionItem,
                  selectedSignal === 'all' && styles.optionItemActive,
                ]}
              >
                <View style={styles.optionContent}>
                  <Typography variant="bodyMedium" style={styles.optionLabel}>
                    Semua Sinyal Tubuh
                  </Typography>
                  <Typography variant="caption" color="#717671">
                    Tampilkan riwayat semua reaksi tubuh tanpa batasan.
                  </Typography>
                </View>
                <View style={[styles.radioCircle, selectedSignal === 'all' && styles.radioCircleActive]}>
                  {selectedSignal === 'all' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              {/* Opsi dari BODY_SIGNAL_LIST */}
              {BODY_SIGNAL_LIST.map((item) => {
                const isSelected = selectedSignal === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.7}
                    onPress={() => {
                      triggerButtonPress();
                      onSelectSignal(item.key);
                      setIsSignalModalOpen(false);
                    }}
                    style={[styles.optionItem, isSelected && styles.optionItemActive]}
                  >
                    <View style={styles.optionContent}>
                      <Typography variant="bodyMedium" style={styles.optionLabel}>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" color="#717671">
                        {item.humanDescription}
                      </Typography>
                    </View>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL 2: Pemilihan Intensitas */}
      <Modal
        visible={isIntensityModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsIntensityModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsIntensityModalOpen(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <Typography variant="bodyLarge" style={styles.modalTitle}>
              Filter Intensitas Stres
            </Typography>
            <Typography variant="caption" color="#717671" style={styles.modalSubtitle}>
              Pilih tingkat intensitas yang ingin kamu periksa polanya.
            </Typography>

            <ScrollView style={styles.optionsScroll} showsVerticalScrollIndicator={false}>
              {INTENSITY_OPTIONS.map((opt) => {
                const isSelected = selectedIntensity === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    activeOpacity={0.7}
                    onPress={() => {
                      triggerButtonPress();
                      onSelectIntensity(opt.key);
                      setIsIntensityModalOpen(false);
                    }}
                    style={[styles.optionItem, isSelected && styles.optionItemActive]}
                  >
                    <View style={styles.optionContent}>
                      <Typography variant="bodyMedium" style={styles.optionLabel}>
                        {opt.label}
                      </Typography>
                      <Typography variant="caption" color="#717671">
                        {opt.sub}
                      </Typography>
                    </View>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#EAE7E1',
    gap: 10,
    marginTop: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: '#636B64',
  },
  resetBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  resetText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: RADIUS.pill,
    backgroundColor: '#F5F0EB',
    borderWidth: 1.2,
    borderColor: '#E8E1D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#EBF3EA',
    borderColor: '#2D5A38',
  },
  pillText: {
    fontSize: 12.5,
    color: '#3E342B',
  },
  pillTextActive: {
    color: '#2D5A38',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2522',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  optionsScroll: {
    maxHeight: 380,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#EAE7E1',
    backgroundColor: '#FAF8F5',
    marginBottom: 8,
    gap: 12,
  },
  optionItemActive: {
    backgroundColor: '#F0F6F1',
    borderColor: '#2D5A38',
  },
  optionContent: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E2522',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.8,
    borderColor: '#C2D8BF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioCircleActive: {
    borderColor: '#2D5A38',
    backgroundColor: '#2D5A38',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});
