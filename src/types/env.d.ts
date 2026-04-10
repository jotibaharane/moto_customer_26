declare module '@env' {
  export const API_URL: string;
  export const SOCKET_URL: string;

  export const DEVELOPMENT_MODE: 'development' | 'production' | 'local';

  export const PROD_API_URL;
  export const PROD_SOCKET_URL;
  export const DEV_API_URL;
  export const DEV_SOCKET_URL;
  export const LOC_API_URL;
  export const LOC_SOCKET_URL;
  export const APP_NAME: string;
  export const SERVICE_TOKEN: string;
  export const MAPBOX_ACCESS_TOKEN: string;
}
