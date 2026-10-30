import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Rect, G, Line } from 'react-native-svg';
import { TechniqueId } from '../../types';

interface ZenHumanIllustrationProps {
  techniqueId: TechniqueId;
  phase: 'A' | 'B' | 'C';
  isActive: boolean;
  circleLabel?: string;
}

export default function ZenHumanIllustration({
  techniqueId,
  phase,
  isActive,
  circleLabel,
}: ZenHumanIllustrationProps) {
  // Animasi pergerakan: hanya aktif di Fase B saat sesi berjalan (isActive)
  const motionAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0.4)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'B' && isActive) {
      // 1. Gerak dinamis halus (napas, dorongan, getaran, pulsa)
      const motionLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(motionAnim, {
            toValue: 1,
            duration: 1100,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(motionAnim, {
            toValue: 0,
            duration: 1100,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );

      // 2. Animasi getaran cepat khusus Body Shaking
      const shakeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ])
      );

      // 3. Rotasi halus untuk Grounding 5-4-3-2-1 & Box Breathing
      const rotateLoop = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      // 4. Denyut gelombang riak konsentris zen
      const rippleLoop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(rippleScale, {
              toValue: 1.07,
              duration: 1200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity, {
              toValue: 0.85,
              duration: 1200,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(rippleScale, {
              toValue: 1,
              duration: 1200,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity, {
              toValue: 0.4,
              duration: 1200,
              useNativeDriver: true,
            }),
          ]),
        ])
      );

      motionLoop.start();
      if (techniqueId === 'body_shaking') shakeLoop.start();
      rotateLoop.start();
      rippleLoop.start();

      return () => {
        motionLoop.stop();
        shakeLoop.stop();
        rotateLoop.stop();
        rippleLoop.stop();
      };
    } else {
      // Fase A (Persiapan) & Fase C (Pelepasan): Diam mematung
      motionAnim.setValue(0);
      shakeAnim.setValue(0);
      rotateAnim.setValue(0);
      rippleScale.setValue(1);
      rippleOpacity.setValue(0.35);
    }
  }, [phase, isActive, techniqueId, motionAnim, shakeAnim, rotateAnim, rippleScale, rippleOpacity]);

  // Interpolasi transformasi gerak
  const pushTranslateX = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4.5], // Dorong ke arah tembok
  });

  const breathScaleY = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.97, 1.05], // Tarik dan hembus napas
  });

  const splashTranslateY = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6], // Percikan air naik ke wajah
  });

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shakeTranslateX = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-3.5, 3.5],
  });


  const strokeColor = '#2F4836';
  const accentGreen = '#2D5A38';
  const propStroke = '#4E6B55';
  const figureFill = 'rgba(45, 90, 56, 0.06)';

  return (
    <View style={styles.container}>
      {/* ─── Concentric Zen Ripple Rings ─── */}
      <Animated.View
        style={[
          styles.rippleContainer,
          {
            transform: [{ scale: rippleScale }],
            opacity: rippleOpacity,
          },
        ]}
      >
        <Svg width={250} height={250} viewBox="0 0 250 250">
          <Circle cx={125} cy={125} r={118} stroke="#E2EDE4" strokeWidth={1.5} fill="none" />
          <Circle cx={125} cy={125} r={105} stroke="#D4E6D7" strokeWidth={1.5} fill="none" />
          <Circle cx={125} cy={125} r={92} stroke="#C4DEC8" strokeWidth={2} fill="none" />
          <Circle cx={125} cy={125} r={80} stroke="#B2D4B7" strokeWidth={2.2} fill="none" />
          <Circle cx={125} cy={125} r={68} fill="#EBF4ED" stroke="#9ECAA4" strokeWidth={2.5} />
        </Svg>
      </Animated.View>

      {/* ─── Karakter & Props Spesifik Setiap Regulasi ─── */}
      <View style={styles.figureStage}>
        {/* 1. WALL PUSH (Mendorong Tembok) */}
        {techniqueId === 'wall_push' && (
          <Animated.View
            style={[
              styles.svgWrapper,
              phase === 'B' ? { transform: [{ translateX: pushTranslateX }] } : {},
            ]}
          >
            <Svg width={210} height={210} viewBox="0 0 200 200">
              {/* Tembok Struktural Tegak di Kanan */}
              <Line x1={158} y1={30} x2={158} y2={175} stroke={propStroke} strokeWidth={3.5} strokeLinecap="round" />
              <Line x1={164} y1={30} x2={164} y2={175} stroke="#A8C9B0" strokeWidth={2} strokeLinecap="round" />
              {/* Garis Tekstur Bata Tembok Minimalis */}
              <Line x1={158} y1={60} x2={164} y2={60} stroke="#A8C9B0" strokeWidth={1.2} />
              <Line x1={158} y1={95} x2={164} y2={95} stroke="#A8C9B0" strokeWidth={1.2} />
              <Line x1={158} y1={130} x2={164} y2={130} stroke="#A8C9B0" strokeWidth={1.2} />

              {phase === 'A' ? (
                // Fase A: Berdiri tegak menghadap tembok, tangan bersiap
                <G>
                  <Circle cx={98} cy={65} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
                  <Path d="M86 85 C86 85 90 125 88 142 C95 144 102 144 108 142 C108 125 110 85 110 85 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
                  <Path d="M104 88 L126 98 L154 94" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
                  <Circle cx={154} cy={94} r={3} fill={strokeColor} />
                  <Line x1={92} y1={142} x2={92} y2={175} stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
                  <Line x1={104} y1={142} x2={104} y2={175} stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
                </G>
              ) : phase === 'B' ? (
                // Fase B: Mencondongkan badan ke depan, mendorong sekuat tenaga
                <G>
                  <Circle cx={106} cy={66} r={12} stroke={strokeColor} strokeWidth={2} fill={figureFill} />
                  <Path d="M92 88 C94 105 84 135 80 146 C88 148 98 147 106 143 C108 130 118 105 118 88 Z" stroke={strokeColor} strokeWidth={2} fill={figureFill} />
                  <Path d="M114 90 L136 102 L156 95" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" fill="none" />
                  <Path d="M108 92 L132 108 L156 103" stroke={strokeColor} strokeWidth={2.2} strokeLinecap="round" fill="none" />
                  <Rect x={155} y={91} width={4} height={16} rx={2} fill={strokeColor} />
                  <Path d="M98 143 L122 175" stroke={strokeColor} strokeWidth={2.2} strokeLinecap="round" fill="none" />
                  <Path d="M80 146 L62 175" stroke={strokeColor} strokeWidth={2.2} strokeLinecap="round" fill="none" />
                  {/* Gelombang Tekanan Kinetik di Tembok */}
                  <Path d="M168 90 Q176 98 168 106" stroke={accentGreen} strokeWidth={2} fill="none" />
                  <Path d="M173 85 Q183 98 173 111" stroke="#9ECAA4" strokeWidth={1.5} fill="none" />
                </G>
              ) : (
                // Fase C: Mundur selangkah, berdiri rileks, tangan menjuntai
                <G>
                  <Circle cx={85} cy={66} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
                  <Path d="M74 85 C74 85 77 125 76 142 C83 144 89 144 96 142 C96 125 98 85 98 85 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
                  <Path d="M74 86 L68 118 L70 138" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
                  <Path d="M98 86 L104 118 L102 138" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
                  <Line x1={80} y1={142} x2={80} y2={175} stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
                  <Line x1={92} y1={142} x2={92} y2={175} stroke={strokeColor} strokeWidth={2} strokeLinecap="round" />
                </G>
              )}
            </Svg>
          </Animated.View>
        )}

        {/* 2. PHYSIOLOGICAL SIGH (Napas Ganda & Alveoli Paru) */}
        {techniqueId === 'physiological_sigh' && (
          <Animated.View
            style={[
              styles.svgWrapper,
              phase === 'B' ? { transform: [{ scaleY: breathScaleY }] } : {},
            ]}
          >
            <Svg width={210} height={210} viewBox="0 0 200 200">
              {/* Duduk di Kursi / Matras Santai */}
              <Line x1={50} y1={155} x2={150} y2={155} stroke="#CADBCF" strokeWidth={2} strokeLinecap="round" />

              {/* Figur Duduk Meditatif */}
              <Circle cx={100} cy={60} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              {/* Rongga Dada & Alveoli Luminous */}
              <Path d="M86 78 C86 78 88 120 86 138 C94 140 106 140 114 138 C112 120 114 78 114 78 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              {/* Tangan Santai di Atas Lutut */}
              <Path d="M86 82 L70 115 L90 128" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
              <Path d="M114 82 L130 115 L110 128" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
              {/* Kaki Bersila Nyaman */}
              <Path d="M72 145 Q100 156 128 145" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />

              {/* Aliran Napas Ganda (Dua Tarikan Masuk & Embusan Panjang Melengkung) */}
              {phase === 'B' ? (
                <G>
                  {/* Tarikan Ganda di Hidung */}
                  <Path d="M96 52 C94 40 84 42 78 46" stroke={accentGreen} strokeWidth={2} strokeLinecap="round" fill="none" />
                  <Path d="M104 52 C106 40 116 42 122 46" stroke={accentGreen} strokeWidth={2} strokeLinecap="round" fill="none" />
                  {/* Embusan Panjang Halus dari Mulut */}
                  <Path d="M100 66 Q100 78 125 76 T150 72" stroke="#5E966B" strokeWidth={2.2} strokeDasharray="3 3" fill="none" />
                  {/* Cahaya Paru-Paru Mengembang */}
                  <Circle cx={94} cy={95} r={8} fill="rgba(78, 150, 95, 0.25)" />
                  <Circle cx={106} cy={95} r={8} fill="rgba(78, 150, 95, 0.25)" />
                </G>
              ) : (
                <G>
                  <Path d="M95 56 Q100 48 105 56" stroke="#9ECAA4" strokeWidth={1.5} fill="none" />
                </G>
              )}
            </Svg>
          </Animated.View>
        )}

        {/* 3. BOX BREATHING (Napas Kotak 4-4-4-4) */}
        {techniqueId === 'box_breathing' && (
          <View style={styles.svgWrapper}>
            <Svg width={210} height={210} viewBox="0 0 200 200">
              {/* Kubus Simetris 4-4-4-4 Melingkupi Karakter */}
              <Rect
                x={42}
                y={32}
                width={116}
                height={116}
                rx={10}
                stroke={phase === 'B' ? accentGreen : '#C4DEC8'}
                strokeWidth={phase === 'B' ? 2.5 : 1.5}
                strokeDasharray={phase === 'B' ? '8 4' : undefined}
                fill="none"
              />

              {/* Tanda Panduan Sisi Kotak */}
              <Line x1={42} y1={32} x2={158} y2={32} stroke="#689E75" strokeWidth={2} />
              <Line x1={158} y1={32} x2={158} y2={148} stroke="#689E75" strokeWidth={2} />
              <Line x1={158} y1={148} x2={42} y2={148} stroke="#689E75" strokeWidth={2} />
              <Line x1={42} y1={148} x2={42} y2={32} stroke="#689E75" strokeWidth={2} />

              {/* Titik Sudut Ritme */}
              <Circle cx={42} cy={32} r={3.5} fill={accentGreen} />
              <Circle cx={158} cy={32} r={3.5} fill={accentGreen} />
              <Circle cx={158} cy={148} r={3.5} fill={accentGreen} />
              <Circle cx={42} cy={148} r={3.5} fill={accentGreen} />

              {/* Figur Duduk Tenang di Tengah Kotak */}
              <Circle cx={100} cy={72} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M88 88 C88 88 90 125 88 138 C96 140 104 140 112 138 C110 125 112 88 112 88 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M88 92 L75 120 L94 130" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
              <Path d="M112 92 L125 120 L106 130" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
              <Path d="M74 142 Q100 152 126 142" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
            </Svg>
          </View>
        )}

        {/* 4. BODY SHAKING (Menggoyangkan Tubuh & Rilis Adrenalin) */}
        {techniqueId === 'body_shaking' && (
          <Animated.View
            style={[
              styles.svgWrapper,
              phase === 'B' ? { transform: [{ translateX: shakeTranslateX }] } : {},
            ]}
          >
            <Svg width={210} height={210} viewBox="0 0 200 200">
              {/* Garis Lantai Terbuka */}
              <Line x1={40} y1={175} x2={160} y2={175} stroke="#C4DEC8" strokeWidth={1.5} strokeLinecap="round" />

              {/* Figur Berdiri Lutut Santai */}
              <Circle cx={100} cy={55} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M88 74 C88 74 91 115 88 135 C96 137 104 137 112 135 C109 115 112 74 112 74 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />

              {/* Lengan Bergetar Mengibas */}
              <Path d="M88 78 L68 110 L56 128" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
              <Path d="M112 78 L132 110 L144 128" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />

              {/* Kaki Agak Ditekuk Memantul */}
              <Path d="M92 135 L88 155 L90 175" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
              <Path d="M108 135 L112 155 L110 175" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />

              {/* Garis Getaran Dinamis (Vibration Waves) di Sekeliling Tubuh */}
              {phase === 'B' && (
                <G>
                  {/* Getaran Tangan Kiri */}
                  <Path d="M48 118 Q42 125 48 132" stroke={accentGreen} strokeWidth={2} fill="none" />
                  <Path d="M42 112 Q36 125 42 138" stroke="#9ECAA4" strokeWidth={1.5} fill="none" />
                  {/* Getaran Tangan Kanan */}
                  <Path d="M152 118 Q158 125 152 132" stroke={accentGreen} strokeWidth={2} fill="none" />
                  <Path d="M158 112 Q164 125 158 138" stroke="#9ECAA4" strokeWidth={1.5} fill="none" />
                  {/* Partikel Pelepasan Beban Stres */}
                  <Circle cx={65} cy={95} r={2} fill={accentGreen} />
                  <Circle cx={135} cy={95} r={2} fill={accentGreen} />
                  <Circle cx={76} cy={140} r={1.5} fill="#9ECAA4" />
                  <Circle cx={124} cy={140} r={1.5} fill="#9ECAA4" />
                </G>
              )}
            </Svg>
          </Animated.View>
        )}

        {/* 5. COLD WATER RESET (Refleks Air Dingin / Wastafel & Es) */}
        {techniqueId === 'cold_water_reset' && (
          <View style={styles.svgWrapper}>
            <Svg width={210} height={210} viewBox="0 0 200 200">
              {/* Wastafel & Mangkuk Air Es Elegan di Bawah */}
              <Path d="M60 148 C60 148 65 170 100 170 C135 170 140 148 140 148 Z" stroke={propStroke} strokeWidth={2.5} fill="#E2EEE4" />
              <Line x1={50} y1={148} x2={150} y2={148} stroke={propStroke} strokeWidth={2.5} strokeLinecap="round" />
              {/* Permukaan Air Dingin Beriak */}
              <Path d="M68 154 Q84 150 100 154 T132 154" stroke="#4C8A60" strokeWidth={1.5} fill="none" />
              {/* Balok Es / Kristal Dingin */}
              <Rect x={80} y={150} width={8} height={8} rx={1.5} stroke="#356E47" strokeWidth={1.2} fill="none" />
              <Rect x={112} y={151} width={7} height={7} rx={1.5} stroke="#356E47" strokeWidth={1.2} fill="none" />

              {/* Figur Membungkuk ke Wastafel Membasuh Wajah */}
              <Circle cx={100} cy={72} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M88 88 C88 95 86 122 84 135 C92 136 108 136 116 135 C114 122 112 95 112 88 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />

              {/* Lengan Menangkup Air ke Wajah */}
              <Path d="M88 92 L76 120 L94 138" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
              <Path d="M112 92 L124 120 L106 138" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />

              {/* Percikan Air Segar ke Area Pipi & Dahi */}
              {phase === 'B' && (
                <Animated.View style={{ transform: [{ translateY: splashTranslateY }] }}>
                  <G>
                    {/* Butiran Air Dingin Melayang Menyentuh Wajah */}
                    <Circle cx={94} cy={74} r={2.5} fill="#2D5A38" />
                    <Circle cx={106} cy={74} r={2.5} fill="#2D5A38" />
                    <Circle cx={100} cy={60} r={2} fill="#4C8A60" />
                    <Circle cx={86} cy={82} r={1.8} fill="#4C8A60" />
                    <Circle cx={114} cy={82} r={1.8} fill="#4C8A60" />
                    <Path d="M92 90 Q100 80 108 90" stroke="#2D5A38" strokeWidth={1.8} strokeLinecap="round" fill="none" />
                  </G>
                </Animated.View>
              )}
            </Svg>
          </View>
        )}

        {/* 6. GROUNDING 5-4-3-2-1 (Panca Indra Sensori) */}
        {techniqueId === 'grounding' && (
          <View style={styles.svgWrapper}>
            {/* 5 Ikon Indra Berputar Mengorbit */}
            <Animated.View style={[styles.orbitLayer, { transform: [{ rotate: spin }] }]}>
              <Svg width={210} height={210} viewBox="0 0 200 200">
                <Circle cx={100} cy={100} r={72} stroke="#C4DEC8" strokeWidth={1.2} strokeDasharray="4 4" fill="none" />
                {/* 5 Node Sensori (Visual, Raba, Suara, Aroma, Rasa) */}
                <Circle cx={100} cy={28} r={7} fill="#EEF5F0" stroke={accentGreen} strokeWidth={1.5} />
                <Circle cx={168} cy={78} r={7} fill="#EEF5F0" stroke={accentGreen} strokeWidth={1.5} />
                <Circle cx={142} cy={158} r={7} fill="#EEF5F0" stroke={accentGreen} strokeWidth={1.5} />
                <Circle cx={58} cy={158} r={7} fill="#EEF5F0" stroke={accentGreen} strokeWidth={1.5} />
                <Circle cx={32} cy={78} r={7} fill="#EEF5F0" stroke={accentGreen} strokeWidth={1.5} />
              </Svg>
            </Animated.View>

            {/* Figur Meditatif Sadar di Pusat Lingkaran */}
            <Svg width={210} height={210} viewBox="0 0 200 200">
              <Circle cx={100} cy={68} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M88 84 C88 84 90 120 88 135 C96 137 104 137 112 135 C110 120 112 84 112 84 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M88 88 L74 115 L92 125" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
              <Path d="M112 88 L126 115 L108 125" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
              <Path d="M72 142 Q100 152 128 142" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
            </Svg>
          </View>
        )}

        {/* 7. NAME IT TO TAME IT (Tangan di Dada & Pelabelan Emosi) */}
        {techniqueId === 'name_it_tame_it' && (
          <View style={styles.svgWrapper}>
            <Svg width={210} height={210} viewBox="0 0 200 200">
              {/* Awan Emosi Halus di Atas Kepala */}
              <Path
                d="M75 36 C68 36 62 42 64 48 C58 50 56 58 60 63 C65 65 135 65 140 63 C144 58 142 50 136 48 C138 42 132 36 125 36 C120 32 110 32 105 35 C100 32 80 32 75 36 Z"
                stroke="#A8C9B0"
                strokeWidth={1.5}
                fill="rgba(235, 244, 237, 0.7)"
              />

              {/* Figur Duduk Bersandar Rileks */}
              <Circle cx={100} cy={66} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M88 84 C88 84 90 125 88 140 C96 142 104 142 112 140 C110 125 112 84 112 84 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />

              {/* TANGAN MENEMPEL DI DADA (Jantung) */}
              <Path d="M88 88 L98 106 L108 102" stroke={strokeColor} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <Circle cx={104} cy={104} r={3.5} fill={accentGreen} />
              {/* Lengan Kanan Santai */}
              <Path d="M112 88 L124 115 L110 128" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
              <Path d="M76 145 Q100 154 124 145" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />

              {/* Gelombang Kehangatan Menyebar dari Dada */}
              {phase === 'B' && (
                <G>
                  <Circle cx={104} cy={104} r={14} stroke={accentGreen} strokeWidth={1.2} strokeDasharray="3 3" fill="none" />
                  <Circle cx={104} cy={104} r={22} stroke="#A8C9B0" strokeWidth={1} strokeDasharray="4 4" fill="none" />
                </G>
              )}
            </Svg>
          </View>
        )}

        {/* 8. HALT CHECK (Pindai 4 Kebutuhan: Lapar, Marah, Sepi, Lelah) */}
        {techniqueId === 'halt_check' && (
          <View style={styles.svgWrapper}>
            <Svg width={210} height={210} viewBox="0 0 200 200">
              {/* 4 Kuadran Simbolik HALT di Sudut */}
              {/* H - Hungry (Piring & Garpu) */}
              <Circle cx={52} cy={48} r={12} fill="#EEF5F0" stroke="#A8C9B0" strokeWidth={1.5} />
              <Path d="M48 44 L48 52 M52 44 L52 52 M56 44 L56 52" stroke={accentGreen} strokeWidth={1.2} />

              {/* A - Angry (Sinyal Petir Reda) */}
              <Circle cx={148} cy={48} r={12} fill="#EEF5F0" stroke="#A8C9B0" strokeWidth={1.5} />
              <Path d="M148 42 L144 48 L152 48 L148 54" stroke={accentGreen} strokeWidth={1.5} strokeLinecap="round" fill="none" />

              {/* L - Lonely (Dua Hati Terhubung) */}
              <Circle cx={148} cy={144} r={12} fill="#EEF5F0" stroke="#A8C9B0" strokeWidth={1.5} />
              <Circle cx={145} cy={144} r={3} stroke={accentGreen} strokeWidth={1.2} />
              <Circle cx={151} cy={144} r={3} stroke={accentGreen} strokeWidth={1.2} />

              {/* T - Tired (Bulan Sabit Tidur) */}
              <Circle cx={52} cy={144} r={12} fill="#EEF5F0" stroke="#A8C9B0" strokeWidth={1.5} />
              <Path d="M50 140 A4 4 0 0 0 54 148 A5 5 0 0 1 50 140 Z" fill={accentGreen} />

              {/* Garis Koneksi Radar ke Pusat Tubuh */}
              <Line x1={64} y1={56} x2={88} y2={85} stroke="#CADBCF" strokeWidth={1} strokeDasharray="2 2" />
              <Line x1={136} y1={56} x2={112} y2={85} stroke="#CADBCF" strokeWidth={1} strokeDasharray="2 2" />
              <Line x1={136} y1={136} x2={112} y2={125} stroke="#CADBCF" strokeWidth={1} strokeDasharray="2 2" />
              <Line x1={64} y1={136} x2={88} y2={125} stroke="#CADBCF" strokeWidth={1} strokeDasharray="2 2" />

              {/* Figur Bersila Kontemplatif di Tengah */}
              <Circle cx={100} cy={66} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M88 84 C88 84 90 120 88 135 C96 137 104 137 112 135 C110 120 112 84 112 84 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M88 88 L74 115 L92 125" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
              <Path d="M112 88 L126 115 L108 125" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
              <Path d="M74 142 Q100 152 126 142" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
            </Svg>
          </View>
        )}

        {/* 9. TEKAN TELAPAK KAKI (Foot Press - Pijakan Gravitasi Bumi) */}
        {techniqueId === 'foot_press' && (
          <View style={styles.svgWrapper}>
            <Svg width={210} height={210} viewBox="0 0 200 200">
              {/* Garis Lantai & Bidang Pijakan Padat */}
              <Line x1={30} y1={168} x2={170} y2={168} stroke={propStroke} strokeWidth={3} strokeLinecap="round" />
              <Line x1={40} y1={174} x2={160} y2={174} stroke="#A8C9B0" strokeWidth={1.5} strokeLinecap="round" />

              {/* Kursi Minimalis Modern */}
              <Line x1={65} y1={120} x2={115} y2={120} stroke="#A8C9B0" strokeWidth={3} strokeLinecap="round" />
              <Line x1={70} y1={120} x2={70} y2={168} stroke="#CADBCF" strokeWidth={2} />

              {/* Figur Duduk Tegak Menekan Telapak Kaki */}
              <Circle cx={95} cy={60} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M85 76 C85 76 88 115 86 122 C94 124 104 124 108 122 C108 115 108 76 108 76 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />

              {/* Kaki Menekuk 90 Derajat Menapak Kuat */}
              <Path d="M86 122 L110 122 L110 166 L124 166" stroke={strokeColor} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <Path d="M96 122 L120 122 L120 166 L134 166" stroke={strokeColor} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />

              {/* Gelombang Tekanan Gravitasi ke Bawah Tanah */}
              {phase === 'B' && (
                <G>
                  <Path d="M102 171 Q120 178 138 171" stroke={accentGreen} strokeWidth={2.2} fill="none" />
                  <Path d="M96 176 Q120 185 144 176" stroke="#9ECAA4" strokeWidth={1.5} fill="none" />
                  {/* Panah Gaya Tekan Gravitasi ke Bawah */}
                  <Line x1={118} y1={148} x2={118} y2={162} stroke={accentGreen} strokeWidth={2} strokeLinecap="round" />
                  <Path d="M114 158 L118 163 L122 158" stroke={accentGreen} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </G>
              )}
            </Svg>
          </View>
        )}

        {/* 10. GENGGAM DAN LEPAS (Grip Release - Otot Tangan) */}
        {techniqueId === 'grip_release' && (
          <View style={styles.svgWrapper}>
            <Svg width={210} height={210} viewBox="0 0 200 200">
              <Circle cx={100} cy={62} r={12} stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />
              <Path d="M88 78 C88 78 90 120 88 135 C96 137 104 137 112 135 C110 120 112 78 112 78 Z" stroke={strokeColor} strokeWidth={1.8} fill={figureFill} />

              {phase === 'B' ? (
                // Fase B: Mengangkat kedua kepalan tangan kuat-kuat lalu melepaskannya
                <G>
                  <Path d="M88 82 L70 102 L80 115" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" fill="none" />
                  <Path d="M112 82 L130 102 L120 115" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" fill="none" />
                  {/* Kepalan Tangan Menggenggam Kuat */}
                  <Circle cx={80} cy={115} r={6} fill={accentGreen} stroke={strokeColor} strokeWidth={1.5} />
                  <Circle cx={120} cy={115} r={6} fill={accentGreen} stroke={strokeColor} strokeWidth={1.5} />
                  {/* Percikan Pelepasan Ketegangan Otot */}
                  <Line x1={70} y1={115} x2={64} y2={115} stroke={accentGreen} strokeWidth={1.8} strokeLinecap="round" />
                  <Line x1={130} y1={115} x2={136} y2={115} stroke={accentGreen} strokeWidth={1.8} strokeLinecap="round" />
                </G>
              ) : (
                // Fase A & C: Telapak Tangan Terbuka Lemas di Atas Paha
                <G>
                  <Path d="M88 82 L72 112 L86 124" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
                  <Path d="M112 82 L128 112 L114 124" stroke={strokeColor} strokeWidth={1.8} strokeLinecap="round" fill="none" />
                  <Circle cx={88} cy={125} r={4} stroke={strokeColor} strokeWidth={1.5} fill="none" />
                  <Circle cx={112} cy={125} r={4} stroke={strokeColor} strokeWidth={1.5} fill="none" />
                </G>
              )}

              <Path d="M76 142 Q100 152 124 142" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" fill="none" />
            </Svg>
          </View>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 4,
  },
  rippleContainer: {
    position: 'absolute',
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  figureStage: {
    width: 210,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrapper: {
    width: 210,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitLayer: {
    position: 'absolute',
    width: 210,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
