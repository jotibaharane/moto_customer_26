import Geolocation from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

const requestPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const granted = await requestPermission();
    if (!granted) return;

    /* 🔥 STEP 1: FAST LOCATION (instant) */
    Geolocation.getCurrentPosition(
      pos => {
        console.log('⚡ FAST LOCATION', pos);

        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      err => console.log('Fast error', err),
      {
        enableHighAccuracy: false, // 🔥 FAST
        timeout: 5000,
        maximumAge: 20000,
      },
    );
  };

  return location;
};
