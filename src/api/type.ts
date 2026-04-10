export type SendOtpRequest = {
  mobile_number: string;
};

export type ValidateOtpRequest = {
  mobile_number: string;
  otp: string;
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
  full_name: string;
  mobile_number: string;
  email: string;
  customer_type: 'individual' | 'organization';
  organization_name?: string;
  organization_type?: string;
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
