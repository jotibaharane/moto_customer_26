import { useGetLoadsQuery } from '@api/api';
import { useFocusEffect } from '@react-navigation/native';
import CustomerSocket from '@socket/CustomerSocket';
import SocketService from '@socket/SocketService';
import { RootState } from '@store/rootReducer';
import { setDrivers } from '@store/slices/map/mapSlice';
import { s, vs } from '@theme/New';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import { styles } from './reporting.style';

const ReportingScreen = () => {
  const dispatch = useDispatch();

  const { data: loads, refetch } = useGetLoadsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { driver } = useSelector((state: RootState) => state.map);
  const currentLoad = loads?.data?.[0];
  const currentLoadId = currentLoad?.LoadId;
  const activeLoadId = driver?.loadId ?? currentLoadId;

  /**
   * Kept in a ref so the reconnect listener below always re-joins the
   * currently active load, without having to re-attach the listener
   * (and risk missing a reconnect) every time the load changes.
   */
  const activeLoadIdRef = useRef(activeLoadId);
  activeLoadIdRef.current = activeLoadId;

  /**
   * Once a trip ends, CustomerSocketListener resets `state.map` — but the
   * REST /load/loads list has its own independent cache and only refetches
   * on screen focus (see the useFocusEffect below), so `currentLoad` can
   * keep returning that same just-completed load (and its static pickup/
   * drop address) as data[0] for a while after. Without this, the pickup/
   * drop pins for a finished trip kept showing on the map — the live
   * route/vehicle correctly disappeared (driven by `driver`, which IS
   * cleared), but the markers fall back to `currentLoad`'s coordinates,
   * which weren't. Tracks the specific loadId that just ended so its pins
   * stay suppressed until a genuinely different load takes over — either a
   * fresh `driver.loadId` (live) or, failing that, a refetched, different
   * `currentLoadId` (REST catches up).
   */
  const [dismissedLoadId, setDismissedLoadId] = useState<string | undefined>(
    undefined,
  );
  const previousDriverLoadId = useRef<string | undefined>(driver?.loadId);

  useEffect(() => {
    if (previousDriverLoadId.current && !driver?.loadId) {
      setDismissedLoadId(previousDriverLoadId.current);
    }
    previousDriverLoadId.current = driver?.loadId;
  }, [driver?.loadId]);

  const isDismissedLoad = driver?.loadId
    ? driver.loadId === dismissedLoadId
    : !!currentLoadId && currentLoadId === dismissedLoadId;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  /**
   * Joins the tracking room for `loadId` and immediately seeds the map
   * with the live snapshot the ack returns, instead of waiting for the
   * next GPS ping from the driver.
   */
  const startTracking = useCallback(
    (loadId: string) => {
      CustomerSocket.trackLoad({ loadId })
        .then(response => {
          if (response?.current) {
            dispatch(setDrivers(response.current));
          }
        })
        .catch(() => {});
    },
    [dispatch],
  );

  useEffect(() => {
    const socket = SocketService.getSocket();
    if (!socket || !activeLoadId) return;
    startTracking(activeLoadId);
  }, [activeLoadId, startTracking]);

  /**
   * Socket.IO room membership does not survive a disconnect — a new
   * connection is a new socket.id with no rooms joined. Without this,
   * any drop (background/foreground, brief network loss) silently
   * stops live location updates until the screen is remounted.
   */
  useEffect(() => {
    const socket = SocketService.getSocket();
    if (!socket) return;

    const handleConnect = () => {
      if (activeLoadIdRef.current) {
        startTracking(activeLoadIdRef.current);
      }
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
    };
  }, [startTracking]);

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
        <MapComponent
          pickup={
            isDismissedLoad
              ? null
              : {
                  latitude: currentLoad?.PickupLatitude,
                  longitude: currentLoad?.PickupLongitude,
                }
          }
          delivery={
            isDismissedLoad
              ? null
              : {
                  latitude: currentLoad?.DeliveryLatitude,
                  longitude: currentLoad?.DeliveryLongitude,
                }
          }
        />
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
