import SplashScreen from '@modules/SplashScreen';
import {
  useLogger,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import { NavigationContainer } from '@react-navigation/native';
import { RootState } from '@store/rootReducer';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import AuthNavigation from './AuthNavigation';
import { navigationRef } from './NavigationService';
import UserNavigation from './UserNavigation';

const RootNavigator = () => {
  // ONLY REQUIRED VALUE
  const CustomerID = useSelector(
    (state: RootState) => state.auth.userId,
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
