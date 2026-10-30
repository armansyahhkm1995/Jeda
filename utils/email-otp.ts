import { storage } from './mmkv';
import { EMAILJS_CONFIG } from '../constants/email-config';

export interface EmailOtpConfig {
  provider: 'resend' | 'brevo' | 'emailjs' | 'custom_api';
  apiKey?: string;
  senderEmail?: string;
  senderName?: string;
  // Khusus EmailJS:
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
}

const STORAGE_KEY_OTP_CONFIG = 'jeda_email_otp_config';

// Konfigurasi default (bisa diubah via runtime atau constants/email-config.ts)
export function getEmailOtpConfig(): EmailOtpConfig {
  const saved = storage.getString(STORAGE_KEY_OTP_CONFIG);
  let parsed: Partial<EmailOtpConfig> = {};
  if (saved) {
    try {
      parsed = JSON.parse(saved);
    } catch {
      // fallback
    }
  }

  return {
    provider: 'emailjs',
    senderEmail: 'auth@jeda.id',
    senderName: 'Jeda (Jeda Sebelum Luka)',
    serviceId: EMAILJS_CONFIG.serviceId || parsed.serviceId || '',
    templateId: EMAILJS_CONFIG.templateId || parsed.templateId || '',
    publicKey: EMAILJS_CONFIG.publicKey || parsed.publicKey || '',
    apiKey: parsed.apiKey || '',
    ...parsed,
  };
}

export function saveEmailOtpConfig(config: Partial<EmailOtpConfig>) {
  const current = getEmailOtpConfig();
  const updated = { ...current, ...config };
  storage.set(STORAGE_KEY_OTP_CONFIG, JSON.stringify(updated));
  return updated;
}

/**
 * Template Email HTML Elegan & Zen khas Jeda
 */
function createOtpEmailHtml(otpCode: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kode Keamanan Jeda</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E2922;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px; background-color: #FAF8F5;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #ECE8E1; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #F5F2EB;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #2D5A38; letter-spacing: -0.5px;">Jeda.</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #717D74;">Ruang aman sebelum emosi mengambil alih</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1E2922;">Kode Verifikasi Masuk</h2>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #556B59;">
                Gunakan 6 digit kode keamanan berikut untuk memverifikasi akun Anda. Kode ini berlaku selama <strong>5 menit</strong>.
              </p>

              <!-- OTP Highlight Box -->
              <div style="background-color: #EEF5F0; border: 1.5px dashed #2D5A38; border-radius: 14px; padding: 18px 24px; margin: 0 auto 28px auto; display: inline-block;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #2D5A38;">
                  ${otpCode}
                </span>
              </div>

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #8F9992;">
                Jangan bagikan kode ini kepada siapa pun. Jika Anda tidak merasa meminta kode ini, Anda dapat mengabaikan email ini dengan aman.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #F8F6F2; text-align: center; border-top: 1px solid #ECE8E1;">
              <p style="margin: 0; font-size: 11px; color: #9AA39C;">
                © ${new Date().getFullYear()} Jeda (Jeda Sebelum Luka). Aplikasi first-aid neurobiologi regulasi sistem saraf.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Mengirim Email OTP Nyata ke Alamat Tujuan
 */
export async function sendRealEmailOtp(
  toEmail: string,
  otpCode: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const config = getEmailOtpConfig();
  const htmlContent = createOtpEmailHtml(otpCode);

  console.log(`[JEDA AUTH] Mengirim OTP ${otpCode} ke: ${toEmail} via provider: ${config.provider}`);

  // 1. PROVIDER: RESEND (https://resend.com)
  if (config.provider === 'resend' && config.apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${config.senderName || 'Jeda'} <${config.senderEmail || 'onboarding@resend.dev'}>`,
          to: [toEmail],
          subject: `${otpCode} adalah kode verifikasi Jeda Anda`,
          html: htmlContent,
        }),
      });

      const resData = await response.json();
      if (response.ok) {
        console.log('[RESEND SUCCESS]:', resData);
        return { success: true, message: 'Email OTP berhasil dikirim via Resend.' };
      } else {
        console.error('[RESEND ERROR]:', resData);
        return { success: false, error: resData.message || 'Gagal mengirim email via Resend' };
      }
    } catch (err: any) {
      console.error('[RESEND FETCH FAILED]:', err);
      return { success: false, error: err.message };
    }
  }

  // 2. PROVIDER: BREVO / SENDINBLUE (https://brevo.com)
  if (config.provider === 'brevo' && config.apiKey) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': config.apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: config.senderName || 'Jeda App',
            email: config.senderEmail || 'auth@jeda.id',
          },
          to: [{ email: toEmail }],
          subject: `${otpCode} adalah kode verifikasi Jeda Anda`,
          htmlContent: htmlContent,
        }),
      });

      const resData = await response.json();
      if (response.ok) {
        console.log('[BREVO SUCCESS]:', resData);
        return { success: true, message: 'Email OTP berhasil dikirim via Brevo.' };
      } else {
        console.error('[BREVO ERROR]:', resData);
        return { success: false, error: resData.message || 'Gagal mengirim email via Brevo' };
      }
    } catch (err: any) {
      console.error('[BREVO FETCH FAILED]:', err);
      return { success: false, error: err.message };
    }
  }

  // 3. PROVIDER: EMAILJS (https://emailjs.com)
  if (config.provider === 'emailjs' && config.serviceId && config.templateId && config.publicKey) {
    try {
      const expiryDate = new Date(Date.now() + 15 * 60 * 1000);
      const expiryTimeStr =
        expiryDate.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jakarta',
        }) + ' WIB';

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'origin': 'http://localhost:8081',
        },
        body: JSON.stringify({
          service_id: config.serviceId,
          template_id: config.templateId,
          user_id: config.publicKey,
          template_params: {
            to_email: toEmail,
            email: toEmail,
            user_email: toEmail,
            otp_code: otpCode,
            otp: otpCode,
            code: otpCode,
            time: expiryTimeStr,
            expiry_time: expiryTimeStr,
            app_name: 'Jeda',
            message: `Kode verifikasi masuk Jeda Anda adalah: ${otpCode}. Berlaku hingga pukul ${expiryTimeStr}.`,
          },
        }),
      });

      if (response.ok) {
        console.log('[EMAILJS SUCCESS]');
        return { success: true, message: 'Email OTP berhasil dikirim via EmailJS.' };
      } else {
        const errText = await response.text();
        console.error('[EMAILJS ERROR]:', errText);
        return { success: false, error: errText };
      }
    } catch (err: any) {
      console.error('[EMAILJS FETCH FAILED]:', err);
      return { success: false, error: err.message };
    }
  }

  // JIKA BELUM ADA API KEY YANG DIKONFIGURASI:
  // Catat kode di konsol dan beri tahu developer/pengguna
  console.warn(
    `[JEDA AUTH INFO]: Belum ada API Key email (Resend / Brevo / EmailJS) yang diset. Kode OTP acak untuk ${toEmail} adalah: [ ${otpCode} ]`
  );

  return {
    success: false,
    error: 'NO_API_KEY',
    message: `API Key pengirim email belum diset. Kode OTP yang di-generate adalah: ${otpCode}`,
  };
}
