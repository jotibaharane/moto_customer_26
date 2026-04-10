import { store } from '@store/index';
import {
  setDriverStates,
  setNearbyVehicles,
} from '@store/slices/Booking/bookingSlice';
import { setDrivers, setPickup } from '@store/slices/map/mapSlice';
import {
  setFromDriver,
  setMessageAndDistance,
  setTripDetails,
} from '@store/slices/tracking/trackingSlice';
import { SOCKET_EVENTS } from './socket.events';
import { getSocket } from './socket.service';

export const registerSocketListeners = () => {
  const socket = getSocket();

  socket.removeAllListeners();

  socket.on('connect', () => {
    console.log('✅ Connected:', socket.id);
  });

  socket.onAny((event, data) => {
    console.log('📡', event, data);
  });

  socket.on(SOCKET_EVENTS.GET_NEARBY_DRIVERS, data => {
    store.dispatch(setNearbyVehicles(data?.data));
    console.log('GET_NEARBY_DRIVERS', data);
  });

  socket.on(SOCKET_EVENTS.DRIVER_ACCEPTED, data => {
    console.log({ DRIVER_ACCEPTED: data });
    store.dispatch(setDriverStates(data));
  });

  socket.on(SOCKET_EVENTS.SINGLE_DRIVER_LOCATION, data => {
    store.dispatch(
      setDrivers({ lat: data.lat, lng: data.lng, heading: data?.heading }),
    );
    store.dispatch(setPickup({ lat: data.pickup_lat, lng: data.pickup_lng }));
    store.dispatch(
      setFromDriver({
        distance_km: data?.distance_km,
        eta_minutes: data?.eta_minutes,
      }),
    );
  });

  socket.on(SOCKET_EVENTS.CUSTOMER_LOAD_DETAILS, data => {
    console.log('customer:trip_details', data);
    store.dispatch(setTripDetails(data));
    store.dispatch(
      setDrivers({ lat: data.lat, lng: data.lng, heading: data?.heading }),
    );
  });
  socket.on(SOCKET_EVENTS.NEARBY_DRIVER_REACH, data => {
    if (store.getState().tracking.message === data?.message) return;
    store.dispatch(
      setMessageAndDistance({
        distance: data?.distance,
        message: data?.message,
      }),
    );
    console.log('customer:driver_nearby', data);
  });
  socket.on(SOCKET_EVENTS.CUSTOMER_DRIVER_UPDATE, data => {
    // store.dispatch(setTripDetails(data));
    console.log('customer:drivers_update', data);
  });
};
