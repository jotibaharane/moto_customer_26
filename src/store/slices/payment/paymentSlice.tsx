import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookingState {
  CustomerID: string;
  LoadpostID: string;
  PaymentStatus: string;
  Paid: number;
  BalanceAmount:any
  PaidAmount:any
  PaymentStage:any
  TotalAmount:any
}

/* ================= INITIAL ================= */

const initialState: BookingState = {
  CustomerID: '',
  LoadpostID: '',
  PaymentStatus: '',
  Paid: 0,
  BalanceAmount:0,
  PaidAmount:0,
  PaymentStage:"",
  TotalAmount:0,
};

/* ================= SLICE ================= */

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayment: (state, action: PayloadAction<BookingState>) => {
      return action.payload;
    },
setPaymentStatus:(state, action: PayloadAction<BookingState>) => {
      return {...action.payload,...state};
    },
    /* ✅ RESET */
    resetPayment: () => initialState,
  },
});

export const { resetPayment, setPayment,setPaymentStatus } = paymentSlice.actions;

export default paymentSlice.reducer;