import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookingState {
  loadId: string;
  DriverID: string;
  driverMobile: string;
  distance_km: string;
  eta_minutes: number;
  message: string;
}

/* ================= INITIAL ================= */

const initialState: BookingState = {
  loadId: '',
  DriverID: '',
  driverMobile: '',
  distance_km: '',
  eta_minutes: 0,
  message: '',
};

/* ================= SLICE ================= */

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    /* ✅ FULL REPLACE */
    setFromDriver: (
      state,
      action: PayloadAction<{
        distance_km: string;
        eta_minutes: any;
      }>,
    ) => {
      state.distance_km = action.payload.distance_km;
      state.eta_minutes = action.payload.eta_minutes;
    },
    setTripDetails: (state, action: PayloadAction<BookingState>) => {
      return action.payload;
    },
    setMessageAndDistance(
      state,
      action: PayloadAction<{ distance: any; message: string }>,
    ) {
      state.message = action.payload.message;
      state.distance_km = action.payload.distance;
    },
    /* ✅ PARTIAL UPDATE (recommended for API updates) */
    updateTripDetails: (
      state,
      action: PayloadAction<Partial<BookingState>>,
    ) => {
      Object.assign(state, action.payload);
    },

    /* ✅ RESET */
    resetBooking: () => initialState,
  },
});

export const {
  resetBooking,
  setTripDetails,
  updateTripDetails,
  setMessageAndDistance,
  setFromDriver,
} = trackingSlice.actions;

export default trackingSlice.reducer;
