import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

interface LucideMailIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Lucide Mail Icon
 * Clean, minimalist, and calming stroke-based email icon.
 */
export default function LucideMailIcon({
  size = 20,
  color = '#1E2522',
  strokeWidth = 1.6,
}: LucideMailIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect width="20" height="16" x="2" y="4" rx="2.5" />
      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Svg>
  );
}
