import ErrorBoundary from '@components/ErrorBoundary';

import '@i18n';
import RootNavigator from '@navigation/index';
import MapboxGL from '@rnmapbox/maps';
import { persistor, store } from '@store/index';
import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import Config from 'react-native-config';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
MapboxGL.setAccessToken(
  'pk.eyJ1IjoicmFtZXNobW90byIsImEiOiJjbWt4c2swb2QwYzA1M2Nxemg2MzZjZG5jIn0.r9DupyA23H--LeacRtBXKA',
);
function App() {
  useEffect(() => {
    Appearance.setColorScheme('light');
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
