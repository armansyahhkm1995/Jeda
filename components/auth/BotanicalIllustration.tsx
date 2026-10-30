import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function BotanicalIllustration() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/illustrations/jeda-leaf-logo-transparent.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  logoImage: {
    width: 120,
    height: 175,
  },
});
