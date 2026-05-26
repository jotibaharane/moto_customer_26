// src/store/slices/bookingSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BookingState,
  IsConfirmed,
  Location,
  VehicleLocation,
} from './bookingSlice.type';

// ✅ Initial state
const initialState: BookingState = {
  current_location: {
    latitude: 0,
    longitude: 0,
  },

  bookingVehicle: undefined,
  isConfirmed: {
    loadstatus: 'waiting',
    DriverID: '',
    loadId: '',
  },
  booking: {
    customerId: '',
    LoadPost_ID: '',
    pickup: '',
    delivery: '',
    vehicle: {
      vehicleType: '',
      approximateWeightKg: '',
      vehicleNo: '',
    },
    load: {
      freight_amount: '',
      paymentMode: '',
      expectedVehicleAvailability: '',
    },
  },
  pickupLocation: {
    latitude: 0,
    longitude: 0,
  },
  dropLocation: {
    latitude: 0,
    longitude: 0,
  },
  avilableVehicles: [],
  DriverID: '',
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: { payload: Location }) => {
      state.current_location = action.payload;
    },
    setPickupLocation: (state, action: { payload: Location }) => {
      state.pickupLocation = action.payload;
    },
    setDropLocation: (state, action: { payload: Location }) => {
      state.dropLocation = action.payload;
    },
    setWeight: (
      state,
      action: { payload: { approximateWeightKg: string } },
    ) => {
      state.booking = {
        ...state.booking,
        vehicle: {
          ...state.booking.vehicle,
          approximateWeightKg: action.payload.approximateWeightKg,
        },
      };
    },
    setLoadPost: (state, action: { payload: { LoadPost_ID: string } }) => {
      state.booking = {
        ...state.booking,
        LoadPost_ID: action.payload.LoadPost_ID,
      };
    },
    setBookingDetails: (
      state,
      action: { payload: BookingState['booking'] },
    ) => {
      state.booking = action.payload;
    },
    setDriverStates(state, action: PayloadAction<IsConfirmed>) {
      state.isConfirmed = action.payload;
    },
    setSelectedVehicle(state, action: PayloadAction<any>) {
      state.booking.vehicle.vehicleType = action.payload?.vehicleType;
      // state.booking.vehicle.vehicleNo = action.payload?.VehicleID;

      state.booking.vehicle.vehicleNo = action.payload?.registration_no;
      state.booking.load = {
        freight_amount: action.payload.freight_amount,
        expectedVehicleAvailability: action.payload.expectedVehicleAvailability,
        paymentMode: action.payload.paymentMode,
      };
      state.DriverID = action.payload.DriverID;
    },
    setBookingVehicle(state, action: PayloadAction<any>) {
      state.bookingVehicle = action.payload;
    },
    setNearbyVehicles: (state, action: PayloadAction<VehicleLocation[]>) => {
      state.avilableVehicles = action.payload;
    },
    resetBooking: () => initialState,
  },
});

export const {
  setCurrentLocation,
  setPickupLocation,
  setDropLocation,
  setBookingDetails,
  setWeight,
  setDriverStates,
  setSelectedVehicle,
  setBookingVehicle,
  resetBooking,
  setNearbyVehicles,
  setLoadPost,
} = bookingSlice.actions;

export default bookingSlice.reducer;
