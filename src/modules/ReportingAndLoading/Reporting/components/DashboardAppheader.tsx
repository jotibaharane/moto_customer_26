import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Menu} from 'lucide-react-native';

interface Props {
  ClientName?: string;
  CompanyName?: string;
  onMenuPress?: () => void;
}

export default function DashboardAppHeader({
  ClientName = 'Rohit Sharma',
  CompanyName = '',
  onMenuPress,
}: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>

        {/* Left - Menu */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onMenuPress}
          style={styles.menuButton}>
          <Menu
            size={28}
            color="#FFFFFF"
            strokeWidth={2}
          />
        </TouchableOpacity>

        {/* Center - Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            MOTOHELP
          </Text>
          <View style={styles.logoUnderline} />
        </View>

        {/* Right - Client ID */}
        <View style={styles.clientContainer}>
          <Text
            numberOfLines={1}
            style={styles.clientText}>
            client id
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#355C97',
  },

  container: {
    height: 64,
    backgroundColor: '#355C97',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
  },

  /* ---------------------------------
     MENU
  ---------------------------------- */

  menuButton: {
    width: 40,
    height: 40,

    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  /* ---------------------------------
     MOTOHELP LOGO
  ---------------------------------- */

  logoContainer: {
    position: 'absolute',

    left: 0,
    right: 0,

    alignItems: 'center',
    justifyContent: 'center',

    pointerEvents: 'none',
  },

  logoText: {
    color: '#FFFFFF',

    fontSize: 27,
    fontWeight: '900',

    letterSpacing: -1.2,
  },

  logoUnderline: {
    width: 88,
    height: 2,

    backgroundColor: '#FFFFFF',

    marginTop: -2,
  },

  /* ---------------------------------
     CLIENT ID
  ---------------------------------- */

  clientContainer: {
    marginLeft: 'auto',

    justifyContent: 'center',
    alignItems: 'flex-end',

    maxWidth: 100,
  },

  clientText: {
    color: '#FFFFFF',

    fontSize: 16,
    fontWeight: '700',

    textTransform: 'lowercase',
  },
});