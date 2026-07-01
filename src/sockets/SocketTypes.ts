export interface NearbyDriver {
  driverId: string;
  driverName: string;
  vehicleNo: string;
  latitude: number;
  longitude: number;
  distance: number;
  eta: number;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  lastSeen: number;
}