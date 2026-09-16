import { requireNativeComponent, ViewStyle } from 'react-native';

export interface CustomerMapViewProps {
  style?: ViewStyle;

  /** "SELECT" (booking screen — own location + preview route) or
   * "TRACKING" (live tracking screen — driver marker + live route). */
  mode: 'SELECT' | 'TRACKING';

  pickupLatitude?: number;
  pickupLongitude?: number;

  deliveryLatitude?: number;
  deliveryLongitude?: number;

  /** TRACKING mode only — the driver's reported position. */
  vehicleLatitude?: number;
  vehicleLongitude?: number;
  vehicleHeading?: number;

  /** TRACKING mode only — drives which leg (pickup/delivery) the native
   * view routes/cameras toward, same values as driver.tripStatus. */
  tripStatus?: string | null;
}

const CustomerMapView = requireNativeComponent<CustomerMapViewProps>('CustomerMapView');

export default CustomerMapView;
