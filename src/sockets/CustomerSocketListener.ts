import { navigate } from '@navigation/NavigationService';
import { resetBooking } from '@store/slices/Booking/bookingSlice';
import {
  clearActiveTrip,
  setActiveTrip,
  setConnected,
  updateDriver,
  updateDriverStatus,
} from '@store/slices/customerSocket/customerSocketSlice';
import { SOCKET_EVENTS } from './SocketEvents';
import SocketService from './SocketService';

class CustomerSocketListener {
  initialize(dispatch: any) {
    console.log('========== INITIALIZE ==========');

    const socket = SocketService.getSocket();

    if (!socket) {
      console.log('Socket is NULL');
      return;
    }

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
     * Authentication Success
     */
    socket.on(SOCKET_EVENTS.AUTHENTICATED, data => {
      console.log('Authenticated', data);
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
    socket.on(
      SOCKET_EVENTS.DRIVER_ONLINE,

      driver => {
        dispatch(
          updateDriver({
            ...driver,

            lastSeen: Date.now(),
          }),
        );
      },
    );

    socket.on(
      SOCKET_EVENTS.DRIVER_OFFLINE,

      driver => {
        dispatch(
          updateDriverStatus({
            driverId: driver.driverId,

            status: 'OFFLINE',
          }),
        );
      },
    );

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

    socket.on(
      SOCKET_EVENTS.LOAD_ACCEPTED,

      load => {
        console.log('LOAD_ACCEPTED =', { load });
        dispatch(resetBooking());
        dispatch(setActiveTrip(load));
        navigate('BottomNavigation', {
          screen: 'New Load',
          params: { load },
        });
      },
    );

    socket.on(
      SOCKET_EVENTS.LOAD_REJECTED,

      load => {
        console.log('LOAD_REJECTED =', { load });
      },
    );
    socket.on(SOCKET_EVENTS.OFFER_EXPIRED, load => {
      navigate('SelectVehicleScreen');
      console.log(load);
    });

    /**
     * Trip Completed
     */
    socket.on(SOCKET_EVENTS.TRIP_COMPLETED, () => {
      dispatch(clearActiveTrip());
    });

    /**
     * Trip Cancelled
     */
    socket.on(SOCKET_EVENTS.TRIP_CANCELLED, () => {
      dispatch(clearActiveTrip());
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
