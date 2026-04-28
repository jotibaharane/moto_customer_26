import { PermissionsAndroid, Platform } from 'react-native';

class PermissionService {
  /* ---------------- LOCATION ---------------- */

  async requestLocation(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    return (
      granted['android.permission.ACCESS_FINE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.ACCESS_COARSE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }

  /* ---------------- CAMERA ---------------- */

  async requestCamera(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  /* ---------------- STORAGE ---------------- */

  async requestStorage(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]);

    return Object.values(granted).every(
      g => g === PermissionsAndroid.RESULTS.GRANTED,
    );
  }

  /* ---------------- ALL (optional) ---------------- */

  async requestAppStartupPermissions() {
    await this.requestLocation();
  }
}

export default new PermissionService();
