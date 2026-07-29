import BackButton from '@components/NavigationComponents/BackButton';
import HeaderTitle from '@components/NavigationComponents/HeaderTitle';
import SignInScreen from '@modules/Auth/SignInScreen';
import SignUpScreen from '@modules/Auth/SignUpScreen';
import MpinLogin from '@modules/Mpin/MpinLogin';
import SetMPINScreen from '@modules/Mpin/SetMPIN';
import LangugeSelection from '@modules/MultiLang';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.LANGUAGE}
        options={{ headerShown: false }}
        component={LangugeSelection}
      />
      <Stack.Screen
        name={ROUTES.MOBILE_LOGIN}
        options={{ headerShown: false }}
        component={SignInScreen}
      />
      <Stack.Screen
        name={ROUTES.SIGNUP}
        options={{
          headerTitleAlign: 'left',
          headerLeft: navigation => <BackButton navigation={navigation} />,
          headerTitle: () => <HeaderTitle title="Registration Form" />,
          headerShadowVisible: false,
        }}
        component={SignUpScreen}
      />
      <Stack.Screen
        name={ROUTES.SET_MPIN}
        options={{ headerShown: false }}
        component={SetMPINScreen}
      />
      <Stack.Screen
        name={ROUTES.MPIN_LOGIN}
        options={{ headerShown: false }}
        component={MpinLogin}
      />
    </Stack.Navigator>
  );
}
