export type Location = {
  latitude: number;
  longitude: number;
};

export type Vehicle = {
  vehicleType: string;
  approximateWeightKg: string;
  vehicleNo: string;
};

export type Load = {
  freight_amount: string;
  paymentMode: string;
  expectedVehicleAvailability: string;
};

export type BookingDetails = {
  customerId: string;
  LoadPost_ID?: string;
  pickup: any;
  delivery: any;
  vehicle: Vehicle;
  load: Load;
};

export type IsConfirmed = {
  DriverID: string;
  loadId: string;
  loadstatus: 'waiting' | 'accepted' | 'rejected';
};
export type BookingState = {
  current_location: Location;
  booking: BookingDetails;
  pickupLocation: Location;
  dropLocation: Location;
  isConfirmed?: IsConfirmed;
  bookingVehicle?: any;
  avilableVehicles?: VehicleLocation[];
  DriverID?: any;
};

export interface VehicleLocation {
  vehicleid: string;
  registration_no: string;
  vehicleType: string;
  body_type: string;
  VehicleName: string;
  WeightRange: string;

  Lat: number;
  Lng: number;

  DriverID: string;
  MobileNo: string;

  VehicleID: string;
  VendorID: string;

  freight_amount: string;

  paymentMode: string | null;
  expectedVehicleAvailability: string | null;

  LP_Status: string;

  Img: string;

  DistanceKm: number;
}
