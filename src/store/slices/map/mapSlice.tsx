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
export interface MapState {
  customer: Coordinates | null;
  pickup: Coordinates | null;
  destination: Coordinates | null;
  driver: (Coordinates & { heading?: any }) | null;
  tracking?:BookingState;
  status: string
}

/* =========================
   INITIAL STATE
========================= */

const initialState: MapState = {
  pickup: null,
  destination: null,
  driver: null,
  customer: null,
  tracking:undefined,
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
      state.tracking=action.payload;
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
    setDrivers: (
      state,
      action: PayloadAction<(Coordinates & { heading?: any }) | null>,
    ) => {
      state.driver = action.payload;
    },
      setMessageAndDistance(
      state,
      action: PayloadAction<{ distance: any; message: string }>,
    ) {
      if(state.tracking){state.tracking.message = action.payload.message;
      state.tracking.distance_km = action.payload.distance;}
    },
    setFromDriver: (
      state,
      action: PayloadAction<{
        distance_km: string;
        eta_minutes: any;
      }>,
    ) => {
     if(state.tracking){ state.tracking.distance_km = action.payload.distance_km;
      state.tracking.eta_minutes = action.payload.eta_minutes;}
    },
  },
});

/* =========================
   EXPORTS
========================= */

export const { setCustomerLocation, setPickup, setDestination, setDrivers ,setLPStatus,setTripDetails,setMessageAndDistance,setFromDriver} =
  mapSlice.actions;

export default mapSlice.reducer;
