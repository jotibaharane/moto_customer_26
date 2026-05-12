declare module 'react-native-config' {
  export interface NativeConfig {
    ENV?: string;
    DEVELOPMENT_MODE?: string;
    API_URL?: string;
    SOCKET_URL?: string;
    APP_NAME?: string;
    SERVICE_TOKEN?: string;
    MAPBOX_ACCESS_TOKEN?: string;
    PAYMENT_API_URL?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
