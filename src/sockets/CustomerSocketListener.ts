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
  private authenticatedCallback: ((data: any) => void) | null = null;

  setAuthenticatedCallback(callback: (data: any) => void) {
    this.authenticatedCallback = callback;
  }

  clearAuthenticatedCallback() {
    this.authenticatedCallback = null;
  }

  initialize(dispatch: any) {
    const socket = SocketService.getSocket();

    if (!socket) return;

    socket.on(SOCKET_EVENTS.AUTHENTICATED, data => {
      console.log('Authenticated', data);
      this.authenticatedCallback?.(data);
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

    socket.on(
      SOCKET_EVENTS.LOAD_REJECTED,

      load => {
        console.log('LOAD_REJECTED =', { load });
      },
    );

    /**
     * Trip Completed
     */
    socket.on(SOCKET_EVENTS.TRIP_COMPLETED, () => {
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
