import { Platform } from 'react-native';
import { createMMKV, MMKV } from 'react-native-mmkv';

// Singleton MMKV storage instance for Jeda app
// Provides fast binary synchronous storage on native iOS/Android
let storageInstance: MMKV | null = null;

if (Platform.OS !== 'web') {
  try {
    storageInstance = createMMKV({
      id: 'jeda-app-storage',
    });
  } catch {
    storageInstance = null;
  }
}

// In-memory or web localStorage fallback
const memoryStorage = new Map<string, string>();

const getWebStorage = (key: string): string | undefined => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const val = window.localStorage.getItem(key);
    return val !== null ? val : undefined;
  }
  return memoryStorage.get(key);
};

const setWebStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
  } else {
    memoryStorage.set(key, value);
  }
};

const removeWebStorage = (key: string): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
  } else {
    memoryStorage.delete(key);
  }
};

export const storage = {
  set: (key: string, value: string | boolean | number) => {
    if (storageInstance) {
      storageInstance.set(key, value);
    } else {
      setWebStorage(key, String(value));
    }
  },

  getString: (key: string): string | undefined => {
    if (storageInstance) {
      return storageInstance.getString(key);
    }
    return getWebStorage(key);
  },

  getBoolean: (key: string): boolean | undefined => {
    if (storageInstance) {
      return storageInstance.getBoolean(key);
    }
    const val = getWebStorage(key);
    return val !== undefined ? val === 'true' : undefined;
  },

  getNumber: (key: string): number | undefined => {
    if (storageInstance) {
      return storageInstance.getNumber(key);
    }
    const val = getWebStorage(key);
    return val !== undefined ? Number(val) : undefined;
  },

  delete: (key: string) => {
    if (storageInstance) {
      storageInstance.remove(key);
    } else {
      removeWebStorage(key);
    }
  },

  clearAll: () => {
    if (storageInstance) {
      storageInstance.clearAll();
    } else {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      memoryStorage.clear();
    }
  },
};
