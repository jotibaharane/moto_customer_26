import { CustomerDetails } from '@api/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ✅ Initial state
const initialState: CustomerDetails = {
  ContactNo: '',
  CustomerID: '',
  CustomerType: '',
  EmailID: '',
  full_name: '',
  Insert_Date: '',
  MPIN_Flag: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    // 🔐 Login
    signIn: (state, action: PayloadAction<CustomerDetails>) => {
      return action.payload;
    },

    // 🚪 Logout
    signOut: state => {
      return initialState;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;
