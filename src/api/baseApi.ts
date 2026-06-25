// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import Config from 'react-native-config';

// export const baseApi = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'https://uat.motohelpindia.com/customer/v1',
//   }),

//   tagTypes: ['Auth', 'LoadPosts', 'Vehicle', 'Drivers', 'Map'],

//   endpoints: () => ({}),
// });




import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@store/rootReducer';


export const baseApi = createApi({
  reducerPath: 'baseApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://10.193.77.184:5000/api/v1',

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ['Auth', 'LoadPosts', 'Vehicle', 'Drivers', 'Map'],
  endpoints: () => ({}),
});