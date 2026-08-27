export type SendOtpRequest = {
  mobile: string;
};

export type ValidateOtpRequest = {
  mobile: string;
  otp: string;
  Role: string;
};

export type SendOtpResponse = {
  status: string;
  message: string;
};

export type CustomerDetails = {
  CustomerID: string;
  full_name: string;
  ContactNo: string;
  EmailID: string;
  CustomerType: string;
  Insert_Date: string;
  MPIN_Flag: string;
};
export type ValidateOtpResponse = {
  status: string;
  message: string;
  Customer_Details: CustomerDetails;
};

export type OnboardingRequest = {
  mobile: string;
  fullName: string;
  email: string;
  customerType: string;
  organizationName: string;
  organizationType: string;
};

export type OnboardingResponse = {
  status: string;
  message: string;
  Customer_Details: CustomerDetails;
};
export interface PickupAddress {
  CustomerID: string;
  SenderName: string;
  SenderContactNo: string;
  AddressType: string; // can adjust if needed

  PickupPlotBuilding: string;
  PickupStreetArea: string;
  PickupAddress: string;

  PickupCity: string;
  PickupDistrict: string;
  PickupTaluka: string;
  PickupState: string;
  PickupPincode: string;

  PickupLat: number;
  PickupLng: number;
}

export interface PincodeData {
  Name: string;
  Description: string | null;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
}

export interface PincodeDataResponse {
  status: string;
  message: string;
  data: PincodeData;
}

export interface PincodeDataRequest {
  pincode: string;
}
// Single photo item
export interface DriverPhoto {
  driver_id: string;
  photo_id: string;
  photo_type: string;
  photo_url: string;
  name: string;
  insert_date: string; // ISO date string
  update_date: string; // ISO date string
}

// API response
export interface DriverPhotosResponse {
  status: string;
  message: string;
  data: DriverPhoto[];
}

export interface PaymentTransaction {
  TransactionAmt: number;
  DeviceInfo: string;
  IPAddress: string;
  UPI_ID: string;
  VPA?: string;
  CustomerID: string;
  LoadpostID: string;
  OrderNo?: string;
  RideID?: string;
  TransactionType: 'FULL' | 'PARTIAL';
  TransactionMode: 'CARD' | 'UPI' | 'NETBANKING' | 'CASH';
  TotalAmount: number;
  PaidAmount: number;
  Currency: 'INR' | 'USD' | 'EUR'; // extend if needed
  DriverID: string;
  PaymentStage?: any;
  GatewayResponse?: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface PaymentData {
  LoadPostID: string;
  CustomerID: string;
  PickupContactNumber: string;
  DeliveryContactPerson: string;
  DeliveryContactNumber: string;
  freight_amount: string; // comes as string from API
  paymentMode: string;
  expectedVehicleAvailability: string; // ISO Date string
  Approximate_weight: number;
  VehicleType: string;
  VehicleNo: string;
  master_status: string; // "N" | "Y"
  verification_code: string;
  verify_flag: string; // "N" | "Y"
  insert_date: string;
  update_date: string;
  driver_id: string;
  ShowAmount?: any;
}

export interface PaymentResponse {
  status: string; // "00"
  message: string;
  data: PaymentData[];
}

export interface VerifyPaymentPayload {
  DriverID: string;
  CustomerID: string;
  LoadpostID: string;
}

export type StatusCode = '00' | '01';

export type TransactionType = 'FULL' | 'PARTIAL';

export type TransactionMode = 'Cash' | 'UPI' | 'Card' | 'Online';

export type Currency = 'INR';

export type RefundStatus = 'NA' | 'PENDING' | 'DONE';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentTransactionData {
  CustomerID: string;
  LoadpostID: string;

  TransactionType: TransactionType;
  TransactionMode: TransactionMode;

  TransactionAmt: number;
  TotalAmount: number;
  PaidAmount: number;
  BalanceAmount: number;

  Currency: Currency;

  DriverID: string;

  TransactionDate: string; // ISO
  insert_date: string;
  update_date: string;

  RefundStatus: RefundStatus;
  RefundAmt: number;

  IsActive: number; // 1 | 0
  IsDeleted: number; // 1 | 0

  PaymentGateway: string;
  TransactionID: string;

  PaymentStatus: PaymentStatus;
  TransactionStatus: TransactionStatus;

  UPI_ID: string | null;
  QRCode: string | null;
  VPA: string | null;

  GatewayResponse: string;

  CommissionAmt: number;
  NetAmtToDriver: number;
}

export interface MakePaymentResponse {
  status: StatusCode;
  message: string;
  data: PaymentTransactionData;
}

// export interface CreateLoadRequest {
//   customerId: string;
//   pickup: LoadLocation;
//   delivery: LoadLocation;
//   vehicleType: string;
//   weight: number;
// }

export interface CreateLoadRequest {
  customerId: string;
  width?: string;
  height?: string;
  length?: string;
  // Selected Driver
  selectedDriverId: string;
  driverName?: string;
  driverMobile?: string;

  // Vehicle
  vehicleType: string;
  vehicleNumber?: string;
  vehicleImage?: string;
  weight: number;
  weightRange?: string;

  // Freight
  freightAmount: number;
  distance: number;
  expectedVehicleAvailability: string;

  // Locations
  pickup: LoadLocation;
  delivery: LoadLocation;
}
export interface LoadLocation {
  mapboxId?: string;
  name?: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
  plotBuilding: string;
  streetArea: string;
  contactName?: string;
  contactMobile?: string;
  tag?: LocationTag | string;
}

export type LocationTag = 'HOME' | 'OFFICE' | 'WAREHOUSE' | 'OTHER';
