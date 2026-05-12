import { paymentApi } from './paymentApi';
import {  PaymentResponse, VerifyPaymentPayload } from './type';

export const paymentsApi = paymentApi.injectEndpoints({
  endpoints: builder => ({
  getLoadPayment: builder.query<PaymentResponse, VerifyPaymentPayload>({
      query: queryArg => ({
        url: `/get_load_Payment`,
        method: 'POST',
        body: queryArg,
      }),
    }),
  }),
});

export const { useGetLoadPaymentQuery } = paymentsApi;
