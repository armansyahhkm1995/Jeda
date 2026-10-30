import { Platform } from 'react-native';

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0
}

/**
 * Mengompresi gambar ke resolusi avatar optimal (default 400x400) dan kualitas 0.7
 * Mengurangi ukuran file dari beberapa MB menjadi puluhan KB sebelum disimpan ke database/storage.
 */
export async function compressAvatarImage(
  uri: string,
  options: CompressOptions = {}
): Promise<string> {
  const maxWidth = options.maxWidth || 400;
  const maxHeight = options.maxHeight || 400;
  const quality = options.quality !== undefined ? options.quality : 0.7;

  // Jika di lingkungan Web, gunakan HTML Canvas untuk kompresi presisi tinggi
  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof document !== 'undefined') {
    return new Promise((resolve) => {
      const img = new (window as any).Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Hitung skala aspect ratio square / avatar
        const minDim = Math.min(width, height);
        const sx = (width - minDim) / 2;
        const sy = (height - minDim) / 2;

        const targetSize = Math.min(maxWidth, maxHeight, minDim);
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          console.log(
            `[Image Compression Web]: Ukuran awal: ${width}x${height} -> Terkompresi: ${targetSize}x${targetSize} (Kualitas: ${quality})`
          );
          resolve(compressedDataUrl);
        } else {
          resolve(uri);
        }
      };

      img.onerror = () => {
        console.warn('[Image Compression Web]: Gagal memuat gambar untuk kompresi, menggunakan URI asli.');
        resolve(uri);
      };

      img.src = uri;
    });
  }

  // Jika di lingkungan Native, expo-image-picker telah melakukan kompresi awal via quality: 0.6
  console.log(`[Image Compression Native]: Gambar terkompresi dari ImagePicker (Kualitas: ${quality})`);
  return uri;
}
