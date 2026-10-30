import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Typography from '../ui/Typography';
import { useAuthStore } from '../../store/useAuthStore';

export default function PartnerModePreview() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const handleOpenPro = () => {
    router.push('/jeda-pro' as any);
  };

  if (user?.isPro) {
    return null;
  }

  return (
    <View style={styles.card}>
      {/* Top Row: Title + PRO Badge */}
      <View style={styles.topRow}>
        <Typography variant="bodyLarge" style={styles.title}>
          Mode Pasangan + Analitik
        </Typography>
        <View style={styles.proBadge}>
          <Typography variant="caption" style={styles.proText}>
            PRO
          </Typography>
        </View>
      </View>

      {/* Subtext */}
      <Typography variant="body" style={styles.desc}>
        Beri tahu pasangan secara otomatis saat sisa kesabaranmu tipis. Saling tahu, tanpa saling mengawasi
      </Typography>

      {/* Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleOpenPro}
        style={styles.proButton}
        accessibilityRole="button"
        accessibilityLabel="Lihat Mode Pro"
      >
        <Typography variant="bodyMedium" style={styles.proButtonText}>
          Lihat Mode Pro
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF5EC',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#EDE3CD',
    padding: 18,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1E2922',
  },
  proBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: '#E8DEC4',
  },
  proText: {
    color: '#A04520',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  desc: {
    fontSize: 13.5,
    lineHeight: 19,
    color: '#635D50',
    marginVertical: 4,
  },
  proButton: {
    backgroundColor: '#E2EBE2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  proButtonText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#2D5A38',
  },
});
