import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'jeda_user_security_pin';
const AUTH_TOKEN_KEY = 'jeda_user_auth_token';

// In-memory or web localStorage fallback
const webStorage = {
  get: (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  set: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  remove: (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

export const secureStorage = {
  /**
   * Save 6-digit security PIN in OS Secure Enclave (Keychain / Keystore)
   * Falls back to web storage when running on browser.
   */
  savePin: async (pin: string): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        webStorage.set(PIN_KEY, pin);
        return true;
      }
      await SecureStore.setItemAsync(PIN_KEY, pin);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Verify if entered PIN matches the stored PIN
   */
  verifyPin: async (enteredPin: string): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        return webStorage.get(PIN_KEY) === enteredPin;
      }
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      return storedPin === enteredPin;
    } catch {
      return false;
    }
  },

  /**
   * Check if a PIN has been set up previously
   */
  hasPin: async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        const pin = webStorage.get(PIN_KEY);
        return Boolean(pin && pin.length === 6);
      }
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      return Boolean(storedPin && storedPin.length === 6);
    } catch {
      return false;
    }
  },

  /**
   * Delete security PIN (e.g. on account reset / logout)
   */
  deletePin: async (): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        webStorage.remove(PIN_KEY);
        return;
      }
      await SecureStore.deleteItemAsync(PIN_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Save auth token securely
   */
  saveToken: async (token: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        webStorage.set(AUTH_TOKEN_KEY, token);
        return;
      }
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    } catch {
      // ignore
    }
  },

  /**
   * Get auth token
   */
  getToken: async (): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return webStorage.get(AUTH_TOKEN_KEY);
      }
      return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Clear all secure credentials on logout
   */
  clearAll: async (): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        webStorage.remove(PIN_KEY);
        webStorage.remove(AUTH_TOKEN_KEY);
        return;
      }
      await SecureStore.deleteItemAsync(PIN_KEY);
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } catch {
      // ignore
    }
  },
};
