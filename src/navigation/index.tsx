import {
  useLogger,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import { NavigationContainer } from '@react-navigation/native';

import { RootState } from '@store/rootReducer';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import SplashScreen from '@modules/SplashScreen';

import { emitCustomerJoin } from '@socket/socket.emitters';
import { registerSocketListeners } from '@socket/socket.listeners';
import { disconnectSocket, initSocket } from '@socket/socket.manager';
import { useEffect, useState } from 'react';
import AuthNavigation from './AuthNavigation';
import { navigationRef } from './NavigationService';
import UserNavigation from './UserNavigation';

function RootNavigator() {
  const { CustomerID } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';

  useLogger(navigationRef);
  useReduxDevToolsExtension(navigationRef);
  useEffect(() => {
    const initApp = async () => {
      try {
        await new Promise((resolve: any) => setTimeout(resolve, 2000));
        if (CustomerID) {
          initSocket(CustomerID);
          registerSocketListeners();
          emitCustomerJoin(CustomerID);
        }
        setTimeout(() => setLoading(false), 2000);
      } catch (e) {
        console.log('Init error', e);
      } finally {
      }
    };

    initApp();

    return () => {
      disconnectSocket();
    };
  }, [CustomerID]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {CustomerID == '' ? <AuthNavigation /> : <UserNavigation />}
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default RootNavigator;
