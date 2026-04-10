import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.2.8:9090/customer/v1',
  }),

  tagTypes: ['Auth', 'LoadPosts', 'Vehicle', 'Drivers', 'Map'],

  endpoints: () => ({}),
});
