import { baseApi } from './baseApi';
import {
  DriverPhotosResponse,
  MakePaymentResponse,
  OnboardingRequest,
  OnboardingResponse,
  PaymentResponse,
  PaymentTransaction,
  PickupAddress,
  PincodeDataRequest,
  PincodeDataResponse,
  SendOtpRequest,
  SendOtpResponse,
  ValidateOtpRequest,
  ValidateOtpResponse,
  VerifyPaymentPayload,
} from './type';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: body => ({
        url: '/Customer_SendOtp',
        method: 'POST',
        body,
      }),
    }),

    validateOtp: builder.mutation<ValidateOtpResponse, ValidateOtpRequest>({
      query: body => ({
        url: '/Customer_ValidateOtp',
        method: 'POST',
        body,
      }),
    }),

    onboarding: builder.mutation<OnboardingResponse, OnboardingRequest>({
      query: body => ({
        url: '/Customer_Onboarding',
        method: 'POST',
        body,
      }),
    }),

    setMpin: builder.mutation<any, any>({
      query: body => ({
        url: '/Customer_Set_Mpin',
        method: 'POST',
        body,
      }),
    }),
    mpinLogin: builder.mutation<
      {
        status_code: string;
        message: string;
      },
      {
        CustomerID: string;
        ContactNo: string;
        Customer_MPIN: string;
      }
    >({
      query: body => ({
        url: '/Customer_Login_Mpin',
        method: 'POST',
        body,
      }),
    }),
    createLoadPost: builder.mutation<any, any>({
      query: body => ({
        url: '/Insert_customer_load_post',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LoadPosts'],
    }),
    updateLoadPost: builder.mutation<any, any>({
      query: body => ({
        url: '/update_customer_load_post',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LoadPosts'],
    }),
    getLoadPosts: builder.query<
      any,
      { CustomerID: string; LoadPostID?: string }
    >({
      query: body => ({
        url: '/get_customer_load_post',
        method: 'POST',
        body,
      }),

      providesTags: ['LoadPosts'],
      keepUnusedDataFor: 0,
    }),

    deleteLoadPost: builder.mutation<any, any>({
      query: body => ({
        url: '/delete_customer_load_post',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LoadPosts'],
    }),
    getVehicleLists: builder.query<
      any,
      { weight: number; PickupLat: number; PickupLng: number }
    >({
      query: body => ({
        url: '/get_Vehicle_Details',
        method: 'POST',
        body,
      }),

      providesTags: ['LoadPosts'],
      keepUnusedDataFor: 0,
    }),
    postBookmark: builder.mutation<any, PickupAddress>({
      query: body => ({
        url: '/insert_Customer_Pickup_Address',
        method: 'POST',
        body,
      }),
    }),
    getBookmarks: builder.query<
      any,
      {
        CustomerID: string;
      }
    >({
      query: body => ({
        url: '/get_Customer_Pickup_Address',
        method: 'POST',
        body,
      }),
    }),
    getVehicleImages: builder.query<
      DriverPhotosResponse,
      {
        driver_id: string;
      }
    >({
      query: body => ({
        url: '/get_Vehicle_IMG',
        method: 'POST',
        body,
      }),
    }),
    getPincodeData: builder.mutation<PincodeDataResponse, PincodeDataRequest>({
      query: queryArg => ({
        url: `/pincode`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    getLoads: builder.query<
      any,
      {
        customer_id: string;
        load_id?: string;
      }
    >({
      query: body => ({
        url: '/Cus_get_load_traking',
        method: 'POST',
        body,
      }),
      transformResponse: (response: {
        status: string;
        message: string;
        data: { load_id: string; trip_id: string }[];
      }) => {
        return {
          ...response,
          data: response.data
            .filter(item => item.load_id && item.load_id !== 'NA') // optional: remove invalid entries
            .map(item => ({
              label: item?.trip_id?.trim(),
              value: item?.load_id?.trim(), // or use a code if you have one later
            })),
        };
      },
    }),
    getLoadTraking: builder.query<
      any,
      {
        customer_id: string;
        load_id?: string;
      }
    >({
      query: body => ({
        url: '/Cus_get_load_traking',
        method: 'POST',
        body,
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
  useCreateLoadPostMutation,
  useDeleteLoadPostMutation,
  useGetBookmarksQuery,
  useGetLoadPostsQuery,
  useGetPincodeDataMutation,
  useGetVehicleImagesQuery,
  useGetVehicleListsQuery,
  usePostBookmarkMutation,
  useUpdateLoadPostMutation,
  useGetLoadTrakingQuery,
  useGetLoadsQuery,
} = authApi;
