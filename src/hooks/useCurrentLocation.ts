// import { useGetLocationByLatLngQuery } from '@api/query';
// import Geolocation from '@react-native-community/geolocation';
// import { useEffect, useRef, useState } from 'react';

// export const useCurrentLocation = () => {
//   const [location, setLocation] = useState<any>(null);
//   const { data: curentLocationData } = useGetLocationByLatLngQuery(
//     { latitude: location?.lat, longitude: location?.lng },
//     { skip: !location?.lat || !location?.lng },
//   );

//   const watchId = useRef<number | null>(null);
//   const init = async () => {
//     if (watchId?.current !== null) {
//       return;
//     }

//     // 1. Get current location immediately
//     Geolocation.getCurrentPosition(
//       position => {
//         console.log('Initial Location:', position.coords);
//         setLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       error => {
//         console.log('Initial Location Error:', error);
//       },
//     );

//     // 2. Listen for location updates
//     watchId.current = Geolocation.watchPosition(
//       position => {
//         console.log('Location Updated:', position.coords);
//         setLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       error => {
//         console.log('Location Error:', error);
//       },
//       {
//         enableHighAccuracy: true,
//         distanceFilter: 10,
//         interval: 5000,
//         fastestInterval: 3000,
//       },
//     );
//   };

//   useEffect(() => {
//     init();
//     return () => {
//       if (watchId?.current !== null) {
//         Geolocation.clearWatch(watchId?.current);
//         watchId.current = null;
//       }
//     };
//   }, []);
//   return { location, curentLocationData };
// };

import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useGetLocationByLatLngQuery } from '@api/query';

interface Coordinates {
  lat: number;
  lng: number;
}

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);

  const watchId = useRef<number | null>(null);

  const updateLocation = useCallback((position: GeolocationResponse) => {
    setLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }, []);

  const handleError = useCallback((error: GeolocationError) => {
    console.error('Location Error:', error);
  }, []);

  const {
    data: currentLocationData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetLocationByLatLngQuery(
    {
      latitude: location?.lat ?? 0,
      longitude: location?.lng ?? 0,
    },
    {
      skip: location === null,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    },
  );

  const refreshLocation = useCallback(() => {
    Geolocation.getCurrentPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  }, [handleError, updateLocation]);

  const startWatching = useCallback(() => {
    if (watchId.current !== null) {
      return;
    }

    refreshLocation();

    watchId.current = Geolocation.watchPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      distanceFilter: 10,
      interval: 5000,
      fastestInterval: 3000,
    });
  }, [refreshLocation, updateLocation, handleError]);

  const stopWatching = useCallback(() => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  useEffect(() => {
    startWatching();

    return () => {
      stopWatching();
    };
  }, [startWatching, stopWatching]);

  const address = useMemo(() => {
    return currentLocationData?.data;
  }, [currentLocationData]);

  return {
    // Coordinates
    location,
    latitude: location?.lat,
    longitude: location?.lng,
    hasLocation: !!location,

    // Reverse geocoded address
    address,

    // RTK Query
    currentLocationData,
    isLoading,
    isFetching,
    error,
    refetch,

    // Actions
    refreshLocation,
    startWatching,
    stopWatching,
  };
};
