
import MyTabBar from '@components/NavigationComponents/CustomBottomTab';
import DashboardScreen from '@modules/BookingConfirmation/Dashboard';
import ReportingScreen from '@modules/ReportingAndLoading/Reporting';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { memo } from 'react';
import Profile from '@modules/Profile';

const Tab = createBottomTabNavigator();

function BottomNavigation() {
  
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        options={{ headerShown: false }}
        component={DashboardScreen}
      />
      <Tab.Screen name="OPS" component={()=><></>} />
      <Tab.Screen
        name="New Load"
        options={{ headerShown: false }}
        component={ReportingScreen}
      />
      <Tab.Screen name="History" component={()=><></>} />
      <Tab.Screen
        name="Profile"
        options={{ headerShown: false }}
        component={Profile}
      />
    </Tab.Navigator>
  );
}
export default memo(BottomNavigation);
