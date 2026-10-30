import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Linking,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import ScreenWrapper from '../shared/ScreenWrapper';
import Typography from '../ui/Typography';
import VectorQRCode from './VectorQRCode';
import { COLORS, SERIF_FONT, RADIUS, SPACING } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { usePartnerStore } from '../../store/usePartnerStore';
import { useHaptics } from '../../hooks/useHaptics';

export type ProStep = 'pro_features' | 'pro_active' | 'invite' | 'partner_welcome';

interface JedaProFlowProps {
  initialStep?: ProStep;
  onClose?: () => void;
}

export default function JedaProFlow({ initialStep, onClose }: JedaProFlowProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const upgradeToPro = useAuthStore((s) => s.upgradeToPro);
  const linkPartner = useAuthStore((s) => s.linkPartner);
  const { triggerButtonPress, triggerPhaseChange } = useHaptics();

  // Partner Store
  const pairCode = usePartnerStore((s) => s.pairCode);
  const generatePairCode = usePartnerStore((s) => s.generatePairCode);
  const linkWithCode = usePartnerStore((s) => s.linkWithCode);
  const [partnerInputCode, setPartnerInputCode] = useState('');
  const [isLinkingCode, setIsLinkingCode] = useState(false);

  // Always start on 'pro_features' (Screen 1) so user can see the package first
  const defaultStep: ProStep = initialStep || 'pro_features';

  const [currentStep, setCurrentStep] = useState<ProStep>(defaultStep);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (currentStep === 'invite' && !pairCode) {
      generatePairCode();
    }
  }, [currentStep, pairCode]);

  const partnerName = user?.partnerName || 'Rani';
  const inviteCode = `JEDA-${(user?.id || 'PRO').slice(-4).toUpperCase()}-LOVE`;
  const inviteLink = `https://jeda.app/invite?code=${inviteCode}`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleBack = () => {
    triggerButtonPress();
    if (currentStep === 'invite') {
      setCurrentStep('pro_active');
    } else if (currentStep === 'pro_active') {
      if (onClose) onClose();
      else if (router.canGoBack()) router.back();
      else router.replace('/(tabs)' as any);
    } else if (currentStep === 'partner_welcome') {
      if (onClose) onClose();
      else if (router.canGoBack()) router.back();
      else router.replace('/(tabs)' as any);
    } else {
      if (onClose) onClose();
      else if (router.canGoBack()) router.back();
      else router.replace('/(tabs)' as any);
    }
  };

  const handleSubscribe = () => {
    triggerPhaseChange();
    setIsSubscribing(true);
    setTimeout(() => {
      upgradeToPro();
      setIsSubscribing(false);
      setCurrentStep('pro_active');
    }, 450);
  };

  const handleSendWhatsapp = async () => {
    triggerButtonPress();
    const message = `Hai sayang, aku ingin kita saling menjaga kapasitas emosi bersama di Jeda. Akses Jeda PRO kamu sudah aktif gratis melalui tautan ini: ${inviteLink}`;
    const waUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const webWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(waUrl);
      if (supported) {
        await Linking.openURL(waUrl);
      } else {
        await Linking.openURL(webWaUrl);
      }
    } catch {
      try {
        await Share.share({ message });
      } catch {
        showToast('Tautan undangan: ' + inviteLink);
      }
    }
  };

  const handleCopyLink = () => {
    triggerPhaseChange();
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink);
    }
    showToast('Tautan undangan berhasil disalin!');
  };

  const handleCompletePartnerWelcome = () => {
    triggerPhaseChange();
    linkPartner(partnerName);
    if (onClose) onClose();
    else router.replace('/(tabs)' as any);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: JEDA PRO (Fitur & Langganan - Image 1)
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentStep === 'pro_features') {
    return (
      <ScreenWrapper style={styles.screen}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="#1F2923"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <Typography variant="h2" style={styles.headerTitleSerif}>
            Jeda Pro
          </Typography>

          <View style={styles.topBarSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Card 1: Paket Berdua (Anda + Pasangan) */}
          <View style={styles.amberCard}>
            <View style={styles.amberHeaderRow}>
              <Typography variant="captionMedium" style={styles.amberSubTitle}>
                PAKET BERDUA (ANDA + PASANGAN)
              </Typography>
              <View style={styles.amberProBadge}>
                <Typography variant="captionMedium" style={styles.amberProText}>
                  PRO
                </Typography>
              </View>
            </View>

            <View style={styles.amberPriceRow}>
              <Typography style={styles.amberPriceNumber}>
                Rp29.000
              </Typography>
              <Typography style={styles.amberPricePeriod}>
                /bulan
              </Typography>
            </View>

            <View style={styles.amberBullets}>
              <View style={styles.bulletRow}>
                <Typography style={styles.bulletDot}>•</Typography>
                <Typography style={styles.bulletText}>
                  Dukungan lebih dalam untuk memahami pola emosi & saling menjaga bersama pasangan.
                </Typography>
              </View>

              <View style={styles.bulletRow}>
                <Typography style={styles.bulletDot}>•</Typography>
                <Typography style={styles.bulletText}>
                  Pasangan yang Anda undang akan otomatis mendapatkan akses Jeda PRO penuh secara gratis{' '}
                  <Typography style={styles.bulletBold}>
                    (tanpa perlu membayar lagi)
                  </Typography>
                </Typography>
              </View>
            </View>
          </View>

          {/* Card 2: Analitik Tren */}
          <View style={styles.whiteCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.greenIconSquare}>
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M3 3v18h18"
                    stroke="#2D5A38"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M7 14l4-4 4 4 6-7"
                    stroke="#2D5A38"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle cx="21" cy="7" r="2" fill="#2D5A38" />
                </Svg>
              </View>
              <View style={styles.mutedProBadge}>
                <Typography style={styles.mutedProText}>
                  PRO
                </Typography>
              </View>
            </View>

            <Typography variant="h2" style={styles.cardTitleSerif}>
              Analitik Tren
            </Typography>

            <Typography style={styles.cardBodyText}>
              Buka tab Tren di menu Analitik untuk melihat pola sinyal tubuh, pemicu utama, waktu rawan, dan insight yang mulai terlihat.
            </Typography>
          </View>

          {/* Card 3: Mode Pasangan */}
          <View style={styles.whiteCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.peachIconSquare}>
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke="#B45447"
                    strokeWidth={1.9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <View style={styles.mutedProBadge}>
                <Typography style={styles.mutedProText}>
                  PRO
                </Typography>
              </View>
            </View>

            <Typography variant="h2" style={styles.cardTitleSerif}>
              Mode Pasangan
            </Typography>

            <Typography style={styles.cardBodyText}>
              Hubungkan akun dengan pasangan. Ketika salah satu melakukan Daily Check-in dengan intensitas Sedang atau Kuat, pasangan akan menerima notifikasi di ponselnya agar dapat segera memberi dukungan.
            </Typography>

            <View style={styles.innerGreenPill}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9.5" stroke="#2D5A38" strokeWidth={1.8} fill="none" />
                <Path
                  d="M8.5 12.2l2.3 2.3L15.8 9.5"
                  stroke="#2D5A38"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Typography style={styles.innerGreenPillText}>
                Gratis akses PRO penuh untuk pasangan yang diundang
              </Typography>
            </View>
          </View>

          {/* Card 4: ALUR DUKUNGAN */}
          <View style={styles.sageCard}>
            <Typography style={styles.sageHeaderTitle}>
              ALUR DUKUNGAN
            </Typography>

            <View style={styles.flowList}>
              {/* Step 1 */}
              <View style={styles.flowRow}>
                <Typography style={styles.flowNumber}>1</Typography>
                <View style={styles.flowCol}>
                  <Typography style={styles.flowStepTitle}>
                    Check-in Sedang/Kuat
                  </Typography>
                  <Typography style={styles.flowStepDesc}>
                    Salah satu pasangan menyelesaikan Daily Check-in dengan intensitas Sedang atau Kuat.
                  </Typography>
                </View>
              </View>

              {/* Step 2 */}
              <View style={styles.flowRow}>
                <Typography style={styles.flowNumber}>2</Typography>
                <View style={styles.flowCol}>
                  <Typography style={styles.flowStepTitle}>
                    Pasangan menerima notifikasi
                  </Typography>
                  <Typography style={styles.flowStepDesc}>
                    Notifikasi lembut masuk ke ponsel pasangan.
                  </Typography>
                </View>
              </View>

              {/* Step 3 */}
              <View style={styles.flowRow}>
                <Typography style={styles.flowNumber}>3</Typography>
                <View style={styles.flowCol}>
                  <Typography style={styles.flowStepTitle}>
                    Pasangan memberi dukungan
                  </Typography>
                  <Typography style={styles.flowStepDesc}>
                    Pasangan dapat segera menindaklanjuti dengan bantuan yang tepat.
                  </Typography>
                </View>
              </View>
            </View>
          </View>

          {/* Box 5: Privacy Security Callout */}
          <View style={styles.privacyBox}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="#2D5A38"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M9 12l2 2 4-4"
                stroke="#2D5A38"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Typography style={styles.privacyText}>
              Catatan pribadi tidak dibagikan. Pasangan hanya menerima status kapasitas dan ajakan untuk membantu.
            </Typography>
          </View>
        </ScrollView>

        {/* Bottom Bar CTA */}
        <View style={styles.bottomBarContainer}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleSubscribe}
            style={styles.primaryForestButton}
            accessibilityRole="button"
            accessibilityLabel="Berlangganan Jeda PRO Rp29.000/bulan"
            disabled={isSubscribing}
          >
            <Typography style={styles.primaryButtonText}>
              {isSubscribing ? 'Mengaktifkan Jeda PRO...' : 'Berlangganan Jeda PRO Rp29.000/bulan'}
            </Typography>
          </TouchableOpacity>

          <Typography style={styles.bottomFooterItalic}>
            Fitur gratis tetap milikmu. Batalkan langganan kapan saja
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: MODE PASANGAN - TERIMA KASIH (Image 2)
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentStep === 'pro_active') {
    return (
      <ScreenWrapper style={styles.screen}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="#1F2923"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Typography variant="h2" style={styles.headerTitleSerif}>
            Mode Pasangan
          </Typography>
          <View style={styles.topBarSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContentActive}
          showsVerticalScrollIndicator={false}
        >
          {/* Soft Peach Circle Badge with Heart + Checkmark */}
          <View style={styles.peachCircleLarge}>
            <Svg width={44} height={44} viewBox="0 0 32 32" fill="none">
              <Path
                d="M16 27.5C16 27.5 4 19.5 4 11.5C4 7.35786 7.35786 4 11.5 4C13.8824 4 16 5.16667 16 7C16 5.16667 18.1176 4 20.5 4C24.6421 4 28 7.35786 28 11.5C28 19.5 16 27.5 16 27.5Z"
                stroke="#A8584F"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 15.5L15 18.5L20.5 12"
                stroke="#A8584F"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <Typography style={styles.titleThankYou}>
            Terima kasih
          </Typography>

          <Typography style={styles.bodyThankYou}>
            Akun Jeda PRO Anda sudah aktif. Anda kini memiliki ruang yang lebih luas untuk memahami diri dan menjaga hubungan dengan pasangan Anda.
          </Typography>

          {/* White Card: Jeda PRO Aktif */}
          <View style={styles.whiteCardActive}>
            <Typography variant="h2" style={styles.cardTitleSerifActive}>
              Jeda PRO Aktif
            </Typography>

            <View style={styles.greenCheckPill}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9.5" stroke="#2D5A38" strokeWidth={1.8} fill="none" />
                <Path
                  d="M8.5 12.2l2.3 2.3L15.8 9.5"
                  stroke="#2D5A38"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Typography style={styles.greenCheckPillText}>
                Akun Jeda PRO
              </Typography>
            </View>

            <View style={styles.greenCheckPill}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9.5" stroke="#2D5A38" strokeWidth={1.8} fill="none" />
                <Path
                  d="M8.5 12.2l2.3 2.3L15.8 9.5"
                  stroke="#2D5A38"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Typography style={styles.greenCheckPillText}>
                Akun pasangan tersedia (PRO)
              </Typography>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Bar Actions */}
        <View style={styles.bottomBarContainer}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              triggerButtonPress();
              setCurrentStep('invite');
            }}
            style={styles.primaryForestButton}
            accessibilityRole="button"
            accessibilityLabel="Undang Pasangan Sekarang"
          >
            <Typography style={styles.primaryButtonText}>
              Undang Pasangan Sekarang
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              triggerButtonPress();
              if (onClose) onClose();
              else router.replace('/(tabs)' as any);
            }}
            style={styles.secondaryTextBtn}
            accessibilityRole="button"
            accessibilityLabel="Kembali ke Beranda"
          >
            <Typography style={styles.secondaryTextBtnLabel}>
              Kembali ke Beranda
            </Typography>
          </TouchableOpacity>

          <Typography style={styles.captionGooglePlay}>
            Anda dapat mengelola & membatalkan langganan kapan saja melalui Google Play
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: UNDANG PASANGAN (QR Code & WhatsApp - Image 3)
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentStep === 'invite') {
    return (
      <ScreenWrapper style={styles.screen}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="#1F2923"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <Typography variant="h2" style={styles.headerTitleSerif}>
            Undang Pasangan
          </Typography>

          <View style={styles.topBarSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContentInvite}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Card: Pilih cara berbagi */}
          <View style={styles.qrMainCard}>
            <Typography style={styles.qrCardTitle}>
              Pilih cara berbagi
            </Typography>

            <Typography style={styles.qrCardSubtitle}>
              Bagikan akses Jeda PRO penuh secara gratis ke pasangan Anda
            </Typography>

            {/* QR Code Container */}
            <View style={styles.qrFrameContainer}>
              <VectorQRCode size={180} />
            </View>

            {/* Kode Pasangan Otomatis */}
            <View style={{ marginTop: 14, alignItems: 'center', backgroundColor: '#F3EFEA', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 }}>
              <Typography variant="caption" color={COLORS.sage[700]} style={{ letterSpacing: 0.8, fontWeight: '700' }}>
                KODE PASANGAN ANDA
              </Typography>
              <Typography variant="h1" style={{ fontSize: 24, fontWeight: '800', color: COLORS.brand.primary, marginVertical: 4 }}>
                {pairCode || 'JEDA-742'}
              </Typography>
              <Typography variant="caption" color={COLORS.brand.textMuted} align="center">
                Minta pasangan memasukkan kode ini di HP mereka untuk terhubung langsung.
              </Typography>
            </View>

            <Typography style={styles.qrCaptionBelow}>
              Minta pasangan memindai QR code ini di ponsel dia secara langsung agar langsung mengunduh Jeda di Google Play
            </Typography>
          </View>

          {/* Kotak Masukkan Kode dari Pasangan */}
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginTop: 16, borderWidth: 1, borderColor: '#E8E4DD' }}>
            <Typography variant="bodyMedium" style={{ fontWeight: '700', color: '#1F2923', marginBottom: 4 }}>
              Punya Kode dari Pasangan?
            </Typography>
            <Typography variant="caption" color={COLORS.brand.textMuted} style={{ marginBottom: 12 }}>
              Masukkan kode 6-karakter yang dibagikan oleh pasangan Anda:
            </Typography>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                value={partnerInputCode}
                onChangeText={setPartnerInputCode}
                placeholder="Contoh: JEDA-742"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                style={{
                  flex: 1,
                  backgroundColor: '#FAF8F5',
                  borderWidth: 1.2,
                  borderColor: '#D4CEBF',
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  fontSize: 15,
                  fontWeight: '700',
                  color: '#1F2923',
                }}
              />

              <TouchableOpacity
                activeOpacity={0.85}
                disabled={isLinkingCode || !partnerInputCode.trim()}
                onPress={async () => {
                  triggerButtonPress();
                  setIsLinkingCode(true);
                  const res = await linkWithCode(partnerInputCode.trim());
                  setIsLinkingCode(false);
                  if (res.success) {
                    triggerPhaseChange();
                    setCurrentStep('partner_welcome');
                  } else {
                    showToast(res.error || 'Gagal menghubungkan pasangan');
                  }
                }}
                style={{
                  backgroundColor: COLORS.brand.primary,
                  paddingHorizontal: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  opacity: isLinkingCode || !partnerInputCode.trim() ? 0.6 : 1,
                }}
              >
                {isLinkingCode ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Typography variant="captionMedium" color="#FFFFFF" style={{ fontWeight: '700' }}>
                    Hubungkan
                  </Typography>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider Text */}
          <Typography style={styles.orDividerText}>
            Atau
          </Typography>

          {/* Action Buttons */}
          <View style={styles.inviteButtonsCol}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSendWhatsapp}
              style={styles.primaryForestButton}
              accessibilityRole="button"
              accessibilityLabel="Kirim Tautan via Whatsapp"
            >
              <Typography style={styles.primaryButtonText}>
                Kirim Tautan via Whatsapp
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCopyLink}
              style={styles.secondaryTextBtn}
              accessibilityRole="button"
              accessibilityLabel="Salin Tautan Undangan"
            >
              <Typography style={styles.secondaryTextBtnLabel}>
                Salin Tautan Undangan
              </Typography>
            </TouchableOpacity>

            <Typography style={styles.inviteFooterCaption}>
              Pasangan Anda akan diarahkan untuk mengunduh Jeda & otomatis mendapatkan akses PRO penuh secara gratis
            </Typography>
          </View>

          {/* Development Shortcut to Test Step 4 */}
          <TouchableOpacity
            onPress={() => {
              triggerButtonPress();
              setCurrentStep('partner_welcome');
            }}
            style={styles.previewPartnerShortcut}
          >
            <Typography style={styles.previewPartnerShortcutText}>
              👁️ Lihat simulasi tampilan pasangan saat tautan dibuka →
            </Typography>
          </TouchableOpacity>
        </ScrollView>

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
      </ScreenWrapper>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 4: SELAMAT DATANG! PASANGAN TERHUBUNG (Image 4)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <ScreenWrapper style={styles.screen}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="#1F2923"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Typography variant="h2" style={styles.headerTitleSerif}>
          Jeda
        </Typography>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContentWelcome}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card: Selamat datang! */}
        <View style={styles.welcomeCard}>
          <Typography style={styles.welcomeTitle}>
            Selamat datang!
          </Typography>

          <Typography style={styles.welcomePara1}>
            Akun Anda telah berhasil terhubung dengan {partnerName}.
          </Typography>

          <Typography style={styles.welcomePara2}>
            Sebagai bentuk komitmen bersama, kamu kini mendapatkan akses penuh Jeda PRO secara gratis.
          </Typography>

          {/* Sub Card: Jeda PRO Aktif */}
          <View style={styles.welcomeSubCard}>
            <Typography style={styles.welcomeSubCardTitle}>
              Jeda PRO Aktif
            </Typography>

            <View style={styles.greenCheckPill}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9.5" stroke="#2D5A38" strokeWidth={1.8} fill="none" />
                <Path
                  d="M8.5 12.2l2.3 2.3L15.8 9.5"
                  stroke="#2D5A38"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Typography style={styles.greenCheckPillText}>
                Berbagi status kapasitas emosi dengan {partnerName}
              </Typography>
            </View>

            <View style={styles.greenCheckPill}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9.5" stroke="#2D5A38" strokeWidth={1.8} fill="none" />
                <Path
                  d="M8.5 12.2l2.3 2.3L15.8 9.5"
                  stroke="#2D5A38"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Typography style={styles.greenCheckPillText}>
                Akses penuh pustaka regulasi & analitik tren
              </Typography>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar Actions */}
      <View style={styles.bottomBarContainer}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleCompletePartnerWelcome}
          style={styles.primaryForestButton}
          accessibilityRole="button"
          accessibilityLabel="Masuk ke Beranda"
        >
          <Typography style={styles.primaryButtonText}>
            Masuk ke Beranda
          </Typography>
        </TouchableOpacity>

        <Typography style={styles.welcomePrivacyCaption}>
          Kamu memiliki kendali penuh atas privasimu. Catatan pribadi tidak akan pernah dibagikan
        </Typography>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  headerTitleSerif: {
    fontFamily: SERIF_FONT,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2923',
  },
  topBarSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 16,
  },
  scrollContentActive: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  scrollContentInvite: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  scrollContentWelcome: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ─── Step 1: Amber Card ───
  amberCard: {
    backgroundColor: '#FCF6EC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0E2CD',
    padding: 18,
  },
  amberHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amberSubTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#7D5D28',
    letterSpacing: 0.5,
  },
  amberProBadge: {
    backgroundColor: '#FDE8CD',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  amberProText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A551E',
  },
  amberPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
    marginBottom: 14,
    gap: 4,
  },
  amberPriceNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F2923',
    fontFamily: SERIF_FONT,
  },
  amberPricePeriod: {
    fontSize: 14,
    color: '#6B7C72',
    fontWeight: '500',
  },
  amberBullets: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    fontSize: 14,
    color: '#50483E',
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#50483E',
  },
  bulletBold: {
    fontWeight: '700',
    color: '#342D25',
  },

  // ─── Step 1: White Cards ───
  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EFEA',
    padding: 18,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greenIconSquare: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E5EFE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  peachIconSquare: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FDECE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutedProBadge: {
    backgroundColor: '#FAF1E6',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  mutedProText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#966E38',
  },
  cardTitleSerif: {
    fontFamily: SERIF_FONT,
    fontSize: 19,
    fontWeight: '700',
    color: '#1F2923',
    marginTop: 14,
    marginBottom: 6,
  },
  cardBodyText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#5C6B61',
  },
  innerGreenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EAF2EC',
    borderWidth: 1,
    borderColor: '#D1E3D5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 14,
  },
  innerGreenPillText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#22492D',
    lineHeight: 18,
  },

  // ─── Step 1: Alur Dukungan ───
  sageCard: {
    backgroundColor: '#F0F5F1',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DFEAE2',
    padding: 18,
  },
  sageHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#506B59',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  flowList: {
    gap: 14,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  flowNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2D5A38',
    width: 18,
    lineHeight: 20,
  },
  flowCol: {
    flex: 1,
    gap: 2,
  },
  flowStepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2923',
  },
  flowStepDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: '#5C6B61',
  },

  // ─── Step 1: Privacy Box ───
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0F5F1',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DFEAE2',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  privacyText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#5C6B61',
  },

  // ─── Step 2: Terima Kasih ───
  peachCircleLarge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FCEAE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  titleThankYou: {
    fontFamily: SERIF_FONT,
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2923',
    marginBottom: 8,
    textAlign: 'center',
  },
  bodyThankYou: {
    fontSize: 14,
    lineHeight: 21,
    color: '#5C6B61',
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  whiteCardActive: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5ECE7',
    padding: 18,
    gap: 10,
  },
  cardTitleSerifActive: {
    fontFamily: SERIF_FONT,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2923',
    marginBottom: 4,
  },
  greenCheckPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EAF2EC',
    borderWidth: 1,
    borderColor: '#D1E3D5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  greenCheckPillText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#22492D',
  },
  captionGooglePlay: {
    fontSize: 12,
    color: '#7B8A80',
    textAlign: 'center',
    marginTop: 4,
  },

  // ─── Step 3: Undang Pasangan ───
  qrMainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5ECE7',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  qrCardTitle: {
    fontFamily: SERIF_FONT,
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2923',
    marginBottom: 6,
    textAlign: 'center',
  },
  qrCardSubtitle: {
    fontSize: 13.5,
    lineHeight: 19,
    color: '#5C6B61',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  qrFrameContainer: {
    backgroundColor: '#FAFBF9',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#DFE7E1',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCaptionBelow: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5C6B61',
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 10,
  },
  orDividerText: {
    fontSize: 14,
    color: '#75857A',
    textAlign: 'center',
    marginVertical: 18,
    fontWeight: '500',
  },
  inviteButtonsCol: {
    gap: 10,
  },
  inviteFooterCaption: {
    fontSize: 12,
    lineHeight: 17,
    color: '#7B8A80',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
  },
  previewPartnerShortcut: {
    alignSelf: 'center',
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#EAEFEA',
  },
  previewPartnerShortcutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D5A38',
  },

  // ─── Step 4: Selamat Datang ───
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5ECE7',
    paddingVertical: 26,
    paddingHorizontal: 20,
    gap: 12,
  },
  welcomeTitle: {
    fontFamily: SERIF_FONT,
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2923',
    textAlign: 'center',
  },
  welcomePara1: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5C6B61',
    textAlign: 'center',
  },
  welcomePara2: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5C6B61',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubCard: {
    gap: 10,
  },
  welcomeSubCardTitle: {
    fontFamily: SERIF_FONT,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2923',
    marginBottom: 2,
  },
  welcomePrivacyCaption: {
    fontSize: 12,
    lineHeight: 17,
    color: '#7B8A80',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },

  // ─── Common Bottom Bar & Buttons ───
  bottomBarContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FAF8F5',
    gap: 6,
  },
  primaryForestButton: {
    height: 52,
    backgroundColor: '#2D5A38',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D5A38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryTextBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  secondaryTextBtnLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#4E5C53',
  },
  bottomFooterItalic: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#75857A',
    textAlign: 'center',
    marginTop: 4,
  },

  // ─── Toast ───
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
});
