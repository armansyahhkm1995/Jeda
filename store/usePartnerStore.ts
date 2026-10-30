import { create } from 'zustand';
import { storage } from '../utils/mmkv';
import { getSupabase, CoupleRecord, createCouplePair, joinCouplePair, broadcastMyStatus } from '../utils/supabase';
import { sendPartnerAlertNotification } from '../utils/notifications';
import { useAuthStore } from './useAuthStore';

interface PartnerState {
  isLinked: boolean;
  pairCode: string | null;
  partnerName: string;
  partnerCapacity: string;
  partnerSignal: string;
  partnerLastUpdated: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  generatePairCode: () => Promise<string>;
  linkWithCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  disconnectPartner: () => void;
  updateMyStatusToPartner: (capacity: string, signal: string) => Promise<void>;
  initializePartnerSync: () => void;
}

const STORAGE_KEYS = {
  IS_LINKED: 'jeda_partner_is_linked',
  PAIR_CODE: 'jeda_partner_pair_code',
  PARTNER_NAME: 'jeda_partner_name',
  PARTNER_CAPACITY: 'jeda_partner_capacity',
  PARTNER_SIGNAL: 'jeda_partner_signal',
  LAST_UPDATED: 'jeda_partner_last_updated',
};

// Singleton channel subscription reference
let activeChannel: any = null;

