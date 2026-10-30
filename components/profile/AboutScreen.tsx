import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Typography from '../ui/Typography';
import { COLORS } from '../../constants/theme';
import { useHaptics } from '../../hooks/useHaptics';

export interface AboutScreenProps {
  onBack: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenLicense: () => void;
}

export default function AboutScreen({
  onBack,
  onOpenPrivacyPolicy,
  onOpenLicense,
}: AboutScreenProps) {
  const { triggerBreathTick } = useHaptics();

  const handlePressPrivacy = () => {
    triggerBreathTick();
    onOpenPrivacyPolicy();
  };

  const handlePressLicense = () => {
    triggerBreathTick();
    onOpenLicense();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="#1E2522"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <Typography variant="bodyLarge" style={styles.headerTitle}>
          Tentang Jeda
        </Typography>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand & Leaf Icon Area */}
        <View style={styles.brandSection}>
          <View style={styles.leafCircle}>
            {/* Jeda leaf icon */}
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
              <Path
                d="M11 20A7 7 0 0 1 4 13C4 9.13401 7.13401 6 11 6C13.5 6 18 4 20 2C20 4 20 8.5 20 11C20 14.866 16.866 20 11 20Z"
                stroke="#2D5A38"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(45, 90, 56, 0.08)"
              />
              <Path
                d="M4 13L13 13"
                stroke="#2D5A38"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </Svg>
          </View>

          <Typography variant="h1" style={styles.brandTitle}>
            Jeda.
          </Typography>

          <Typography variant="body" style={styles.tagline}>
            Ruang aman sebelum emosi mengambil alih.
          </Typography>
        </View>

        {/* Description Card */}
        <View style={styles.descriptionCard}>
          <Typography variant="body" style={styles.descText}>
            Jeda adalah pendamping 'Jeda Sebelum Luka' yang menghadirkan pertolongan pertama emosional untuk orang tua — sederhana, privat, dan bisa digunakan di sela hari.
          </Typography>

          <Typography variant="caption" style={styles.versionText}>
            Versi 1.0.0
          </Typography>
        </View>

        {/* Links Menu List */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handlePressPrivacy}
            accessibilityRole="button"
          >
            <Typography variant="bodyMedium" style={styles.menuItemText}>
              Kebijakan Privasi
            </Typography>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18L15 12L9 6"
                stroke="#8A948C"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handlePressLicense}
            accessibilityRole="button"
          >
            <Typography variant="bodyMedium" style={styles.menuItemText}>
              Lisensi
            </Typography>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18L15 12L9 6"
                stroke="#8A948C"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Typography variant="caption" style={styles.footerText}>
            Dibuat dengan empati untuk keluarga Indonesia.
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFECE6',
    backgroundColor: '#FAF8F5',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2522',
  },
  headerSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  leafCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDF5EE',
    borderWidth: 1.5,
    borderColor: '#D4E5D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '700',
    color: '#1E2522',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: '#4A554D',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  descriptionCard: {
    backgroundColor: '#F5F1EB',
    borderWidth: 1,
    borderColor: '#E7E2D8',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    gap: 14,
  },
  descText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#556057',
    textAlign: 'left',
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7E8880',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#ECE7DE',
    borderRadius: 16,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  menuItemText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1E2522',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2EEE7',
    marginHorizontal: 16,
  },
  footerSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12.5,
    color: '#8A948C',
    textAlign: 'center',
  },
});
