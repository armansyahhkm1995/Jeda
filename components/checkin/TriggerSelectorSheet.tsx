import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import BottomSheet from '../ui/BottomSheet';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { TRIGGER_LIST, TRIGGER_CATEGORIES, TriggerOption } from '../../constants/triggers';
import { useHaptics } from '../../hooks/useHaptics';

export interface TriggerSelectorSheetProps {
  visible: boolean;
  selectedTrigger: string | null;
  onSelect: (trigger: TriggerOption) => void;
  onClose: () => void;
}

export default function TriggerSelectorSheet({
  visible,
  selectedTrigger,
  onSelect,
  onClose,
}: TriggerSelectorSheetProps) {
  const { triggerButtonPress } = useHaptics();

  const handleSelect = (item: TriggerOption) => {
    triggerButtonPress();
    onSelect(item);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>
            Apa yang memicu rasa ini?
          </Typography>
          <Typography variant="caption" color={COLORS.brand.textMuted} style={styles.subtitle}>
            Pilih situasi yang menyulut reaksi emosi atau tubuhmu saat ini.
          </Typography>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={styles.list}
        >
          {TRIGGER_CATEGORIES.map((cat) => {
            const catItems = TRIGGER_LIST.filter((t) => t.category === cat.key);

            return (
              <View key={cat.key} style={styles.categorySection}>
                {/* Header Kategori */}
                <View style={styles.categoryHeader}>
                  <Typography variant="captionMedium" style={styles.categoryTitle}>
                    {cat.title}
                  </Typography>
                  <Typography variant="caption" color={COLORS.brand.textMuted} style={styles.categorySubtitle}>
                    {cat.subtitle}
                  </Typography>
                </View>

                {/* Daftar Pilihan dalam Kategori */}
                <View style={styles.itemsWrapper}>
                  {catItems.map((item) => {
                    const isSelected =
                      selectedTrigger === item.id ||
                      selectedTrigger === item.label;

                    return (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.75}
                        onPress={() => handleSelect(item)}
                        style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: isSelected }}
                        accessibilityLabel={`${item.label}, ${item.description}`}
                      >
                        <View style={styles.cardContent}>
                          {/* 1. Nama Pemicu */}
                          <Typography
                            variant="bodyMedium"
                            style={[styles.itemTitle, isSelected && styles.itemTitleSelected]}
                          >
                            {item.label}
                          </Typography>

                          {/* 2. Deskripsi Penjelasan Pemicu */}
                          <Typography
                            variant="caption"
                            color={COLORS.brand.textMuted}
                            style={styles.itemDesc}
                          >
                            {item.description}
                          </Typography>
                        </View>

                        {/* Radio Button */}
                        <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                          {isSelected && <View style={styles.radioInnerDot} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
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
    maxHeight: 580,
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
    gap: 16,
    paddingBottom: SPACING.xxl,
  },
  categorySection: {
    gap: 8,
  },
  categoryHeader: {
    backgroundColor: '#F5F2EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    gap: 2,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brand.textDark,
  },
  categorySubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  itemsWrapper: {
    gap: 8,
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
    fontSize: 14.5,
    fontWeight: '600',
    color: COLORS.brand.textDark,
  },
  itemTitleSelected: {
    color: COLORS.brand.primaryDark,
  },
  itemDesc: {
    fontSize: 12.5,
    lineHeight: 17,
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
