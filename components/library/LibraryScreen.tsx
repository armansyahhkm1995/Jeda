import React, { useState, useMemo } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import TechniqueCard from './TechniqueCard';
import FilterSheet, { DurationFilter } from './FilterSheet';
import { COLORS, SPACING, SERIF_FONT } from '../../constants/theme';
import { TECHNIQUES } from '../../constants/techniques';
import { Technique, TechniqueCategory } from '../../types';
import { useSessionStore } from '../../store/useSessionStore';
import { useHaptics } from '../../hooks/useHaptics';

// Daftar sinyal tubuh lengkap berbasis neurobiologi
const AVAILABLE_BODY_SIGNALS = [
  'Dada sesak',
  'Rahang tegang',
  'Jantung berdebar',
  'Napas pendek',
  'Tangan mengepal',
  'Bahu kaku',
  'Pikiran kalut',
  'Kepala berat',
  'Sulit diam',
  'Sumbu pendek',
  'Tenggorokan mengganjal',
  'Hampir meledak',
];

export default function LibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TechniqueCategory | 'all'>('all');
  const [selectedDuration, setSelectedDuration] = useState<DurationFilter>('all');
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const startSession = useSessionStore((s) => s.startSession);
  const { triggerPhaseChange, triggerBreathTick, triggerButtonPress } = useHaptics();

  // Toggle selection sinyal tubuh (Multi-Select Chips)
  const handleToggleSignal = (signal: string) => {
    triggerBreathTick();
    setSelectedSignals((prev) =>
      prev.includes(signal) ? prev.filter((s) => s !== signal) : [...prev, signal]
    );
  };

  const handleResetFilters = () => {
    triggerButtonPress();
    setSelectedCategory('all');
    setSelectedDuration('all');
    setSelectedSignals([]);
    setSearchQuery('');
  };

  // Filter & Urutkan Teknik (Relevansi Sinyal lalu Durasi Tersingkat)
  const filteredTechniques = useMemo(() => {
    return TECHNIQUES.filter((tech) => {
      // 1. Filter Kategori
      if (selectedCategory !== 'all' && tech.category !== selectedCategory) {
        return false;
      }

      // 2. Filter Durasi
      if (selectedDuration !== 'all') {
        const estMinutes = tech.durationEstimateMinutes || 1;
        if (selectedDuration === 'short' && estMinutes > 1) return false;
        if (selectedDuration === 'medium' && (estMinutes < 2 || estMinutes > 3)) return false;
        if (selectedDuration === 'long' && estMinutes <= 3) return false;
      }

      // 3. Filter Sinyal Tubuh (Multi-Select)
      if (selectedSignals.length > 0) {
        const matchesSignal = selectedSignals.some((sig) => {
          const sigLower = sig.toLowerCase();
          const inSuitable = tech.suitableSignals?.some(
            (s) => s.toLowerCase().includes(sigLower) || sigLower.includes(s.toLowerCase())
          );
          const inKeys = tech.bodySignalKeys?.some(
            (k) => k.toLowerCase().includes(sigLower) || sigLower.includes(k.toLowerCase())
          );
          return inSuitable || inKeys;
        });
        if (!matchesSignal) return false;
      }

      // 4. Pencarian Teks Bebas
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchName = tech.name.toLowerCase().includes(q);
        const matchSubtitle = tech.subtitle.toLowerCase().includes(q);
        const matchDesc = tech.description.toLowerCase().includes(q);
        const matchNeuro = tech.neuroBio.toLowerCase().includes(q);
        const matchSuitable = tech.suitableSignals?.some((s) => s.toLowerCase().includes(q));
        return matchName || matchSubtitle || matchDesc || matchNeuro || matchSuitable;
      }

      return true;
    }).sort((a, b) => {
      // Prioritas 1: Kecocokan sinyal tubuh terbanyak
      if (selectedSignals.length > 0) {
        const matchCountA = selectedSignals.filter((sig) =>
          a.suitableSignals?.some((s) => s.toLowerCase().includes(sig.toLowerCase()))
        ).length;
        const matchCountB = selectedSignals.filter((sig) =>
          b.suitableSignals?.some((s) => s.toLowerCase().includes(sig.toLowerCase()))
        ).length;
        if (matchCountB !== matchCountA) return matchCountB - matchCountA;
      }

      // Prioritas 2: Durasi tersingkat ke terlama (menghadirkan pertolongan tercepat di urutan atas)
      const durA = a.durationEstimateMinutes || 1;
      const durB = b.durationEstimateMinutes || 1;
      return durA - durB;
    });
  }, [searchQuery, selectedCategory, selectedDuration, selectedSignals]);

  const handleSelectTechnique = (tech: Technique) => {
    triggerPhaseChange();
    startSession(tech.id, 'library');
    router.push('/(checkin)/session' as any);
  };

  const hasAnyFilterActive =
    selectedCategory !== 'all' ||
    selectedDuration !== 'all' ||
    selectedSignals.length > 0 ||
    searchQuery.trim().length > 0;

  return (
    <ScreenWrapper scrollable withTabBar style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="captionMedium" style={styles.tagline}>
          PUSTAKA REGULASI SINYAL TUBUH
        </Typography>
        <Typography variant="h1" style={styles.title}>
          Cari regulasi sinyal tubuhmu
        </Typography>
      </View>

      {/* Search Bar & Filter Button (Tanpa Mikrofon) */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          {/* Magnifier Icon */}
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#717D74"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder='Ketik bagian tubuh, mis. "rahang"'
            placeholderTextColor="#8A948C"
            style={styles.searchInput}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Typography variant="caption" color={COLORS.earth[400]}>
                ✕
              </Typography>
            </TouchableOpacity>
          )}

          {/* Filter Icon Button (Funnel) di kanan kolom search */}
          <View style={styles.searchDivider} />
          <TouchableOpacity
            onPress={() => {
              triggerButtonPress();
              setIsFilterOpen(true);
            }}
            style={[
              styles.filterIconBtn,
              (selectedCategory !== 'all' || selectedDuration !== 'all') && styles.filterIconBtnActive,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Filter Durasi dan Kategori"
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
                stroke={
                  selectedCategory !== 'all' || selectedDuration !== 'all' ? '#2D5A38' : '#717D74'
                }
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* Somatic Signal Badges (Flex Wrap — Semua Tampak Tanpa Perlu Swipe ke Samping) */}
      <View style={styles.signalsSection}>
        <View style={styles.signalsWrapContainer}>
          {AVAILABLE_BODY_SIGNALS.map((signal) => {
            const isSelected = selectedSignals.includes(signal);
            return (
              <TouchableOpacity
                key={signal}
                activeOpacity={0.8}
                onPress={() => handleToggleSignal(signal)}
                style={[styles.signalChip, isSelected && styles.signalChipSelected]}
                accessibilityRole="button"
                accessibilityLabel={`Sinyal tubuh ${signal}, ${isSelected ? 'terpilih' : 'tidak terpilih'}`}
              >
                {isSelected && (
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17L4 12"
                      stroke="#2D5A38"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
                <Typography
                  variant="captionMedium"
                  style={[styles.signalChipText, isSelected && styles.signalChipTextSelected]}
                >
                  {signal}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Active Filter Bar (Jika ada filter aktif) */}
      {hasAnyFilterActive && (
        <View style={styles.activeFilterSummary}>
          <Typography variant="caption" style={styles.activeFilterCount}>
            Menampilkan hasil untuk:
            {selectedSignals.length > 0 && ` ${selectedSignals.length} sinyal tubuh`}
            {selectedCategory !== 'all' && ` • Kategori ${selectedCategory}`}
            {selectedDuration !== 'all' && ` • Durasi ${selectedDuration}`}
            {searchQuery ? ` • "${searchQuery}"` : ''}
          </Typography>

          <TouchableOpacity onPress={handleResetFilters} style={styles.resetFilterChip}>
            <Typography variant="captionMedium" color={COLORS.brand.error}>
              Reset Semua ✕
            </Typography>
          </TouchableOpacity>
        </View>
      )}

      {/* Section Header: "Daftar regulasi" + Jumlah Teknik */}
      <View style={styles.sectionHeaderRow}>
        <Typography variant="bodyLarge" style={styles.sectionTitle}>
          Daftar regulasi
        </Typography>
        <Typography variant="caption" style={styles.sectionSortHint}>
          {filteredTechniques.length} teknik tersedia
        </Typography>
      </View>

      {/* Techniques List */}
      <View style={styles.list}>
        {filteredTechniques.map((tech) => (
          <TechniqueCard key={tech.id} technique={tech} onPress={handleSelectTechnique} />
        ))}

        {filteredTechniques.length === 0 && (
          <View style={styles.emptyState}>
            <Typography variant="bodyLarge" align="center" style={styles.emptyTitle}>
              Tidak ada regulasi yang cocok
            </Typography>
            <Typography variant="caption" color={COLORS.earth[400]} align="center">
              Coba kurangi kombinasi sinyal tubuh atau reset filter kategori & durasi.
            </Typography>
            <TouchableOpacity onPress={handleResetFilters} style={styles.emptyResetBtn}>
              <Typography variant="bodyMedium" color="#2D5A38" style={{ fontWeight: '600' }}>
                Tampilkan Semua Regulasi
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Filter Bottom Sheet (Durasi & Kategori) */}
      <FilterSheet
        visible={isFilterOpen}
        selectedCategory={selectedCategory}
        selectedDuration={selectedDuration}
        onSelectCategory={setSelectedCategory}
        onSelectDuration={setSelectedDuration}
        onReset={() => {
          setSelectedCategory('all');
          setSelectedDuration('all');
        }}
        onClose={() => setIsFilterOpen(false)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#FAF8F5',
  },
  header: {
    paddingTop: 16,
    marginBottom: 16,
    gap: 4,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D5A38',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 28,
    fontFamily: SERIF_FONT,
    color: '#1E2522',
    lineHeight: 34,
    fontWeight: '700',
  },
  searchRow: {
    marginBottom: 14,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6E2DA',
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E2522',
  },
  clearBtn: {
    padding: 4,
  },
  searchDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EBE7DF',
    marginHorizontal: 2,
  },
  filterIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconBtnActive: {
    backgroundColor: '#EBF2ED',
  },
  signalsSection: {
    marginBottom: 16,
  },
  signalsWrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  signalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2DED7',
  },
  signalChipSelected: {
    backgroundColor: '#EEF5F0',
    borderColor: '#2D5A38',
  },
  signalChipText: {
    fontSize: 13,
    color: '#45524A',
    fontWeight: '500',
  },
  signalChipTextSelected: {
    color: '#2D5A38',
    fontWeight: '700',
  },
  activeFilterSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3EFE9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  activeFilterCount: {
    flex: 1,
    fontSize: 11,
    color: '#5C6760',
  },
  resetFilterChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2522',
  },
  sectionSortHint: {
    fontSize: 12,
    color: '#717D74',
  },
  list: {
    gap: 14,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
  },
  emptyResetBtn: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#EEF5F0',
  },
});
