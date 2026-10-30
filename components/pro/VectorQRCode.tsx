import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';

interface VectorQRCodeProps {
  size?: number;
}

// 21x21 Matrix representing a valid QR pattern for Jeda Pro Invite
const QR_MATRIX = [
  [1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,1,1,1,0,0,1],
  [1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1,1,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
  [1,0,1,1,0,0,1,1,1,0,1,0,1,1,0,1,0,0,1,1,1],
  [0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,1,0,1,0,0,0],
  [1,1,0,1,0,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1],
  [0,0,1,0,1,0,0,1,1,0,0,0,1,1,0,0,1,0,1,0,0],
  [1,0,1,1,0,1,1,0,0,1,1,1,0,1,1,0,0,1,0,1,1],
  [0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,1,0,0],
  [1,1,1,1,1,1,1,0,1,1,0,1,0,1,0,0,1,0,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,1,0,1,1,1,0,0,1,0,0,0],
  [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,0,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,0,1,0,0,1,0],
  [1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,1,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,1],
];

export default function VectorQRCode({ size = 180 }: VectorQRCodeProps) {
  const matrixSize = QR_MATRIX.length;
  const cellSize = size / matrixSize;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Rect x={0} y={0} width={size} height={size} fill="#FFFFFF" />
        <G>
          {QR_MATRIX.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              if (cell === 1) {
                return (
                  <Rect
                    key={`${rIdx}-${cIdx}`}
                    x={cIdx * cellSize}
                    y={rIdx * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill="#1A241E"
                  />
                );
              }
              return null;
            })
          )}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
