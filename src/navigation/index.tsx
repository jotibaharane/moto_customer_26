import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  useLogger,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '@store/rootReducer';
import SplashScreen from '@modules/SplashScreen';
import { emitCustomerJoin } from '@socket/socket.emitters';
import { registerSocketListeners } from '@socket/socket.listeners';
import { disconnectSocket, initSocket } from '@socket/socket.manager';
import AuthNavigation from './AuthNavigation';
import UserNavigation from './UserNavigation';
import { navigationRef } from './NavigationService';

const RootNavigator = () => {
  // ONLY REQUIRED VALUE
  const CustomerID = useSelector(
    (state: RootState) => state.auth.CustomerID,
    shallowEqual,
  );

  const [loading, setLoading] = useState(true);

  const isDarkMode = useColorScheme() === 'dark';

  useLogger(navigationRef);

  useReduxDevToolsExtension(navigationRef);

  // MEMOIZE STATUSBAR STYLE
  const barStyle = useMemo(
    () => (isDarkMode ? 'light-content' : 'dark-content'),
    [isDarkMode],
  );

  useEffect(() => {
    let mounted = true;

    const initApp = async () => {
      try {
        // SPLASH DELAY
        await new Promise((resolve: any) => setTimeout(resolve, 2000));

        if (CustomerID) {
          initSocket(CustomerID);
          registerSocketListeners();
          emitCustomerJoin(CustomerID);
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.log('Init error:', error);
      }
    };

    initApp();

    return () => {
      mounted = false;

      disconnectSocket();
    };
  }, [CustomerID]);

  // PREVENT UNNECESSARY RERENDER
  const Navigation = useMemo(() => {
    return CustomerID ? <UserNavigation /> : <AuthNavigation />;
  }, [CustomerID]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={barStyle}
      />

      {Navigation}
    </NavigationContainer>
  );
};

export default memo(RootNavigator);
