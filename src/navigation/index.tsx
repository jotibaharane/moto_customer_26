import SplashScreen from '@modules/SplashScreen';
import AuthNavigation from '@navigation/AuthNavigation';
import UserNavigation from '@navigation/UserNavigation';
import {
  useLogger,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import { NavigationContainer } from '@react-navigation/native';
import CustomerSocketListener from '@socket/CustomerSocketListener';
import SocketService from '@socket/SocketService';
import { RootState } from '@store/rootReducer';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { navigationRef } from './NavigationService';

const RootNavigator = () => {
  const dispatch = useDispatch();
  const isProfileCompleted = useSelector(
    (state: RootState) => state.auth.isProfileCompleted,
  );
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';

  useLogger(navigationRef);
  useReduxDevToolsExtension(navigationRef);

  const barStyle = useMemo(
    () => (isDarkMode ? 'light-content' : 'dark-content'),
    [isDarkMode],
  );

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

  useEffect(() => {
    SocketService.connect(accessToken);
    CustomerSocketListener.initialize(dispatch);
  }, [accessToken, dispatch]);

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
