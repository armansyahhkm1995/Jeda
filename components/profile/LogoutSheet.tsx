import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import BottomSheet from '../ui/BottomSheet';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import { COLORS, SPACING } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';

export interface LogoutSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function LogoutSheet({ visible, onClose }: LogoutSheetProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const { triggerWarning } = useHaptics();

  const handleConfirmLogout = async () => {
    triggerWarning();
    await logout();
    onClose();
    router.replace('/(auth)' as any);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Typography variant="h2" align="center" style={styles.title}>
          Keluar dari Akun?
        </Typography>

        <Typography variant="body" color={COLORS.earth[500]} align="center" style={styles.subtitle}>
          Data refleksi lokalmu akan tetap aman. Saat keluar, login dengan PIN dinonaktifkan dan kamu akan diminta masuk kembali menggunakan Email.
        </Typography>

        <View style={styles.actions}>
          <Button
            label="Keluar dari Akun"
            variant="destructive"
            onPress={handleConfirmLogout}
          />
          <Button
            label="Batal"
            variant="ghost"
            onPress={onClose}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  title: {
    fontSize: 22,
  },
  subtitle: {
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
  },
  actions: {
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
});
