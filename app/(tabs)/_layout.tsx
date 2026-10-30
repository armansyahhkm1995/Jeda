import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

function HomeTabIcon({ color, focused }: { color: any; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinejoin="round"
          fill={focused ? 'rgba(45, 90, 56, 0.1)' : 'none'}
        />
        <Path d="M9 21V12H15V21" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

function LibraryTabIcon({ color, focused }: { color: any; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path
          d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinejoin="round"
          fill={focused ? 'rgba(45, 90, 56, 0.1)' : 'none'}
        />
      </Svg>
    </View>
  );
}

function AnalyticsTabIcon({ color }: { color: any }) {
  return (
    <View style={styles.iconContainer}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M18 20V10M12 20V4M6 20V14"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function ProfileTabIcon({ color, focused }: { color: any; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <Circle
          cx="12"
          cy="7"
          r="4"
          stroke={color}
          strokeWidth={1.8}
          fill={focused ? 'rgba(45, 90, 56, 0.1)' : 'none'}
        />
      </Svg>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FAFAF8',
          borderTopColor: '#EBEBE6',
          borderTopWidth: 1,
          height: 60 + Math.max(insets.bottom, 10),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.brand.primary,
        tabBarInactiveTintColor: '#8A948C',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => <HomeTabIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pustaka"
        options={{
          title: 'Regulasi',
          tabBarIcon: ({ color, focused }) => <LibraryTabIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="analitik"
        options={{
          title: 'Analitik',
          tabBarIcon: ({ color }) => <AnalyticsTabIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => <ProfileTabIcon color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
});
