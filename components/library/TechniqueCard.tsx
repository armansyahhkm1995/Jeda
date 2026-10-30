import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Card from '../ui/Card';
import Typography from '../ui/Typography';
import { Technique } from '../../types';
import { useHaptics } from '../../hooks/useHaptics';

export interface TechniqueCardProps {
  technique: Technique;
  onPress: (technique: Technique) => void;
}

function TechniqueIcon({ iconKey }: { iconKey?: string }) {
  const strokeColor = '#2D5A38';
  switch (iconKey) {
    case 'breath':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"
            stroke={strokeColor}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'foot':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="8" stroke={strokeColor} strokeWidth={1.8} />
          <Circle cx="12" cy="12" r="3" stroke={strokeColor} strokeWidth={1.8} />
        </Svg>
      );
    case 'hand':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3m-4-1V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v7M6 10v2a6 6 0 0 0 6 6h1a6 6 0 0 0 6-6V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2"
            stroke={strokeColor}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'wall':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 4v16M8 8h8M8 12h8M8 16h8M20 4v16"
            stroke={strokeColor}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'shake':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M2 12h2m4-5v10m4-7v4m4-9v14m4-7v2m2-1h2"
            stroke={strokeColor}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'water':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
            stroke={strokeColor}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'sensory':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            stroke={strokeColor}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="12" r="3" stroke={strokeColor} strokeWidth={1.8} />
        </Svg>
      );
    case 'halt':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
            stroke={strokeColor}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    default:
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            stroke={strokeColor}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
  }
}

export default function TechniqueCard({ technique, onPress }: TechniqueCardProps) {
  const { triggerButtonPress } = useHaptics();

  const handlePress = () => {
    triggerButtonPress();
    onPress(technique);
  };

  const suitableText = technique.suitableSignals && technique.suitableSignals.length > 0
    ? technique.suitableSignals.join(', ')
    : 'Dada sesak, Rahang tegang, Jantung berdebar';

  const durationStr = technique.durationLabel || `${technique.durationEstimateMinutes} menit`;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${technique.name}, estimasi durasi ${durationStr}`}
    >
      <Card variant="flat" padding="none" style={styles.card}>
        {/* Top Duration Row (Menggantikan Kuat/Sedang/Ringan) */}
        <View style={styles.topRow}>
          <Typography variant="caption" style={styles.durationHeaderLabel}>
            Estimasi Selesai
          </Typography>

          {/* Badge Durasi Waktu di Kanan Atas */}
          <View style={styles.durationBadge}>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
              <Circle cx="12" cy="12" r="9" stroke="#2D5A38" strokeWidth={2} />
              <Path d="M12 7v5l3 2" stroke="#2D5A38" strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Typography variant="captionMedium" style={styles.durationBadgeText}>
              {durationStr}
            </Typography>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Content Row: Icon + Texts + Chevron */}
        <View style={styles.mainRow}>
          {/* Avatar Icon */}
          <View style={styles.iconCircle}>
            <TechniqueIcon iconKey={technique.iconKey} />
          </View>

          {/* Details Column: Title & Sinyal Tubuh Cocok */}
          <View style={styles.detailsCol}>
            <Typography variant="bodyLarge" style={styles.title}>
              {technique.name}
            </Typography>

            {/* Sinyal Tubuh yang Cocok */}
            <Typography variant="caption" style={styles.signalsText} numberOfLines={2}>
              {suitableText}
            </Typography>
          </View>

          {/* Right Chevron */}
          <View style={styles.chevronCol}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18l6-6-6-6"
                stroke="#8A948C"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>

        {/* Neurobiology Grounding Footer */}
        <View style={styles.neuroFooter}>
          <Typography variant="caption" style={styles.neuroText}>
            🧠 {technique.neuroBio}
          </Typography>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8E1',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  durationHeaderLabel: {
    fontSize: 13,
    color: '#717D74',
    fontWeight: '500',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF5F0',
    borderWidth: 1,
    borderColor: '#D4E2D7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  durationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D5A38',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0ECE4',
    marginBottom: 12,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EDF3EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCol: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
  },
  signalsText: {
    fontSize: 13,
    color: '#717D74',
    lineHeight: 18,
  },
  chevronCol: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },
  neuroFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F2EB',
  },
  neuroText: {
    fontSize: 11,
    color: '#436B4E',
    lineHeight: 15,
  },
});
