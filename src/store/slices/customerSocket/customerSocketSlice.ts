import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DriverStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';




export type ProviderType = 'DRIVER';

export type OnboardingStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | string;

export type CapacityUnit = 'kg' | string;

export type VehicleType = 'Light' | 'Medium' | 'Heavy' | string;

export type VehicleCategory = 'HGV' | 'MGV' | 'LCV' | string;

export interface Vendor {
  vendorId: string;
  vendorName: string;
  onboardingStatus: OnboardingStatus;
}

export interface Vehicle {
  assignmentId: string;
  cardImage: string | null;

  vehicleId: string;
dhalaHeight:string;
dhalaLength:string;
dhalaWidth:string;
  minLoadingCapacity: number;
  maxLoadingCapacity: number;
  capacityUnit: CapacityUnit;

  vehicleNo: string;
  vehicleType: VehicleType;

  manufacturer: string;
  makerModel: string;

  loadingCapacity: number;
  vehicleGrossWeight: number;

  vehicleCategory: VehicleCategory;
  bodyType: string;

  verified: boolean;
  active: boolean;
  assignmentActive: boolean;
}

export interface DriverLocation {
  driverId: string;

  latitude: number;
  longitude: number;

  heading: number;
  speed: number;

  updatedAt: string;
}

export interface DriverResponse {
  providerType: ProviderType;

  driverId: string;
  profileId: string;

  driverName: string;
  nickName: string;

  verified: boolean;

  capacityKg: number;
  etaMinutes: number;

  vendor: Vendor;
  vehicle: Vehicle;
  location: DriverLocation;

  online: boolean;
}



export interface ActiveTrip {
  tripId?: string;
  loadId?: string;
  driverId?: string;
  customerId?: string;
  status?: string;

  pickup?: string;
  drop?: string;

  fare?: number;
  weight?: number;

  [key: string]: any;
}

interface CustomerSocketState {
  connected: boolean;

  nearbyDrivers: DriverResponse[];

  selectedDriver: DriverResponse | null;

  activeTrip: ActiveTrip | null;

  watchingRadius: number;
}

const initialState: CustomerSocketState = {
  connected: false,

  nearbyDrivers: [],

  selectedDriver: null,

  activeTrip: null,

  watchingRadius: 5,
};
const customerSocketSlice = createSlice({
  name: 'customerSocket',

  initialState,

  reducers: {
    setConnected(
      state,
      action: PayloadAction<boolean>,
    ) {
      state.connected = action.payload;
    },

    setWatchingRadius(
      state,
      action: PayloadAction<number>,
    ) {
      state.watchingRadius = action.payload;
    },

    setNearbyDrivers(
      state,
      action: PayloadAction<DriverResponse[]>,
    ) {
      state.nearbyDrivers = action.payload;
    },

    updateDriver(
      state,
      action: PayloadAction<DriverResponse>,
    ) {
      const driver = action.payload;

      const index = state.nearbyDrivers.findIndex(
        item => item.driverId === driver.driverId,
      );

      if (index === -1) {
        state.nearbyDrivers.push(driver);
        return;
      }

      state.nearbyDrivers[index] = {
        ...state.nearbyDrivers[index],
        ...driver,
        location: {
          ...state.nearbyDrivers[index].location,
          ...driver.location,
        },
        vehicle: {
          ...state.nearbyDrivers[index].vehicle,
          ...driver.vehicle,
        },
      };
    },

    removeDriver(
      state,
      action: PayloadAction<string>,
    ) {
      const driverId = action.payload;

      state.nearbyDrivers = state.nearbyDrivers.filter(
        driver => driver.driverId !== driverId,
      );

      if (state.selectedDriver?.driverId === driverId) {
        state.selectedDriver = null;
      }
    },

    clearNearbyDrivers(state) {
      state.nearbyDrivers = [];
    },

    selectDriver(
      state,
      action: PayloadAction<DriverResponse>,
    ) {
      state.selectedDriver = action.payload;
    },

    clearSelectedDriver(state) {
      state.selectedDriver = null;
    },

    setActiveTrip(
      state,
      action: PayloadAction<ActiveTrip>,
    ) {
      state.activeTrip = action.payload;
    },

    updateActiveTrip(
      state,
      action: PayloadAction<Partial<ActiveTrip>>,
    ) {
      if (state.activeTrip) {
        state.activeTrip = {
          ...state.activeTrip,
          ...action.payload,
        };
      }
    },

    clearActiveTrip(state) {
      state.activeTrip = null;
    },

    resetCustomerSocketState() {
      return initialState;
    },
  },
});

export const {
  setConnected,
  setWatchingRadius,
  setNearbyDrivers,
  updateDriver,
  removeDriver,
  clearNearbyDrivers,
  selectDriver,
  clearSelectedDriver,
  setActiveTrip,
  updateActiveTrip,
  clearActiveTrip,
  resetCustomerSocketState,
} = customerSocketSlice.actions;

export default customerSocketSlice.reducer;