export const usePartnerStore = create<PartnerState>((set, get) => ({
  isLinked: storage.getBoolean(STORAGE_KEYS.IS_LINKED) ?? false,
  pairCode: storage.getString(STORAGE_KEYS.PAIR_CODE) || null,
  partnerName: storage.getString(STORAGE_KEYS.PARTNER_NAME) || 'Pasangan',
  partnerCapacity: storage.getString(STORAGE_KEYS.PARTNER_CAPACITY) || 'Aman',
  partnerSignal: storage.getString(STORAGE_KEYS.PARTNER_SIGNAL) || 'Tenang',
  partnerLastUpdated: storage.getString(STORAGE_KEYS.LAST_UPDATED) || null,
  isLoading: false,
  error: null,

  generatePairCode: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    const myId = user?.id || 'usr_' + Date.now();
    const myName = user?.name || 'Rani';

    // Buat kode 6 karakter acak yang mudah dibaca (misal: "JEDA-742")
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const code = `JEDA-${randomDigits}`;

    const res = await createCouplePair(code, myId, myName, 'Aman', 'Tenang');
    if (res.success) {
      storage.set(STORAGE_KEYS.PAIR_CODE, code);
      set({ pairCode: code, isLoading: false });
      get().initializePartnerSync();
      return code;
    } else {
      set({ isLoading: false, error: res.error || 'Gagal membuat kode' });
      return code;
    }
  },

  linkWithCode: async (code: string) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    const myId = user?.id || 'usr_' + Date.now();
    const myName = user?.name || 'Budi';

    const cleanCode = code.toUpperCase().trim();
    const res = await joinCouplePair(cleanCode, myId, myName, 'Aman', 'Tenang');

    if (res.success && res.data) {
      const pRecord = res.data;
      const isUserA = pRecord.user_a_id === myId;
      const pName = isUserA ? pRecord.user_b_name || 'Pasangan' : pRecord.user_a_name || 'Pasangan';
      const pCapacity = isUserA ? pRecord.user_b_capacity || 'Aman' : pRecord.user_a_capacity || 'Aman';
      const pSignal = isUserA ? pRecord.user_b_signal || 'Tenang' : pRecord.user_a_signal || 'Tenang';

      storage.set(STORAGE_KEYS.IS_LINKED, true);
      storage.set(STORAGE_KEYS.PAIR_CODE, cleanCode);
      storage.set(STORAGE_KEYS.PARTNER_NAME, pName);
      storage.set(STORAGE_KEYS.PARTNER_CAPACITY, pCapacity);
      storage.set(STORAGE_KEYS.PARTNER_SIGNAL, pSignal);
      storage.set(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());

      // Update auth store user profile
      useAuthStore.getState().linkPartner(pName);

      set({
        isLinked: true,
        pairCode: cleanCode,
        partnerName: pName,
        partnerCapacity: pCapacity,
        partnerSignal: pSignal,
        partnerLastUpdated: new Date().toISOString(),
        isLoading: false,
      });

      // Hubungkan realtime listener
      get().initializePartnerSync();
      return { success: true };
    } else {
      set({ isLoading: false, error: res.error || 'Gagal menghubungkan' });
      return { success: false, error: res.error };
    }
  },

  disconnectPartner: () => {
    if (activeChannel) {
      activeChannel.unsubscribe();
      activeChannel = null;
    }
    storage.delete(STORAGE_KEYS.IS_LINKED);
    storage.delete(STORAGE_KEYS.PAIR_CODE);
    storage.delete(STORAGE_KEYS.PARTNER_NAME);
    storage.delete(STORAGE_KEYS.PARTNER_CAPACITY);
    storage.delete(STORAGE_KEYS.PARTNER_SIGNAL);
    storage.delete(STORAGE_KEYS.LAST_UPDATED);

    set({
      isLinked: false,
      pairCode: null,
      partnerName: 'Pasangan',
      partnerCapacity: 'Aman',
      partnerSignal: 'Tenang',
      partnerLastUpdated: null,
    });
  },

  updateMyStatusToPartner: async (capacity: string, signal: string) => {
    const pairCode = get().pairCode;
    const user = useAuthStore.getState().user;
    if (!pairCode || !user?.id) return;

    await broadcastMyStatus(pairCode, user.id, capacity, signal);
  },

  initializePartnerSync: () => {
    const pairCode = get().pairCode;
    const client = getSupabase();
    if (!client || !pairCode) return;

    // Hindari duplikasi subscription channel
    if (activeChannel) {
      activeChannel.unsubscribe();
    }

    const myId = useAuthStore.getState().user?.id;

    console.log(`[PARTNER SYNC] Memulai mendengarkan pembaruan pasangan di room: ${pairCode}`);

    activeChannel = client
      .channel(`couple_${pairCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'couples',
          filter: `pair_code=eq.${pairCode}`,
        },
        (payload: any) => {
          const row = payload.new as CoupleRecord;
          if (!row) return;

          const isUserA = row.user_a_id === myId;
          const pName = isUserA ? row.user_b_name || 'Pasangan' : row.user_a_name || 'Pasangan';
          const newCapacity = isUserA ? row.user_b_capacity || 'Aman' : row.user_a_capacity || 'Aman';
          const newSignal = isUserA ? row.user_b_signal || 'Tenang' : row.user_a_signal || 'Tenang';

          const previousCapacity = get().partnerCapacity;
          const previousSignal = get().partnerSignal;

          // Cek apakah ada perubahan status dari pasangan
          const hasChanged = newCapacity !== previousCapacity || newSignal !== previousSignal;

          if (hasChanged) {
            console.log(`[PARTNER UPDATE]: ${pName} memperbarui status -> Kapasitas: ${newCapacity}, Sinyal: ${newSignal}`);

            storage.set(STORAGE_KEYS.PARTNER_NAME, pName);
            storage.set(STORAGE_KEYS.PARTNER_CAPACITY, newCapacity);
            storage.set(STORAGE_KEYS.PARTNER_SIGNAL, newSignal);
            storage.set(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());

            set({
              partnerName: pName,
              partnerCapacity: newCapacity,
              partnerSignal: newSignal,
              partnerLastUpdated: new Date().toISOString(),
            });

            // Kirim notifikasi instan ke HP pengguna dengan copy format yang diminta:
            // "Kapasitas {Nama Pasangan} sedang {kapasitas Emosi} dengan sinyal tubuh {Sinyal Tubuh}. Berikan jeda sejenak"
            sendPartnerAlertNotification(pName, newCapacity, newSignal);
          }
        }
      )
      .subscribe();
  },
}));
