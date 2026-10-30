import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import JedaProFlow, { ProStep } from '../components/pro/JedaProFlow';

export default function JedaProRoute() {
  const params = useLocalSearchParams<{ step?: string }>();
  const initialStep = (params.step as ProStep) || undefined;

  return <JedaProFlow initialStep={initialStep} />;
}
