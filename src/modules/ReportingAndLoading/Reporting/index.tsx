// ReportingScreen.tsx

import { RootState } from '@store/rootReducer';
import { COLORS } from '@theme/index';
import { handleCall } from '@utils/helperfunctions.utils';
import { Phone, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import { styles } from './reporting.style';

import { InputOutline } from '@components/Input';
import { navigate } from '@navigation/NavigationService';
import CustomerSocket from '@socket/CustomerSocket';
import MapComponent from './components/MapComponent';

const ReportingScreen = () => {
  const [loadIdForTracking, setLoadIdForTracking] = React.useState<
    string | undefined
  >('');
  const { status, tracking } = useSelector((state: RootState) => state.map);
  const { PaymentStatus, BalanceAmount } = useSelector(
    (state: RootState) => state.payment,
  );
  const { driverMobile, loadId } = tracking || {};

  useEffect(() => {
    if (
      status === 'loaded' ||
      (status === 'reached' && PaymentStatus !== 'FULL' && BalanceAmount !== 0)
    ) {
      navigate('FrightPayment');
    }
  }, [status]);

  useEffect(() => {
    const handleDriverArrivedPickup = (data: any) => {
      Alert.alert('Driver has arrived at pickup location');
    };
    const handleDriverNearPickup = (data: any) => {
      Alert.alert('Driver is near the pickup location');
    };
    const handleDriverNearDelivery = (data: any) => {
      Alert.alert('Driver is near the delivery location');
    };
    const handleDriverArrivedDelivery = (data: any) => {
      Alert.alert('Driver has arrived at delivery location');
    };
    CustomerSocket.driverArrivedPickup(handleDriverArrivedPickup);
    CustomerSocket.nearDriverPickup(handleDriverNearPickup);
    CustomerSocket.nearDriverDelivery(handleDriverNearDelivery);
    CustomerSocket.driverArrivedDelivery(handleDriverArrivedDelivery);
  }, []);

  const handleLoadTracking = async () => {
    try {
      CustomerSocket.trackLoad({
        loadId: loadIdForTracking,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Header />
      <InputOutline
        placeholder="Enter your message"
        value={loadIdForTracking}
        onChangeText={setLoadIdForTracking}
      />
      <TouchableOpacity onPress={handleLoadTracking}>
        <Text>Track Load</Text>
      </TouchableOpacity>
      {/* MAP */}
      <MapComponent />
      {/* ========================= */}
      {/* CALL BUTTON */}
      {/* ========================= */}

      {loadId && (
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall(driverMobile)}
        >
          <View style={styles.callRows}>
            <View style={styles.phoneRotate}>
              <Phone size={36} color={COLORS.primary[500]} />
            </View>

            <View style={styles.userIconWrapper}>
              <User />
            </View>
          </View>

          <Text style={styles.postIdText} numberOfLines={1}>
            Post id {loadId || 'N/A'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ReportingScreen;
