import ErrorBoundary from '@components/ErrorBoundary';
import { MAPBOX_ACCESS_TOKEN } from '@env';
import '@i18n';
import RootNavigator from '@navigation/index';
import MapboxGL from '@rnmapbox/maps';
import { persistor, store } from '@store/index';
import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN!);
function App() {
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootNavigator />
        </PersistGate>
      </ReduxProvider>
    </ErrorBoundary>
  );
}

export default App;
