import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Modal,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import Typography from '../ui/Typography';
import { sendCancellationSurvey } from '../../utils/survey';
import { sendInstantTestNotification } from '../../utils/notifications';
import JedaProScreen from './JedaProScreen';
import LogoutSheet from './LogoutSheet';
import EditProfileScreen from './EditProfileScreen';
import ChangePinScreen from './ChangePinScreen';
import PrivacyDataScreen from './PrivacyDataScreen';
import AboutScreen from './AboutScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import LicenseScreen from './LicenseScreen';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSafeInsets } from '../../hooks/useSafeInsets';

type SubScreen =
  | 'main'
  | 'edit_profile'
  | 'change_pin'
  | 'privacy_data'
  | 'about'
  | 'privacy_policy'
  | 'license';

const TIME_PRESETS = [
  { label: 'Pagi Hari', time: '07:00' },
  { label: 'Siang Hari', time: '12:30' },
  { label: 'Sore Hari', time: '17:00' },
  { label: 'Malam Hari', time: '20:30' },
];

export default function ProfileScreen() {
  const insets = useSafeInsets();
  const router = useRouter();
  const [currentSubScreen, setCurrentSubScreen] = useState<SubScreen>('main');
  const [privacyPolicyOrigin, setPrivacyPolicyOrigin] = useState<'about' | 'privacy_data'>('about');
  const [showProModal, setShowProModal] = useState(false);
  const [showLogoutSheet, setShowLogoutSheet] = useState(false);

  // Modal Timers
  const [showReminderModal, setShowReminderModal] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isPro = user?.isPro;
  const cancelProSubscription = useAuthStore((s) => s.cancelProSubscription);

  const [showCancelProModal, setShowCancelProModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('Biaya langganan terlalu mahal');
  const [surveyNotes, setSurveyNotes] = useState<string>('');
  const [isSendingSurvey, setIsSendingSurvey] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const SURVEY_REASONS = [
    'Biaya langganan terlalu mahal',
    'Jarang menggunakan Mode Pasangan / Analitik',
    'Pasangan tidak aktif menggunakan aplikasi',
    'Mengalami kendala teknis / aplikasi lambat',
    'Fitur gratis sudah cukup untuk kebutuhan saya',
    'Lainnya',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Step 1: User klik "Ya, Berhenti" di modal konfirmasi -> Buka modal kuisioner
  const handleProceedToSurvey = () => {
    triggerButtonPress();
    setShowCancelProModal(false);
    setShowSurveyModal(true);
  };

  // Step 2A: User memilih Lewati / Skip kuisioner
  const handleSkipSurvey = () => {
    triggerPhaseChange();
    cancelProSubscription();
    setShowSurveyModal(false);
    showToast('Langganan Jeda PRO telah dinonaktifkan.');
  };

  // Step 2B: User mengisi kuisioner dan mengirim masukan (dikirim ke armansyahhakim263@gmail.com)
  const handleSubmitSurvey = async () => {
    triggerPhaseChange();
    setIsSendingSurvey(true);
    await sendCancellationSurvey({
      userName: user?.name || 'Pengguna Jeda',
      userEmail: user?.email || undefined,
      reason: selectedReason,
      notes: surveyNotes.trim() || undefined,
      date: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    });
    cancelProSubscription();
    setIsSendingSurvey(false);
    setShowSurveyModal(false);
    showToast('Terima kasih atas masukan Anda. Langganan telah dihentikan.');
  };

  // Settings from store
  const reminderEnabled = useAuthStore((s) => s.reminderEnabled);
  const reminderTime = useAuthStore((s) => s.reminderTime);
  const setReminderEnabled = useAuthStore((s) => s.setReminderEnabled);
  const setReminderTime = useAuthStore((s) => s.setReminderTime);

  const [tempTime, setTempTime] = useState(reminderTime || '07:00');

  const { triggerBreathTick, triggerButtonPress, triggerPhaseChange } = useHaptics();

  const handleToggleReminder = () => {
    triggerBreathTick();
    const nextVal = !reminderEnabled;
    setReminderEnabled(nextVal);
    showToast(nextVal ? `Pengingat aktif setiap ${reminderTime || '07:00'} WIB` : 'Pengingat harian dinonaktifkan');
  };

  const handleSaveReminderTime = () => {
    triggerPhaseChange();
    setReminderTime(tempTime);
    setReminderEnabled(true);
    setShowReminderModal(false);
    showToast(`Pengingat diset setiap hari pukul ${tempTime} WIB`);
  };

  // Navigations to subviews
  if (currentSubScreen === 'edit_profile') {
    return <EditProfileScreen onBack={() => setCurrentSubScreen('main')} />;
  }

  if (currentSubScreen === 'change_pin') {
    return <ChangePinScreen onBack={() => setCurrentSubScreen('main')} />;
  }

  if (currentSubScreen === 'privacy_data') {
    return (
      <PrivacyDataScreen
        onBack={() => setCurrentSubScreen('main')}
        onLogout={() => setCurrentSubScreen('main')}
      />
    );
  }

  if (currentSubScreen === 'about') {
    return (
      <AboutScreen
        onBack={() => setCurrentSubScreen('main')}
        onOpenPrivacyPolicy={() => {
          setPrivacyPolicyOrigin('about');
          setCurrentSubScreen('privacy_policy');
        }}
        onOpenLicense={() => setCurrentSubScreen('license')}
      />
    );
  }

  if (currentSubScreen === 'privacy_policy') {
    return <PrivacyPolicyScreen onBack={() => setCurrentSubScreen(privacyPolicyOrigin)} />;
  }

  if (currentSubScreen === 'license') {
    return <LicenseScreen onBack={() => setCurrentSubScreen('about')} />;
  }

  // SCREEN 1: Menu Profil Utama
  const userName = user?.name || 'Rani';
  const userPhone = user?.phone || '+62 812 3456 XXXX';
  const initialChar = (userName.trim().charAt(0) || 'R').toUpperCase();
  const avatarKey = user?.avatarUri;

  const renderAvatarContent = () => {
    if (
      avatarKey &&
      (avatarKey.startsWith('data:') ||
        avatarKey.startsWith('file:') ||
        avatarKey.startsWith('http') ||
        avatarKey.startsWith('blob:'))
    ) {
      return (
        <Image
          source={{ uri: avatarKey }}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      );
    }
    return (
      <Typography variant="bodyLarge" style={styles.avatarText}>
        {initialChar}
      </Typography>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Row */}
        <View style={styles.profileHeaderRow}>
          <View style={styles.profileInfoCol}>
            <View style={styles.avatarCircle}>{renderAvatarContent()}</View>

            <View style={styles.userTextCol}>
              <Typography variant="bodyLarge" style={styles.userNameText}>
                {userName}
              </Typography>
              <Typography variant="caption" style={styles.userPhoneText}>
                {userPhone}
              </Typography>
            </View>
          </View>

          {/* Edit Button Pencil */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            activeOpacity={0.7}
            onPress={() => {
              triggerButtonPress();
              setCurrentSubScreen('edit_profile');
            }}
            accessibilityRole="button"
            accessibilityLabel="Edit Profil"
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                stroke="#2D5A38"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Plan Cards: Jika sudah PRO, jeda gratis & pilihan menjadi pro HILANG, diganti Jeda PRO Aktif */}
        {!isPro ? (
          <>
            {/* Plan Card 1: Paket Saat Ini (Jeda Gratis) */}
            <View style={styles.currentPlanCard}>
              <View style={styles.planCardHeaderRow}>
                <Typography variant="caption" style={styles.planBadgeSub}>
                  PAKET SAAT INI
                </Typography>
                <View style={styles.gratisBadge}>
                  <Typography variant="caption" style={styles.gratisBadgeText}>
                    GRATIS
                  </Typography>
                </View>
              </View>

              <Typography variant="bodyLarge" style={styles.planCardTitle}>
                Jeda Gratis
              </Typography>

              <Typography variant="caption" style={styles.planCardDesc}>
                Check-in harian, seluruh pustaka pola regulasi, dan kalender dasar.
              </Typography>
            </View>

            {/* Plan Card 2: Upgrade to Jeda Pro */}
            <View style={styles.proPlanCard}>
              <View style={styles.planCardHeaderRow}>
                <Typography variant="bodyLarge" style={styles.proCardTitle}>
                  Jeda Pro
                </Typography>
                <View style={styles.proBadge}>
                  <Typography variant="caption" style={styles.proBadgeText}>
                    PRO
                  </Typography>
                </View>
              </View>

              <Typography variant="caption" style={styles.proCardDesc}>
                Tambahkan Mode Pasangan dan Analitik Pemicu Lanjutan. Fitur gratis tetap milikmu.
              </Typography>

              <View style={styles.priceRow}>
                <Typography variant="bodyLarge" style={styles.priceText}>
                  Rp29.000{' '}
                  <Typography variant="caption" style={styles.pricePeriodText}>
                    /bulan
                  </Typography>
                </Typography>
              </View>

              <TouchableOpacity
                style={styles.proBtn}
                activeOpacity={0.8}
                onPress={() => {
                  triggerBreathTick();
                  router.push('/jeda-pro' as any);
                }}
                accessibilityRole="button"
              >
                <Typography variant="bodyMedium" style={styles.proBtnText}>
                  Lihat Mode Pro
                </Typography>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* Jeda PRO Aktif Card (Ketika user adalah anggota PRO) */
          <View style={styles.activeProPlanCard}>
            <View style={styles.planCardHeaderRow}>
              <Typography variant="caption" style={styles.planBadgeSub}>
                PAKET SAAT INI
              </Typography>
              <View style={styles.activeProBadge}>
                <Typography variant="caption" style={styles.activeProBadgeText}>
                  PRO AKTIF
                </Typography>
              </View>
            </View>

            <Typography variant="bodyLarge" style={styles.activeProTitle}>
              Jeda PRO Aktif
            </Typography>

            <Typography variant="caption" style={styles.activeProDesc}>
              Akses penuh Mode Pasangan, analitik tren sinyal tubuh, dan seluruh pustaka regulasi eksklusif.
            </Typography>

            <View style={styles.activeProStatusRow}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9.5" stroke="#2D5A38" strokeWidth={1.8} fill="none" />
                <Path
                  d="M8.5 12.2l2.3 2.3L15.8 9.5"
                  stroke="#2D5A38"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Typography style={styles.activeProStatusText}>
                Langganan aktif • Rp29.000/bulan
              </Typography>
            </View>

            {/* Tombol Berhenti Berlangganan */}
            <TouchableOpacity
              style={styles.cancelProBtn}
              activeOpacity={0.8}
              onPress={() => {
                triggerButtonPress();
                setShowCancelProModal(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="Berhenti Berlangganan"
            >
              <Typography variant="bodyMedium" style={styles.cancelProBtnText}>
                Berhenti Berlangganan
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        {/* Section: Pengaturan */}
        <View style={styles.settingsSection}>
          <Typography variant="bodyLarge" style={styles.sectionTitle}>
            Pengaturan
          </Typography>

          <View style={styles.settingsGroupCard}>
            {/* Item 1: Pengingat check-in (Copy diperbarui & jam bisa diklik) */}
            <View style={styles.settingItemRow}>
              <View style={styles.settingIconCircle}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                    stroke="#2D5A38"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M13.73 21a2 2 0 0 1-3.46 0"
                    stroke="#2D5A38"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>

              <TouchableOpacity
                style={styles.settingTextCol}
                activeOpacity={reminderEnabled ? 0.7 : 1}
                onPress={() => {
                  if (reminderEnabled) {
                    setTempTime(reminderTime);
                    setShowReminderModal(true);
                  }
                }}
              >
                <Typography variant="bodyMedium" style={styles.settingItemTitle}>
                  Pengingat check-in
                </Typography>
                <Typography variant="caption" style={styles.settingItemSub}>
                  {reminderEnabled ? `Setiap hari, ${reminderTime}` : 'Nonaktif'}
                  {reminderEnabled && (
                    <Typography variant="caption" style={styles.changeTimeHint}>
                      {' '}(Ubah jam)
                    </Typography>
                  )}
                </Typography>
              </TouchableOpacity>

              <Switch
                value={reminderEnabled}
                onValueChange={handleToggleReminder}
                trackColor={{ false: '#E2DED7', true: '#2D5A38' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.itemDivider} />

            {/* Ubah PIN Keamanan */}
            <TouchableOpacity
              style={styles.settingNavRow}
              activeOpacity={0.7}
              onPress={() => {
                triggerButtonPress();
                setCurrentSubScreen('change_pin');
              }}
              accessibilityRole="button"
            >
              <View style={styles.settingIconCircle}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Circle cx="7.5" cy="15.5" r="5.5" stroke="#2D5A38" strokeWidth={1.8} />
                  <Path
                    d="m21 2-9.6 9.6M15.5 7.5l3 3M18.5 4.5l3 3"
                    stroke="#2D5A38"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>

              <View style={styles.settingTextCol}>
                <Typography variant="bodyMedium" style={styles.settingItemTitle}>
                  Ubah PIN Keamanan
                </Typography>
                <Typography variant="caption" style={styles.settingItemSub}>
                  Ganti 6 digit PIN rahasiamu
                </Typography>
              </View>

              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 18L15 12L9 6"
                  stroke="#8A948C"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>

            <View style={styles.itemDivider} />

            {/* Item 4: Privasi & data */}
            <TouchableOpacity
              style={styles.settingNavRow}
              activeOpacity={0.7}
              onPress={() => {
                triggerButtonPress();
                setCurrentSubScreen('privacy_data');
              }}
              accessibilityRole="button"
            >
              <View style={styles.settingIconCircle}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    stroke="#2D5A38"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="m9 12 2 2 4-4"
                    stroke="#2D5A38"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>

              <View style={styles.settingTextCol}>
                <Typography variant="bodyMedium" style={styles.settingItemTitle}>
                  Privasi & data
                </Typography>
                <Typography variant="caption" style={styles.settingItemSub}>
                  Kamu yang mengendalikan
                </Typography>
              </View>

              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 18L15 12L9 6"
                  stroke="#8A948C"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>

            <View style={styles.itemDivider} />

            {/* Item 5: Mode Pasangan (PRO) */}
            <TouchableOpacity
              style={styles.settingNavRow}
              activeOpacity={0.7}
              onPress={() => {
                triggerButtonPress();
                if (isPro) {
                  // Jika sudah jadi anggota pro, tidak lagi diarahkan ke lihat detail mode pro, tapi langsung ke alur Mode Pasangan
                  router.push({ pathname: '/jeda-pro', params: { step: 'pro_active' } } as any);
                } else {
                  router.push('/jeda-pro' as any);
                }
              }}
              accessibilityRole="button"
            >
              <View style={styles.settingIconCircle}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    stroke="#2D5A38"
                    strokeWidth={1.8}
                  />
                  <Circle cx="9" cy="7" r="4" stroke="#2D5A38" strokeWidth={1.8} />
                  <Path
                    d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                    stroke="#2D5A38"
                    strokeWidth={1.8}
                  />
                </Svg>
              </View>

              <View style={styles.settingTextCol}>
                <View style={styles.coupleTitleRow}>
                  <Typography variant="bodyMedium" style={styles.settingItemTitle}>
                    Mode Pasangan
                  </Typography>
                  <View style={styles.smallProBadge}>
                    <Typography variant="caption" style={styles.smallProBadgeText}>
                      PRO
                    </Typography>
                  </View>
                </View>
                <Typography variant="caption" style={styles.settingItemSub}>
                  {user?.partnerLinked
                    ? `Terhubung (${user?.partnerName || 'Pasangan'})`
                    : user?.isPro
                    ? 'Jeda PRO Aktif'
                    : 'Belum terhubung'}
                </Typography>
              </View>

              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 18L15 12L9 6"
                  stroke="#8A948C"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>

            <View style={styles.itemDivider} />

            {/* Item 6: Tentang Jeda (Pusat Legal: Kebijakan Privasi & Lisensi) */}
            <TouchableOpacity
              style={styles.settingNavRow}
              activeOpacity={0.7}
              onPress={() => {
                triggerButtonPress();
                setCurrentSubScreen('about');
              }}
              accessibilityRole="button"
            >
              <View style={styles.settingIconCircle}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                    stroke="#2D5A38"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                  <Path
                    d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                    stroke="#2D5A38"
                    strokeWidth={1.8}
                  />
                </Svg>
              </View>

              <View style={styles.settingTextCol}>
                <Typography variant="bodyMedium" style={styles.settingItemTitle}>
                  Tentang Jeda
                </Typography>
                <Typography variant="caption" style={styles.settingItemSub}>
                  Pendamping buku, kebijakan & lisensi
                </Typography>
              </View>

              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 18L15 12L9 6"
                  stroke="#8A948C"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Button: Keluar dari Akun */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.7}
          onPress={() => setShowLogoutSheet(true)}
          accessibilityRole="button"
        >
          <Typography variant="bodyMedium" style={styles.logoutBtnText}>
            Keluar dari Akun
          </Typography>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Pemilihan Jam Pengingat (Seamless Timer Picker) */}
      <Modal
        visible={showReminderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReminderModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Typography variant="bodyLarge" style={styles.modalTitle}>
              Atur Jam Pengingat
            </Typography>
            <Typography variant="caption" style={styles.modalSub}>
              Pilih waktu saat kamu membutuhkan ruang jeda sebelum emosi menumpuk.
            </Typography>

            {/* Quick Presets */}
            <View style={styles.presetsGrid}>
              {TIME_PRESETS.map((preset) => {
                const isSelected = tempTime === preset.time;
                return (
                  <TouchableOpacity
                    key={preset.time}
                    style={[
                      styles.presetItem,
                      isSelected && styles.presetItemActive,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      triggerBreathTick();
                      setTempTime(preset.time);
                    }}
                  >
                    <Typography variant="caption" style={styles.presetLabel}>
                      {preset.label}
                    </Typography>
                    <Typography
                      variant="bodyLarge"
                      style={[
                        styles.presetTime,
                        isSelected && styles.presetTimeActive,
                      ]}
                    >
                      {preset.time}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Time Display */}
            <View style={styles.customTimeDisplay}>
              <Typography variant="caption" color="#717D74">
                Waktu terpilih:{' '}
              </Typography>
              <Typography variant="bodyLarge" style={styles.selectedTimeHighlight}>
                {tempTime} WIB
              </Typography>
            </View>

            {/* Test Notification Trigger */}
            <TouchableOpacity
              style={styles.testNotificationBtn}
              onPress={async () => {
                triggerButtonPress();
                const sent = await sendInstantTestNotification();
                if (sent) {
                  showToast('🔔 Notifikasi terkirim! Cek bilah status HP kamu.');
                } else {
                  showToast('Izin notifikasi belum diaktifkan di perangkat.');
                }
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Typography variant="captionMedium" color="#2D5A38">
                🔔 Tes Notifikasi (Kirim Sekarang)
              </Typography>
            </TouchableOpacity>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setShowReminderModal(false)}
                activeOpacity={0.7}
              >
                <Typography variant="bodyMedium" style={styles.modalSecondaryText}>
                  Batal
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={handleSaveReminderTime}
                activeOpacity={0.8}
              >
                <Typography variant="bodyMedium" style={styles.modalPrimaryText}>
                  Simpan Jam
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pro Subscription Modal Sheet */}
      <JedaProScreen visible={showProModal} onClose={() => setShowProModal(false)} />

      {/* Modal Konfirmasi Berhenti Berlangganan */}
      <Modal
        visible={showCancelProModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelProModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Typography variant="h2" style={styles.modalTitle}>
              Berhenti Berlangganan?
            </Typography>

            <Typography variant="body" style={styles.modalMessage}>
              Jika berhenti berlangganan, akses Mode Pasangan dan Analitik Tren akan dinonaktifkan. Anda dapat berlangganan kembali kapan saja.
            </Typography>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalDangerBtn}
                onPress={handleProceedToSurvey}
                activeOpacity={0.8}
              >
                <Typography variant="bodyMedium" style={styles.modalDangerText}>
                  Ya, Berhenti
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setShowCancelProModal(false)}
                activeOpacity={0.7}
              >
                <Typography variant="bodyMedium" style={styles.modalSecondaryText}>
                  Tetap Berlangganan
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Kuisioner Berhenti Berlangganan */}
      <Modal
        visible={showSurveyModal}
        transparent
        animationType="fade"
        onRequestClose={handleSkipSurvey}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.surveyModalCard}>
            <Typography variant="h2" style={styles.surveyTitle}>
              Bantu Kami Berkembang
            </Typography>

            <Typography variant="caption" style={styles.surveySubtitle}>
              Pilih alasan utama Anda berhenti berlangganan Jeda PRO:
            </Typography>

            <View style={styles.surveyReasonList}>
              {SURVEY_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.surveyReasonItem,
                      isSelected && styles.surveyReasonItemActive,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <View
                      style={[
                        styles.surveyRadioOuter,
                        isSelected && styles.surveyRadioOuterActive,
                      ]}
                    >
                      {isSelected && <View style={styles.surveyRadioInner} />}
                    </View>
                    <Typography
                      style={[
                        styles.surveyReasonText,
                        isSelected && styles.surveyReasonTextActive,
                      ]}
                    >
                      {reason}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Input Catatan Tambahan (Opsional) */}
            <TextInput
              style={styles.surveyTextInput}
              value={surveyNotes}
              onChangeText={setSurveyNotes}
              placeholder="Ceritakan kritik, saran, atau masukan Anda (opsional)..."
              placeholderTextColor="#9EA8A1"
              multiline
              numberOfLines={3}
            />

            {/* Tombol Aksi: Kirim & Selesai / Lewati (Skip) */}
            <View style={styles.surveyActionsCol}>
              <TouchableOpacity
                style={styles.surveySubmitBtn}
                onPress={handleSubmitSurvey}
                activeOpacity={0.88}
                disabled={isSendingSurvey}
              >
                <Typography style={styles.surveySubmitText}>
                  {isSendingSurvey ? 'Mengirim Masukan...' : 'Kirim Masukan & Berhenti'}
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.surveySkipBtn}
                onPress={handleSkipSurvey}
                activeOpacity={0.7}
                disabled={isSendingSurvey}
              >
                <Typography style={styles.surveySkipText}>
                  Lewati Kuisioner (Skip)
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Sheet */}
      <LogoutSheet visible={showLogoutSheet} onClose={() => setShowLogoutSheet(false)} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <View style={styles.floatingToast}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17L4 12"
              stroke="#2D5A38"
              strokeWidth={2.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Typography style={styles.floatingToastText}>
            {toastMessage}
          </Typography>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  profileInfoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5EDE6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D5A38',
  },
  userTextCol: {
    gap: 2,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2522',
  },
  userPhoneText: {
    fontSize: 13,
    color: '#717D74',
  },
  editProfileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPlanCard: {
    backgroundColor: '#EDF5EE',
    borderWidth: 1.2,
    borderColor: '#D8E8DC',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  planCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planBadgeSub: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#717D74',
    letterSpacing: 0.5,
  },
  gratisBadge: {
    backgroundColor: '#DCECDC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gratisBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2D5A38',
    letterSpacing: 0.5,
  },
  planCardTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#1E2522',
  },
  planCardDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#556057',
  },
  proPlanCard: {
    backgroundColor: '#FFFDF7',
    borderWidth: 1.2,
    borderColor: '#EFE7DA',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  proCardTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#1E2522',
  },
  proBadge: {
    backgroundColor: '#FEF4E8',
    borderWidth: 1,
    borderColor: '#F8D7B2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  proBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#D35400',
    letterSpacing: 0.5,
  },
  proCardDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#556057',
  },
  priceRow: {
    marginTop: 2,
  },
  priceText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E2522',
  },
  pricePeriodText: {
    fontSize: 12.5,
    color: '#717D74',
    fontWeight: '500',
  },
  proBtn: {
    backgroundColor: '#F3ECE2',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  proBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D5A38',
  },
  activeProPlanCard: {
    backgroundColor: '#FCF8F2',
    borderWidth: 1.2,
    borderColor: '#E8DEC8',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  activeProBadge: {
    backgroundColor: '#EAF3EB',
    borderWidth: 1,
    borderColor: '#B8D9BD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeProBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2D5A38',
    letterSpacing: 0.5,
  },
  activeProTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2522',
  },
  activeProDesc: {
    fontSize: 13,
    lineHeight: 18.5,
    color: '#556057',
  },
  activeProStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EBF3EC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 2,
  },
  activeProStatusText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#244B30',
  },
  cancelProBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8CFC2',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  cancelProBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#8A4535',
  },
  modalDangerBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#C2574F',
    alignItems: 'center',
  },
  modalDangerText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
  floatingToast: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7DBCB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  floatingToastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D5A38',
  },
  settingsSection: {
    marginTop: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
    paddingHorizontal: 4,
  },
  settingsGroupCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#ECE7DE',
    borderRadius: 18,
    overflow: 'hidden',
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  settingNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  settingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextCol: {
    flex: 1,
    gap: 2,
  },
  settingItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E2522',
  },
  settingItemSub: {
    fontSize: 12,
    color: '#717D74',
  },
  changeTimeHint: {
    color: '#2D5A38',
    fontWeight: '600',
  },
  coupleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smallProBadge: {
    backgroundColor: '#FEF4E8',
    borderWidth: 1,
    borderColor: '#F8D7B2',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  smallProBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#D35400',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F4EFE9',
    marginLeft: 66,
  },
  logoutBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  logoutBtnText: {
    color: '#C84232',
    fontSize: 14.5,
    fontWeight: '600',
  },
  // Modal Backdrop & Card
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    ...(Platform.OS === 'web'
      ? {
          position: 'fixed' as any,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }
      : {}),
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  surveyModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 360,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2522',
    textAlign: 'center',
  },
  surveySubtitle: {
    fontSize: 12.5,
    color: '#717D74',
    textAlign: 'center',
    marginTop: -4,
  },
  surveyReasonList: {
    gap: 8,
    marginVertical: 4,
  },
  surveyReasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FAF9F6',
    borderWidth: 1.2,
    borderColor: '#ECE7DD',
  },
  surveyReasonItemActive: {
    backgroundColor: '#EDF5EE',
    borderColor: '#2D5A38',
  },
  surveyRadioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.8,
    borderColor: '#9EAAA0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surveyRadioOuterActive: {
    borderColor: '#2D5A38',
  },
  surveyRadioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#2D5A38',
  },
  surveyReasonText: {
    fontSize: 12.5,
    color: '#3A443D',
    flex: 1,
  },
  surveyReasonTextActive: {
    fontWeight: '700',
    color: '#1E2522',
  },
  surveyTextInput: {
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#DFD9CE',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#1E2522',
    minHeight: 65,
    textAlignVertical: 'top',
  },
  surveyActionsCol: {
    gap: 6,
    marginTop: 4,
  },
  surveySubmitBtn: {
    backgroundColor: '#2D5A38',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  surveySubmitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
  surveySkipBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  surveySkipText: {
    color: '#717D74',
    fontWeight: '600',
    fontSize: 13,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2522',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 12,
    color: '#717D74',
    textAlign: 'center',
    marginTop: -4,
  },
  modalMessage: {
    fontSize: 13,
    lineHeight: 19,
    color: '#556057',
    textAlign: 'center',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  presetItem: {
    width: '47%',
    backgroundColor: '#F7F5F0',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    gap: 4,
  },
  presetItemActive: {
    backgroundColor: '#EDF5EE',
    borderColor: '#2D5A38',
  },
  presetLabel: {
    fontSize: 11,
    color: '#717D74',
    fontWeight: '500',
  },
  presetTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
  },
  presetTimeActive: {
    color: '#2D5A38',
  },
  customTimeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  selectedTimeHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D5A38',
  },
  testNotificationBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#EEF5F0',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#D4E2D7',
    width: '100%',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
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
  modalPrimaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2D5A38',
    alignItems: 'center',
  },
  modalPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
  pinShieldIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EDF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalActionsCol: {
    gap: 10,
    marginTop: 8,
    width: '100%',
  },
  modalConfirmPinBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#2D5A38',
    alignItems: 'center',
  },
  modalConfirmPinText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalCancelBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#717D74',
    fontWeight: '600',
    fontSize: 13.5,
  },
});
