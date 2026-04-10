import SignInScreen from '@modules/Auth/SignInScreen';
import SignUpScreen from '@modules/Auth/SignUpScreen';
import LangugeSelection from '@modules/MultiLang';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '@theme/index';
import React from 'react';

const Stack = createNativeStackNavigator();
const AuthNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.white[500] },
          headerShown: false,
        }}
      >
        <Stack.Screen name="Languge" component={LangugeSelection} />
        <Stack.Screen name="Login" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AuthNavigation;
