import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import CalendarView from './CalendarView';
import CheckinHistoryList from './CheckinHistoryList';
import AnalyticsFilterBar from './AnalyticsFilterBar';
import WeeklyInsightCard from './WeeklyInsightCard';
import TriggerBarChart from './TriggerBarChart';
import MoodLineChart from './MoodLineChart';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useCheckinStore } from '../../store/useCheckinStore';
import { getTodayIsoString } from '../../utils/date';
import { useHaptics } from '../../hooks/useHaptics';
import { BodySignalKey, IntensityLevel } from '../../types';

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState<'kalender' | 'tren'>('kalender');

  // Default tanggal terpilih: 9 Oktober 2026 (sesuai Screenshot 1)
  const initialDate = '2026-10-09';
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);

  // State Filter Sinyal Tubuh & Intensitas untuk Tab Kalender
  const [signalFilter, setSignalFilter] = useState<BodySignalKey | 'all'>('all');
  const [intensityFilter, setIntensityFilter] = useState<IntensityLevel | 'all'>('all');

  const history = useCheckinStore((s) => s.history);
  const { triggerBreathTick } = useHaptics();

  // Riwayat terfilter berdasarkan sinyal tubuh dan intensitas yang dipilih
  const filteredHistory = useMemo(() => {
    return history.filter((r) => {
      const matchSignal = signalFilter === 'all' || r.bodySignal === signalFilter;
      const matchIntensity = intensityFilter === 'all' || r.intensity === intensityFilter;
      return matchSignal && matchIntensity;
    });
  }, [history, signalFilter, intensityFilter]);

  const handleResetFilters = () => {
    setSignalFilter('all');
    setIntensityFilter('all');
  };

  const handleSwitchTab = (tab: 'kalender' | 'tren') => {
    triggerBreathTick();
    setActiveTab(tab);
  };

  const isFiltered = signalFilter !== 'all' || intensityFilter !== 'all';

  return (
    <ScreenWrapper scrollable withTabBar style={styles.container}>
      {/* Header Halaman sesuai Screenshot 1 & 2 */}
      <View style={styles.header}>
        <Typography variant="h1" style={styles.screenTitle}>
          Analitik
        </Typography>
      </View>

      {/* Segmented Control Switcher Pills: [ Kalender | Tren PRO ] dengan background hijau saat aktif */}
      <View style={styles.segmentedContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSwitchTab('kalender')}
          style={[styles.segmentBtn, activeTab === 'kalender' && styles.segmentBtnActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'kalender' }}
        >
          <Typography
            variant="bodyMedium"
            style={[
              styles.segmentText,
              activeTab === 'kalender' && styles.segmentTextActive,
            ]}
          >
            Kalender
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSwitchTab('tren')}
          style={[styles.segmentBtn, activeTab === 'tren' && styles.segmentBtnActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'tren' }}
        >
          <Typography
            variant="bodyMedium"
            style={[
              styles.segmentText,
              activeTab === 'tren' && styles.segmentTextActive,
            ]}
          >
            Tren PRO
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Konten Tab */}
      {activeTab === 'kalender' ? (
        <View style={styles.tabContent}>
          {/* Kalender Bulanan Interaktif dengan navigasi Tahun dan Bulan lebih besar & kontras tinggi */}
          <CalendarView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            history={filteredHistory}
            initialYear={2026}
            initialMonth={9} // Oktober (0-indexed: 9)
            isFiltered={isFiltered}
          />

          {/* Filter Bar Sinyal Tubuh & Intensitas */}
          <AnalyticsFilterBar
            selectedSignal={signalFilter}
            selectedIntensity={intensityFilter}
            onSelectSignal={setSignalFilter}
            onSelectIntensity={setIntensityFilter}
            onReset={handleResetFilters}
          />

          {/* Riwayat Check-in untuk tanggal terpilih dengan format card persis seperti di Beranda */}
          <CheckinHistoryList
            selectedDate={selectedDate}
            signalFilter={signalFilter}
            intensityFilter={intensityFilter}
            onResetFilter={handleResetFilters}
          />
        </View>
      ) : (
        <View style={styles.tabContent}>
          {/* Card 1: Pola yang mulai terlihat ✨ (Template literal deterministik tanpa AI) */}
          <WeeklyInsightCard />

          {/* Card 2: Pemicu Utama Bulan Ini (Horizontal Bar Chart dengan warna terakota & amber) */}
          <TriggerBarChart />

          {/* Card 3: Pola Kapasitas Emosi (Interactive Trend Line SVG dengan skala 0-50 & detail node) */}
          <MoodLineChart />
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 12,
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E2522',
    letterSpacing: -0.4,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAE5DD',
    borderRadius: RADIUS.pill,
    padding: 3,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
  },
  segmentBtnActive: {
    backgroundColor: '#355E3B', // Warna hijau tombol check-in harian (menggantikan hitam)
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636B64',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    gap: 16,
  },
});
