import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Coordinates = {
  lat: number;
  lng: number;
};

export interface MapState {
  customer: Coordinates | null;
  pickup: Coordinates | null;
  destination: Coordinates | null;
  driver: (Coordinates & { heading?: any }) | null;
}

/* =========================
   INITIAL STATE
========================= */

const initialState: MapState = {
  pickup: null,
  destination: null,
  driver: null,
  customer: null,
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

    setPickup: (state, action: PayloadAction<Coordinates | null>) => {
      state.pickup = action.payload;
    },

    setDestination: (state, action: PayloadAction<Coordinates | null>) => {
      state.destination = action.payload;
    },

    setDrivers: (
      state,
      action: PayloadAction<(Coordinates & { heading?: any }) | null>,
    ) => {
      state.driver = action.payload;
    },
  },
});

/* =========================
   EXPORTS
========================= */

export const { setCustomerLocation, setPickup, setDestination, setDrivers } =
  mapSlice.actions;

export default mapSlice.reducer;
