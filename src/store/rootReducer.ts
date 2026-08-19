import { baseApi } from '@api/baseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import { createTransform, persistReducer } from 'redux-persist';
import authReducer from './slices/Auth/authSlice';
import bookingSlice from './slices/Booking/bookingSlice';
import customerSocketReducer from './slices/customerSocket/customerSocketSlice';
import mapSlice from './slices/map/mapSlice';
import paymentSlice from './slices/payment/paymentSlice';
// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['auth', 'map',"tracking"], // only persist auth
// };

// Remove isLogin before saving
const authTransform = createTransform(
  (inboundState: any) => {
    if (!inboundState) return inboundState;

    const { isLogin, ...rest } = inboundState;

    return rest;
  },

  (outboundState: any) => {
    return {
      ...outboundState,
      isLogin: false,
    };
  },

  {
    whitelist: ['auth'],
  },
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'map', 'tracking'],
  transforms: [authTransform],
};

const rootReducer = combineReducers({
  auth: authReducer,
  payment: paymentSlice,
  booking: bookingSlice,
  map: mapSlice,
  customerSocket: customerSocketReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default persistReducer(persistConfig, rootReducer as any);
export type RootState = ReturnType<typeof rootReducer>;
