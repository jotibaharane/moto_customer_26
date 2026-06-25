import ErrorBoundary from '@components/ErrorBoundary';

import '@i18n';
import RootNavigator from '@navigation/index';
import MapboxGL from '@rnmapbox/maps';
import { persistor, store } from '@store/index';
import { MAPBOX_ACCESS_TOKEN } from '@utils/constants';
import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import permissionService from './src/services/permissions/permission.service';
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);
function App() {
  useEffect(() => {
    Appearance.setColorScheme('light');
    permissionService.requestAppStartupPermissions();
  }, []);

  return (
    <KeyboardProvider>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RootNavigator />
          </PersistGate>
        </ReduxProvider>
      </ErrorBoundary>
    </KeyboardProvider>
  );
}

export default App;
