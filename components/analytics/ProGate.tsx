import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

export default function ProGate() {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/jeda-pro' as any);
  };

  return (
    <Card variant="flat" padding="lg" style={styles.card}>
      <View style={styles.iconCircle}>
        <Typography variant="h1" style={styles.icon}>
          🔒
        </Typography>
      </View>

      <Typography variant="h2" align="center" style={styles.title}>
        Fitur Analisis Tren (Jeda Pro)
      </Typography>

      <Typography variant="body" color={COLORS.earth[600]} align="center" style={styles.desc}>
        Kenali jam-jam rentan emosimu, pola pemicu utama bulanan, dan hari di mana kapasitas mentalmu berada di titik paling tipis.
      </Typography>

      <View style={styles.featureList}>
        <Typography variant="captionMedium" color={COLORS.sage[800]}>
          ✓ Pola Line Chart Kapasitas Emosi 7 Hari
        </Typography>
        <Typography variant="captionMedium" color={COLORS.sage[800]}>
          ✓ Analisis Pemicu Utama Berulang (Bulan Ini)
        </Typography>
        <Typography variant="captionMedium" color={COLORS.sage[800]}>
          ✓ Sinkronisasi Sinyal Otomatis ke Pasangan
        </Typography>
      </View>

      <Button
        label="Buka Akses Pro Berdua"
        variant="primary"
        onPress={handleUpgrade}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cream[50],
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xl,
    borderWidth: 1.5,
    borderColor: COLORS.sage[300],
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.sage[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  icon: {
    fontSize: 26,
  },
  title: {
    fontSize: 22,
  },
  desc: {
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  featureList: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.cream[100],
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.cream[300],
  },
});
