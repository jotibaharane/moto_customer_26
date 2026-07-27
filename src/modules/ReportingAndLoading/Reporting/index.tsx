import { useGetLoadsQuery } from '@api/query';
import { useFocusEffect } from '@react-navigation/native';
import CustomerSocket from '@socket/CustomerSocket';
import SocketService from '@socket/SocketService';
import { RootState } from '@store/rootReducer';
import { s, vs } from '@theme/New';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import { styles } from './reporting.style';

const ReportingScreen = () => {
  const { data: loads, refetch } = useGetLoadsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { driver } = useSelector((state: RootState) => state.map);

  const currentLoadId = loads?.data?.[0]?.LoadId;

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
    socket.on('connect', track);
    if (socket.connected) {
      track();
    }
    return () => {
      socket.off('connect', track);
    };
  }, [currentLoadId]);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View
        style={{
          padding: vs(16),
          flex: 1,
          borderRadius: s(30),
          overflow: 'hidden',
        }}
      >
        <MapComponent />
      </View>

      {/* {driver?.loadId && (
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall('driverMobile')}
        >
          <View style={styles.callRows}>
            <View style={styles.phoneRotate}>
              <Phone size={36} color={COLORS.primary[500]} />
            </View>

            <View style={styles.userIconWrapper}>
              <User />
            </View>
          </View>

          <Text style={styles.postIdText} numberOfLines={2}>
            Post id {driver?.loadId}
          </Text>
        </TouchableOpacity>
      )} */}
    </SafeAreaView>
  );
};

export default ReportingScreen;
