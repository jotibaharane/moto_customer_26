export const SOCKET_EVENTS = {
  /**
   * Socket lifecycle
   */
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  /**
   * Authentication
   */
  AUTHENTICATED: 'authenticated',

  /**
   * =========================
   * CUSTOMER → SERVER
   * =========================
   */
 NEARBY_DRIVERS: 'nearby:drivers',
  CUSTOMER_WATCH: 'customer:watch',

  CUSTOMER_SEND_OFFER: 'customer:send-offer',

  CUSTOMER_TRACK_LOAD: 'customer:track-load',

  CUSTOMER_STOP_TRACK_LOAD: 'customer:stop-track-load',

  /**
   * =========================
   * DRIVER / NEARBY
   * =========================
   */

  DRIVER_ONLINE: 'driver:online',

  DRIVER_OFFLINE: 'driver:offline',

  DRIVER_LOCATION: 'driver:location',

  /**
   * =========================
   * LOAD
   * =========================
   */

  LOAD_OFFER_SENT: 'load:offer:sent',

  LOAD_OFFER_EXPIRED: 'load:offer:expired',

  LOAD_ASSIGNED: 'load:assigned',

  LOAD_REJECTED: 'load:rejected',

  LOAD_CANCELLED: 'load:cancelled',

  LOAD_DRIVER_LOCATION: 'load:driver-location',

  /**
   * =========================
   * LOAD STATUS
   * =========================
   */

  LOAD_STATUS_CHANGED: 'load:status-changed',

  /**
   * =========================
   * TRIP
   * =========================
   */

  TRIP_STARTED: 'trip:started',

  TRIP_COMPLETED: 'trip:completed',

  /**
   * =========================
   * PAYMENT
   * =========================
   */

  PAYMENT_CREATE: 'payment:create',

  PAYMENT_STATUS: 'payment:status',
} as const;
