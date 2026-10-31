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
    const extraTop = stylePadTop ?? paddingVertical ?? padding ?? 0;
    const numExtraTop = typeof extraTop === 'number' ? extraTop : (Number(extraTop) || 0);
    const finalTop = baseTop + numExtraTop;

    // Tab bar clearance: at least 88px if withTabBar is true
    const baseBottom = withBottomInset ? bottom : 0;
    const extraBottom = withTabBar ? 88 : 32;
    const padBottom = stylePadBottom ?? paddingVertical ?? padding ?? 0;
    const numPadBottom = typeof padBottom === 'number' ? padBottom : (Number(padBottom) || 0);
    const finalBottom = baseBottom + extraBottom + numPadBottom;

    const extraLeft = stylePadLeft ?? paddingHorizontal ?? padding ?? 0;
    const numExtraLeft = typeof extraLeft === 'number' ? extraLeft : (Number(extraLeft) || 0);
    const finalLeft = left + numExtraLeft;

    const extraRight = stylePadRight ?? paddingHorizontal ?? padding ?? 0;
    const numExtraRight = typeof extraRight === 'number' ? extraRight : (Number(extraRight) || 0);
    const finalRight = right + numExtraRight;

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

  const padTop = flattened.paddingTop ?? flattened.paddingVertical ?? flattened.padding ?? 0;
  const numPadTop = typeof padTop === 'number' ? padTop : (Number(padTop) || 0);

  const padBottom = flattened.paddingBottom ?? flattened.paddingVertical ?? flattened.padding ?? 0;
  const numPadBottom = typeof padBottom === 'number' ? padBottom : (Number(padBottom) || 0);

  const padLeft = flattened.paddingLeft ?? flattened.paddingHorizontal ?? flattened.padding ?? 0;
  const numPadLeft = typeof padLeft === 'number' ? padLeft : (Number(padLeft) || 0);

  const padRight = flattened.paddingRight ?? flattened.paddingHorizontal ?? flattened.padding ?? 0;
  const numPadRight = typeof padRight === 'number' ? padRight : (Number(padRight) || 0);

  const {
    padding,
    paddingHorizontal,
    paddingVertical,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    ...nonPaddingStyle
  } = flattened;

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: (withTopInset ? top : 0) + numPadTop,
    paddingBottom: (withBottomInset ? bottom : 0) + (withTabBar ? 88 : 0) + numPadBottom,
    paddingLeft: left + numPadLeft,
    paddingRight: right + numPadRight,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View style={[containerStyle, nonPaddingStyle]}>{children}</View>
    </KeyboardAvoidingView>
  );
}
