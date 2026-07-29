import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MyTabBar from '@components/NavigationComponents/CustomBottomTab';
import DashboardScreen from '@modules/BookingConfirmation/Dashboard';
import Profile from '@modules/Profile';
import ReportingScreen from '@modules/ReportingAndLoading/Reporting';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <MyTabBar {...props} />}
      initialRouteName="Dashboard"
    >
      <Tab.Screen
        name="Home"
        options={{ headerShown: false }}
        component={DashboardScreen}
      />
      <Tab.Screen name="OPS" component={() => <></>} />
      <Tab.Screen
        name="New Load"
        options={{ headerShown: false }}
        component={ReportingScreen}
      />
      <Tab.Screen name="History" component={() => <></>} />
      <Tab.Screen
        name="Profile"
        options={{ headerShown: false }}
        component={Profile}
      />
    </Tab.Navigator>
  );
}
