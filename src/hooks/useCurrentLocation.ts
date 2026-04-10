import Geolocation from '@react-native-community/geolocation';
import { setCustomerLocation } from '@store/slices/map/mapSlice';
import { useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { useDispatch } from 'react-redux';

const requestPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const useCurrentLocation = (cameraRef?: any) => {
  const dispatch = useDispatch();
  const isFirstFix = useRef(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const granted = await requestPermission();
    if (!granted) return;

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, heading } = position.coords;

        /* ✅ REDUX */
        dispatch(setCustomerLocation({ lat: latitude, lng: longitude }));

        /* ✅ CAMERA */
        if (cameraRef?.current) {
          cameraRef.current.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 16,
            pitch: 45,
            heading: heading || 0,
            animationMode: 'easeTo',
            animationDuration: isFirstFix.current ? 0 : 800,
          });
        }

        if (isFirstFix.current) isFirstFix.current = false;
      },
      error => console.log('Location error:', error),
      {
        enableHighAccuracy: true,
      },
    );
  };
};
