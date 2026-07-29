export type RootStackParamList = {
  Splash: undefined;
  Loading: undefined;
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  LanguageSelection: undefined;
  MobileLogin: undefined;
  Signup: undefined;
  QRCode: undefined;
  SetMPIN: undefined;
  MPINLogin: undefined;
};

export type BottomTabParamList = {
  Dashboard: undefined;
  CustomerLoadRequestList: undefined;
  Payment: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;

  PaymentOTPGeneration: {
    loadId: string;
  };

  VerifyPaymentOTP: {
    paymentId: string;
  };

  FreightPayment: {
    paymentId: string;
  };
};
