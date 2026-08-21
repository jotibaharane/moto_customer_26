import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Coordinates = {
  lat: number;
  lng: number;
};
export interface BookingState {
  loadId: string;
  DriverID: string;
  driverMobile: string;
  distance_km: string;
  eta_minutes: number;
  message: string;
  status?: string;
}

interface LocationDistance {
  distanceKm: number;
  durationMin: number;
  durationText: Text;
}

export interface DriverLocationUpdate {
  status: string;
  loadId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  pickupDistance: LocationDistance;
  deliveryDistance: LocationDistance;
  tripStatus: string;
  updatedAt: string;
  destinationCoordinate: { latitude: any; longitude: any };
  pickupCoordinate: { latitude: any; longitude: any };
}
export interface MapState {
  customer: Coordinates | null;
  pickup: Coordinates | null;
  destination: Coordinates | null;
  driver: DriverLocationUpdate | null;
  tracking?: BookingState;
  status: string;
  message?: string;
}

/* =========================
   INITIAL STATE
========================= */

const initialState: MapState = {
  pickup: null,
  destination: null,
  driver: null,
  customer: null,
  tracking: undefined,
  status: '',
};

/* =========================
   SLICE
========================= */

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCustomerLocation: (state, action: PayloadAction<Coordinates | null>) => {
      state.customer = action.payload;
    },
    setTripDetails: (state, action: PayloadAction<BookingState>) => {
      state.tracking = action.payload;
    },
    setPickup: (state, action: PayloadAction<Coordinates | null>) => {
      state.pickup = action.payload;
    },

    setDestination: (state, action: PayloadAction<Coordinates | null>) => {
      state.destination = action.payload;
    },
    setLPStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setDrivers: (state, action: PayloadAction<DriverLocationUpdate | null>) => {
      state.driver = action.payload;
    },
    setMessageAndDistance(
      state,
      action: PayloadAction<{ distance: any; message: string }>,
    ) {
      if (state.tracking) {
        state.tracking.message = action.payload.message;
        state.tracking.distance_km = action.payload.distance;
      }
    },
    setFromDriver: (
      state,
      action: PayloadAction<{
        distance_km: string;
        eta_minutes: any;
      }>,
    ) => {
      if (state.tracking) {
        state.tracking.distance_km = action.payload.distance_km;
        state.tracking.eta_minutes = action.payload.eta_minutes;
      }
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setDriverData: (
      state,
      action: PayloadAction<Partial<DriverLocationUpdate>>,
    ) => {
      // Only merge defined fields to avoid overwriting required properties with undefined
      if (state.driver && action.payload) {
        const updated: DriverLocationUpdate = { ...state.driver };
        (
          Object.keys(action.payload) as Array<keyof DriverLocationUpdate>
        ).forEach(key => {
          const val = action.payload[key];
          if (val !== undefined) {
            // @ts-ignore assign known key safely
            updated[key] = val as any;
          }
        });
        state.driver = updated;
      }
    },
  },
});

/* =========================
   EXPORTS
========================= */

export const {
  setCustomerLocation,
  setPickup,
  setDestination,
  setDrivers,
  setLPStatus,
  setTripDetails,
  setMessageAndDistance,
  setFromDriver,
  setMessage,
  setDriverData,
} = mapSlice.actions;

export default mapSlice.reducer;
