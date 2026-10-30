import React, { useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';

export interface PinInputProps {
  value: string;
  onChange: (pin: string) => void;
  length?: number;
  hasError?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function PinInput({
  value,
  onChange,
  length = 6,
  hasError = false,
  disabled = false,
  autoFocus = true,
}: PinInputProps) {
  const inputRef = useRef<TextInput>(null);
  const { triggerBreathTick, triggerWarning } = useHaptics();

  const handleContainerPress = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    if (cleaned.length > value.length) {
      triggerBreathTick();
    }
    onChange(cleaned);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleContainerPress}
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel={`PIN input, ${value.length} of ${length} digits entered`}
    >
      {/* Hidden native input with secure properties */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        maxLength={length}
        secureTextEntry
        autoFocus={autoFocus}
        editable={!disabled}
        style={styles.hiddenInput}
        caretHidden
      />

      {/* 6 Visual PIN dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length }).map((_, index) => {
          const isFilled = index < value.length;
          const isCurrent = index === value.length && !disabled;

          const dotStyles: ViewStyle[] = [styles.dot];
          if (isFilled) dotStyles.push(styles.dotFilled);
          if (isCurrent) dotStyles.push(styles.dotCurrent);
          if (hasError) dotStyles.push(styles.dotError);

          return <View key={index} style={dotStyles} />;
        })}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.0001,
    fontSize: 1,
    color: 'transparent',
    zIndex: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    borderColor: COLORS.cream[300],
    backgroundColor: 'transparent',
  },
  dotCurrent: {
    borderColor: COLORS.sage[500],
    transform: [{ scale: 1.15 }],
  },
  dotFilled: {
    backgroundColor: COLORS.sage[500],
    borderColor: COLORS.sage[500],
  },
  dotError: {
    borderColor: COLORS.status.error,
    backgroundColor: COLORS.status.error,
  },
});
