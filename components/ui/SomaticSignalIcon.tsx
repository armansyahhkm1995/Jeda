import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { BodySignalKey } from '../../types';
import { normalizeSignalKey } from '../../utils/ranking-algorithm';
import { COLORS } from '../../constants/theme';

interface SomaticSignalIconProps {
  signalKey: BodySignalKey | string;
  size?: number;
  color?: string;
  accentColor?: string;
}

export default function SomaticSignalIcon({
  signalKey,
  size = 20,
  color = COLORS.brand.primary,
  accentColor,
}: SomaticSignalIconProps) {
  const canonical = normalizeSignalKey(signalKey as BodySignalKey);

  switch (canonical) {
    case 'dada_sesak':
      // Paru-paru (Lungs) elegan & presisi dengan trakea dan kedua lobus
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Batang tenggorokan / Trachea & bronkus */}
          <Path
            d="M12 2V8M12 8C12 10.5 9.5 11.5 8 13M12 8C12 10.5 14.5 11.5 16 13"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Lobus Paru Kiri */}
          <Path
            d="M8 13C6 11.5 3.5 13 3.5 16.5C3.5 19.5 5.5 21.5 8 21.5C10.5 21.5 11.5 19 11.5 16C11.5 14 10 12.8 8 13Z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill={accentColor || 'rgba(45, 90, 56, 0.12)'}
          />
          {/* Lobus Paru Kanan */}
          <Path
            d="M16 13C18 11.5 20.5 13 20.5 16.5C20.5 19.5 18.5 21.5 16 21.5C13.5 21.5 12.5 19 12.5 16C12.5 14 14 12.8 16 13Z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill={accentColor || 'rgba(45, 90, 56, 0.12)'}
          />
        </Svg>
      );

    case 'hampir_meledak':
      // Gunung berapi / Letupan amarah
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 21L8 8H16L21 21H3Z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill={accentColor || 'rgba(207, 115, 86, 0.12)'}
          />
          <Path
            d="M9.5 8C9.5 5.5 10.8 3.5 12 2C13.2 3.5 14.5 5.5 14.5 8"
            stroke="#CF7356"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <Path
            d="M12 8V12"
            stroke="#CF7356"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'rahang_tegang':
      // Rahang / Gigi mengeras
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M7 4C4.5 4 3 6 3 9C3 13 5.5 17 7 21C7.8 21 8.5 19 9.5 16C10.5 13 13.5 13 14.5 16C15.5 19 16.2 21 17 21C18.5 17 21 13 21 9C21 6 19.5 4 17 4C14.5 4 13 5.5 12 6.5C11 5.5 9.5 4 7 4Z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill={accentColor || 'rgba(45, 90, 56, 0.12)'}
          />
        </Svg>
      );

    case 'pikiran_kalut':
      // Badai pikiran / Pusaran
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill={accentColor || 'rgba(45, 90, 56, 0.12)'}
          />
          <Path
            d="M7 17H15M5 20H12"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'kelelahan_ekstrem':
      // Baterai menipis
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="2"
            y="6"
            width="17"
            height="12"
            rx="2.5"
            stroke={color}
            strokeWidth="1.6"
            fill={accentColor || 'rgba(222, 179, 82, 0.12)'}
          />
          <Path
            d="M22 10.5V13.5"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <Path
            d="M6 10V14"
            stroke="#DEB352"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'emosi_kusut':
    default:
      // Benang kusut emosional
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
            stroke={color}
            strokeWidth="1.6"
            fill={accentColor || 'rgba(45, 90, 56, 0.12)'}
          />
          <Path
            d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <Path
            d="M12 16C10 16 9 17.5 9 19.5"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </Svg>
      );
  }
}
