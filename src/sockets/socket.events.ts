export const SOCKET_EVENTS = {
  //************** EMIT *****************//
  CREATE_CUSTOMER_LOAD: 'customer:new_load',
  JOIN: 'join',
  CUSTOMER_LOCATION: 'customer:nearby_vehicle',
  JOIN_ROOM: 'join_room',
  PAYMENT_STATUS_UPDATE: 'customer:payment_update',

  //************** ON *****************//
  GET_NEARBY_DRIVERS: 'customer:nearby_vehicle_result',
  DRIVER_ACCEPTED: 'customer:load_accepted',
  SINGLE_DRIVER_LOCATION: 'customer:driver_location',
  CUSTOMER_LOAD_DETAILS: 'customer:trip_details',
  NEARBY_DRIVER_REACH: 'customer:driver_nearby',
  CUSTOMER_DRIVER_UPDATE: 'customer:drivers_update',
};
