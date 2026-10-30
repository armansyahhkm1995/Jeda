import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS, SPACING, SERIF_FONT } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';

interface NumericKeypadProps {
  onPressDigit: (digit: string) => void;
  onPressDelete: () => void;
  disabled?: boolean;
}

export default function NumericKeypad({
  onPressDigit,
  onPressDelete,
  disabled = false,
}: NumericKeypadProps) {
  const { triggerBreathTick, triggerWarning } = useHaptics();

  // Listen to physical keyboard on Web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key >= '0' && e.key <= '9') {
        triggerBreathTick();
        onPressDigit(e.key);
      } else if (e.key === 'Backspace') {
        triggerWarning();
        onPressDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, onPressDigit, onPressDelete, triggerBreathTick, triggerWarning]);

  const handleDigit = (digit: string) => {
    if (disabled) return;
    triggerBreathTick();
    onPressDigit(digit);
  };

  const handleDelete = () => {
    if (disabled) return;
    triggerWarning();
    onPressDelete();
  };

  return (
    <View style={styles.container}>
      {/* Row 1 */}
      <View style={styles.row}>
        {['1', '2', '3'].map((d) => (
          <TouchableOpacity
            key={d}
            activeOpacity={0.4}
            onPress={() => handleDigit(d)}
            style={styles.key}
            accessibilityRole="button"
            accessibilityLabel={d}
          >
            <Typography variant="h2" style={styles.digitText}>
              {d}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        {['4', '5', '6'].map((d) => (
          <TouchableOpacity
            key={d}
            activeOpacity={0.4}
            onPress={() => handleDigit(d)}
            style={styles.key}
            accessibilityRole="button"
            accessibilityLabel={d}
          >
            <Typography variant="h2" style={styles.digitText}>
              {d}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Row 3 */}
      <View style={styles.row}>
        {['7', '8', '9'].map((d) => (
          <TouchableOpacity
            key={d}
            activeOpacity={0.4}
            onPress={() => handleDigit(d)}
            style={styles.key}
            accessibilityRole="button"
            accessibilityLabel={d}
          >
            <Typography variant="h2" style={styles.digitText}>
              {d}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Row 4: Empty, 0, Backspace */}
      <View style={styles.row}>
        <View style={styles.emptyKey} />

        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => handleDigit('0')}
          style={styles.key}
          accessibilityRole="button"
          accessibilityLabel="0"
        >
          <Typography variant="h2" style={styles.digitText}>
            0
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.4}
          onPress={handleDelete}
          style={styles.key}
          accessibilityRole="button"
          accessibilityLabel="Hapus digit"
        >
          <Typography variant="h3" style={styles.backspaceIcon}>
            ⌫
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    paddingVertical: SPACING.md,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyKey: {
    width: 72,
    height: 72,
  },
  digitText: {
    fontSize: 26,
    fontFamily: SERIF_FONT,
    color: COLORS.brand.textDark,
    fontWeight: '500',
  },
  backspaceIcon: {
    fontSize: 24,
    color: COLORS.brand.textDark,
  },
});
