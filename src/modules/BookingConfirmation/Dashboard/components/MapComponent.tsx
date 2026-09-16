import CustomerMapView from '@components/CustomerMapView';
import { RootState } from '@store/rootReducer';
import { setCurrentLocation } from '@store/slices/Auth/authSlice';
import React, { memo, useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from '../Dashboard.style';

/**
 * Single persistent native map (see android/app/src/main/java/com/
 * moto_customer/map/CustomerMapView.kt) — replaces the previous
 * @rnmapbox/maps JS tree. Camera framing, the own-location puck, the
 * preview route between pickup/drop, and the recenter button are all
 * native now; this component only supplies booking coordinates and
 * forwards the native location fix into Redux.
 */
const MapComponent = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'CustomerMapLocationUpdate',
      (event: { latitude: number; longitude: number; heading: number }) => {
        dispatch(
          setCurrentLocation({ lat: event.latitude, lng: event.longitude }),
        );
      },
    );

    return () => subscription.remove();
  }, [dispatch]);

  return (
    <View style={styles.mapContainer}>
      <CustomerMapView
        style={mapComponentStyles.map}
        mode="SELECT"
        pickupLatitude={booking?.pickup?.latitude}
        pickupLongitude={booking?.pickup?.longitude}
        deliveryLatitude={booking?.delivery?.latitude}
        deliveryLongitude={booking?.delivery?.longitude}
      />
    </View>
  );
};

const mapComponentStyles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default memo(MapComponent);
