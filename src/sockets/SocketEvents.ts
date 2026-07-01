export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  AUTHENTICATED: 'authenticated',

  /**
   * Customer
   */
  CUSTOMER_WATCH: 'customer-watch',
  CREATE_LOAD_OFFER: 'create-load-offer',

  /**
   * Nearby Driver
   */
  DRIVER_ONLINE: 'driver-online',
  DRIVER_OFFLINE: 'driver-offline',
  NEARBY_DRIVER_LOCATION: 'nearby-driver-location',

  /**
   * Load Offer
   */
  LOAD_OFFER: 'load-offer',
  LOAD_ACCEPTED: 'load-accepted',
  LOAD_REJECTED: 'load-rejected',
  OFFER_EXPIRED: 'offer-expired',

  /**
   * Driver
   */
  ACCEPT_LOAD: 'accept-load',
  REJECT_LOAD: 'reject-load',

  /**
   * Trip
   */
  TRIP_STARTED: 'trip-started',
  TRIP_LOCATION: 'trip-location',
  TRIP_COMPLETED: 'trip-completed',
  TRIP_CANCELLED: 'trip-cancelled',
} as const;
