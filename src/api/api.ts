import { baseApi } from './baseApi';
import {
  OnboardingRequest,
  OnboardingResponse,
  SendOtpRequest,
  ValidateOtpRequest,
} from './type';

export const api = baseApi.injectEndpoints({
  endpoints: builder => ({
    sendOtp: builder.mutation<any, SendOtpRequest>({
      query: body => ({
        url: '/send-otp',
        method: 'POST',
        body,
      }),
    }),

    validateOtp: builder.mutation<any, ValidateOtpRequest>({
      query: body => ({
        url: '/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    onboarding: builder.mutation<OnboardingResponse, OnboardingRequest>({
      query: body => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),

    setMpin: builder.mutation<any, { mpin: string }>({
      query: body => ({
        url: '/create-mpin',
        method: 'POST',
        body,
      }),
    }),

    mpinLogin: builder.mutation<any, { mpin: string }>({
      query: body => ({
        url: '/login-mpin',
        method: 'POST',
        body,
      }),
    }),

    // NOTE: customer-service does not currently expose a profile-update
    // route (only auth/load/location are registered) — this call will
    // 404 until that backend endpoint exists.
    profile: builder.mutation<OnboardingResponse, OnboardingRequest>({
      query: body => ({
        url: '/update_Customer',
        method: 'POST',
        body,
      }),
    }),

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
    getLocationByLatLng: builder.query<
      any,
      { latitude: number; longitude: number }
    >({
      query: body => ({
        url: '/location/reverse',
        params: body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useSendOtpMutation,
  useValidateOtpMutation,
  useOnboardingMutation,
  useSetMpinMutation,
  useMpinLoginMutation,
  useProfileMutation,
  useGetSearchLocationQuery,
  useGetSavedLocationQuery,
  useGetAddressByTagQuery,
  useGetAddressLabelsQuery,
  useGetLoadsQuery,
  useGetLocationByLatLngQuery,
} = api;
