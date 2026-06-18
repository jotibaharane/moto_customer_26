import { navigate } from '@navigation/NavigationService';
import { RootState } from '@store/rootReducer';
import { Bell, Menu } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from '../reporting.style';

const Header = () => {
  const { message } = useSelector((state: RootState) => state.map?.tracking || {message: null});

  return (
    <>
      <View style={styles.header}>
        <View>
          <Menu size={24} />
        </View>
        <View style={styles.headerCenter} />
        <Bell size={24} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.trackingBtn}
          onPress={() => navigate('LiveTrackingScreen')}
        >
          <Text style={styles.trackingText}> + Tracking</Text>
        </TouchableOpacity>
      </View>
      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.headerText}>{message}</Text>
        </View>
      )}
    </>
  );
};

export default Header;
