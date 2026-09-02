import SplashScreen from '@modules/SplashScreen';
import AuthNavigation from '@navigation/AuthNavigation';
import UserNavigation from '@navigation/UserNavigation';
import NetInfo from '@react-native-community/netinfo';
import {
  useLogger,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import { NavigationContainer } from '@react-navigation/native';
import CustomerSocketListener from '@socket/CustomerSocketListener';
import SocketService from '@socket/SocketService';
import { RootState } from '@store/rootReducer';
import { setConnected } from '@store/slices/customerSocket/customerSocketSlice';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, StatusBar, useColorScheme } from 'react-native';
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
    if (!accessToken) {
      SocketService.disconnect();
      dispatch(setConnected(false));
      return;
    }

    SocketService.connect(accessToken);
    CustomerSocketListener.initialize(dispatch);

    return () => {
      CustomerSocketListener.destroy();
      SocketService.disconnect();
      dispatch(setConnected(false));
    };
  }, [accessToken, dispatch]);

  /**
   * The socket can silently die while the app is backgrounded (OS
   * suspends the connection) or the device loses network — neither
   * always fires a `disconnect` event on resume. Watch both and force
   * a reconnect so tracking doesn't go stale.
   */
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const appStateSubscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active') {
          SocketService.ensureConnected(accessToken);
        }
      },
    );

    const netInfoUnsubscribe = NetInfo.addEventListener(state => {
      const isOnline = Boolean(
        state.isConnected && state.isInternetReachable !== false,
      );

      if (isOnline && wasOfflineRef.current) {
        SocketService.ensureConnected(accessToken);
      }

      wasOfflineRef.current = !isOnline;
    });

    return () => {
      appStateSubscription.remove();
      netInfoUnsubscribe();
    };
  }, [accessToken]);

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
