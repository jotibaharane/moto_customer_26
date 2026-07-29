import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomerDetails {
  userId: string;
  mobile: string;
  role: string;
  isProfileCompleted: boolean;
  accessToken: string;
  refreshToken: string;
  isMPINSet?: boolean;
  isLogin: boolean;
}

// ✅ Initial state
const initialState: CustomerDetails = {
  accessToken: '',
  isProfileCompleted: false,
  mobile: '',
  refreshToken: '',
  role: '',
  userId: '',
  isLogin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    signIn: (state, action: PayloadAction<CustomerDetails>) => {
      return { ...state, ...action.payload };
    },
    isProfileCompleted: (state, action: PayloadAction<boolean>) => {
      state.isProfileCompleted = action.payload;
    },
    login: (state, action: PayloadAction<void>) => {
      state.isLogin = true;
    },
    logout: (state, action: PayloadAction<void>) => {
      state.isLogin = false;
    },
    // 🚪 Logout
    signOut: state => {
      return initialState;
    },
  },
});

export const { signIn, signOut, isProfileCompleted, login, logout } =
  authSlice.actions;

export default authSlice.reducer;
