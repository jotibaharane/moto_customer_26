import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HeaderTitle from '@components/NavigationComponents/HeaderTitle';
// import CustomerLoadRequestList from '@modules/load/CustomerLoadRequestList';
// import FreightPayment from '@modules/payment/FreightPayment';
// import Payment from '@modules/payment/Payment';
// import PaymentOTPGeneration from '@modules/payment/PaymentOTPGeneration';
// import VerifyPaymentOTP from '@modules/payment/VerifyPaymentOTP';
// import Profile from '@modules/profile/Profile';
// import DriverSession from '@services/driver-session/DriverSession';
import ReviewBookingScreen from '@modules/BookingConfirmation/ReviewBookingScreen';
import SelectVehicleScreen from '@modules/BookingConfirmation/SelectVehicleScreen';
import VehicleDhalaSizeScreen from '@modules/BookingConfirmation/VehicleDhalaSizeScreen';
import LiveTrackingScreen from '@modules/LiveTracking/LiveTrackingScreen';
import DrawerNavigator from './DrawerNavigator';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Drawer">
      <Stack.Screen
        name="Drawer"
        options={{ headerShown: false }}
        component={DrawerNavigator}
      />

      <Stack.Screen
        name={'ReviewBookingScreen'}
        component={ReviewBookingScreen}
        options={{
          headerTitle: () => (
            <HeaderTitle title="Tripe Sheet/Payment Receipt" />
          ),
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name={'VehicleDhalaSizeScreen'}
        component={VehicleDhalaSizeScreen}
        options={{
          headerTitle: () => <HeaderTitle title="" />,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name={'SelectVehicleScreen'}
        options={{
          headerTitle: () => <HeaderTitle title="Fright Payment" />,
          headerShadowVisible: false,
        }}
        component={SelectVehicleScreen}
      />
      <Stack.Screen
        name={'LiveTrackingScreen'}
        component={LiveTrackingScreen}
        options={{
          headerTitle: () => <HeaderTitle title="LOAD POST POOL" />,
        }}
      />
      {/* <Stack.Screen name={ROUTES.PAYMENT} component={Payment} />
      <Stack.Screen name={ROUTES.PROFILE} component={Profile} /> */}
    </Stack.Navigator>
  );
}
