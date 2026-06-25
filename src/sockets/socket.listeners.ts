import { store } from '@store/index';
import {
  setDriverStates,
  setNearbyVehicles,
} from '@store/slices/Booking/bookingSlice';
import { setDestination, setDrivers, setFromDriver, setLPStatus, setMessageAndDistance, setPickup, setTripDetails } from '@store/slices/map/mapSlice';

import { setPayment, setPaymentStatus } from '@store/slices/payment/paymentSlice';
import { SOCKET_EVENTS } from './socket.events';
import { getSocket } from './socket.service';

export const registerSocketListeners = () => {
  const socket = getSocket();

  socket.removeAllListeners();

socket.on('connect', () => {
  console.log('🔗 Connected:', socket.id);

  // REJOIN DRIVER
  socket.emit(SOCKET_EVENTS.JOIN, {
      userId: store.getState()?.auth?.CustomerID,
      role: 'customer',
    });
});

  socket.onAny((event, data) => {
    console.log('📡', event, data);
    debugger;
  });

  socket.on(SOCKET_EVENTS.GET_NEARBY_DRIVERS, data => {
    store.dispatch(setNearbyVehicles(data?.data));
    console.log('GET_NEARBY_DRIVERS', data);
  });

  socket.on(SOCKET_EVENTS.DRIVER_ACCEPTED, data => {
    store.dispatch(setDriverStates(data));
  });

  socket.on(SOCKET_EVENTS.SINGLE_DRIVER_LOCATION, data => {
    console.log("SINGLE_DRIVER_LOCATION",{data})
    store.dispatch(
      setDrivers({ lat: data.lat, lng: data.lng, heading: data?.heading }),
    );
    store.dispatch(setPickup({ lat: data.pickup_lat, lng: data.pickup_lng }));
     store.dispatch(setDestination({ lat: data?.Delivery?.lat, lng: data?.Delivery?.lng }));
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
      store.dispatch(
  setTripDetails({
    ...store?.getState()?.map?.tracking as any,
    DriverID: data?.DriverID,
    loadId: data?.loadId,
    distance_km: data?.distance_km,
  })
);
const currentMessage = store.getState()?.map?.tracking?.message;

if (currentMessage === data?.message) return;
    store.dispatch(
      setMessageAndDistance({
        distance: data?.distance,
        message: data?.message,
      }),
    );
  });

   socket.on("customer:payment_status", data => {
    store.dispatch(setPayment(data?.ReceivePayment));
  });
  socket.on("customer:payment_details", data => {
    store.dispatch(setPaymentStatus(data?.ReceivePayment));
  });
   socket.on("customer:LP_Status", data => {
   store.dispatch(setLPStatus(data?.data))
  
  });
};









