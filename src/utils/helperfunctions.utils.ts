import { Linking } from 'react-native';

export const handleCall = (driverMobile: any) => {
  if (!driverMobile) return;
  Linking.openURL(`tel:${driverMobile}`);
};
