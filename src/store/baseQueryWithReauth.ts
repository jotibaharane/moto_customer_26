import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { RootState } from './rootReducer';
import { signIn, signOut } from './slices/Auth/authSlice';

const baseQuery = fetchBaseQuery({
  // baseUrl: 'https://stag.motohelpindia.com/api/v1',
  baseUrl: 'http://192.168.1.112:5000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  /**
   * Token expired
   */

  if (result.error?.status === 401) {
    console.log('Refreshing Token...');

    const state = api.getState() as RootState;

    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(signOut());

      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
        body: {
          refreshToken,
        },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const response: any = refreshResult.data;

      api.dispatch(
        signIn({
          ...state.auth,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        }),
      );

      /**
       * Retry Original API
       */
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(signOut());
    }
  }

  return result;
};
