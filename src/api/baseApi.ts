import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Config from 'react-native-config';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: Config.API_URL,
  }),

  tagTypes: ['Auth', 'LoadPosts', 'Vehicle', 'Drivers', 'Map'],

  endpoints: () => ({}),
});
