import BackButton from '@components/NavigationComponents/BackButton';
import HeaderTitle from '@components/NavigationComponents/HeaderTitle';
import ReviewBookingScreen from '@modules/BookingConfirmation/ReviewBookingScreen';
import SelectVehicleScreen from '@modules/BookingConfirmation/SelectVehicleScreen';
import VehicleDhalaSizeScreen from '@modules/BookingConfirmation/VehicleDhalaSizeScreen';
import LiveTrackingScreen from '@modules/LiveTracking/LiveTrackingScreen';
import MpinLogin from '@modules/Mpin/MpinLogin';
import SetMPINScreen from '@modules/Mpin/SetMPIN';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootState } from '@store/rootReducer';
import { COLORS } from '@theme/index';
import React, { memo, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import BottomNavigation from './BottomNavigation';

const Stack = createNativeStackNavigator();

const UserNavigation = () => {
  const MPIN_Flag = useSelector(
    (state: RootState) => state.auth.isMPINSet,
    shallowEqual,
  );

  const initialRouteName = useMemo(() => {
    return MPIN_Flag ? 'MpinLogin' : 'SetMPIN';
  }, [MPIN_Flag]);

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      {/* BOTTOM TAB */}
      <Stack.Group
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.white[500],
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>

      {/* MAIN SCREENS */}
      <Stack.Group
        screenOptions={({ navigation }: any) => ({
          headerLeft: () => <BackButton navigation={navigation} />,
          headerShadowVisible: false,
        })}
      >
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
        <Stack.Screen
          name="SetMPIN"
          component={SetMPINScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default memo(UserNavigation);
