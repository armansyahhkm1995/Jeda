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
}

export default function ScreenWrapper({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  backgroundColor = COLORS.cream[200],
  withTopInset = true,
  withBottomInset = true,
}: ScreenWrapperProps) {
  const { top, bottom, left, right } = useSafeInsets();
  useAppState();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: withTopInset ? top : 0,
    paddingBottom: withBottomInset ? bottom : 0,
    paddingLeft: left,
    paddingRight: right,
  };

  if (scrollable) {
    // Separate layout properties that must be applied to contentContainerStyle on web & native
    const flattened = StyleSheet.flatten(style) || {};
    const {
      justifyContent,
      alignItems,
      alignContent,
      flexDirection,
      flexWrap,
      ...scrollStyle
    } = flattened;

    const layoutStyle: ViewStyle = {
      flexGrow: 1,
      ...(justifyContent ? { justifyContent } : {}),
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
          style={[containerStyle, scrollStyle]}
          contentContainerStyle={[layoutStyle, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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
