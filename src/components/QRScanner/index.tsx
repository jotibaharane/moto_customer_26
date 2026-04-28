import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

const QRScanner = ({ onScan }: { onScan?: (val: string) => void }) => {
  const { hasPermission, requestPermission } = useCameraPermission();

  // ✅ get back camera properly
  const device = useCameraDevice('back');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  // ❌ if no camera available
  if (device == null) {
    return (
      <View>
        <Text>No Camera Device Found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Camera
        style={{ width: 158, height: 151, alignSelf: 'center', marginTop: 20 }}
        device={device}
        isActive={true}
      />
    </View>
  );
};

export default QRScanner;
