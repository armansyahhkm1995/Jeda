import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import BottomSheet from '../ui/BottomSheet';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import { COLORS, SPACING } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';

export interface BodySignalsFilterSheetProps {
  visible: boolean;
  allSignals: string[];
  selectedSignals: string[];
  onToggleSignal: (signal: string) => void;
  onClearSignals: () => void;
  onClose: () => void;
}

export default function BodySignalsFilterSheet({
  visible,
  allSignals,
  selectedSignals,
  onToggleSignal,
  onClearSignals,
  onClose,
}: BodySignalsFilterSheetProps) {
  const { triggerBreathTick, triggerButtonPress } = useHaptics();

  const handleToggle = (sig: string) => {
    triggerBreathTick();
    onToggleSignal(sig);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>
            Pilih Sinyal Tubuh
          </Typography>
          <Typography variant="caption" color={COLORS.earth[500]} style={styles.subtitle}>
            Centang satu atau lebih sensasi fisik yang kamu rasakan untuk melihat teknik regulasi yang cocok.
          </Typography>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
          {allSignals.map((sig) => {
            const isChecked = selectedSignals.includes(sig);
            return (
              <TouchableOpacity
                key={sig}
                activeOpacity={0.75}
                onPress={() => handleToggle(sig)}
                style={[styles.itemCard, isChecked && styles.itemCardChecked]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isChecked }}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && (
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M20 6L9 17L4 12"
                        stroke="#FFFFFF"
                        strokeWidth={2.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                </View>

                <Typography
                  variant="bodyMedium"
                  style={[styles.itemLabel, isChecked && styles.itemLabelChecked]}
                >
                  {sig}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          {selectedSignals.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                triggerButtonPress();
                onClearSignals();
              }}
              style={styles.clearBtn}
            >
              <Typography variant="bodyMedium" color={COLORS.brand.error}>
                Hapus Semua Sinyal ({selectedSignals.length})
              </Typography>
            </TouchableOpacity>
          )}

          <Button
            label={`Terapkan (${selectedSignals.length} Sinyal)`}
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
    maxHeight: 560,
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
  list: {
    marginVertical: 10,
    maxHeight: 340,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#EAE5DC',
    marginBottom: 8,
  },
  itemCardChecked: {
    borderColor: '#2D5A38',
    backgroundColor: '#EEF4F0',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#A8B3AC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2D5A38',
    borderColor: '#2D5A38',
  },
  itemLabel: {
    fontSize: 14,
    color: '#1E2522',
    fontWeight: '500',
  },
  itemLabelChecked: {
    color: '#2D5A38',
    fontWeight: '700',
  },
  footer: {
    marginTop: 10,
    gap: 8,
  },
  clearBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
});
