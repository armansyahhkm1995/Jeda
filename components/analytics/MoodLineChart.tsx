import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useCheckinStore } from '../../store/useCheckinStore';
import { computePeriodCapacityTrend, CapacityTrendPoint } from '../../utils/analytics';
import { useHaptics } from '../../hooks/useHaptics';

export interface MoodLineChartProps {
  data?: any;
}

// Hanya Mingguan, Bulanan, dan Tahunan (Harian dihapus sesuai instruksi)
const PERIOD_OPTIONS: ('Mingguan' | 'Bulanan' | 'Tahunan')[] = ['Mingguan', 'Bulanan', 'Tahunan'];

// Skala Ordinat Y sesuai rumus ambang batas kategori kapasitas emosi:
// >42: Sangat Tipis (puncak 50) | 32-42: Tipis | 22-32: Sedang | 15-22: Aman | <=15: Sangat Aman | 0: Baseline
const Y_AXIS_CUTOFFS = [50, 42, 32, 22, 15, 0];

export default function MoodLineChart({ data }: MoodLineChartProps) {
  const history = useCheckinStore((s) => s.history);
  const [activePeriod, setActivePeriod] = useState<'Mingguan' | 'Bulanan' | 'Tahunan'>('Mingguan');
  const [containerWidth, setContainerWidth] = useState<number>(320);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number>(4); // Default Jumat (indeks 4)
  const scrollViewRef = useRef<ScrollView>(null);
  const { triggerBreathTick, triggerButtonPress } = useHaptics();

  // Hitung data tren berdasarkan periode yang aktif
  const trendResult = computePeriodCapacityTrend(history, activePeriod);
  const { points, conclusionSentence } = trendResult;

  // Reset node terpilih jika berpindah periode
  useEffect(() => {
    if (activePeriod === 'Mingguan') {
      setSelectedNodeIdx(4); // Jumat
    } else if (activePeriod === 'Bulanan') {
      setSelectedNodeIdx(1); // Minggu ke-2
    } else {
      setSelectedNodeIdx(9); // Oktober
    }
  }, [activePeriod]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) {
      setContainerWidth(w);
    }
  };

  const handleSwitchPeriod = (period: 'Mingguan' | 'Bulanan' | 'Tahunan') => {
    triggerBreathTick();
    setActivePeriod(period);
  };

  // Dimensi Chart
  const chartHeight = 150;
  const yAxisWidth = 32;
  const paddingTop = 12;
  const paddingBottom = 26;
  const availableHeight = chartHeight - paddingTop - paddingBottom;

  // Lebar viewport kanan (area grafik di sebelah sumbu Y)
  const viewportRightWidth = Math.max(containerWidth - 36 - yAxisWidth, 230);

  // Pada mode Tahunan, buat lebar grafik ~1.95x lebar viewport agar 6 bulan pertama terlihat di awal,
  // dan user dapat swipe/scroll ke kanan untuk melihat 6 bulan berikutnya (Jul-Des).
  const graphContentWidth =
    activePeriod === 'Tahunan' ? Math.round(viewportRightWidth * 1.95) : viewportRightWidth;

  const paddingLeft = 14;
  const paddingRight = 16;
  const availablePlotWidth = graphContentWidth - paddingLeft - paddingRight;

  // Hitung koordinat untuk setiap titik
  const coords = points.map((p, idx) => {
    const x = paddingLeft + (idx / Math.max(points.length - 1, 1)) * availablePlotWidth;
    // Skala Y: 0 di bawah, 50 di atas (skala rumus kapasitas emosi)
    const yRatio = p.score / 50.0;
    const y = paddingTop + (1 - yRatio) * availableHeight;
    return { x, y, score: p.score, label: p.dayName, point: p };
  });

  // Bangun kurva smooth bezier path
  let pathD = '';
  if (coords.length > 0) {
    pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX = (curr.x + next.x) / 2;
      pathD += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
  }

  const selectedPoint: CapacityTrendPoint | undefined = points[selectedNodeIdx] || points[0];
  const selectedCoord = coords[selectedNodeIdx];

  const handleSelectNode = (idx: number) => {
    triggerButtonPress();
    setSelectedNodeIdx(idx);
  };

  // Helper string rincian intensitas tanpa koma di akhir
  const getBreakdownText = (p: CapacityTrendPoint) => {
    if (p.checkinCount === 0) return 'Estimasi rata-rata kapasitas pada periode ini.';
    const parts: string[] = [];
    if (p.kuatCount > 0) parts.push(`${p.kuatCount} Kuat`);
    if (p.sedangCount > 0) parts.push(`${p.sedangCount} Sedang`);
    if (p.ringanCount > 0) parts.push(`${p.ringanCount} Ringan`);
    return `${p.checkinCount} check-in tercatat (${parts.join(', ')})`;
  };

  return (
    <View style={styles.card} onLayout={handleLayout}>
      <Typography variant="bodyLarge" style={styles.title}>
        Pola Kapasitas Emosi
      </Typography>

      {/* Period Filter Pills: [ Mingguan | Bulanan | Tahunan ] */}
      <View style={styles.periodRow}>
        {PERIOD_OPTIONS.map((period) => {
          const isActive = period === activePeriod;
          return (
            <TouchableOpacity
              key={period}
              activeOpacity={0.7}
              onPress={() => handleSwitchPeriod(period)}
              style={[
                styles.periodPill,
                isActive && styles.periodPillActive,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Typography
                variant="caption"
                style={[
                  styles.periodText,
                  isActive && styles.periodTextActive,
                ]}
              >
                {period}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Petunjuk Interaktivitas & Hint Geser jika mode Tahunan */}
      <View style={styles.hintRow}>
        <Typography variant="caption" color="#717671" style={styles.hintText}>
          💡 Ketuk titik untuk melihat detail status kapasitas emosi.
        </Typography>

        {activePeriod === 'Tahunan' && (
          <Typography variant="caption" color="#2D5A38" style={styles.swipeHintText}>
            👉 Geser grafik untuk melihat Jul–Des
          </Typography>
        )}
      </View>

      {/* Chart Layout: Fixed Y-Axis di kiri + Graph Content di kanan */}
      <View style={styles.chartContainerRow}>
        {/* Fixed Sumbu Ordinat Y (Skala Rumus: 50, 42, 32, 22, 15, 0) */}
        <View style={[styles.fixedYAxisCol, { height: chartHeight }]}>
          <Svg width={yAxisWidth} height={chartHeight}>
            {Y_AXIS_CUTOFFS.map((yVal) => {
              const yPos = paddingTop + (1 - yVal / 50.0) * availableHeight;
              return (
                <SvgText
                  key={yVal}
                  x={yAxisWidth - 6}
                  y={yPos + 3.5}
                  fill="#8A928B"
                  fontSize="9.5"
                  textAnchor="end"
                  fontWeight="600"
                >
                  {yVal}
                </SvgText>
              );
            })}
          </Svg>
        </View>

        {/* Area Grafik (Scrollable horizontal saat mode Tahunan) */}
        {activePeriod === 'Tahunan' ? (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={{ width: graphContentWidth }}
            style={styles.horizontalScrollArea}
          >
            <View style={{ width: graphContentWidth, height: chartHeight, position: 'relative' }}>
              <Svg width={graphContentWidth} height={chartHeight}>
                {/* Horizontal Grid lines */}
                {Y_AXIS_CUTOFFS.map((yVal) => {
                  const yPos = paddingTop + (1 - yVal / 50.0) * availableHeight;
                  return (
                    <Line
                      key={`grid_${yVal}`}
                      x1={0}
                      y1={yPos}
                      x2={graphContentWidth}
                      y2={yPos}
                      stroke="#F0ECE6"
                      strokeWidth="1"
                      strokeDasharray={yVal === 0 || yVal === 50 ? '0' : '2,2'}
                    />
                  );
                })}

                {/* Garis Vertikal Penanda Node Terpilih */}
                {selectedCoord && (
                  <Line
                    x1={selectedCoord.x}
                    y1={selectedCoord.y}
                    x2={selectedCoord.x}
                    y2={chartHeight - paddingBottom}
                    stroke="#355E3B"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                )}

                {/* Smooth Bezier Line in Terracotta */}
                {pathD ? (
                  <Path
                    d={pathD}
                    fill="none"
                    stroke="#CF7356"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}

                {/* Data Points (Circles) */}
                {coords.map((c, idx) => {
                  const isSelected = idx === selectedNodeIdx;
                  return (
                    <Circle
                      key={`circ_${idx}`}
                      cx={c.x}
                      cy={c.y}
                      r={isSelected ? 6.5 : 4}
                      fill={isSelected ? '#355E3B' : '#CF7356'}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? 2.5 : 2}
                    />
                  );
                })}

                {/* Sumbu X: 12 Bulan (Jan - Des) */}
                {coords.map((c, idx) => {
                  const isSelected = idx === selectedNodeIdx;
                  return (
                    <SvgText
                      key={`label_${idx}`}
                      x={c.x}
                      y={chartHeight - 6}
                      fill={isSelected ? '#355E3B' : '#8A928B'}
                      fontSize="10.5"
                      textAnchor="middle"
                      fontWeight={isSelected ? '700' : '500'}
                    >
                      {c.label}
                    </SvgText>
                  );
                })}
              </Svg>

              {/* Touch Layer Kolom Per Bulan */}
              <View style={[StyleSheet.absoluteFill, styles.touchOverlay]} pointerEvents="box-none">
                {coords.map((c, idx) => (
                  <TouchableOpacity
                    key={`touch_${idx}`}
                    activeOpacity={0.6}
                    onPress={() => handleSelectNode(idx)}
                    style={styles.colTouchArea}
                    accessibilityRole="button"
                    accessibilityLabel={`Pilih ${c.point.fullLabel}`}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          /* Mode Mingguan & Bulanan (Pas 100% di layar tanpa perlu scroll) */
          <View style={{ flex: 1, height: chartHeight, position: 'relative' }}>
            <Svg width={viewportRightWidth} height={chartHeight}>
              {/* Horizontal Grid lines */}
              {Y_AXIS_CUTOFFS.map((yVal) => {
                const yPos = paddingTop + (1 - yVal / 50.0) * availableHeight;
                return (
                  <Line
                    key={`grid_${yVal}`}
                    x1={0}
                    y1={yPos}
                    x2={viewportRightWidth}
                    y2={yPos}
                    stroke="#F0ECE6"
                    strokeWidth="1"
                    strokeDasharray={yVal === 0 || yVal === 50 ? '0' : '2,2'}
                  />
                );
              })}

              {/* Garis Vertikal Penanda Node Terpilih */}
              {selectedCoord && (
                <Line
                  x1={selectedCoord.x}
                  y1={selectedCoord.y}
                  x2={selectedCoord.x}
                  y2={chartHeight - paddingBottom}
                  stroke="#355E3B"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
              )}

              {/* Smooth Bezier Line in Terracotta */}
              {pathD ? (
                <Path
                  d={pathD}
                  fill="none"
                  stroke="#CF7356"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}

              {/* Data Points (Circles) */}
              {coords.map((c, idx) => {
                const isSelected = idx === selectedNodeIdx;
                return (
                  <Circle
                    key={`circ_${idx}`}
                    cx={c.x}
                    cy={c.y}
                    r={isSelected ? 6.5 : 4}
                    fill={isSelected ? '#355E3B' : '#CF7356'}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2.5 : 2}
                  />
                );
              })}

              {/* Sumbu X: Hari (Mingguan) atau Minggu 1-4 (Bulanan) */}
              {coords.map((c, idx) => {
                const isSelected = idx === selectedNodeIdx;
                return (
                  <SvgText
                    key={`label_${idx}`}
                    x={c.x}
                    y={chartHeight - 6}
                    fill={isSelected ? '#355E3B' : '#8A928B'}
                    fontSize="11"
                    textAnchor="middle"
                    fontWeight={isSelected ? '700' : '500'}
                  >
                    {c.label}
                  </SvgText>
                );
              })}
            </Svg>

            {/* Touch Layer Kolom */}
            <View style={[StyleSheet.absoluteFill, styles.touchOverlay]} pointerEvents="box-none">
              {coords.map((c, idx) => (
                <TouchableOpacity
                  key={`touch_${idx}`}
                  activeOpacity={0.6}
                  onPress={() => handleSelectNode(idx)}
                  style={styles.colTouchArea}
                  accessibilityRole="button"
                  accessibilityLabel={`Pilih ${c.point.fullLabel}`}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* DETAIL KAPASITAS EMOSI NODE TERPILIH (Saran Dihapus, Label Ganti Jadi "Skor Kapasitas Emosi") */}
      {selectedPoint && (
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View style={styles.detailTagBadge}>
              <Typography variant="caption" style={styles.detailTagText}>
                {selectedPoint.fullLabel.toUpperCase()}
              </Typography>
            </View>

            {/* Skor Kapasitas Emosi (menggantikan Skor Beban) */}
            <Typography variant="caption" color="#717671" style={styles.detailScoreText}>
              Skor Kapasitas Emosi: {selectedPoint.score} / 50
            </Typography>
          </View>

          {/* Status Kapasitas Emosi & 5 Titik Indikator */}
          <View style={styles.statusRow}>
            <Typography variant="bodyLarge" style={styles.statusTitle}>
              {selectedPoint.evaluation.title}
            </Typography>

            {/* 5 Battery / Capacity Dots */}
            <View style={styles.dotsRow}>
              {[1, 2, 3, 4, 5].map((dotIndex) => {
                const isFilled = dotIndex <= selectedPoint.evaluation.dots;
                return (
                  <View
                    key={dotIndex}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: isFilled
                          ? selectedPoint.evaluation.dotColor
                          : '#E5DFD5',
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>

          {/* Rincian Intensitas Tercatat */}
          <Typography variant="caption" color="#636B64" style={styles.breakdownText}>
            {getBreakdownText(selectedPoint)}
          </Typography>
        </View>
      )}

      {/* Kesimpulan Template Literal di bawah Chart */}
      <View style={styles.conclusionRow}>
        <Typography variant="bodyMedium" style={styles.conclusionText}>
          {conclusionSentence}
        </Typography>
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
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  periodPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.pill,
    backgroundColor: '#F5F0EB',
  },
  periodPillActive: {
    backgroundColor: '#355E3B', // Warna hijau tombol check-in harian
  },
  periodText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#636B64',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: -2,
  },
  hintText: {
    fontSize: 11.5,
    color: '#717671',
  },
  swipeHintText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chartContainerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  fixedYAxisCol: {
    width: 32,
    justifyContent: 'flex-start',
  },
  horizontalScrollArea: {
    flex: 1,
  },
  touchOverlay: {
    flexDirection: 'row',
  },
  colTouchArea: {
    flex: 1,
    height: '100%',
    backgroundColor: 'transparent',
  },
  detailCard: {
    backgroundColor: '#EDF5EE',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#D4E5D6',
    padding: 14,
    gap: 8,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTagBadge: {
    backgroundColor: '#DDECE0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detailTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2D5A38',
    letterSpacing: 0.5,
  },
  detailScoreText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2522',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#4A554D',
  },
  conclusionRow: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2EFEB',
  },
  conclusionText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#1E2522',
    fontWeight: '500',
  },
});
