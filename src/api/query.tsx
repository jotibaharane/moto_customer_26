import { baseApi } from './baseApi';

export const authApiQuery = baseApi.injectEndpoints({
  endpoints: builder => ({
    getSearchLocation: builder.query<
      any,
      { search: string; latitude?: number; longitude?: number }
    >({
      query: body => ({
        url: '/location/search',
        params: body,
      }),
    }),
    getSavedLocation: builder.query<any, void>({
      query: () => `/load/saved-addresses`,
    }),
    getAddressByTag: builder.query<any, { tag: string }>({
      query: body => ({
        url: '/load/address-by-tag',
        params: body,
      }),
    }),
    getAddressLabels: builder.query<any, void>({
      query: () => `/load/address-labels`,
    }),
    getLoads: builder.query<any, void>({
      query: () => `/load/loads`,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSearchLocationQuery,
  useGetSavedLocationQuery,
  useGetAddressByTagQuery,
  useGetAddressLabelsQuery,
  useGetLoadsQuery,
} = authApiQuery;
