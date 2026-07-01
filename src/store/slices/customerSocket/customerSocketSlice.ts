import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DriverStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface NearbyDriver {
  driverId: string;
  driverName?: string;
  vehicleNo?: string;

  latitude: number;
  longitude: number;

  distance?: number;
  eta?: number;

  status: DriverStatus;

  heading?: number;
  speed?: number;

  lastSeen: number;
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

  nearbyDrivers: NearbyDriver[];

  selectedDriver: NearbyDriver | null;

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
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },

    setWatchingRadius(state, action: PayloadAction<number>) {
      state.watchingRadius = action.payload;
    },

    setNearbyDrivers(state, action: PayloadAction<NearbyDriver[]>) {
      state.nearbyDrivers = action.payload;
    },

    updateDriver(state, action: PayloadAction<NearbyDriver>) {
      const index = state.nearbyDrivers.findIndex(
        item => item.driverId === action.payload.driverId,
      );

      if (index !== -1) {
        state.nearbyDrivers[index] = {
          ...state.nearbyDrivers[index],
          ...action.payload,
        };
      } else {
        state.nearbyDrivers.push(action.payload);
      }

      state.nearbyDrivers.sort(
        (a, b) => (a.distance ?? 9999) - (b.distance ?? 9999),
      );
    },

    updateDriverStatus(
      state,
      action: PayloadAction<{
        driverId: string;
        status: DriverStatus;
      }>,
    ) {
      const driver = state.nearbyDrivers.find(
        item => item.driverId === action.payload.driverId,
      );

      if (driver) {
        driver.status = action.payload.status;
        driver.lastSeen = Date.now();
      }
    },

    removeDriver(state, action: PayloadAction<string>) {
      state.nearbyDrivers = state.nearbyDrivers.filter(
        item => item.driverId !== action.payload,
      );

      if (state.selectedDriver?.driverId === action.payload) {
        state.selectedDriver = null;
      }
    },

    removeExpiredDrivers(state) {
      const now = Date.now();

      state.nearbyDrivers = state.nearbyDrivers.filter(
        item => now - item.lastSeen <= 15000,
      );

      if (
        state.selectedDriver &&
        now - state.selectedDriver.lastSeen > 15000
      ) {
        state.selectedDriver = null;
      }
    },

    clearNearbyDrivers(state) {
      state.nearbyDrivers = [];
      state.selectedDriver = null;
    },

    selectDriver(state, action: PayloadAction<NearbyDriver>) {
      state.selectedDriver = action.payload;
    },

    clearSelectedDriver(state) {
      state.selectedDriver = null;
    },

    setActiveTrip(state, action: PayloadAction<ActiveTrip>) {
      state.activeTrip = action.payload;
    },

    updateActiveTrip(state, action: PayloadAction<Partial<ActiveTrip>>) {
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
  updateDriverStatus,
  removeDriver,
  removeExpiredDrivers,
  clearNearbyDrivers,
  selectDriver,
  clearSelectedDriver,
  setActiveTrip,
  updateActiveTrip,
  clearActiveTrip,
  resetCustomerSocketState,
} = customerSocketSlice.actions;

export default customerSocketSlice.reducer;