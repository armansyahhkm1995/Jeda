import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../ui/Typography';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { useCheckinStore } from '../../store/useCheckinStore';
import { generatePolaInsight } from '../../utils/analytics';

export interface WeeklyInsightCardProps {
  summary?: any;
  customInsight?: string;
}

export default function WeeklyInsightCard({ customInsight }: WeeklyInsightCardProps) {
  const history = useCheckinStore((s) => s.history);
  const insightText = customInsight || generatePolaInsight(history);

  return (
    <View style={styles.card}>
      <Typography variant="bodyLarge" style={styles.title}>
        Pola yang mulai terlihat ✨
      </Typography>

      <Typography variant="body" style={styles.content}>
        {insightText}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.2,
    borderColor: '#EAE7E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E2522',
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
    color: '#3E342B',
  },
});
