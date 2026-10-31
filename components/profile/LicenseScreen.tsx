import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Typography from '../ui/Typography';
import { COLORS } from '../../constants/theme';
import { useSafeInsets } from '../../hooks/useSafeInsets';

export interface LicenseScreenProps {
  onBack: () => void;
}

const OPEN_SOURCE_LIBS = [
  { name: 'React Native', license: 'MIT License', desc: 'Framework aplikasi mobile lintas platform oleh Meta Platforms, Inc.' },
  { name: 'Expo SDK', license: 'MIT License', desc: 'Rangka kerja dan pustaka runtime aplikasi native oleh 650 Industries, Inc.' },
  { name: 'React Native SVG', license: 'MIT License', desc: 'Pustaka rendering grafik vektor dan kurva analitik oleh Horcrux & komunitas.' },
  { name: 'Zustand', license: 'MIT License', desc: 'Solusi manajemen state reaktif ringan oleh Poimandres.' },
  { name: 'NativeWind / Tailwind CSS', license: 'MIT License', desc: 'Sistem desain berbasis utilitas styling oleh Mark Lawlor & Tailwind Labs.' },
  { name: 'React Native MMKV', license: 'MIT License', desc: 'Penyimpanan lokal sinkron berkinerja tinggi oleh Marc Rousavy (Tencent).' },
  { name: 'Expo Secure Store', license: 'MIT License', desc: 'Akses penyimpanan terenkripsi Keychain / Keystore oleh Expo.' },
  { name: 'Lucide Icons', license: 'ISC License', desc: 'Ikon grafis esensial modern oleh Lucide Project.' },
];

export default function LicenseScreen({ onBack }: LicenseScreenProps) {
  const insets = useSafeInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
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
          Lisensi
        </Typography>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Book Copyright Notice */}
        <View style={styles.copyrightCard}>
          <Typography variant="caption" style={styles.copyrightBadge}>
            HAK CIPTA & KONTEN RESMI
          </Typography>
          <Typography variant="h3" style={styles.bookTitle}>
            Jeda Sebelum Luka
          </Typography>
          <Typography variant="body" style={styles.copyrightDesc}>
            Seluruh konten metodologi regulasi sistem saraf otonom, naskah panduan napas, dan materi psikologis dalam aplikasi ini merupakan hak cipta dilindungi undang-undang.
          </Typography>
          <Typography variant="caption" style={styles.copyrightYear}>
            © 2026 Jeda Sebelum Luka. Seluruh hak cipta dilindungi.
          </Typography>
        </View>

        {/* Software License */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionHeading}>
            Aplikasi Jeda
          </Typography>
          <Typography variant="body" style={styles.paragraph}>
            Aplikasi Jeda dikembangkan sebagai ruang aman pertolongan pertama emosional. Kode aplikasi, desain antarmuka, dan nama dagang Jeda dilindungi oleh hukum kekayaan intelektual Republik Indonesia.
          </Typography>
        </View>

        {/* Open Source Acknowledgments */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionHeading}>
            Pustaka Sumber Terbuka (Open Source)
          </Typography>
          <Typography variant="body" style={styles.paragraph}>
            Aplikasi ini terwujud berkat kontribusi luar biasa dari berbagai perangkat lunak sumber terbuka berikut:
          </Typography>

          <View style={styles.libList}>
            {OPEN_SOURCE_LIBS.map((lib, idx) => (
              <View key={idx} style={styles.libCard}>
                <View style={styles.libHeader}>
                  <Typography variant="bodyMedium" style={styles.libName}>
                    {lib.name}
                  </Typography>
                  <View style={styles.licensePill}>
                    <Typography variant="caption" style={styles.licensePillText}>
                      {lib.license}
                    </Typography>
                  </View>
                </View>
                <Typography variant="caption" style={styles.libDesc}>
                  {lib.desc}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Typography variant="caption" style={styles.footerText}>
            Terima kasih kepada seluruh pengembang komunitas open-source.
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
    paddingTop: 20,
    paddingBottom: 80,
  },
  copyrightCard: {
    backgroundColor: '#EDF5EE',
    borderWidth: 1,
    borderColor: '#CDE4D0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  copyrightBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2D5A38',
    letterSpacing: 0.5,
  },
  bookTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2522',
  },
  copyrightDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: '#344537',
  },
  copyrightYear: {
    fontSize: 11.5,
    color: '#5C6E60',
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    gap: 8,
  },
  sectionHeading: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
  },
  paragraph: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#4F5A53',
  },
  libList: {
    gap: 10,
    marginTop: 6,
  },
  libCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#ECE7DE',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  libHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  libName: {
    fontWeight: '700',
    color: '#1E2522',
    fontSize: 14,
  },
  licensePill: {
    backgroundColor: '#F3EFE9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  licensePillText: {
    fontSize: 10.5,
    color: '#5C6760',
    fontWeight: '600',
  },
  libDesc: {
    fontSize: 12,
    lineHeight: 16,
    color: '#717D74',
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#8A948C',
    textAlign: 'center',
  },
});
