import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useCheckinStore } from '../../store/useCheckinStore';
import { aggregateTriggers, TriggerBarItem } from '../../utils/analytics';

export interface TriggerBarChartProps {
  data?: TriggerBarItem[];
}

export default function TriggerBarChart({ data }: TriggerBarChartProps) {
  const history = useCheckinStore((s) => s.history);
  const items = data || aggregateTriggers(history);

  // Cari count tertinggi untuk skala bar proporsional (100% width)
  const maxCount = Math.max(...items.map((i) => i.count), 1);

  return (
    <View style={styles.card}>
      <Typography variant="bodyLarge" style={styles.title}>
        Pemicu Utama Bulan Ini
      </Typography>

      <View style={styles.barsContainer}>
        {items.map((item, index) => {
          // Warna: pemicu kuantitas terbanyak memakai warna kapasitas emosi sangat tipis (#CF7356),
          // dan pemicu di bawahnya memakai warna emosi sedang (#DEB352)
          const barPercent = Math.max(Math.round((item.count / maxCount) * 100), 8);
          const barColor = item.isPrimary ? '#CF7356' : '#DEB352';

          return (
            <View key={index} style={styles.barRow}>
              {/* Trigger Label */}
              <View style={styles.labelCol}>
                <Typography
                  variant="bodyMedium"
                  style={styles.labelText}
                  numberOfLines={1}
                >
                  {item.trigger}
                </Typography>
              </View>

              {/* Progress Bar Track */}
              <View style={styles.trackCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${barPercent}%`,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Count (e.g. 12×) */}
              <View style={styles.countCol}>
                <Typography variant="bodyMedium" style={styles.countText}>
                  {item.count}×
                </Typography>
              </View>
            </View>
          );
        })}
      </View>

      {/* Legend Row sesuai Screenshot 2 */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.legendBoxPrimary]} />
          <Typography variant="caption" style={styles.legendLabel}>
            Pemicu utama
          </Typography>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.legendBoxOther]} />
          <Typography variant="caption" style={styles.legendLabel}>
            Pemicu lainnya
          </Typography>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.2,
    borderColor: '#EAE7E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    gap: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
  },
  barsContainer: {
    gap: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  labelCol: {
    width: 105,
  },
  labelText: {
    fontSize: 13,
    color: '#1E2522',
    fontWeight: '500',
  },
  trackCol: {
    flex: 1,
    justifyContent: 'center',
  },
  barTrack: {
    height: 7,
    backgroundColor: '#F0ECE6',
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3.5,
  },
  countCol: {
    width: 28,
    alignItems: 'flex-end',
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E2522',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 2,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2EFEB',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendBoxPrimary: {
    backgroundColor: '#CF7356', // Terracotta
  },
  legendBoxOther: {
    backgroundColor: '#DEB352', // Warna emosi sedang (amber/gold)
  },
  legendLabel: {
    fontSize: 12,
    color: '#636B64',
  },
});
