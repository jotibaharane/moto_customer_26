import { baseApi } from '@api/baseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import authReducer from './slices/Auth/authSlice';
import bookingSlice from './slices/Booking/bookingSlice';
import mapSlice from './slices/map/mapSlice';
import trackingSlice from './slices/tracking/trackingSlice';
import paymentSlice from "./slices/payment/paymentSlice"
import { paymentApi } from '@api/paymentApi';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'map'], // only persist auth
};

const rootReducer = combineReducers({
  auth: authReducer,
  tracking: trackingSlice,
  payment: paymentSlice,
  booking: bookingSlice,
  map: mapSlice,
  [baseApi.reducerPath]: baseApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
});

export default persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;
