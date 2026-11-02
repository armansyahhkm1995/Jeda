/**
 * JEDA FEATURE FLAGS
 * 
 * Pengaturan fitur untuk rilis aplikasi Jeda:
 * - Versi 1.0 (MVP Peluncuran Play Store):
 *   - ENABLE_PRO_MODE = false (Mode Jeda PRO disembunyikan agar bebas penolakan in-app purchase Play Store)
 *   - ENABLE_PARTNER_SYNC = false (Mode Pasangan disembunyikan sampai aplikasi resmi live di Play Store)
 * 
 * - Versi 1.1 (Pembaruan berikutnya setelah live di Play Store):
 *   - Cukup ubah flags menjadi true untuk mengaktifkan kembali seluruh Mode Pasangan & Analitik Tren PRO.
 */
export const FEATURE_FLAGS = {
  ENABLE_PRO_MODE: false,
  ENABLE_PARTNER_SYNC: false,
};
