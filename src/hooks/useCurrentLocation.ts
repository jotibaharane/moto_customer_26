import Geolocation from '@react-native-community/geolocation';
import { useEffect, useRef, useState } from 'react';

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<any>(null);
  const watchId = useRef<number | null>(null);
  const init = async () => {
    if (watchId?.current !== null) {
      return;
    }

    // 1. Get current location immediately
    Geolocation.getCurrentPosition(
      position => {
        console.log('Initial Location:', position.coords);
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      error => {
        console.log('Initial Location Error:', error);
      },
    );

    // 2. Listen for location updates
    watchId.current = Geolocation.watchPosition(
      position => {
        console.log('Location Updated:', position.coords);
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      error => {
        console.log('Location Error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 3000,
      },
    );
  };

  useEffect(() => {
    init();
    return () => {
      if (watchId?.current !== null) {
        Geolocation.clearWatch(watchId?.current);
        watchId.current = null;
      }
    };
  }, []);
  return location;
};
