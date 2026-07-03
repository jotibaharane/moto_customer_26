// ReportingScreen.tsx

import { RootState } from '@store/rootReducer';
import { COLORS } from '@theme/index';
import { handleCall } from '@utils/helperfunctions.utils';
import { Phone, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import { styles } from './reporting.style';

import { navigate } from '@navigation/NavigationService';
import MapComponent from './components/MapComponent';

const ReportingScreen = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Header />

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
