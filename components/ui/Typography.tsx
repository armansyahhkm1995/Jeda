import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../constants/theme';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLarge'
  | 'body'
  | 'bodyMedium'
  | 'caption'
  | 'captionMedium';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export default function Typography({
  variant = 'body',
  color,
  align = 'left',
  style,
  children,
  ...rest
}: TypographyProps) {
  const getStyle = (): TextStyle => {
    const base = TYPOGRAPHY[variant];
    return {
      ...base,
      color: color || (variant.startsWith('h') ? COLORS.earth[900] : COLORS.earth[800]),
      textAlign: align,
    };
  };

  return (
    <Text style={[getStyle(), style]} {...rest}>
      {children}
    </Text>
  );
}
