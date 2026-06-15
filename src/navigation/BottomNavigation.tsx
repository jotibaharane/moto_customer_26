import { useGetLoadPostsQuery } from '@api/Mutations';
import MyTabBar from '@components/NavigationComponents/CustomBottomTab';
import DashboardScreen from '@modules/BookingConfirmation/Dashboard';
import ReportingScreen from '@modules/ReportingAndLoading/Reporting';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@store/rootReducer';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { navigate } from './NavigationService';
import Profile from '@modules/Profile';

const Tab = createBottomTabNavigator();

function BottomNavigation() {
  const { CustomerID } = useSelector((state: RootState) => state?.auth);
  const { DriverID } = useSelector((state: RootState) => state?.booking);
  const { data } = useGetLoadPostsQuery(
    { CustomerID: CustomerID! },
    { skip: !CustomerID },
  );

  const trips = data?.data ?? [];
  useEffect(() => {
    if (trips.length > 0 && !DriverID) {
      navigate('BottomNavigation', { screen: 'New Load' });
    }
  }, [trips]);

  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
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
export default BottomNavigation;
