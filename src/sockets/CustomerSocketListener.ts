import { goBack, navigate } from '@navigation/NavigationService';
import { resetBooking } from '@store/slices/Booking/bookingSlice';
import {
  clearActiveTrip,
  setActiveTrip,
  setConnected,
  updateDriver,
  updateDriverStatus,
} from '@store/slices/customerSocket/customerSocketSlice';
import { resetMap, setDrivers, setMessage } from '@store/slices/map/mapSlice';
import { Alert } from 'react-native';
import { SOCKET_EVENTS } from './SocketEvents';
import SocketService from './SocketService';

class CustomerSocketListener {
  initialize(dispatch: any) {
    const socket = SocketService.getSocket();
    if (!socket) return;
    socket.on(SOCKET_EVENTS.AUTHENTICATED, data => {
      console.log('Authenticated', data);
    });

    socket.onAny((event, ...args) => {
      console.log(`🟢 Socket Event: ${event}`, ...args);
    });
    /**
     * Connected
     */
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('🟢 Socket Connected');
      console.log('Socket ID:', socket.id);
      dispatch(setConnected(true));
    });

    /**
     * Disconnected
     */
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('🔴 Socket Disconnected');

      dispatch(setConnected(false));
    });

    /**
     * Connection errors
     */
    socket.on(SOCKET_EVENTS.CONNECT_ERROR, error => {
      console.log('🔴 Socket Connect Error:', error?.message);

      dispatch(setConnected(false));
    });

    socket.io.on(SOCKET_EVENTS.RECONNECT_ERROR, error => {
      console.log('🔴 Socket Reconnect Error:', error?.message);
    });

    socket.io.on(SOCKET_EVENTS.RECONNECT_FAILED, () => {
      console.log('🔴 Socket Reconnect Failed');

      dispatch(setConnected(false));
    });

    /**
     * Live Driver Location
     */
    socket.on(SOCKET_EVENTS.NEARBY_DRIVER_LOCATION, (driver: any) => {
      dispatch(
        updateDriver({
          ...driver,
          lastSeen: Date.now(),
        }),
      );
    });

    /**
     * Driver Status
     */
    socket.on(SOCKET_EVENTS.DRIVER_ONLINE, driver => {
      dispatch(
        updateDriver({
          ...driver,
          lastSeen: Date.now(),
        }),
      );
    });

    socket.on(SOCKET_EVENTS.DRIVER_OFFLINE, driver => {
      dispatch(
        updateDriverStatus({
          driverId: driver.driverId,
          status: 'OFFLINE',
        }),
      );
    });

    /**
     * Trip Started
     */
    socket.on(SOCKET_EVENTS.TRIP_STARTED, trip => {
      console.log('Trip Started');

      dispatch(setActiveTrip(trip));
    });

    /**
     * Driver Live Tracking
     */

    socket.on(SOCKET_EVENTS.LOAD_ACCEPTED, load => {
      console.log('LOAD_ACCEPTED =', { load });
      // CustomerSocket.trackLoad({
      //   loadId: load?.loadId,
      // });
      dispatch(resetBooking());
      dispatch(setActiveTrip(load));
      navigate('BottomNavigation', {
        screen: 'New Load',
        params: { load },
      });
    });

    socket.on(
      SOCKET_EVENTS.LOAD_REJECTED,

      load => {
        console.log('LOAD_REJECTED =', { load });
      },
    );
    socket.on(SOCKET_EVENTS.OFFER_EXPIRED, load => {
      goBack();
      // navigate('SelectVehicleScreen');
      console.log(load);
    });

    /**
     * Trip Completed
     */
    socket.on(SOCKET_EVENTS.TRIP_COMPLETED, () => {
      dispatch(clearActiveTrip());
      dispatch(resetMap());
    });

    /**
     * Trip Cancelled
     */
    socket.on(SOCKET_EVENTS.TRIP_CANCELLED, () => {
      dispatch(clearActiveTrip());
    });

    // new

    socket.on('tracking-driver-location', data => {
      console.log('Tracking Location : ', { data });
      if (data?.tripStatus === 'TRIP_COMPLETED') {
        dispatch(clearActiveTrip());
        dispatch(resetMap());
      } else {
        dispatch(setDrivers(data));
      }
    });

    socket.on('load-status-changed', data => {
      console.log('Load Status Changed : ', { data });
    });
    socket.on('driver-near-pickup', data => {
      console.log('Driver Near Pickup : ', { data });
      dispatch(setMessage('Driver reached within 500m.'));
    });
    socket.on('driver-arrived-pickup', data => {
      console.log('Driver Arrived at Pickup : ', { data });
      dispatch(setMessage('Driver Arrived at Pickup Location.'));
    });
    socket.on('driver-near-delivery', data => {
      console.log('Driver Near Delivery : ', { data });
      dispatch(setMessage('Driver reached Near Delivery within 500m.'));
    });
    socket.on('driver-arrived-delivery', data => {
      console.log('Driver Arrived at Delivery : ', { data });
      dispatch(setMessage('Driver Arrived at Delivery Location.'));
    });
    socket.on('trip-completed', data => {
      console.log('Trip Completed : ', { data });
      dispatch(setMessage(''));
    });

    socket.on('payment-notification', data => {
      console.log('payment-notification: ', { data });
      Alert.alert(data?.message);
      dispatch(setMessage(''));
    });
  }

  destroy() {
    const socket = SocketService.getSocket();
    if (!socket) {
      return;
    }
    socket.removeAllListeners();
  }
}

export default new CustomerSocketListener();
