import { Platform } from 'react-native';
import { storage } from './mmkv';

export interface CancellationSurveyData {
  userName: string;
  userEmail?: string;
  reason: string;
  notes?: string;
  date: string;
}

const TARGET_EMAIL = 'armansyahhakim263@gmail.com';
const STORAGE_KEY = 'jeda_pro_cancellation_surveys';

export async function sendCancellationSurvey(data: CancellationSurveyData): Promise<boolean> {
  const payload = {
    _subject: `[Jeda PRO Feedback] Alasan Berhenti Berlangganan - ${data.userName}`,
    _template: 'table',
    _captcha: 'false',
    name: data.userName,
    email: data.userEmail || 'user@jeda.id',
    alasan_utama: data.reason,
    catatan_tambahan: data.notes || '(Tidak ada catatan tambahan)',
    waktu_pengiriman: data.date,
  };

  // 1. Simpan ke local storage agar developer selalu bisa melihat riwayat kuisioner
  try {
    const existing = storage.getString(STORAGE_KEY);
    const list: CancellationSurveyData[] = existing ? JSON.parse(existing) : [];
    list.unshift(data);
    storage.set(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Gagal menyimpan kuisioner ke storage:', err);
  }

  // 2. Log jelas di konsol developer
  console.log(`[KUISIONER BERHENTI PRO dikirim ke ${TARGET_EMAIL}]:`, JSON.stringify(payload, null, 2));

  // 3. Kirim via FormSubmit endpoint ke email target
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log('Kuisioner berhasil terkirim ke email:', TARGET_EMAIL);
      return true;
    }
  } catch (err) {
    console.warn('Pengiriman HTTP formsubmit gagal/offline, data tetap tersimpan di storage:', err);
  }

  return true;
}
