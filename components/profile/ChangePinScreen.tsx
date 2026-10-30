import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';

export interface ChangePinScreenProps {
  onBack: () => void;
}

export default function ChangePinScreen({ onBack }: ChangePinScreenProps) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updatePin = useAuthStore((s) => s.updatePin);
  const user = useAuthStore((s) => s.user);
  const { triggerBreathTick, triggerPhaseChange, triggerWarning } = useHaptics();

  const handleSavePin = async () => {
    setErrorMessage(null);

    if (currentPin.length !== 6) {
      setErrorMessage('PIN saat ini harus 6 digit.');
      triggerWarning();
      return;
    }

    if (newPin.length !== 6) {
      setErrorMessage('PIN baru harus 6 digit angka.');
      triggerWarning();
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMessage('Konfirmasi PIN baru tidak cocok.');
      triggerWarning();
      return;
    }

    if (newPin === '123456' || newPin === '000000' || newPin === '111111') {
      setErrorMessage('Hindari PIN yang terlalu mudah ditebak seperti angka berurutan.');
      triggerWarning();
      return;
    }

    const res = await updatePin(currentPin, newPin);
    if (!res.success) {
      setErrorMessage(res.error || 'Gagal mengubah PIN. Periksa kembali PIN saat ini.');
      triggerWarning();
      return;
    }

    triggerPhaseChange();
    setIsSuccess(true);
  };

  const handleForgotPin = () => {
    triggerBreathTick();
    Alert.alert(
      'Pemulihan PIN',
      `Kode verifikasi pemulihan PIN akan dikirimkan ke alamat email terdaftar (${user?.email || 'email@anda.com'}).`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Kirim Kode Email',
          onPress: () => {
            Alert.alert('Kode Terkirim', 'Silakan periksa kotak masuk email Anda untuk mereset PIN keamanan.');
          },
        },
      ]
    );
  };

  // SCREEN 5: State Sukses "PIN Berhasil Diperbarui"
  if (isSuccess) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successContent}>
          {/* Large Circle with Checkmark */}
          <View style={styles.bigCheckCircle}>
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 6L9 17L4 12"
                stroke="#2D5A38"
                strokeWidth={2.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <Typography variant="h1" style={styles.successTitle}>
            PIN Berhasil Diperbarui
          </Typography>

          <Typography variant="body" style={styles.successSubtitle}>
            PIN baru telah aktif dan dapat langsung kamu gunakan saat masuk kembali ke Jeda.
          </Typography>
        </View>

        <View style={styles.successBottom}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Typography variant="bodyLarge" style={styles.primaryButtonText}>
              Kembali ke Profil
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // SCREEN 4: Form Ubah PIN Keamanan
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
          Ubah PIN Keamanan
        </Typography>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Typography variant="body" style={styles.instructionText}>
          Gunakan 6 digit yang mudah kamu ingat, tetapi sulit ditebak orang lain.
        </Typography>

        {errorMessage && (
          <View style={styles.errorAlert}>
            <Typography variant="caption" style={styles.errorText}>
              {errorMessage}
            </Typography>
          </View>
        )}

        <View style={styles.formSection}>
          {/* Field: PIN saat ini */}
          <View style={styles.inputGroup}>
            <Typography variant="caption" style={styles.inputLabel}>
              PIN saat ini
            </Typography>
            <TextInput
              style={styles.pinInput}
              value={currentPin}
              onChangeText={(t) => {
                setErrorMessage(null);
                setCurrentPin(t.replace(/[^0-9]/g, '').slice(0, 6));
              }}
              placeholder="••••••"
              placeholderTextColor="#A0A8A2"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {/* Field: PIN baru */}
          <View style={styles.inputGroup}>
            <Typography variant="caption" style={styles.inputLabel}>
              PIN baru
            </Typography>
            <TextInput
              style={styles.pinInput}
              value={newPin}
              onChangeText={(t) => {
                setErrorMessage(null);
                setNewPin(t.replace(/[^0-9]/g, '').slice(0, 6));
              }}
              placeholder="••••••"
              placeholderTextColor="#A0A8A2"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {/* Field: Ulangi PIN baru */}
          <View style={styles.inputGroup}>
            <Typography variant="caption" style={styles.inputLabel}>
              Ulangi PIN baru
            </Typography>
            <TextInput
              style={styles.pinInput}
              value={confirmPin}
              onChangeText={(t) => {
                setErrorMessage(null);
                setConfirmPin(t.replace(/[^0-9]/g, '').slice(0, 6));
              }}
              placeholder="••••••"
              placeholderTextColor="#A0A8A2"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />

            <Typography variant="caption" style={styles.hintText}>
              Hindari tanggal lahir atau angka berurutan.
            </Typography>
          </View>

          {/* Lupa PIN link */}
          <TouchableOpacity
            onPress={handleForgotPin}
            activeOpacity={0.7}
            style={styles.forgotLinkContainer}
          >
            <Typography variant="caption" style={styles.forgotLinkText}>
              Lupa PIN? Verifikasi lewat Email
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Bottom Save Action */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSavePin}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Typography variant="bodyLarge" style={styles.primaryButtonText}>
              Simpan PIN baru
            </Typography>
          </TouchableOpacity>
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
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5C6760',
    marginBottom: 20,
  },
  errorAlert: {
    backgroundColor: '#FDEEEB',
    borderWidth: 1,
    borderColor: '#F5C6BE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#C84232',
    fontWeight: '600',
    fontSize: 12.5,
  },
  formSection: {
    gap: 18,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#49524B',
  },
  pinInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E6E1D8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: '#1E2522',
    letterSpacing: 6,
  },
  hintText: {
    fontSize: 11.5,
    color: '#8A948C',
    marginTop: 2,
  },
  forgotLinkContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  forgotLinkText: {
    fontSize: 13,
    color: '#2D5A38',
    fontWeight: '700',
  },
  bottomSection: {
    marginTop: 40,
  },
  primaryButton: {
    backgroundColor: '#2D5A38',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D5A38',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },
  // Success Screen Styles
  successContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  successContent: {
    alignItems: 'center',
    paddingTop: 60,
  },
  bigCheckCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#EDF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4E5D6',
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#1E2522',
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 14.5,
    lineHeight: 21,
    color: '#637066',
    textAlign: 'center',
    maxWidth: 260,
  },
  successBottom: {
    width: '100%',
  },
});
