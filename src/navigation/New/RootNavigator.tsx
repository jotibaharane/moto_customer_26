import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '@modules/SplashScreen';
import { RootState } from '@store/rootReducer';
import { useSelector } from 'react-redux';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const customer = useSelector((state: RootState) => state.auth);

  const isLoggedIn = customer?.isLogin;
  const loading = false;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      {loading ? (
        <Stack.Screen name="Loading" component={SplashScreen} />
      ) : isLoggedIn ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
