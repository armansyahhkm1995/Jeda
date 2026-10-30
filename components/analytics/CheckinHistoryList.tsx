import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useCheckinStore } from '../../store/useCheckinStore';
import { formatDateWithoutDay } from '../../utils/date';
import SingleCheckinCard from '../shared/SingleCheckinCard';
import { CheckinRecord, BodySignalKey, IntensityLevel } from '../../types';

export interface CheckinHistoryListProps {
  selectedDate: string;
  signalFilter?: BodySignalKey | 'all';
  intensityFilter?: IntensityLevel | 'all';
  onResetFilter?: () => void;
}

export default function CheckinHistoryList({
  selectedDate,
  signalFilter = 'all',
  intensityFilter = 'all',
  onResetFilter,
}: CheckinHistoryListProps) {
  const router = useRouter();
  const history = useCheckinStore((s) => s.history);
  const [showOtherDates, setShowOtherDates] = useState(false);

  const isFiltered = signalFilter !== 'all' || intensityFilter !== 'all';

  // Filter check-in untuk tanggal yang sedang dipilih sesuai kriteria filter
  const selectedDateRecords = history.filter((r) => {
    const matchDate = r.date === selectedDate;
    const matchSignal = signalFilter === 'all' || r.bodySignal === signalFilter;
    const matchIntensity = intensityFilter === 'all' || r.intensity === intensityFilter;
    return matchDate && matchSignal && matchIntensity;
  });

  const formattedDate = formatDateWithoutDay(selectedDate);

  // Ekstrak bulan dari selectedDate (YYYY-MM)
  const selectedMonthPrefix = selectedDate.substring(0, 7);
  // Riwayat di bulan yang sama tetapi tanggal berbeda sesuai kriteria filter
  const otherMonthRecords = history.filter((r) => {
    const matchMonth = r.date.startsWith(selectedMonthPrefix) && r.date !== selectedDate;
    const matchSignal = signalFilter === 'all' || r.bodySignal === signalFilter;
    const matchIntensity = intensityFilter === 'all' || r.intensity === intensityFilter;
    return matchMonth && matchSignal && matchIntensity;
  });

  return (
    <View style={styles.container}>
      {/* Header baris: Tanggal di kiri, Jumlah check-in di kanan sesuai Screenshot 1 */}
      <View style={styles.headerRow}>
        <Typography variant="bodyLarge" style={styles.dateTitle}>
          {formattedDate}
        </Typography>

        <Typography variant="caption" style={styles.countText}>
          {selectedDateRecords.length} check-in{isFiltered ? ' (sesuai filter)' : ''}
        </Typography>
      </View>

      {/* Daftar kartu check-in pada tanggal terpilih (Format persis sama dengan di Beranda) */}
      {selectedDateRecords.length === 0 ? (
        <View style={styles.emptyCard}>
          <Typography variant="body" color="#717671" align="center" style={styles.emptyText}>
            {isFiltered
              ? 'Tidak ada catatan check-in yang cocok dengan filter pada tanggal ini.'
              : 'Belum ada catatan check-in pada tanggal ini.'}
          </Typography>

          {isFiltered && onResetFilter ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onResetFilter}
              style={styles.resetFilterBtn}
            >
              <Typography variant="captionMedium" color="#2D5A38">
                Tampilkan Semua Check-in (Reset Filter)
              </Typography>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/checkin' as any)}
              style={styles.addCheckinBtn}
            >
              <Typography variant="captionMedium" color="#2D5A38">
                + Check-in Sinyal Tubuh
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.cardsList}>
          {selectedDateRecords.map((record: CheckinRecord) => (
            <SingleCheckinCard key={record.id} record={record} />
          ))}
        </View>
      )}

      {/* Handling riwayat panjang: Tombol accordion untuk melihat tanggal lain di bulan ini */}
      {otherMonthRecords.length > 0 && (
        <View style={styles.otherDatesSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowOtherDates(!showOtherDates)}
            style={styles.expandToggleBtn}
          >
            <Typography variant="captionMedium" color="#2D5A38">
              {showOtherDates
                ? 'Sembunyikan Riwayat Lainnya ▲'
                : `Lihat Riwayat Tanggal Lainnya (${otherMonthRecords.length} check-in${isFiltered ? ' terfilter' : ''}) ▼`}
            </Typography>
          </TouchableOpacity>

          {showOtherDates && (
            <View style={styles.cardsList}>
              {otherMonthRecords.map((record: CheckinRecord) => (
                <View key={record.id} style={styles.otherItemWrapper}>
                  <Typography variant="caption" color="#717671" style={styles.otherDateBadge}>
                    📅 {formatDateWithoutDay(record.date)} • {record.time}
                  </Typography>
                  <SingleCheckinCard record={record} />
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginTop: 6,
  },
  dateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E2522',
    letterSpacing: -0.2,
  },
  countText: {
    fontSize: 13,
    color: '#717671',
    fontWeight: '500',
  },
  cardsList: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#EAE7E1',
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  addCheckinBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
    backgroundColor: '#EBF3EA',
    borderWidth: 1,
    borderColor: '#BACFBA',
  },
  resetFilterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
    backgroundColor: '#EDF5EE',
    borderWidth: 1.2,
    borderColor: '#2D5A38',
  },
  otherDatesSection: {
    marginTop: 8,
    gap: 12,
  },
  expandToggleBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2DCD2',
  },
  otherItemWrapper: {
    gap: 6,
  },
  otherDateBadge: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
});
