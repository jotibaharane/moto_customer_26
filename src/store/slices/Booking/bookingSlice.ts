import { CreateLoadRequest } from '@api/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CreateLoadRequest = {
   customerId: '',
   selectedDriverId: '',
   freightAmount: 0,
   expectedVehicleAvailability: '',
   distance: 0,
   vehicleImage: '',
  vehicleNumber: '',
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
setSelectedDriver: (
  state,
  action: PayloadAction<{
    driverId: string;
    vehicleType: string;
    freightAmount: number;
    expectedVehicleAvailability: string;
    vehicleImage: string;
    vehicleNumber: string;
    distance:any
  }>
) => {

  state.selectedDriverId = action.payload.driverId;

  state.vehicleType = action.payload.vehicleType;

  state.freightAmount = action.payload.freightAmount;

  state.expectedVehicleAvailability =
    action.payload.expectedVehicleAvailability;

  state.vehicleImage = action.payload.vehicleImage;

  state.vehicleNumber = action.payload.vehicleNumber;
  state.distance=action.payload.distance
},setDistance: (
  state,
  action: PayloadAction<number>,
) => {

  state.distance = action.payload;

},
    resetBooking: () => initialState,
  },
});

export const {
  setPickup,
  setDelivery,
  setWeight,
  resetBooking,
  setDistance,
  setSelectedDriver
} = bookingSlice.actions;

export default bookingSlice.reducer;