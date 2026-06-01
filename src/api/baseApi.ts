import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Config from 'react-native-config';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://uat.motohelpindia.com/customer/v1',
  }),

  tagTypes: ['Auth', 'LoadPosts', 'Vehicle', 'Drivers', 'Map'],

  endpoints: () => ({}),
});
