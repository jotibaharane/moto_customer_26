import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Config from 'react-native-config';
export const paymentApi = createApi({
  reducerPath: 'paymentApi', // ✅ different
  baseQuery: fetchBaseQuery({
    baseUrl: Config.PAYMENT_API_URL,
  }),
  tagTypes: ['Auth', 'LoadPosts', 'Vehicle', 'Drivers', 'Map'],
  endpoints: () => ({}),
});
