import React, { memo, useCallback, useMemo } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '@store/rootReducer';

import { COLORS } from '@theme/index';

import BackButton from '@components/NavigationComponents/BackButton';
import HeaderTitle from '@components/NavigationComponents/HeaderTitle';
import MPINHeader from '@components/NavigationComponents/MPINHeader';

import BottomNavigation from './BottomNavigation';

import ReviewBookingScreen from '@modules/BookingConfirmation/ReviewBookingScreen';
import SelectVehicleScreen from '@modules/BookingConfirmation/SelectVehicleScreen';
import VehicleDhalaSizeScreen from '@modules/BookingConfirmation/VehicleDhalaSizeScreen';

import LiveTrackingScreen from '@modules/LiveTracking/LiveTrackingScreen';

import ConfirmMPINScreen from '@modules/Mpin/ConfirmMPIN';
import MpinLogin from '@modules/Mpin/MpinLogin';
import SetMPINScreen from '@modules/Mpin/SetMPIN';

import FrightPayment from '@modules/Payment';

const Stack = createNativeStackNavigator();

const ReviewBookingHeader = memo(() => <HeaderTitle title="Review Booking" />);

const VehicleDhalaHeader = memo(() => (
  <HeaderTitle title="Vehicle Dhala Size" />
));

const FrightPaymentHeader = memo(() => <HeaderTitle title="Fright Payment" />);

const SelectVehicleHeader = memo(() => <HeaderTitle title="Select Vehicle" />);

const LiveTrackingHeader = memo(() => <HeaderTitle title="Live Tracking" />);

const SetMPINHeaderMemo = memo(() => (
  <MPINHeader subtitle="Enter your 6-digit security PIN" />
));

const ConfirmMPINHeaderMemo = memo(() => (
  <MPINHeader subtitle="Confirm your 6-digit security PIN" />
));

const UserNavigation = () => {
  // ONLY SELECT REQUIRED VALUE
  const MPIN_Flag = useSelector(
    (state: RootState) => state.auth.MPIN_Flag,
    shallowEqual,
  );

  // MEMOIZE INITIAL ROUTE
  const initialRouteName = useMemo(() => {
    return MPIN_Flag === 'Y' ? 'MpinLogin' : 'SetMPIN';
  }, [MPIN_Flag]);

  // STATIC OPTIONS
  const commonHeaderStyle = useMemo(
    () => ({
      headerStyle: {
        backgroundColor: COLORS.white[500],
      },
      headerShadowVisible: false,
    }),
    [],
  );

  // MEMOIZED SCREEN OPTIONS
  const screenOptions = useCallback(
    ({ navigation }: any) => ({
      headerLeft: () => <BackButton navigation={navigation} />,
      headerShadowVisible: false,
    }),
    [],
  );

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      {/* BOTTOM TAB */}
      <Stack.Group screenOptions={commonHeaderStyle}>
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>

      {/* MAIN SCREENS */}
      <Stack.Group screenOptions={screenOptions}>
        <Stack.Screen
          name="MpinLogin"
          component={MpinLogin}
          options={{
            headerTitle: '',
          }}
        />

        <Stack.Screen
          name="ReviewBookingScreen"
          component={ReviewBookingScreen}
          options={{
            headerTitle: ReviewBookingHeader,
          }}
        />

        <Stack.Screen
          name="VehicleDhalaSizeScreen"
          component={VehicleDhalaSizeScreen}
          options={{
            headerTitle: VehicleDhalaHeader,
          }}
        />

        <Stack.Screen
          name="FrightPayment"
          component={FrightPayment}
          options={{
            headerTitle: FrightPaymentHeader,
          }}
        />

        <Stack.Screen
          name="SelectVehicleScreen"
          component={SelectVehicleScreen}
          options={{
            headerTitle: SelectVehicleHeader,
          }}
        />

        <Stack.Screen
          name="LiveTrackingScreen"
          component={LiveTrackingScreen}
          options={{
            headerTitle: LiveTrackingHeader,
          }}
        />
      </Stack.Group>

      {/* MPIN SCREENS */}
      <Stack.Group screenOptions={screenOptions}>
        <Stack.Screen
          name="SetMPIN"
          component={SetMPINScreen}
          options={{
            headerTitle: SetMPINHeaderMemo,
          }}
        />

        <Stack.Screen
          name="ConfirmMPIN"
          component={ConfirmMPINScreen}
          options={{
            headerTitle: ConfirmMPINHeaderMemo,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default memo(UserNavigation);
