import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  disabled,
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const { triggerButtonPress } = useHaptics();

  const handlePress = (e: any) => {
    if (disabled || isLoading) return;
    triggerButtonPress();
    onPress?.(e);
  };

  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    // Sizes - guaranteed minimum 48dp touch target
    if (size === 'sm') list.push(styles.sizeSm);
    if (size === 'md') list.push(styles.sizeMd);
    if (size === 'lg') list.push(styles.sizeLg);

    // Variants
    if (variant === 'primary') list.push(styles.primary);
    if (variant === 'secondary') list.push(styles.secondary);
    if (variant === 'outline') list.push(styles.outline);
    if (variant === 'ghost') list.push(styles.ghost);
    if (variant === 'destructive') list.push(styles.destructive);

    if (fullWidth) list.push(styles.fullWidth);
    if (disabled || isLoading) list.push(styles.disabled);

    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.textBase];
    if (size === 'sm') list.push(styles.textSm);
    if (size === 'md') list.push(styles.textMd);
    if (size === 'lg') list.push(styles.textLg);

    if (variant === 'primary') list.push(styles.textPrimary);
    if (variant === 'secondary') list.push(styles.textSecondary);
    if (variant === 'outline') list.push(styles.textOutline);
    if (variant === 'ghost') list.push(styles.textGhost);
    if (variant === 'destructive') list.push(styles.textDestructive);

    if (disabled) list.push(styles.textDisabled);

    return list;
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[getContainerStyle(), style as ViewStyle]}
      onPress={handlePress}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.white : COLORS.sage[600]}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={getTextStyle()}>{label}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
    minHeight: 52, // Exceeds 48dp minimum ergonomics
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  fullWidth: {
    width: '100%',
  },
  sizeSm: {
    minHeight: 48,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  sizeMd: {
    minHeight: 52,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  sizeLg: {
    minHeight: 58,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  primary: {
    backgroundColor: COLORS.sage[500],
    shadowColor: COLORS.sage[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondary: {
    backgroundColor: COLORS.cream[100],
    borderWidth: 1,
    borderColor: COLORS.cream[300],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.sage[500],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#FBEBE9',
    borderWidth: 1,
    borderColor: COLORS.status.error,
  },
  disabled: {
    opacity: 0.45,
    elevation: 0,
    shadowOpacity: 0,
  },
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textSm: {
    fontSize: 13,
  },
  textMd: {
    fontSize: 15,
  },
  textLg: {
    fontSize: 17,
  },
  textPrimary: {
    color: COLORS.white,
  },
  textSecondary: {
    color: COLORS.earth[900],
  },
  textOutline: {
    color: COLORS.sage[600],
  },
  textGhost: {
    color: COLORS.sage[700],
  },
  textDestructive: {
    color: COLORS.status.error,
  },
  textDisabled: {
    color: COLORS.earth[400],
  },
});
