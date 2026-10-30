import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet from '../ui/BottomSheet';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { TechniqueCategory } from '../../types';
import { useHaptics } from '../../hooks/useHaptics';

export type DurationFilter = 'all' | 'short' | 'medium' | 'long';

export interface FilterSheetProps {
  visible: boolean;
  selectedCategory: TechniqueCategory | 'all';
  selectedDuration: DurationFilter;
  onSelectCategory: (category: TechniqueCategory | 'all') => void;
  onSelectDuration: (duration: DurationFilter) => void;
  onReset: () => void;
  onClose: () => void;
}

const CATEGORIES: Array<{ key: TechniqueCategory | 'all'; label: string; desc: string }> = [
  { key: 'all', label: 'Semua Kategori', desc: 'Tampilkan seluruh teknik regulasi emosi' },
  { key: 'breathing', label: 'Napas & Pernapasan', desc: 'Physiological Sigh, Box Breathing' },
  { key: 'physical', label: 'Gerakan Fisik & Darurat', desc: 'Wall Push, Body Shaking, Cold Water Reset' },
  { key: 'sensory', label: 'Sensori & Grounding', desc: 'Grounding 5-4-3-2-1, Tekan telapak kaki' },
  { key: 'cognitive', label: 'Kognitif & Kesadaran', desc: 'HALT Check, Name It to Tame It' },
];

const DURATIONS: Array<{ key: DurationFilter; label: string; desc: string }> = [
  { key: 'all', label: 'Semua Durasi', desc: 'Semua rentang waktu latihan' },
  { key: 'short', label: 'Singkat (≤ 60 detik)', desc: 'Untuk darurat / pertolongan instan di sela aktivitas' },
  { key: 'medium', label: 'Sedang (1 - 3 menit)', desc: 'Ritme regulasi penuh untuk menstabilkan saraf' },
  { key: 'long', label: 'Mendalam (> 3 menit)', desc: 'Latihan menyeluruh untuk memulihkan fokus' },
];

export default function FilterSheet({
  visible,
  selectedCategory,
  selectedDuration,
  onSelectCategory,
  onSelectDuration,
  onReset,
  onClose,
}: FilterSheetProps) {
  const { triggerBreathTick, triggerButtonPress } = useHaptics();

  const handleChooseCategory = (cat: TechniqueCategory | 'all') => {
    triggerBreathTick();
    onSelectCategory(cat);
  };

  const handleChooseDuration = (dur: DurationFilter) => {
    triggerBreathTick();
    onSelectDuration(dur);
  };

  const hasActiveFilter = selectedCategory !== 'all' || selectedDuration !== 'all';

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>
            Filter Regulasi
          </Typography>
          <Typography variant="caption" color={COLORS.earth[500]} style={styles.subtitle}>
            Sesuaikan teknik berdasarkan durasi waktu yang kamu miliki dan kategori latihannya.
          </Typography>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
          {/* Section 1: Durasi Regulasi */}
          <Typography variant="bodyMedium" style={styles.sectionHeader}>
            Durasi Latihan
          </Typography>

          <View style={styles.optionsList}>
            {DURATIONS.map((item) => {
              const isSelected = selectedDuration === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.75}
                  onPress={() => handleChooseDuration(item.key)}
                  style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.row}>
                    <View style={[styles.radioDot, isSelected && styles.radioDotSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.textCol}>
                      <Typography
                        variant="bodyMedium"
                        style={[styles.label, isSelected && styles.labelSelected]}
                      >
                        {item.label}
                      </Typography>
                      <Typography variant="caption" style={styles.desc}>
                        {item.desc}
                      </Typography>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Section 2: Kategori Regulasi */}
          <Typography variant="bodyMedium" style={[styles.sectionHeader, { marginTop: 18 }]}>
            Kategori Regulasi
          </Typography>

          <View style={styles.optionsList}>
            {CATEGORIES.map((item) => {
              const isSelected = selectedCategory === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.75}
                  onPress={() => handleChooseCategory(item.key)}
                  style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.row}>
                    <View style={[styles.radioDot, isSelected && styles.radioDotSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.textCol}>
                      <Typography
                        variant="bodyMedium"
                        style={[styles.label, isSelected && styles.labelSelected]}
                      >
                        {item.label}
                      </Typography>
                      <Typography variant="caption" style={styles.desc}>
                        {item.desc}
                      </Typography>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {hasActiveFilter && (
            <TouchableOpacity
              onPress={() => {
                triggerButtonPress();
                onReset();
              }}
              style={styles.resetBtn}
              accessibilityRole="button"
            >
              <Typography variant="bodyMedium" color={COLORS.brand.error}>
                Reset Filter
              </Typography>
            </TouchableOpacity>
          )}

          <Button
            label="Terapkan Filter"
            variant="primary"
            onPress={() => {
              triggerButtonPress();
              onClose();
            }}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
    maxHeight: 580,
  },
  header: {
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E2522',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  scrollArea: {
    marginVertical: SPACING.xs,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D5A38',
    marginBottom: 8,
  },
  optionsList: {
    gap: 8,
  },
  itemCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#EAE5DC',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  itemCardSelected: {
    borderColor: '#2D5A38',
    backgroundColor: '#EEF4F0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A8B3AC',
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDotSelected: {
    borderColor: '#2D5A38',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2D5A38',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E2522',
  },
  labelSelected: {
    color: '#2D5A38',
  },
  desc: {
    fontSize: 12,
    color: '#717D74',
    lineHeight: 16,
  },
  footer: {
    marginTop: 12,
    gap: 8,
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
});
