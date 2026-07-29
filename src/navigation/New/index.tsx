import { NavigationContainer } from '@react-navigation/native';

import {
  useLogger,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import CustomerSocketListener from '@socket/CustomerSocketListener';
import SocketService from '@socket/SocketService';
import { RootState } from '@store/rootReducer';
import { setConnected } from '@store/slices/customerSocket/customerSocketSlice';
import { useEffect, useMemo } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { navigationRef } from './NavigationService';
import RootNavigator from './RootNavigator';

export default function Navigation() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const isDarkMode = useColorScheme() === 'dark';
  useLogger(navigationRef);
  useReduxDevToolsExtension(navigationRef);

  const barStyle = useMemo(
    () => (isDarkMode ? 'light-content' : 'dark-content'),
    [isDarkMode],
  );

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

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={barStyle}
      />
      <RootNavigator />
    </NavigationContainer>
  );
}
