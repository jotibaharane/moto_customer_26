interface TransformProps {
  driverDetails: any;
  latitude: number;
  longitude: number;
  speed: number;
  apiResponse: any;
  direction: number;
  tripStatus: string;
  status: string;
  heading:any
}

export const transformLocationToPayload = ({
  driverDetails,
  latitude,
  longitude,
  speed,
  apiResponse,
  direction,
  tripStatus,
  status,
  heading
}: TransformProps) => {
  const feature = apiResponse?.features?.[0] ?? {};
  const context = feature?.context || [];

  const find = (key: string) =>
    context.find((c: any) => c.id.includes(key))?.text || '';

  return {
    Address: feature?.place_name || '',
    City: find('place') || find('locality'),
    District: find('district'),
    State: find('region'),
    Pincode: find('postcode'),

    Direction: direction?.toString(),
    Speed: Number(speed || 0).toFixed(2),

    lat: latitude,
    lng: longitude,

    DriverID: driverDetails?.driver_id,
    MobileNo: driverDetails?.contact_no,
    VendorID: driverDetails?.vendor_id,
    VehicleID: 'MH01AB1234',

    Driver_LPStatus: tripStatus,
    Status: status,
    Taluka: find('locality'),
    heading:heading
  };
};
