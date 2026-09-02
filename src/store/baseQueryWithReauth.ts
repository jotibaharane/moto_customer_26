import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import Config from 'react-native-config';

import SocketService from '@socket/SocketService';

import { RootState } from './rootReducer';
import { signIn, signOut } from './slices/Auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: Config.API_URL,
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
        url: '/refresh-token',
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

      SocketService.updateAuthToken(response.data.accessToken);

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
