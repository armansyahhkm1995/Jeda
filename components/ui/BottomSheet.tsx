import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useSafeInsets } from '../../hooks/useSafeInsets';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

export default function BottomSheet({
  visible,
  onClose,
  children,
  containerStyle,
}: BottomSheetProps) {
  const { bottom } = useSafeInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheet, { paddingBottom: bottom }, containerStyle]}>
              {/* Drag handle pill */}
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.cream[50],
    borderTopLeftRadius: RADIUS.sheet,
    borderTopRightRadius: RADIUS.sheet,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    maxHeight: '85%',
    shadowColor: COLORS.earth[900],
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.cream[300],
  },
});
