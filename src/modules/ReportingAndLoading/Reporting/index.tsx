

// ReportingScreen.tsx

import React, { useCallback, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Phone, User } from 'lucide-react-native';

import Header from './components/Header';
import MapComponent from './components/MapComponent';
import { styles } from './reporting.style';
import { COLORS } from '@theme/index';
import { RootState } from '@store/rootReducer';
import { handleCall } from '@utils/helperfunctions.utils';
import { navigate } from '@navigation/NavigationService';
import CustomerSocket from '@socket/CustomerSocket';
import { useGetLoadsQuery } from '@api/query';
import CustomerSocketListener from '@socket/CustomerSocketListener';
import SocketService from '@socket/SocketService';

const ReportingScreen = () => {
  const {
    data: loads,
    refetch,
  } = useGetLoadsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {driver} = useSelector(
    (state: RootState) => state.map,
  );


  const currentLoadId = loads?.data?.[0]?.LoadId;

  /**
   * Refetch whenever screen is focused
   */
  useFocusEffect(
    useCallback(() => {
      refetch();
     
    }, [refetch]),
  );

useEffect(() => {
  const socket = SocketService.getSocket();

  if (!socket) return;

  const track = () => {
    if (!currentLoadId) return;

    CustomerSocket.trackLoad({
      loadId: currentLoadId,
    });
  };

  socket.on("connect", track);

  if (socket.connected) {
    track();
  }

  return () => {
    socket.off("connect", track);
  };
}, [currentLoadId]);



  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <MapComponent />

      {driver?.loadId && (
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall("driverMobile")}
        >
          <View style={styles.callRows}>
            <View style={styles.phoneRotate}>
              <Phone
                size={36}
                color={COLORS.primary[500]}
              />
            </View>

            <View style={styles.userIconWrapper}>
              <User />
            </View>
          </View>

          <Text style={styles.postIdText}>
            Post id {driver?.loadId}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ReportingScreen;