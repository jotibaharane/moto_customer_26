import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomerDetails {
  userId: string;
  mobile: string;
  role: string;
  isProfileCompleted: boolean;
  accessToken: string;
  refreshToken: string;
  isMPINSet?: boolean;
}

// ✅ Initial state
const initialState: CustomerDetails = {
  accessToken: '',
  isProfileCompleted: false,
  mobile: '',
  refreshToken: '',
  role: '',
  userId: '',
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
    // 🚪 Logout
    signOut: state => {
      return initialState;
    },
  },
});

export const { signIn, signOut, isProfileCompleted } = authSlice.actions;

export default authSlice.reducer;
