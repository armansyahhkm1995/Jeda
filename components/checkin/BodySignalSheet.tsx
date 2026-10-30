import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import BottomSheet from '../ui/BottomSheet';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { BODY_SIGNAL_LIST, BodySignalInfo } from '../../constants/body-signals';
import { BodySignalKey } from '../../types';
import { useHaptics } from '../../hooks/useHaptics';

export interface BodySignalSheetProps {
  visible: boolean;
  selectedSignal: BodySignalKey | null;
  onSelect: (signal: BodySignalKey) => void;
  onClose: () => void;
}

export default function BodySignalSheet({
  visible,
  selectedSignal,
  onSelect,
  onClose,
}: BodySignalSheetProps) {
  const { triggerButtonPress } = useHaptics();

  const handleSelect = (signal: BodySignalInfo) => {
    triggerButtonPress();
    onSelect(signal.key);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>
            Apa yang paling dominan kamu rasakan di tubuhmu?
          </Typography>
          <Typography variant="caption" color={COLORS.brand.textMuted} style={styles.subtitle}>
            Pilih reaksi fisik yang paling dominan di tubuhmu saat ini.
          </Typography>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={styles.list}
        >
          {BODY_SIGNAL_LIST.map((item) => {
            const isSelected = selectedSignal === item.key;

            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.75}
                onPress={() => handleSelect(item)}
                style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${item.label}, ${item.humanDescription}`}
              >
                <View style={styles.cardContent}>
                  {/* 1. Nama Reaksi Tubuh */}
                  <Typography
                    variant="bodyMedium"
                    style={[styles.itemTitle, isSelected && styles.itemTitleSelected]}
                  >
                    {item.label}
                  </Typography>

                  {/* 2. Deskripsi Reaksi Tubuh */}
                  <Typography
                    variant="caption"
                    color={COLORS.brand.textMuted}
                    style={styles.itemDesc}
                  >
                    {item.humanDescription}
                  </Typography>
                </View>

                {/* Input Radio Button */}
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioInnerDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
    maxHeight: 560,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 20,
    marginBottom: 4,
    color: COLORS.brand.textDark,
  },
  subtitle: {
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  list: {
    gap: 10,
    paddingBottom: SPACING.xl,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.cream[300],
    padding: SPACING.md,
    gap: SPACING.md,
  },
  itemCardSelected: {
    borderColor: COLORS.brand.primary,
    backgroundColor: '#F5F9F6',
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.brand.textDark,
  },
  itemTitleSelected: {
    color: COLORS.brand.primaryDark,
  },
  itemDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: COLORS.cream[400],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioCircleSelected: {
    borderColor: COLORS.brand.primary,
    backgroundColor: COLORS.brand.primary,
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});
