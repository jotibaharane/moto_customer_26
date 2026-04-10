import Splash from '@assets/Svg/Splash';
import { COLORS } from '@theme/index';
import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './splash.style';

const SplashScreen = () => {
  return (
    <LinearGradient
      colors={[COLORS.primary[300], COLORS.primary[500]]}
      style={styles.container}
    >
      <Splash />
      <Text style={styles.text}>ABC Company</Text>
    </LinearGradient>
  );
};

export default SplashScreen;
