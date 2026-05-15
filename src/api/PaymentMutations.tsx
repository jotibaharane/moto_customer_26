import { paymentApi } from './paymentApi';
import {  MakePaymentResponse, PaymentResponse, PaymentTransaction, VerifyPaymentPayload } from './type';

export const paymentsApi = paymentApi.injectEndpoints({
  endpoints: builder => ({
  getLoadPayment: builder.query<PaymentResponse, VerifyPaymentPayload>({
      query: queryArg => ({
        url: `/get_load_Payment`,
        method: 'POST',
        body: queryArg,
      }),
    }),
      makePayment: builder.mutation<MakePaymentResponse, PaymentTransaction>({
      query: queryArg => ({
        url: `/Payment_pay`,
        method: 'POST',
        body: queryArg,
      }),
    }),
         paymentHistory: builder.mutation<any, {LoadpostID:string}>({
      query: queryArg => ({
        url: `/payment_history`,
        method: 'POST',
        body: queryArg,
      }),
    }),
  }),
  
});

export const { useGetLoadPaymentQuery,useMakePaymentMutation,usePaymentHistoryMutation } = paymentsApi;
