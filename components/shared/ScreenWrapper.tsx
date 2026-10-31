import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { useSafeInsets } from '../../hooks/useSafeInsets';
import { useAppState } from '../../hooks/useAppState';
import { COLORS } from '../../constants/theme';

export interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  withTopInset?: boolean;
  withBottomInset?: boolean;
  withTabBar?: boolean;
}

export default function ScreenWrapper({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  backgroundColor = COLORS.cream[200],
  withTopInset = true,
  withBottomInset = true,
  withTabBar = false,
}: ScreenWrapperProps) {
  const { top, bottom, left, right } = useSafeInsets();
  useAppState();

  const flattened = StyleSheet.flatten(style) || {};

  if (scrollable) {
    const {
      justifyContent,
      alignItems,
      alignContent,
      flexDirection,
      flexWrap,
      padding,
      paddingHorizontal,
      paddingVertical,
      paddingTop: stylePadTop,
      paddingBottom: stylePadBottom,
      paddingLeft: stylePadLeft,
      paddingRight: stylePadRight,
      ...outerStyle
    } = flattened;

    const baseTop = withTopInset ? top : 0;
    const rawTop = stylePadTop ?? paddingVertical ?? padding ?? baseTop;
    const finalTop = typeof rawTop === 'number' ? rawTop : (Number(rawTop) || 0);

    // Tab bar clearance: at least 88px if withTabBar is true
    const baseBottom = withBottomInset ? bottom : 0;
    const extraBottom = withTabBar ? 88 : 32;
    const rawBottom = stylePadBottom ?? paddingVertical ?? padding ?? baseBottom;
    const numBottom = typeof rawBottom === 'number' ? rawBottom : (Number(rawBottom) || 0);
    const finalBottom = numBottom + extraBottom;

    const finalLeft = stylePadLeft ?? paddingHorizontal ?? padding ?? left;
    const finalRight = stylePadRight ?? paddingHorizontal ?? padding ?? right;

    const layoutStyle: ViewStyle = {
      flexGrow: 1,
      paddingTop: finalTop,
      paddingBottom: finalBottom,
      paddingLeft: finalLeft,
      paddingRight: finalRight,
      ...(alignItems ? { alignItems } : {}),
      ...(alignContent ? { alignContent } : {}),
      ...(flexDirection ? { flexDirection } : {}),
      ...(flexWrap ? { flexWrap } : {}),
    };

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor }}
      >
        <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
        <ScrollView
          style={[{ flex: 1, backgroundColor }, outerStyle]}
          contentContainerStyle={[layoutStyle, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: withTopInset ? top : 0,
    paddingBottom: (withBottomInset ? bottom : 0) + (withTabBar ? 88 : 0),
    paddingLeft: left,
    paddingRight: right,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View style={[containerStyle, style]}>{children}</View>
    </KeyboardAvoidingView>
  );
}
