import { CreateLoadRequest } from '@api/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState extends CreateLoadRequest {
  selectedDriverId: string;

  driverName: string;
  driverMobile: string;

  vehicleType: string;
  vehicleNumber: string;
  vehicleImage: string;

  weightRange: string;

  freightAmount: number;
  expectedVehicleAvailability: string;

  distance: number;
}

const initialState: BookingState = {
  customerId: '',

  selectedDriverId: '',

  driverName: '',
  driverMobile: '',

  vehicleType: '',
  vehicleNumber: '',
  vehicleImage: '',

  weightRange: '',

  freightAmount: 0,
  expectedVehicleAvailability: '',

  distance: 0,

  pickup: {
    name: '',
    fullAddress: '',
    latitude: undefined,
    longitude: undefined,
    plotBuilding: '',
    streetArea: '',
    contactName: '',
    contactMobile: '',
    tag: '',
  },

  delivery: {
    name: '',
    fullAddress: '',
    latitude: undefined,
    longitude: undefined,
    plotBuilding: '',
    streetArea: '',
    contactName: '',
    contactMobile: '',
    tag: '',
  },

  weight: 0,
};