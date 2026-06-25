import Geolocation from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';


export const useCurrentLocation = () => {
  const [location, setLocation] = useState<any>(null);

  

  const init = async () => {
    Geolocation.getCurrentPosition(async position => {
      try {
         setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (error) {
        console.log('Location Process Error:', error);
      }
    });
  };
  
useEffect(() => {
    init();
  }, []);
  return location;
};
