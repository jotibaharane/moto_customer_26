import { RootState } from '@store/rootReducer';
import { Phone, User } from 'lucide-react-native';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from '../reporting.style';

const BottomCard = () => {
  const { driverMobile, distance_km, eta_minutes, loadId } = useSelector(
    (state: RootState) => state.tracking,
  );
  const handleCall = (phone?: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };
  return (
    <View style={styles.bottomCard}>
      <View style={styles.column}>
        <Text style={styles.label}>Post Id</Text>
        <Text style={styles.value}>{loadId || 'N/A'}</Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.label}>Reach In</Text>
        <Text style={styles.value}>{eta_minutes || 'N/A'} Min</Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.label}>Distance</Text>
        <Text style={styles.value}>{distance_km} KM</Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.label}>Calling</Text>
        <TouchableOpacity
          style={styles.callRow}
          onPress={() => handleCall(driverMobile)}
        >
          <Phone size={24} />
          <User size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomCard;
