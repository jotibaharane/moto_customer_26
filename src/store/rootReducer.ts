import { baseApi } from '@api/baseApi';
import { paymentApi } from '@api/paymentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import authReducer from './slices/Auth/authSlice';
import bookingSlice from './slices/Booking/bookingSlice';
import customerSocketReducer from './slices/customerSocket/customerSocketSlice';
import mapSlice from './slices/map/mapSlice';
import paymentSlice from "./slices/payment/paymentSlice";
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'map',"tracking"], // only persist auth
};

const rootReducer = combineReducers({
  auth: authReducer,
  payment: paymentSlice,
  booking: bookingSlice,
  map: mapSlice,
   customerSocket: customerSocketReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
});

export default persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;
