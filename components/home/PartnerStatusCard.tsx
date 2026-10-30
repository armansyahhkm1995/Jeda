import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { usePartnerStore } from '../../store/usePartnerStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function PartnerStatusCard() {
  const isLinked = usePartnerStore((s) => s.isLinked);
  const partnerName = usePartnerStore((s) => s.partnerName);
  const partnerCapacity = usePartnerStore((s) => s.partnerCapacity);
  const partnerSignal = usePartnerStore((s) => s.partnerSignal);
  const { triggerBreathTick } = useHaptics();

  if (!isLinked) {
    return null;
  }

  // Tentukan warna status berdasarkan kapasitas pasangan
  const isThin = partnerCapacity.toLowerCase().includes('tipis');
  const isMedium = partnerCapacity.toLowerCase().includes('sedang');
  const badgeColor = isThin ? '#CF7356' : isMedium ? '#D97706' : '#2D5A38';
  const badgeBg = isThin ? 'rgba(207, 115, 86, 0.12)' : isMedium ? 'rgba(217, 119, 6, 0.12)' : 'rgba(45, 90, 56, 0.12)';

  return (
    <Card variant="flat" padding="md" style={styles.card}>
      {/* Header Baris Atas */}
      <View style={styles.headerRow}>
        <View style={styles.labelGroup}>
          <View style={[styles.statusDot, { backgroundColor: badgeColor }]} />
          <Typography variant="captionMedium" color={COLORS.sage[700]} style={styles.headerLabel}>
            KAPASITAS PASANGAN
          </Typography>
        </View>

        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Typography variant="caption" color={badgeColor} style={styles.badgeText}>
            {partnerCapacity}
          </Typography>
        </View>
      </View>

      {/* Pesan Sesuai Format Permintaan:
          "Kapasitas {Nama} sedang {Kapasitas Emosi} dengan sinyal tubuh {Sinyal Tubuh}. Berikan jeda sejenak" */}
      <Typography variant="bodyMedium" style={styles.message}>
        Kapasitas <Typography variant="bodyMedium" style={{ fontWeight: '700', color: COLORS.brand.textDark }}>{partnerName}</Typography> sedang{' '}
        <Typography variant="bodyMedium" style={{ fontWeight: '700', color: badgeColor }}>{partnerCapacity}</Typography> dengan sinyal tubuh{' '}
        <Typography variant="bodyMedium" style={{ fontWeight: '700', color: COLORS.brand.textDark }}>{partnerSignal}</Typography>. Berikan jeda sejenak.
      </Typography>

      {/* Rekomendasi Tindakan Lembut untuk Pasangan */}
      <View style={styles.actionRow}>
        <Typography variant="caption" color={COLORS.brand.textMuted}>
          {isThin
            ? '💡 Rekomendasi: Ambil alih tugas rumah tangga sejenak atau ajak hening 5 menit.'
            : '✨ Kapasitas pasangan terjaga stabil.'}
        </Typography>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF8F5',
    borderColor: '#E8E4DD',
    borderWidth: 1,
    borderRadius: RADIUS.card,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerLabel: {
    letterSpacing: 0.8,
    fontSize: 11,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 11,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3A423D',
  },
  actionRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
  },
});
