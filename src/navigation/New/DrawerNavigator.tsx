import { createDrawerNavigator } from '@react-navigation/drawer';

// import Settings from '@modules/settings/Settings';
import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
      {/* <Drawer.Screen name="Settings" component={Settings} /> */}
    </Drawer.Navigator>
  );
}
