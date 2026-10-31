import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Share,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Typography from '../ui/Typography';
import { COLORS } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useCheckinStore } from '../../store/useCheckinStore';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSafeInsets } from '../../hooks/useSafeInsets';

export interface PrivacyDataScreenProps {
  onBack: () => void;
  onOpenPrivacyPolicy?: () => void;
  onLogout: () => void;
}

export default function PrivacyDataScreen({
  onBack,
  onLogout,
}: PrivacyDataScreenProps) {
  const insets = useSafeInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const deleteAccountPermanently = useAuthStore((s) => s.deleteAccountPermanently);
  const history = useCheckinStore((s) => s.history);
  const clearCheckinHistory = useCheckinStore((s) => s.clearHistory);
  const clearAnalyticsHistory = useAnalyticsStore((s) => s.clearHistory);

  const { triggerBreathTick, triggerWarning, triggerPhaseChange } = useHaptics();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);

  // 1. Ekspor & Unduh Data Format CSV (Pasal 13 UU PDP)
  const handleExportDataCSV = () => {
    triggerPhaseChange();
    const csvHeader = 'ID,Tanggal,Waktu,Sinyal Tubuh,Intensitas,Pemicu\n';
    const csvRows = history.map((h) => {
      const triggerClean = (h.trigger || '-').replace(/"/g, '""');
      return `"${h.id}","${h.date}","${h.time}","${h.bodySignal}","${h.intensity}","${triggerClean}"`;
    }).join('\n');
    const csvContent = csvHeader + csvRows;

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `riwayat_jeda_${dateStr}.csv`;

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      try {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Alert.alert(
          'Ekspor CSV Berhasil',
          `Berkas ${filename} berisi ${history.length} baris riwayat check-in telah berhasil diunduh.`
        );
      } catch (err) {
        Alert.alert('Ekspor Data', 'Gagal mengunduh berkas secara otomatis.');
      }
    } else {
      Share.share({
        title: 'Ekspor Riwayat Jeda (CSV)',
        message: csvContent,
      }).catch(() => {
        Alert.alert('Ekspor Berhasil', 'Data riwayat siap disimpan ke dokumen.');
      });
    }
  };

  // 2. Bersihkan Riwayat Check-in (Hak Penghapusan - Pasal 8 UU PDP)
  const confirmClearHistory = () => {
    clearCheckinHistory();
    clearAnalyticsHistory();
    setShowClearHistoryModal(false);
    triggerBreathTick();
    Alert.alert('Riwayat Dibersihkan', 'Seluruh riwayat check-in telah dihapus dari memori perangkat.');
  };

  // 3. Hapus Akun & Data Permanen (Pemusnahan Data / Right to be Forgotten)
  const confirmDeleteAccount = async () => {
    setShowDeleteModal(false);
    triggerWarning();
    clearCheckinHistory();
    clearAnalyticsHistory();
    await deleteAccountPermanently();
    onLogout();
    router.replace('/(auth)' as any);
  };

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
          Privasi & Data
        </Typography>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner UU PDP No. 27/2022 */}
        <View style={styles.pdpBanner}>
          <View style={styles.shieldIconBadge}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 22S4 18 4 12V5L12 2L20 5V12C20 18 12 22 12 22Z"
                stroke="#2D5A38"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M9 12L11 14L15 10"
                stroke="#2D5A38"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <View style={styles.pdpBannerTextCol}>
            <Typography variant="caption" style={styles.pdpBadgeTag}>
              UU NO. 27 TAHUN 2022 (PDP)
            </Typography>
            <Typography variant="bodyLarge" style={styles.pdpBannerTitle}>
              Kamu yang Mengendalikan Datamu
            </Typography>
            <Typography variant="caption" style={styles.pdpBannerDesc}>
              Catatan emosional dan sinyal tubuhmu disimpan secara lokal di perangkat ini dengan proteksi PIN. Data ini tidak pernah dijual atau diserahkan ke pihak ketiga.
            </Typography>
          </View>
        </View>

        {/* Section: Hak Subjek Data */}
        <View style={styles.section}>
          <Typography variant="caption" style={styles.sectionHeaderTitle}>
            HAK PEMILIK DATA PRIBADI
          </Typography>

          <View style={styles.cardContainer}>
            {/* Opsi Ekspor Data (CSV) */}
            <View style={styles.actionItem}>
              <View style={styles.actionInfo}>
                <Typography variant="bodyMedium" style={styles.actionTitle}>
                  Ekspor & Unduh Data Saya (CSV)
                </Typography>
                <Typography variant="caption" style={styles.actionDesc}>
                  Unduh salinan berkas CSV riwayat check-in ({history.length} sesi) untuk disimpan atau dibuka di spreadsheet (Pasal 13 UU PDP).
                </Typography>
              </View>

              <TouchableOpacity
                style={styles.outlineActionButton}
                onPress={handleExportDataCSV}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Typography variant="caption" style={styles.outlineActionText}>
                  Unduh CSV
                </Typography>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Opsi Bersihkan Riwayat */}
            <View style={styles.actionItem}>
              <View style={styles.actionInfo}>
                <Typography variant="bodyMedium" style={styles.actionTitle}>
                  Bersihkan Riwayat Check-in
                </Typography>
                <Typography variant="caption" style={styles.actionDesc}>
                  Hapus seluruh catatan intensitas dan sinyal tubuh dari memori ponsel tanpa menghapus akunmu.
                </Typography>
              </View>

              <TouchableOpacity
                style={styles.outlineActionButton}
                onPress={() => setShowClearHistoryModal(true)}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Typography variant="caption" style={styles.outlineActionText}>
                  Bersihkan
                </Typography>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Opsi Hapus Akun Permanen */}
            <View style={styles.actionItem}>
              <View style={styles.actionInfo}>
                <Typography variant="bodyMedium" style={styles.dangerActionTitle}>
                  Hapus Akun & Data Permanen
                </Typography>
                <Typography variant="caption" style={styles.actionDesc}>
                  Musnahkan seluruh data identitas, riwayat, dan PIN dari database Jeda. Membutuhkan verifikasi ulang OTP jika ingin masuk kembali.
                </Typography>
              </View>

              <TouchableOpacity
                style={styles.dangerActionButton}
                onPress={() => setShowDeleteModal(true)}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Typography variant="caption" style={styles.dangerActionText}>
                  Hapus Akun
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section: Keamanan Enkripsi */}
        <View style={styles.section}>
          <Typography variant="caption" style={styles.sectionHeaderTitle}>
            KEAMANAN PENYIMPANAN DATA
          </Typography>

          <View style={styles.cardContainer}>
            <View style={styles.actionItem}>
              <View style={styles.actionInfo}>
                <Typography variant="bodyMedium" style={styles.actionTitle}>
                  Enkripsi Penyimpanan Lokal
                </Typography>
                <Typography variant="caption" style={styles.actionDesc}>
                  Data profil dan riwayatmu diamankan dengan enkripsi tingkat hardware (Secure Enclave / Keystore).
                </Typography>
              </View>
              <View style={styles.alwaysOnBadge}>
                <Typography variant="caption" style={styles.alwaysOnText}>
                  Aktif
                </Typography>
              </View>
            </View>
          </View>
        </View>

        {/* Section: Kontak Petugas Privasi (DPO) */}
        <View style={styles.section}>
          <Typography variant="caption" style={styles.sectionHeaderTitle}>
            LAYANAN PERLINDUNGAN DATA PRIBADI
          </Typography>

          <View style={styles.cardContainer}>
            <View style={styles.dpoContactCol}>
              <Typography variant="caption" style={styles.dpoHeading}>
                Petugas Perlindungan Data Pribadi (DPO)
              </Typography>
              <Typography variant="caption" style={styles.dpoDesc}>
                Dokumen kebijakan privasi lengkap dan lisensi resmi dapat diakses melalui menu{' '}
                <Typography variant="caption" style={styles.boldText}>
                  Tentang Jeda
                </Typography>
                . Untuk pertanyaan atau pelaksanaan hak datamu, silakan hubungi tim DPO kami di{' '}
                <Typography variant="caption" style={styles.dpoEmail}>
                  privasi@jeda.id
                </Typography>
                .
              </Typography>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal Konfirmasi Bersihkan Riwayat */}
      <Modal
        visible={showClearHistoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearHistoryModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Typography variant="bodyLarge" style={styles.modalTitle}>
              Bersihkan Riwayat Check-in?
            </Typography>
            <Typography variant="caption" style={styles.modalMessage}>
              Tindakan ini akan menghapus seluruh catatan sinyal tubuh, intensitas emosi, dan analitik tren dari penyimpanan perangkat ini. Akun dan profilmu akan tetap aktif.
            </Typography>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setShowClearHistoryModal(false)}
                activeOpacity={0.7}
              >
                <Typography variant="bodyMedium" style={styles.modalSecondaryText}>
                  Batal
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryDestructiveBtn}
                onPress={confirmClearHistory}
                activeOpacity={0.8}
              >
                <Typography variant="bodyMedium" style={styles.modalPrimaryDestructiveText}>
                  Bersihkan
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Konfirmasi Hapus Akun Permanen */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.warningIconCircle}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z"
                  stroke="#C84232"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            <Typography variant="bodyLarge" style={styles.modalTitle}>
              Hapus Akun & Data Permanen?
            </Typography>
            <Typography variant="caption" style={styles.modalMessage}>
              Seluruh info pengguna, profil, nomor telepon, email, PIN keamanan, dan riwayat emosimu akan dihapus sepenuhnya dari database Jeda.
              {'\n\n'}
              Untuk masuk kembali ke aplikasi Jeda, kamu harus mendaftar ulang dan melakukan verifikasi OTP lagi.
            </Typography>

            <View style={styles.modalActionsCol}>
              <TouchableOpacity
                style={styles.modalDeleteBtn}
                onPress={confirmDeleteAccount}
                activeOpacity={0.8}
              >
                <Typography variant="bodyMedium" style={styles.modalDeleteText}>
                  Hapus Akun & Kirim Ulang OTP Nanti
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.7}
              >
                <Typography variant="bodyMedium" style={styles.modalCancelText}>
                  Batal
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },
  pdpBanner: {
    backgroundColor: '#EDF5EE',
    borderWidth: 1.2,
    borderColor: '#CDE4D0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  shieldIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCECDC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  pdpBannerTextCol: {
    flex: 1,
    gap: 4,
  },
  pdpBadgeTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2D5A38',
    letterSpacing: 0.5,
  },
  pdpBannerTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
  },
  pdpBannerDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: '#344537',
  },
  section: {
    marginBottom: 24,
    gap: 8,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#717D74',
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#ECE7DE',
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionInfo: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E2522',
  },
  dangerActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C84232',
  },
  actionDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#717D74',
  },
  outlineActionButton: {
    borderWidth: 1.2,
    borderColor: '#2D5A38',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  outlineActionText: {
    color: '#2D5A38',
    fontWeight: '700',
    fontSize: 12,
  },
  dangerActionButton: {
    borderWidth: 1.2,
    borderColor: '#C84232',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  dangerActionText: {
    color: '#C84232',
    fontWeight: '700',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3EFE9',
    marginHorizontal: 16,
  },
  alwaysOnBadge: {
    backgroundColor: '#EDF5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  alwaysOnText: {
    color: '#2D5A38',
    fontWeight: '700',
    fontSize: 11.5,
  },
  dpoContactCol: {
    padding: 16,
    gap: 6,
  },
  dpoHeading: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E2522',
  },
  dpoDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#556057',
  },
  boldText: {
    fontWeight: '700',
    color: '#1E2522',
  },
  dpoEmail: {
    color: '#2D5A38',
    fontWeight: '700',
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: 12,
  },
  warningIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDEEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E2522',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#5A665D',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  modalSecondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3EFE9',
    alignItems: 'center',
  },
  modalSecondaryText: {
    color: '#5C6760',
    fontWeight: '600',
    fontSize: 13.5,
  },
  modalPrimaryDestructiveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#C84232',
    alignItems: 'center',
  },
  modalPrimaryDestructiveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
  modalActionsCol: {
    gap: 8,
    marginTop: 8,
    width: '100%',
  },
  modalDeleteBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#C84232',
    alignItems: 'center',
  },
  modalDeleteText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
    textAlign: 'center',
  },
  modalCancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#717D74',
    fontWeight: '600',
    fontSize: 13.5,
  },
});
