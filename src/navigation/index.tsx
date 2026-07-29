import SplashScreen from '@modules/SplashScreen';
import {
  useLogger,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigation from '@navigation/AuthNavigation';
import UserNavigation from '@navigation/UserNavigation';
import { navigationRef } from './NavigationService';

import { RootState } from '@store/rootReducer';

import React, { memo, useEffect, useMemo, useState } from 'react';

import { StatusBar, useColorScheme } from 'react-native';

import CustomerSocketListener from '@socket/CustomerSocketListener';
import SocketService from '@socket/SocketService';
import { setConnected } from '@store/slices/customerSocket/customerSocketSlice';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

const RootNavigator = () => {
  const dispatch = useDispatch();

  const isProfileCompleted = useSelector(
    (state: RootState) => state.auth.isProfileCompleted,
    shallowEqual,
  );

  const { accessToken } = useSelector(
    (state: RootState) => state.auth,
    shallowEqual,
  );

  const [loading, setLoading] = useState(true);

  const isDarkMode = useColorScheme() === 'dark';

  useLogger(navigationRef);
  useReduxDevToolsExtension(navigationRef);

  const barStyle = useMemo(
    () => (isDarkMode ? 'light-content' : 'dark-content'),
    [isDarkMode],
  );

  /**
   * Splash Screen
   */
  useEffect(() => {
    let mounted = true;

    const initApp = async () => {
      await new Promise((resolve: any) => setTimeout(resolve, 2000));

      if (mounted) {
        setLoading(false);
      }
    };

    initApp();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Socket Connection
   */
  useEffect(() => {
    if (!accessToken) {
      SocketService.disconnect();
      dispatch(setConnected(false));
      return;
    }
    SocketService.connect(accessToken);
    CustomerSocketListener.initialize(dispatch);
    return () => {
      console.log('Disconnecting Socket...');
      CustomerSocketListener.destroy();
      SocketService.disconnect();
      dispatch(setConnected(false));
    };
  }, [accessToken, dispatch]);

  /**
   * Navigation
   */
  const Navigation = useMemo(() => {
    return isProfileCompleted ? <UserNavigation /> : <AuthNavigation />;
  }, [isProfileCompleted]);

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
