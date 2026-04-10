import { RootState } from '@store/rootReducer';
import { Bell, Menu } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from '../reporting.style';

const Header = () => {
  const { message } = useSelector((state: RootState) => state.tracking);
  console.log({ message });
  return (
    <>
      <View style={styles.header}>
        <View>
          <Menu size={24} />
        </View>

        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>{message}</Text>
          {/* <SlidingHeader
            text={message || '🚚 Live navigation to pickup location'}
          /> */}
        </View>

        <Bell size={24} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity style={styles.trackingBtn}>
          <Text style={styles.trackingText}> + Tracking</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Header;
