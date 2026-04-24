import ReviewBookingScreen from '@modules/BookingConfirmation/ReviewBookingScreen';
import SelectVehicleScreen from '@modules/BookingConfirmation/SelectVehicleScreen';
import VehicleDhalaSizeScreen from '@modules/BookingConfirmation/VehicleDhalaSizeScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '@theme/index';
import React from 'react';

import BackButton from '@components/NavigationComponents/BackButton';
import HeaderTitle from '@components/NavigationComponents/HeaderTitle';
import MPINHeader from '@components/NavigationComponents/MPINHeader';
import LiveTrackingScreen from '@modules/LiveTracking/LiveTrackingScreen';
import ConfirmMPINScreen from '@modules/Mpin/ConfirmMPIN';
import MpinLogin from '@modules/Mpin/MpinLogin';
import SetMPINScreen from '@modules/Mpin/SetMPIN';
import FrightPayment from '@modules/Payment';
import { RootState } from '@store/rootReducer';
import { useSelector } from 'react-redux';
import BottomNavigation from './BottomNavigation';

const Stack = createNativeStackNavigator();

const UserNavigation = () => {
  const customer = useSelector((state: RootState) => state.auth);

  const initialRouteName =
    customer?.MPIN_Flag === 'Y' ? 'MpinLogin' : 'SetMPIN';

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Group
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.white[500] },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
          options={{ headerShown: false }}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={({ navigation }) => ({
          headerLeft: () => <BackButton navigation={navigation} />,
          headerShadowVisible: false,
        })}
      >
        <Stack.Screen
          name="MpinLogin"
          options={{
            headerTitle: '',
          }}
          component={MpinLogin}
        />
        <Stack.Screen
          name="ReviewBookingScreen"
          component={ReviewBookingScreen}
          options={{
            headerTitle: () => <HeaderTitle title="Review Booking" />,
          }}
        />

        <Stack.Screen
          name="VehicleDhalaSizeScreen"
          component={VehicleDhalaSizeScreen}
          options={{
            headerTitle: () => <HeaderTitle title="Vehicle Dhala Size" />,
          }}
        />

        <Stack.Screen
          name="FrightPayment"
          component={FrightPayment}
          options={{
            headerTitle: () => <HeaderTitle title="Fright Payment" />,
          }}
        />

        <Stack.Screen
          name="SelectVehicleScreen"
          component={SelectVehicleScreen}
          options={{
            headerTitle: () => <HeaderTitle title="Select Vehicle" />,
          }}
        />
        <Stack.Screen
          name="LiveTrackingScreen"
          component={LiveTrackingScreen}
          options={{
            headerTitle: () => <HeaderTitle title="Live Tracking" />,
          }}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={({ navigation }) => ({
          headerLeft: () => <BackButton navigation={navigation} />,
          headerShadowVisible: false,
        })}
      >
        <Stack.Screen
          name="SetMPIN"
          options={{
            headerTitle: () => (
              <MPINHeader subtitle="Enter your 6- digit security PIN" />
            ),
          }}
          component={SetMPINScreen}
        />
        <Stack.Screen
          name="ConfirmMPIN"
          options={{
            headerTitle: () => (
              <MPINHeader subtitle="Confirm your 6- digit security PIN" />
            ),
          }}
          component={ConfirmMPINScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default UserNavigation;
