import { create } from 'zustand';
import { storage } from '../utils/mmkv';
import { secureStorage } from '../utils/secure-store';
import { sendRealEmailOtp } from '../utils/email-otp';
import { scheduleDailyReminder, cancelDailyReminder } from '../utils/notifications';

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatarUri?: string;
  isPro: boolean;
  partnerLinked: boolean;
  partnerName?: string;
  partnerPhone?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  hasPin: boolean;
  pinLoginEnabled: boolean;
  biometricLoginEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
  tempPhone: string | null;
  tempEmail: string | null;
  tempOtp: string | null;
  tempPin: string | null;

  // Actions
  setTempPhone: (phone: string) => void;
  setTempEmail: (email: string) => void;
  setTempPin: (pin: string | null) => void;
  setPinLoginEnabled: (enabled: boolean) => void;
  setBiometricLoginEnabled: (enabled: boolean) => void;
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
  sendOtp: () => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  setupPin: (pin: string) => Promise<boolean>;
  verifySecurityPin: (pin: string) => Promise<boolean>;
  loginWithSecurityPin: (pin: string) => Promise<boolean>;
  upgradeToPro: () => void;
  cancelProSubscription: () => void;
  linkPartner: (partnerName: string, partnerPhone?: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updatePin: (oldPin: string, newPin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  deleteAccountPermanently: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const STORAGE_KEYS = {
  USER: 'jeda_user_profile',
  IS_AUTHENTICATED: 'jeda_is_authenticated',
  PIN_LOGIN_ENABLED: 'jeda_pin_login_enabled',
  BIOMETRIC_LOGIN_ENABLED: 'jeda_biometric_login_enabled',
  REMINDER_ENABLED: 'jeda_reminder_enabled',
  REMINDER_TIME: 'jeda_reminder_time',
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_rani',
  name: 'Rani',
  phone: '+62 812 3456 XXXX',
  email: 'rani@jeda.id',
  isPro: false,
  partnerLinked: false,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: DEFAULT_USER,
  isAuthenticated: true,
  hasPin: true,
  pinLoginEnabled: false, // Default nonaktif sesuai instruksi
  biometricLoginEnabled: false, // Default nonaktif sesuai instruksi
  reminderEnabled: true,
  reminderTime: '07:00',
  tempPhone: null,
  tempEmail: null,
  tempOtp: '123456', // Default simulated OTP
  tempPin: null,

  setTempPhone: (phone: string) => set({ tempPhone: phone, tempEmail: null }),
  setTempEmail: (email: string) => set({ tempEmail: email, tempPhone: null }),
  setTempPin: (pin: string | null) => set({ tempPin: pin }),

  setPinLoginEnabled: (enabled: boolean) => {
    storage.set(STORAGE_KEYS.PIN_LOGIN_ENABLED, enabled);
    set({ pinLoginEnabled: enabled });
  },

  setBiometricLoginEnabled: (enabled: boolean) => {
    storage.set(STORAGE_KEYS.BIOMETRIC_LOGIN_ENABLED, enabled);
    set({ biometricLoginEnabled: enabled });
  },

  setReminderEnabled: (enabled: boolean) => {
    storage.set(STORAGE_KEYS.REMINDER_ENABLED, enabled);
    set({ reminderEnabled: enabled });
    if (enabled) {
      scheduleDailyReminder(get().reminderTime || '07:00');
    } else {
      cancelDailyReminder();
    }
  },

  setReminderTime: (time: string) => {
    storage.set(STORAGE_KEYS.REMINDER_TIME, time);
    set({ reminderTime: time });
    if (get().reminderEnabled) {
      scheduleDailyReminder(time);
    }
  },

  sendOtp: async () => {
    // Generate real random 6-digit OTP code (100000 - 999999)
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    set({ tempOtp: randomOtp });

    const email = get().tempEmail;
    if (email) {
      await sendRealEmailOtp(email, randomOtp);
    }
    return true;
  },

  verifyOtp: async (code: string) => {
    const currentOtp = get().tempOtp;
    if (!currentOtp) return false;
    return code === currentOtp;
  },

  setupPin: async (pin: string) => {
    if (pin.length !== 6) return false;
    const success = await secureStorage.savePin(pin);
    if (success) {
      storage.delete('jeda_account_deleted');
      const existingUser = get().user;
      const newUser: UserProfile = existingUser || {
        id: 'usr_' + Date.now(),
        name: 'Pengguna Jeda',
        phone: get().tempPhone || undefined,
        email: get().tempEmail || undefined,
        isPro: false,
        partnerLinked: false,
      };

      storage.set(STORAGE_KEYS.USER, JSON.stringify(newUser));
      storage.set(STORAGE_KEYS.IS_AUTHENTICATED, true);

      set({
        user: newUser,
        isAuthenticated: true,
        hasPin: true,
        tempPin: null,
      });
      return true;
    }
    return false;
  },

  verifySecurityPin: async (pin: string) => {
    return await secureStorage.verifyPin(pin);
  },

  loginWithSecurityPin: async (pin: string): Promise<boolean> => {
    const isValid = await secureStorage.verifyPin(pin);
    if (isValid) {
      const savedUserJson = storage.getString(STORAGE_KEYS.USER);
      let currentUser = get().user;
      if (!currentUser && savedUserJson) {
        try {
          currentUser = JSON.parse(savedUserJson);
        } catch {
          currentUser = DEFAULT_USER;
        }
      } else if (!currentUser) {
        currentUser = {
          ...DEFAULT_USER,
          phone: get().tempPhone || DEFAULT_USER.phone,
          email: get().tempEmail || DEFAULT_USER.email,
        };
      }
      storage.set(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      storage.set(STORAGE_KEYS.IS_AUTHENTICATED, true);
      set({
        user: currentUser,
        isAuthenticated: true,
        hasPin: true,
        tempPin: null,
      });
      return true;
    }
    return false;
  },

  upgradeToPro: () => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser: UserProfile = { ...currentUser, isPro: true };
      storage.set(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  cancelProSubscription: () => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        isPro: false,
        partnerLinked: false,
        partnerName: undefined,
      };
      storage.set(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  linkPartner: (partnerName: string, partnerPhone?: string) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        isPro: true, // Auto-pro on couple linking
        partnerLinked: true,
        partnerName,
        partnerPhone,
      };
      storage.set(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  updateProfile: (profile: Partial<UserProfile>) => {
    const currentUser = get().user || DEFAULT_USER;
    const updatedUser: UserProfile = { ...currentUser, ...profile };
    storage.set(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  updatePin: async (oldPin: string, newPin: string): Promise<{ success: boolean; error?: string }> => {
    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      return { success: false, error: 'PIN baru harus 6 digit angka.' };
    }
    const hasPinStored = await secureStorage.hasPin();
    if (hasPinStored) {
      const isOldValid = await secureStorage.verifyPin(oldPin);
      if (!isOldValid) {
        return { success: false, error: 'PIN saat ini salah. Silakan coba lagi.' };
      }
    }
    const saved = await secureStorage.savePin(newPin);
    if (!saved) {
      return { success: false, error: 'Gagal memperbarui PIN di penyimpanan aman.' };
    }
    // Aktifkan login dengan PIN saat PIN berhasil diubah
    storage.set(STORAGE_KEYS.PIN_LOGIN_ENABLED, true);
    set({ hasPin: true, pinLoginEnabled: true });
    return { success: true };
  },

  // Logout (Keluar dari Akun): Hanya mengakhiri sesi. PIN dan profil tetap tersimpan aman.
  logout: async () => {
    storage.set(STORAGE_KEYS.IS_AUTHENTICATED, false);
    storage.set(STORAGE_KEYS.PIN_LOGIN_ENABLED, false);
    storage.set(STORAGE_KEYS.BIOMETRIC_LOGIN_ENABLED, false);
    const hasPinStored = await secureStorage.hasPin();
    set({
      isAuthenticated: false,
      hasPin: hasPinStored,
      pinLoginEnabled: false,
      biometricLoginEnabled: false,
      tempPhone: null,
      tempEmail: null,
      tempPin: null,
    });
  },

  // Hapus Akun & Data Permanen (Pemusnahan Data Sesuai UU PDP)
  deleteAccountPermanently: async () => {
    await secureStorage.clearAll();
    storage.set('jeda_account_deleted', true);
    storage.set('jeda_checkin_history_cleared', true);
    storage.set('jeda_analytics_sessions_cleared', true);
    storage.delete('jeda_checkin_history');
    storage.delete('jeda_analytics_sessions');
    storage.delete('jeda_last_checkin_date');
    storage.delete(STORAGE_KEYS.USER);
    storage.delete(STORAGE_KEYS.IS_AUTHENTICATED);
    storage.delete(STORAGE_KEYS.PIN_LOGIN_ENABLED);
    storage.delete(STORAGE_KEYS.BIOMETRIC_LOGIN_ENABLED);
    set({
      user: null,
      isAuthenticated: false,
      hasPin: false,
      pinLoginEnabled: false,
      biometricLoginEnabled: false,
      tempPhone: null,
      tempEmail: null,
      tempPin: null,
    });
  },

  initializeAuth: async () => {
    const savedUserJson = storage.getString(STORAGE_KEYS.USER);
    const savedIsAuth = storage.getBoolean(STORAGE_KEYS.IS_AUTHENTICATED) ?? false;
    let hasPinStored = await secureStorage.hasPin();
    const savedPinLogin = storage.getBoolean(STORAGE_KEYS.PIN_LOGIN_ENABLED) ?? false;
    const savedBiometric = storage.getBoolean(STORAGE_KEYS.BIOMETRIC_LOGIN_ENABLED) ?? false;
    const savedReminder = storage.getBoolean(STORAGE_KEYS.REMINDER_ENABLED) ?? true;
    const savedReminderTime = storage.getString(STORAGE_KEYS.REMINDER_TIME) ?? '07:00';
    const accountDeleted = storage.getBoolean('jeda_account_deleted') ?? false;

    // Default demo setup: jika PIN belum pernah disimpan dan akun tidak dihapus permanen, buat PIN default '123456'
    if (!hasPinStored && !accountDeleted) {
      await secureStorage.savePin('123456');
      hasPinStored = true;
    }

    let userObj: UserProfile | null = null;
    if (savedUserJson) {
      try {
        userObj = JSON.parse(savedUserJson) as UserProfile;
      } catch {
        userObj = DEFAULT_USER;
      }
    } else if (!accountDeleted) {
      userObj = DEFAULT_USER;
    }

    set({
      user: userObj,
      isAuthenticated: savedIsAuth,
      hasPin: hasPinStored,
      pinLoginEnabled: savedPinLogin,
      biometricLoginEnabled: savedBiometric,
      reminderEnabled: savedReminder,
      reminderTime: savedReminderTime,
    });

    if (savedReminder && savedReminderTime) {
      scheduleDailyReminder(savedReminderTime);
    }
  },
}));
