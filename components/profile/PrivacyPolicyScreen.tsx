import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Typography from '../ui/Typography';
import { COLORS } from '../../constants/theme';

export interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export default function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  return (
    <View style={styles.container}>
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
          Kebijakan Privasi
        </Typography>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Compliance Header Card */}
        <View style={styles.legalBadgeCard}>
          <Typography variant="caption" style={styles.legalBadgeText}>
            STANDAR PERLINDUNGAN DATA PRIBADI (UU PDP NO. 27 TAHUN 2022)
          </Typography>
          <Typography variant="bodyMedium" style={styles.legalBadgeDesc}>
            Terakhir diperbarui: 27 Oktober 2026. Aplikasi Jeda berkomitmen penuh melindungi hak privasi dan keamanan data setiap pengguna.
          </Typography>
        </View>

        {/* Section 1 */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionHeading}>
            1. Filosofi Privasi Sejak Awal (Privacy by Design)
          </Typography>
          <Typography variant="body" style={styles.paragraph}>
            Kami memahami bahwa catatan emosi, pemicu kemarahan, dan sinyal tubuh Anda adalah data kesehatan dan psikologis yang sangat sensitif. Oleh karena itu, aplikasi Jeda dirancang dengan pendekatan{' '}
            <Typography variant="body" style={styles.boldText}>
              Local-First & Privacy by Design
            </Typography>
            , di mana data check-in Anda diproses dan disimpan di perangkat ponsel Anda sendiri, bukan dieksploitasi di server eksternal.
          </Typography>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionHeading}>
            2. Identitas Pengendali Data Pribadi
          </Typography>
          <Typography variant="body" style={styles.paragraph}>
            Pengendali Data Pribadi untuk aplikasi Jeda adalah pengembang resmi platform pendamping buku "Jeda Sebelum Luka". Kami bertanggung jawab atas pemrosesan dan perlindungan data pribadi Anda sesuai dengan ketentuan perundang-undangan di Republik Indonesia.
          </Typography>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionHeading}>
            3. Data yang Kami Kumpulkan & Tujuannya
          </Typography>
          <Typography variant="body" style={styles.paragraph}>
            Kami mengelompokkan data ke dalam dua kategori:
          </Typography>
          <View style={styles.bulletList}>
            <View style={styles.bulletRow}>
              <Typography style={styles.bulletDot}>•</Typography>
              <Typography variant="body" style={styles.bulletText}>
                <Typography variant="body" style={styles.boldText}>Data Umum Identitas:</Typography>{' '}
                Nama panggilan, Nomor WhatsApp (digunakan semata-mata untuk otentikasi login OTP), dan Alamat Email (opsional untuk pemulihan akun dan buletin).
              </Typography>
            </View>

            <View style={styles.bulletRow}>
              <Typography style={styles.bulletDot}>•</Typography>
              <Typography variant="body" style={styles.bulletText}>
                <Typography variant="body" style={styles.boldText}>Data Spesifik Emosional:</Typography>{' '}
                Pilihan sinyal tubuh otonom (detak jantung, rahang mengeras, dll.), tingkat intensitas emosi, kategori pemicu, dan skor kapasitas emosi. Data ini digunakan semata-mata untuk menghadirkan visualisasi analitik pribadi Anda dan tidak pernah diperjualbelikan.
              </Typography>
            </View>
          </View>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionHeading}>
            4. Larangan Penjualan Data & Pihak Ketiga
          </Typography>
          <Typography variant="body" style={styles.paragraph}>
            Jeda <Typography variant="body" style={styles.boldText}>TIDAK PERNAH</Typography> menjual, menyewakan, meminjamkan, atau menukarkan data pribadi atau data check-in Anda kepada broker data, pengiklan, media sosial, atau pihak komersial lainnya. Aplikasi Jeda bebas dari jaringan iklan pihak ketiga yang melacak perilaku pengguna.
          </Typography>
        </View>

        {/* Section 5 */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionHeading}>
            5. Hak-Hak Anda Menurut UU No. 27/2022
          </Typography>
          <Typography variant="body" style={styles.paragraph}>
            Berdasarkan Bab IV Undang-Undang Perlindungan Data Pribadi, Anda memiliki hak penuh sebagai Pemilik Data Pribadi:
          </Typography>
          <View style={styles.bulletList}>
            <View style={styles.bulletRow}>
              <Typography style={styles.bulletDot}>•</Typography>
              <Typography variant="body" style={styles.bulletText}>
                <Typography variant="body" style={styles.boldText}>Hak Akses & Portabilitas Data (Pasal 13):</Typography>{' '}
                Anda berhak mengunduh dan meminta salinan seluruh data pribadi dan riwayat check-in Anda kapan saja.
              </Typography>
            </View>

            <View style={styles.bulletRow}>
              <Typography style={styles.bulletDot}>•</Typography>
              <Typography variant="body" style={styles.bulletText}>
                <Typography variant="body" style={styles.boldText}>Hak Memperbarui Data (Pasal 6):</Typography>{' '}
                Anda dapat mengubah nama, email, nomor ponsel, dan foto profil langsung melalui menu Edit Profil.
              </Typography>
            </View>

            <View style={styles.bulletRow}>
              <Typography style={styles.bulletDot}>•</Typography>
              <Typography variant="body" style={styles.bulletText}>
                <Typography variant="body" style={styles.boldText}>Hak Penghapusan & Pemusnahan (Pasal 8 & 9):</Typography>{' '}
                Anda dapat menghapus riwayat check-in lokal atau menghapus seluruh akun Anda secara permanen (*Right to be Forgotten*).
              </Typography>
            </View>

            <View style={styles.bulletRow}>
              <Typography style={styles.bulletDot}>•</Typography>
              <Typography variant="body" style={styles.bulletText}>
                <Typography variant="body" style={styles.boldText}>Hak Menarik Persetujuan:</Typography>{' '}
                Anda dapat mencabut izin notifikasi pengingat harian atau analitik diagnostik kapan saja di pengaturan aplikasi.
              </Typography>
            </View>
          </View>
        </View>

        {/* Section 6 */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionHeading}>
            6. Keamanan & Penyimpanan
          </Typography>
          <Typography variant="body" style={styles.paragraph}>
            PIN 6-digit keamanan Anda dilindungi menggunakan penyimpanan terenkripsi tingkat sistem operasi (iOS Keychain / Android Keystore). Kami menerapkan standar keamanan terbaik untuk mencegah akses yang tidak sah.
          </Typography>
        </View>

        {/* Section 7 */}
        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionHeading}>
            7. Kontak Petugas Perlindungan Data (DPO)
          </Typography>
          <Typography variant="body" style={styles.paragraph}>
            Apabila Anda memiliki pertanyaan, permohonan pelaksanaan hak data pribadi, atau saran mengenai kebijakan ini, silakan hubungi Petugas Perlindungan Data kami melalui email di:
          </Typography>
          <View style={styles.contactCard}>
            <Typography variant="bodyMedium" style={styles.contactEmail}>
              privasi@jeda.id
            </Typography>
            <Typography variant="caption" style={styles.contactSub}>
              Tim Perlindungan Data Pribadi Jeda — Jakarta, Indonesia
            </Typography>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 40,
  },
  legalBadgeCard: {
    backgroundColor: '#EDF5EE',
    borderWidth: 1,
    borderColor: '#CDE4D0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    gap: 6,
  },
  legalBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2D5A38',
    letterSpacing: 0.5,
  },
  legalBadgeDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#344537',
  },
  section: {
    marginBottom: 24,
    gap: 8,
  },
  sectionHeading: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
  },
  paragraph: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#4F5A53',
  },
  boldText: {
    fontWeight: '700',
    color: '#1E2522',
  },
  bulletList: {
    gap: 8,
    paddingLeft: 4,
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    fontSize: 16,
    color: '#2D5A38',
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#4F5A53',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E1D8',
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    gap: 4,
  },
  contactEmail: {
    color: '#2D5A38',
    fontWeight: '700',
    fontSize: 14,
  },
  contactSub: {
    color: '#717D74',
    fontSize: 12,
  },
});
