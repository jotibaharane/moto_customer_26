import { API_URL } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),

  tagTypes: ['Auth', 'LoadPosts', 'Vehicle', 'Drivers', 'Map'],

  endpoints: () => ({}),
});
