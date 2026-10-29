
import MyTabBar from '@components/NavigationComponents/CustomBottomTab';

import DashboardScreen from '@modules/BookingConfirmation/Dashboard';
import Profile from '@modules/Profile';
import ReportingScreen from '@modules/ReportingAndLoading/Reporting';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { memo } from 'react';

const Tab = createBottomTabNavigator();

function BottomNavigation() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
      />

      <Tab.Screen
        name="OPS"
        component={() => null}
      />

      <Tab.Screen
        name="Find Veh"
        component={ReportingScreen}
      />

      <Tab.Screen
        name="History"
        component={() => null}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
}

export default memo(BottomNavigation);
