import React, { useEffect } from 'react';
import { Camera, useCameraPermission } from 'react-native-vision-camera';

const QRScanner = ({ onScan }: { onScan?: (val: string) => void }) => {
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  return <Camera style={{ flex: 1 }} isActive={true} device="back" />;
};

export default QRScanner;
