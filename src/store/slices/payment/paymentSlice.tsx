import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookingState {
  CustomerID: string;
  LoadpostID: string;
  PaymentStatus: string;
  Paid: number;
}

/* ================= INITIAL ================= */

const initialState: BookingState = {
  CustomerID: '',
  LoadpostID: '',
  PaymentStatus: '',
  Paid: 0,
};

/* ================= SLICE ================= */

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayment: (state, action: PayloadAction<BookingState>) => {
      return action.payload;
    },

    /* ✅ RESET */
    resetPayment: () => initialState,
  },
});

export const { resetPayment, setPayment } = paymentSlice.actions;

export default paymentSlice.reducer;