import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path } from 'react-native-svg';
import Typography from '../ui/Typography';
import { useAuthStore } from '../../store/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';
import { useSafeInsets } from '../../hooks/useSafeInsets';
import { compressAvatarImage } from '../../utils/image-compression';

export interface EditProfileScreenProps {
  onBack: () => void;
}

export default function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const insets = useSafeInsets();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { triggerBreathTick, triggerPhaseChange } = useHaptics();

  const [name, setName] = useState(user?.name || 'Rani');
  const [email, setEmail] = useState(user?.email || 'rani@jeda.id');
  const [phone, setPhone] = useState(user?.phone || '+62 812 3456 XXXX');
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUri || null);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const initialAvatarChar = (name.trim().charAt(0) || 'R').toUpperCase();

  const handleFieldChange = (field: 'name' | 'email' | 'phone', value: string) => {
    setIsSaved(false);
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'phone') setPhone(value);
  };

  // Langsung buka galeri foto di HP user & auto compress sebelum disimpan
  const handlePickImage = async () => {
    triggerBreathTick();
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Izin Galeri Diperlukan',
          'Mohon izinkan akses galeri foto agar dapat memilih foto profil.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setIsCompressingPhoto(true);

        // Logic Auto-Compress foto profil
        const compressed = await compressAvatarImage(selectedAsset.uri, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 0.7,
        });

        setAvatarUri(compressed);
        setIsCompressingPhoto(false);
        setIsSaved(false);
      }
    } catch (error) {
      console.error('Gagal membuka galeri foto:', error);
      setIsCompressingPhoto(false);
      Alert.alert('Gagal Mengambil Foto', 'Terjadi kendala saat membuka galeri foto.');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Nama Diperlukan', 'Mohon isi nama kamu.');
      return;
    }
    triggerPhaseChange();
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatarUri: avatarUri || undefined,
    });
    setIsSaved(true);
  };

  const hasPhoto = Boolean(
    avatarUri &&
      (avatarUri.startsWith('data:') ||
        avatarUri.startsWith('file:') ||
        avatarUri.startsWith('http') ||
        avatarUri.startsWith('blob:'))
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke profil"
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
          Edit Profil
        </Typography>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section - Tapping immediately opens device photo gallery */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarTouchable}
            activeOpacity={0.8}
            onPress={handlePickImage}
            accessibilityRole="button"
            accessibilityLabel="Pilih foto dari galeri"
            disabled={isCompressingPhoto}
          >
            <View style={styles.avatarCircle}>
              {isCompressingPhoto ? (
                <ActivityIndicator size="small" color="#2D5A38" />
              ) : hasPhoto ? (
                <Image source={{ uri: avatarUri! }} style={styles.avatarImage} resizeMode="cover" />
              ) : (
                <Typography variant="h1" style={styles.avatarText}>
                  {initialAvatarChar}
                </Typography>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.7} disabled={isCompressingPhoto}>
            <Typography variant="caption" style={styles.changePhotoText}>
              {isCompressingPhoto ? 'Mengompresi foto...' : 'Pilih dari galeri foto'}
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <View style={styles.formSection}>
          {/* Field: Nama */}
          <View style={styles.inputGroup}>
            <Typography variant="caption" style={styles.inputLabel}>
              Nama
            </Typography>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={(text) => handleFieldChange('name', text)}
              placeholder="Nama kamu"
              placeholderTextColor="#A0A8A2"
              autoCapitalize="words"
            />
          </View>

          {/* Field: Email */}
          <View style={styles.inputGroup}>
            <Typography variant="caption" style={styles.inputLabel}>
              Email
            </Typography>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(text) => handleFieldChange('email', text)}
              placeholder="nama@email.com"
              placeholderTextColor="#A0A8A2"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Field: Nomor WhatsApp */}
          <View style={styles.inputGroup}>
            <Typography variant="caption" style={styles.inputLabel}>
              Nomor WhatsApp
            </Typography>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={(text) => handleFieldChange('phone', text)}
              placeholder="+62 812-XXXX-XXXX"
              placeholderTextColor="#A0A8A2"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Spacer to push actions down */}
        <View style={{ flex: 1, minHeight: 60 }} />

        {/* Toast / Sonner "Perubahan profil berhasil disimpan" (Tepat di atas Bottom Bar) */}
        {isSaved && (
          <View style={styles.floatingSonner}>
            <View style={styles.sonnerCheckCircle}>
              <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 6L9 17L4 12"
                  stroke="#2D5A38"
                  strokeWidth={2.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Typography variant="bodyMedium" style={styles.sonnerText}>
              Perubahan profil berhasil disimpan.
            </Typography>
          </View>
        )}

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.primaryButton, isSaved && styles.savedButton]}
            activeOpacity={0.8}
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Simpan perubahan profil"
          >
            <Typography
              variant="bodyLarge"
              style={[
                styles.primaryButtonText,
                isSaved && styles.savedButtonText,
              ]}
            >
              {isSaved ? 'Tersimpan' : 'Simpan perubahan'}
            </Typography>
          </TouchableOpacity>

          {isSaved ? (
            <Typography variant="caption" style={styles.noChangesText}>
              Tidak ada perubahan baru.
            </Typography>
          ) : (
            <TouchableOpacity
              onPress={onBack}
              style={styles.cancelButton}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Typography variant="bodyMedium" style={styles.cancelButtonText}>
                Batal
              </Typography>
            </TouchableOpacity>
          )}
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
    paddingTop: 16,
    paddingBottom: 80,
    flexGrow: 1,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 18,
    gap: 8,
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E5EDE6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 42,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#2D5A38',
  },
  changePhotoText: {
    fontSize: 13,
    color: '#2D5A38',
    fontWeight: '600',
  },
  formSection: {
    gap: 18,
    marginVertical: 12,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#49524B',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E6E1D8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E2522',
  },
  floatingSonner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF5EE',
    borderWidth: 1.2,
    borderColor: '#C4DEC7',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 14,
    shadowColor: '#2D5A38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sonnerCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DCECDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sonnerText: {
    fontSize: 13,
    color: '#204327',
    fontWeight: '600',
    flex: 1,
  },
  bottomActions: {
    gap: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2D5A38',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D5A38',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  savedButton: {
    backgroundColor: '#B4CAB7',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },
  savedButtonText: {
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#637066',
    fontSize: 14,
    fontWeight: '500',
  },
  noChangesText: {
    color: '#8A948C',
    fontSize: 12.5,
  },
});
