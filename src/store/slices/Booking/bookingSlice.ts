import { CreateLoadRequest } from '@api/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CreateLoadRequest = {
  customerId: '',
  pickup: {
    name: '',
    fullAddress: '',
    latitude: 0,
    longitude: 0,
    plotBuilding: '',
    streetArea: '',
    contactName: '',
    contactMobile: '',
    tag: '',
  },
  delivery: {
    name: '',
    fullAddress: '',
    latitude: 0,
    longitude: 0,
    plotBuilding: '',
    streetArea: '',
    contactName: '',
    contactMobile: '',
    tag: '',
  },
  vehicleType: '',
  weight: 0,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setPickup: (
      state,
      action: PayloadAction<{ pickup: CreateLoadRequest['pickup'] }>
    ) => {
      state.pickup = action.payload.pickup;
    },

    setDelivery: (
      state,
      action: PayloadAction<{ delivery: CreateLoadRequest['delivery'] }>
    ) => {
      state.delivery = action.payload.delivery;
    },

    setWeight: (
      state,
      action: PayloadAction<{ weight: string }>
    ) => {
      state.weight = Number(action.payload.weight);
    },

    resetBooking: () => initialState,
  },
});

export const {
  setPickup,
  setDelivery,
  setWeight,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;