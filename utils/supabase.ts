import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG as CONFIG } from '../constants/supabase-config';
import { storage } from './mmkv';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = CONFIG.url?.trim();
  const key = CONFIG.anonKey?.trim();

  if (!url || !key) {
    return null;
  }

  try {
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false, // Jeda menggunakan local MMKV/PIN auth
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    return supabaseClient;
  } catch (err) {
    console.warn('[SUPABASE] Gagal inisialisasi client:', err);
    return null;
  }
}

export interface CoupleRecord {
  id?: string;
  pair_code: string;
  user_a_id: string;
  user_a_name: string;
  user_a_capacity: string;
  user_a_signal: string;
  user_b_id?: string;
  user_b_name?: string;
  user_b_capacity?: string;
  user_b_signal?: string;
  updated_at?: string;
}

/**
 * Buat Kode Pasangan Baru (User A mendaftar sebagai host)
 */
export async function createCouplePair(
  pairCode: string,
  myId: string,
  myName: string,
  myCapacity: string,
  mySignal: string
): Promise<{ success: boolean; data?: CoupleRecord; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: true,
      data: {
        pair_code: pairCode,
        user_a_id: myId,
        user_a_name: myName,
        user_a_capacity: myCapacity,
        user_a_signal: mySignal,
      },
    };
  }

  try {
    const { data, error } = await client
      .from('couples')
      .upsert({
        pair_code: pairCode,
        user_a_id: myId,
        user_a_name: myName,
        user_a_capacity: myCapacity,
        user_a_signal: mySignal,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'pair_code' })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as CoupleRecord };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Hubungkan Pasangan via Kode Pasangan (User B memasukkan kode dari User A)
 */
export async function joinCouplePair(
  pairCode: string,
  myId: string,
  myName: string,
  myCapacity: string,
  mySignal: string
): Promise<{ success: boolean; data?: CoupleRecord; partnerName?: string; error?: string }> {
  const client = getSupabase();
  if (!client) {
    // Mode demo / offline jika belum set Supabase API key
    return {
      success: true,
      partnerName: 'Pasangan Jeda',
      data: {
        pair_code: pairCode,
        user_a_id: 'partner_demo',
        user_a_name: 'Pasangan Jeda',
        user_a_capacity: 'Tipis',
        user_a_signal: 'Rahang Tegang',
        user_b_id: myId,
        user_b_name: myName,
        user_b_capacity: myCapacity,
        user_b_signal: mySignal,
      },
    };
  }

  try {
    // 1. Cari pasangan berdasarkan pair_code
    const { data: existing, error: findError } = await client
      .from('couples')
      .select('*')
      .eq('pair_code', pairCode.toUpperCase().trim())
      .single();

    if (findError || !existing) {
      return { success: false, error: 'Kode pasangan tidak ditemukan. Pastikan kodenya sesuai.' };
    }

    // 2. Tentukan posisi (User B jika User A sudah ada)
    const isUserA = existing.user_a_id === myId;
    const partnerName = isUserA ? existing.user_b_name || 'Pasangan' : existing.user_a_name || 'Pasangan';

    const updates: Partial<CoupleRecord> = isUserA
      ? {
          user_a_name: myName,
          user_a_capacity: myCapacity,
          user_a_signal: mySignal,
          updated_at: new Date().toISOString(),
        }
      : {
          user_b_id: myId,
          user_b_name: myName,
          user_b_capacity: myCapacity,
          user_b_signal: mySignal,
          updated_at: new Date().toISOString(),
        };

    const { data: updated, error: updateError } = await client
      .from('couples')
      .update(updates)
      .eq('pair_code', pairCode.toUpperCase().trim())
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, data: updated as CoupleRecord, partnerName };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Perbarui Status Kapasitas & Sinyal Saya ke Database Supabase
 */
export async function broadcastMyStatus(
  pairCode: string,
  myId: string,
  capacity: string,
  signal: string
): Promise<boolean> {
  const client = getSupabase();
  if (!client || !pairCode) return false;

  try {
    const { data: existing } = await client
      .from('couples')
      .select('user_a_id, user_b_id')
      .eq('pair_code', pairCode)
      .single();

    if (!existing) return false;

    const isUserA = existing.user_a_id === myId;
    const updatePayload = isUserA
      ? { user_a_capacity: capacity, user_a_signal: signal, updated_at: new Date().toISOString() }
      : { user_b_capacity: capacity, user_b_signal: signal, updated_at: new Date().toISOString() };

    await client.from('couples').update(updatePayload).eq('pair_code', pairCode);
    return true;
  } catch (err) {
    console.warn('[SUPABASE] Gagal mengirim status ke pasangan:', err);
    return false;
  }
}
