import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';

export interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  length?: number;
  hasError?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
  hasError = false,
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const { triggerBreathTick } = useHaptics();

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
      accessibilityLabel={`OTP input, ${value.length} of ${length} digits entered`}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        editable={!disabled}
        style={styles.hiddenInput}
        caretHidden
      />

      <View style={styles.boxesRow}>
        {Array.from({ length }).map((_, index) => {
          const char = value[index] || '';
          const isFocused = index === value.length && !disabled;

          const boxStyles: ViewStyle[] = [styles.box];
          if (char) boxStyles.push(styles.boxFilled);
          if (isFocused) boxStyles.push(styles.boxFocused);
          if (hasError) boxStyles.push(styles.boxError);

          return (
            <View key={index} style={boxStyles}>
              <Text style={styles.digitText}>{char}</Text>
            </View>
          );
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
  boxesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  box: {
    width: 46,
    height: 56,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.cream[300],
    backgroundColor: COLORS.cream[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFocused: {
    borderColor: COLORS.sage[500],
    backgroundColor: COLORS.white,
    shadowColor: COLORS.sage[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  boxFilled: {
    borderColor: COLORS.sage[400],
    backgroundColor: COLORS.white,
  },
  boxError: {
    borderColor: COLORS.status.error,
    backgroundColor: '#FDF3F2',
  },
  digitText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.earth[900],
  },
});
