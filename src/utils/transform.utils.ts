/* ================= TYPES ================= */

interface Coordinates {
  lat?: number;
  lng?: number;
}

interface LocationInput {
  phone?: string;
  plot?: string;
  street?: string;
  googleAddress?: string;
  name?: string;
  city?: string;
  district?: string;
  taluka?: string;
  state?: string;
  pincode?: string;
  coordinates?: Coordinates;
  consigneeName?: string;
  contactNumber?: string;
  plotOrBuilding?: string;
  streetArea?: string;
}

/* ================= HELPERS ================= */

export const transformCoordinates = (coords?: Coordinates) => {
  if (!coords) return null;

  return {
    lat: Number(coords.lat ?? 0),
    lng: Number(coords.lng ?? 0),
  };
};

/* ================= PICKUP ================= */

export const transformPickup = (pickup?: LocationInput) => {
  if (!pickup) return null;

  return {
    contactNumber: pickup.phone || pickup.contactNumber || '',
    plotOrBuilding: pickup.plot || pickup.plotOrBuilding || '',
    streetArea: pickup.street || pickup.streetArea || '',
    googleAddress: pickup.googleAddress || '',
    city: pickup.city || '',
    district: pickup.district || pickup.city || '',
    taluka: pickup.taluka || pickup.city || '',
    state: pickup.state || '',
    pincode: pickup.pincode || '',
    coordinates: transformCoordinates(pickup.coordinates),
  };
};

/* ================= DELIVERY ================= */

export const transformDelivery = (delivery?: LocationInput) => {
  if (!delivery) return null;

  return {
    consigneeName: delivery.consigneeName || '',
    contactNumber: delivery.contactNumber || '',
    plotOrBuilding: delivery.plotOrBuilding || '',
    streetArea: delivery.streetArea || '',
    googleAddress: delivery.name || delivery.googleAddress || '',
    city: delivery.city || '',
    district: delivery.district || '',
    taluka: delivery.taluka || '',
    state: delivery.state || '',
    pincode: delivery.pincode || '',
    coordinates: transformCoordinates(delivery.coordinates),
  };
};

/* ================= VEHICLE ================= */

export const transformVehicle = (vehicle?: any) => {
  if (!vehicle) return null;

  return {
    vehicleNo: vehicle.vehicleNo || '',
    vehicleType: vehicle.vehicleType || '',
    approximateWeightKg: Number(vehicle.approximateWeightKg || 0),
  };
};

/* ================= LOAD ================= */

export const transformLoad = (load?: any) => {
  if (!load) return null;

  return {
    freight_amount: Number(load.freight_amount || 0),
    paymentMode: load.paymentMode || '',
    expectedVehicleAvailability: load.expectedVehicleAvailability || '',
  };
};

/* ================= MAIN PAYLOAD ================= */

export const transformBookingPayload = (booking: any, customerId: string) => {
  return {
    customerId,
    pickup: transformPickup(booking?.pickup),
    delivery: transformDelivery(booking?.delivery),
    vehicle: transformVehicle(booking?.vehicle),
    load: transformLoad(booking?.load),
  };
};

export const formatCoordinate = (value?: number) => {
  if (typeof value !== 'number') return 0;

  return parseFloat(value.toFixed(5));
};

export const transformSocketLocation = (
  booking: any,
  loadId: string,
  distance: any,
  DriverID: any,
  customerId: any,
) => {
  const pickup = booking?.pickup?.coordinates;
  const delivery = booking?.delivery?.coordinates;

  return {
    loadId: loadId || '',
    pickuplat: formatCoordinate(pickup?.lat),
    pickuplng: formatCoordinate(pickup?.lng),
    deliverylat: formatCoordinate(delivery?.lat),
    deliverylng: formatCoordinate(delivery?.lng),
    Approximate_weight: Number(booking?.vehicle?.approximateWeightKg || 0),
    customerId: customerId,
    DistanceKm: distance?.distanceKm,
    assignType: 'single', // broadcast | single | hybrid
    DriverID,
  };
};
