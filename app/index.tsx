import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Typography from '../components/ui/Typography';
import { COLORS, SPACING, SERIF_FONT } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';
import { useCheckinStore } from '../store/useCheckinStore';
import { usePartnerStore } from '../store/usePartnerStore';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

export default function RootIndex() {
  const router = useRouter();
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const checkAndResetIfNewDay = useCheckinStore((s) => s.checkAndResetIfNewDay);
  useDeviceCapability(); // Check RAM and low-end Android version

  useEffect(() => {
    async function determineInitialRoute() {
      await initializeAuth();
      checkAndResetIfNewDay();
      usePartnerStore.getState().initializePartnerSync();

      const isAuth = useAuthStore.getState().isAuthenticated;

      // Smooth transition: jika sudah login langsung ke Beranda, jika belum ke halaman Auth
      setTimeout(() => {
        if (isAuth) {
          router.replace('/(tabs)' as any);
        } else {
          router.replace('/(auth)' as any);
        }
      }, 700);
    }

    determineInitialRoute();
  }, [initializeAuth, checkAndResetIfNewDay, router]);

  return (
    <View style={styles.container}>
      {/* Brand Leaf Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../assets/illustrations/jeda-leaf-logo-transparent.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Title & Tagline */}
      <Typography variant="h1" align="center" style={styles.title}>
        Jeda.
      </Typography>

      <Typography variant="body" color={COLORS.brand.textMuted} align="center" style={styles.tagline}>
        Jeda Sebelum Luka
      </Typography>

      <ActivityIndicator size="small" color={COLORS.brand.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  logoWrapper: {
    width: 110,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoImage: {
    width: 90,
    height: 150,
  },
  title: {
    fontSize: 34,
    fontFamily: SERIF_FONT,
    color: COLORS.brand.textDark,
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: 6,
    fontSize: 15,
  },
  spinner: {
    marginTop: SPACING.xl,
  },
});
