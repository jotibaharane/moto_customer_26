import { baseApi } from '@api/baseApi';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import rootReducer from './rootReducer';
import { paymentApi } from '@api/paymentApi';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware, paymentApi.middleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
