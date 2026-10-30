import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { CheckinRecord } from '../../types';
import { getTodayIsoString, formatMonthYear, INDONESIAN_MONTHS } from '../../utils/date';
import { computeCalendarDaysFromHistory, EnrichedCalendarDay } from '../../utils/analytics';
import { useHaptics } from '../../hooks/useHaptics';

export interface CalendarViewProps {
  selectedDate: string;
  onSelectDate: (dateIso: string) => void;
  history: CheckinRecord[];
  initialYear?: number;
  initialMonth?: number; // 0-indexed (0 = Jan, 9 = Okt)
  isFiltered?: boolean;
}

// Kolom hari dimulai dari Senin (Sen, Sel, Rab, Kam, Jum, Sab, Min)
const DAYS_HEADER = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
const AVAILABLE_YEARS = [2024, 2025, 2026, 2027, 2028];

export default function CalendarView({
  selectedDate,
  onSelectDate,
  history,
  initialYear,
  initialMonth,
  isFiltered = false,
}: CalendarViewProps) {
  const { triggerBreathTick } = useHaptics();
  const today = getTodayIsoString();

  // Ekstrak tahun dan bulan awal dari selectedDate atau props
  const [selectedY, selectedM] = selectedDate.split('-').map(Number);
  const [viewYear, setViewYear] = useState<number>(initialYear ?? (selectedY || 2026));
  const [viewMonth, setViewMonth] = useState<number>(initialMonth ?? (selectedM ? selectedM - 1 : 9)); // default Oktober (9)

  // Modal pemilihan cepat Tahun & Bulan
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Navigasi Bulan & Tahun
  const handlePrevMonth = () => {
    triggerBreathTick();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    triggerBreathTick();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handlePrevYear = () => {
    triggerBreathTick();
    setViewYear((y) => y - 1);
  };

  const handleNextYear = () => {
    triggerBreathTick();
    setViewYear((y) => y + 1);
  };

  // Hitung hari dalam bulan ini beserta status check-in
  const calendarDays = useMemo(() => {
    return computeCalendarDaysFromHistory(history, viewYear, viewMonth);
  }, [history, viewYear, viewMonth]);

  // Hitung blank slot di awal bulan berdasarkan hari Senin sebagai indeks 0
  const firstDate = new Date(viewYear, viewMonth, 1);
  const firstDayMondayBased = (firstDate.getDay() + 6) % 7; // Senin = 0, ..., Minggu = 6
  const blankSlots = Array.from({ length: firstDayMondayBased });

  return (
    <View style={styles.cardContainer}>
      {/* Month & Year Navigation Bar - Desain Lebih Besar & Kontras Tinggi */}
      <View style={styles.navRow}>
        <View style={styles.navGroup}>
          {/* Tombol Tahun Sebelumnya («) */}
          <TouchableOpacity
            onPress={handlePrevYear}
            activeOpacity={0.7}
            style={styles.arrowButtonYear}
            accessibilityRole="button"
            accessibilityLabel="Tahun Sebelumnya"
          >
            <Typography variant="bodyMedium" style={styles.arrowTextYear}>
              «
            </Typography>
          </TouchableOpacity>

          {/* Tombol Bulan Sebelumnya (‹) */}
          <TouchableOpacity
            onPress={handlePrevMonth}
            activeOpacity={0.7}
            style={styles.arrowButtonMonth}
            accessibilityRole="button"
            accessibilityLabel="Bulan Sebelumnya"
          >
            <Typography variant="bodyMedium" style={styles.arrowTextMonth}>
              ‹
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Klik label bulan untuk membuka pemilih cepat */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsPickerOpen(true)}
          style={styles.monthTitleWrapper}
          accessibilityRole="button"
          accessibilityLabel={`Pilih bulan atau tahun, saat ini ${formatMonthYear(viewYear, viewMonth)}`}
        >
          <Typography variant="bodyLarge" style={styles.monthTitle}>
            {formatMonthYear(viewYear, viewMonth)} ▾
          </Typography>
        </TouchableOpacity>

        <View style={styles.navGroup}>
          {/* Tombol Bulan Berikutnya (›) */}
          <TouchableOpacity
            onPress={handleNextMonth}
            activeOpacity={0.7}
            style={styles.arrowButtonMonth}
            accessibilityRole="button"
            accessibilityLabel="Bulan Berikutnya"
          >
            <Typography variant="bodyMedium" style={styles.arrowTextMonth}>
              ›
            </Typography>
          </TouchableOpacity>

          {/* Tombol Tahun Berikutnya (») */}
          <TouchableOpacity
            onPress={handleNextYear}
            activeOpacity={0.7}
            style={styles.arrowButtonYear}
            accessibilityRole="button"
            accessibilityLabel="Tahun Berikutnya"
          >
            <Typography variant="bodyMedium" style={styles.arrowTextYear}>
              »
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Days of Week Header (S S R K J S M) */}
      <View style={styles.daysHeaderRow}>
        {DAYS_HEADER.map((dayLabel, idx) => (
          <View key={idx} style={styles.dayCol}>
            <Typography variant="captionMedium" style={styles.dayHeaderText}>
              {dayLabel}
            </Typography>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.grid}>
        {blankSlots.map((_, idx) => (
          <View key={`blank_${idx}`} style={styles.dayCell} />
        ))}

        {calendarDays.map((item: EnrichedCalendarDay) => {
          const isSelected = item.date === selectedDate;
          const isTodayDate = item.date === today;

          return (
            <TouchableOpacity
              key={item.date}
              activeOpacity={0.7}
              onPress={() => {
                triggerBreathTick();
                onSelectDate(item.date);
              }}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Tanggal ${item.dayNumber}, ${item.hasCheckin ? 'Ada check-in' : 'Belum check-in'}`}
            >
              <Typography
                variant="bodyMedium"
                style={[
                  styles.dayNumber,
                  isSelected && styles.dayNumberSelected,
                  isTodayDate && !isSelected && styles.dayNumberToday,
                ]}
              >
                {item.dayNumber}
              </Typography>

              {/* Indicator Dot */}
              <View style={styles.dotContainer}>
                {isSelected ? (
                  <View style={[styles.dot, styles.dotSelected]} />
                ) : item.hasCheckin ? (
                  <View
                    style={[
                      styles.dot,
                      item.isThinCapacity ? styles.dotTerracotta : styles.dotGreen,
                    ]}
                  />
                ) : (
                  <View style={styles.dotEmpty} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend Row di bawah Kalender sesuai visual Screenshot 1 */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotGreen]} />
          <Typography variant="caption" style={styles.legendLabel}>
            Kapasitas cukup
          </Typography>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotTerracotta]} />
          <Typography variant="caption" style={styles.legendLabel}>
            Kapasitas tipis
          </Typography>
        </View>
      </View>

      {isFiltered && (
        <Typography variant="caption" color="#2D5A38" style={styles.filteredLegendNote}>
          *Menampilkan titik tanggal sesuai filter aktif
        </Typography>
      )}

      {/* Modal Quick Picker Tahun & Bulan */}
      <Modal
        visible={isPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsPickerOpen(false)}
        >
          <View style={styles.pickerModalContent} onStartShouldSetResponder={() => true}>
            <Typography variant="bodyLarge" style={styles.pickerModalTitle}>
              Pilih Bulan & Tahun
            </Typography>

            {/* Tahun Selector */}
            <Typography variant="captionMedium" color="#717671" style={styles.pickerSubhead}>
              TAHUN
            </Typography>
            <View style={styles.yearPillsRow}>
              {AVAILABLE_YEARS.map((y) => (
                <TouchableOpacity
                  key={y}
                  onPress={() => setViewYear(y)}
                  style={[
                    styles.pickerPill,
                    viewYear === y && styles.pickerPillActive,
                  ]}
                >
                  <Typography
                    variant="captionMedium"
                    color={viewYear === y ? '#FFFFFF' : '#1E2522'}
                  >
                    {y}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bulan Selector */}
            <Typography variant="captionMedium" color="#717671" style={styles.pickerSubhead}>
              BULAN
            </Typography>
            <ScrollView style={styles.monthScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.monthGrid}>
                {INDONESIAN_MONTHS.map((mName, mIdx) => (
                  <TouchableOpacity
                    key={mName}
                    onPress={() => {
                      setViewMonth(mIdx);
                      setIsPickerOpen(false);
                    }}
                    style={[
                      styles.monthCell,
                      viewMonth === mIdx && styles.monthCellActive,
                    ]}
                  >
                    <Typography
                      variant="bodyMedium"
                      color={viewMonth === mIdx ? '#FFFFFF' : '#1E2522'}
                    >
                      {mName}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderWidth: 1.2,
    borderColor: '#EAE7E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  navGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowButtonYear: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F5ECE1',
    borderWidth: 1.5,
    borderColor: '#D7C7B7',
  },
  arrowButtonMonth: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#EDF5EE',
    borderWidth: 1.5,
    borderColor: '#B9D7BB',
  },
  arrowTextYear: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '800',
    color: '#3E342B',
  },
  arrowTextMonth: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
    color: '#2D5A38',
  },
  monthTitleWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.2,
    borderColor: '#EAE5DD',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
    letterSpacing: -0.2,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2EFEB',
    paddingBottom: 6,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A928B',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 2,
  },
  dayCellSelected: {
    backgroundColor: '#355E3B', // Warna hijau tombol check-in harian (menggantikan hitam)
    borderRadius: 14,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E2522',
  },
  dayNumberSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayNumberToday: {
    fontWeight: '700',
    color: '#2D5A38',
  },
  dotContainer: {
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dotGreen: {
    backgroundColor: '#2D5A38', // Kapasitas cukup (hijau)
  },
  dotTerracotta: {
    backgroundColor: '#CF7356', // Kapasitas tipis (terakota)
  },
  dotSelected: {
    backgroundColor: '#FFFFFF', // Dot putih di bawah tanggal yang sedang dipilih
  },
  dotEmpty: {
    width: 5,
    height: 5,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2EFEB',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#636B64',
  },
  filteredLegendNote: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerModalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2522',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerSubhead: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  yearPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pickerPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F0EB',
  },
  pickerPillActive: {
    backgroundColor: '#2D5A38',
  },
  monthScroll: {
    maxHeight: 220,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthCell: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
  },
  monthCellActive: {
    backgroundColor: '#2D5A38',
  },
});
