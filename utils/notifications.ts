import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Inisialisasi handler agar notifikasi tetap muncul (banner & suara) saat aplikasi terbuka (foreground)
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

const ANDROID_CHANNEL_ID = 'jeda-daily-checkin';

/**
 * Setup Channel Notifikasi untuk Android 8.0+
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'Pengingat Check-in Jeda',
        description: 'Notifikasi harian untuk mengecek kapasitas emosi & sinyal tubuh',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2D5A38',
      });
    } catch (err) {
      console.warn('Gagal membuat notification channel Android:', err);
    }
  }
}

/**
 * Meminta Izin Notifikasi ke Pengguna (Android 13+ & iOS)
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') return true;
      const res = await Notification.requestPermission();
      return res === 'granted';
    }
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      await setupNotificationChannels();
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Gagal meminta izin notifikasi:', error);
    return false;
  }
}

/**
 * Menjadwalkan Notifikasi Harian Berulang (Daily Repeating)
 * @param timeStr Format jam "HH:mm" (contoh: "07:00", "20:30")
 */
export async function scheduleDailyReminder(timeStr: string): Promise<string | null> {
  try {
    // 1. Batalkan jadwal pengingat lama agar tidak duplikat
    await cancelDailyReminder();

    // 2. Parse jam & menit
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10) || 7;
    const minute = parseInt(minuteStr, 10) || 0;

    // 3. Minta izin jika belum aktif
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('[NOTIFIKASI] Izin notifikasi belum diaktifkan oleh pengguna.');
      return null;
    }

    if (Platform.OS === 'web') {
      console.log(`[NOTIFIKASI WEB] Pengingat harian diset pada pukul ${timeStr} WIB.`);
      return 'web_scheduled_' + timeStr;
    }

    // 4. Jadwalkan di background sistem operasi
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Waktunya Jeda Sejenak 🌿',
        body: 'Bagaimana sisa kesabaranmu hari ini? Ambil jeda 1 menit untuk check-in sinyal tubuhmu.',
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { screen: '/(checkin)' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: ANDROID_CHANNEL_ID,
      },
    });

    console.log(`[NOTIFIKASI AKTIF] Berhasil menjadwalkan pengingat harian pukul ${timeStr} WIB (ID: ${notificationId})`);
    return notificationId;
  } catch (error) {
    console.error('Gagal menjadwalkan notifikasi harian:', error);
    return null;
  }
}

/**
 * Membatalkan Seluruh Jadwal Notifikasi Pengingat
 */
export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[NOTIFIKASI] Semua pengingat harian dinonaktifkan.');
  } catch (err) {
    console.warn('Gagal membatalkan notifikasi:', err);
  }
}

/**
 * Mengirim Notifikasi Uji Langsung (Muncul dalam 2 detik)
 * Berguna agar developer / user bisa langsung melihat tampilan notifikasinya tanpa menunggu besok jam 07:00
 */
export async function sendInstantTestNotification(): Promise<boolean> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return false;
  }

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Waktunya Jeda Sejenak 🌿', {
        body: 'Tes Berhasil! Pengingat check-in harian Jeda sudah aktif.',
        icon: '/assets/illustrations/jeda-leaf-logo-transparent.png',
      });
      return true;
    }
    return false;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Waktunya Jeda Sejenak 🌿',
        body: 'Tes Berhasil! Pengingat check-in harian Jeda sudah aktif.',
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { screen: '/(checkin)' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        channelId: ANDROID_CHANNEL_ID,
      },
    });
    return true;
  } catch (error) {
    console.error('Gagal mengirim notifikasi uji:', error);
    return false;
  }
}

/**
 * Mengirim Notifikasi Status Pasangan ke HP Pengguna saat Pasangan Check-in
 * Format sesuai permintaan:
 * "Kapasitas {Nama} sedang {Kapasitas Emosi} dengan sinyal tubuh {Sinyal Tubuh}. Berikan jeda sejenak"
 */
export async function sendPartnerAlertNotification(
  partnerName: string,
  capacityLabel: string,
  signalLabel: string
): Promise<boolean> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return false;
  }

  const notificationMessage = `Kapasitas ${partnerName} sedang ${capacityLabel} dengan sinyal tubuh ${signalLabel}. Berikan jeda sejenak`;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`Sinyal Pasangan: ${partnerName} 🌿`, {
        body: notificationMessage,
        icon: '/assets/illustrations/jeda-leaf-logo-transparent.png',
      });
      return true;
    }
    return false;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Sinyal Pasangan: ${partnerName} 🌿`,
        body: notificationMessage,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { screen: '/(tabs)' },
      },
      trigger: null, // Kirim instan tanpa penundaan (instant trigger)
    });
    return true;
  } catch (error) {
    console.error('Gagal mengirim notifikasi pasangan:', error);
    return false;
  }
}
