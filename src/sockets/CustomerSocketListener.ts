import {
  clearActiveTrip,
  DriverResponse,
  removeDriver,
  setActiveTrip,
  setConnected,
  setNearbyDrivers,
  updateDriver,
} from '@store/slices/customerSocket/customerSocketSlice';

import { navigate } from '@navigation/NavigationService';
import { resetBooking } from '@store/slices/Booking/bookingSlice';
import { setDrivers } from '@store/slices/map/mapSlice';
import { EventBus, EVENTS } from '../events';
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

    if (!socket) {
      console.log('Socket not available');
      return;
    }

    /**
     * AUTHENTICATED
     */
    socket.on(SOCKET_EVENTS.AUTHENTICATED, data => {
      console.log('Authenticated', data);

      this.authenticatedCallback?.(data);
    });

    /**
     * CONNECT
     */
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('🟢 Socket Connected');
      console.log('Socket ID:', socket.id);

      dispatch(setConnected(true));
    });

    /**
     * DISCONNECT
     */
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('🔴 Socket Disconnected');

      dispatch(setConnected(false));
    });

    /**
     * INITIAL NEARBY DRIVERS
     */
    socket.on(
      SOCKET_EVENTS.NEARBY_DRIVERS,
      (response: { data: DriverResponse[] }) => {
        console.log('📍 Nearby Drivers:', response.data);

        dispatch(setNearbyDrivers(response.data));
      },
    );

    /**
     * DRIVER ONLINE
     */
    socket.on(SOCKET_EVENTS.DRIVER_ONLINE, (driver: DriverResponse) => {
      console.log('🟢 Driver Online:', driver.driverId);

      dispatch(updateDriver(driver));
    });

    /**
     * DRIVER LOCATION
     */
    socket.on(SOCKET_EVENTS.DRIVER_LOCATION, (driver: DriverResponse) => {
      console.log('📍 Driver Location:', driver.driverId);

      dispatch(updateDriver(driver));
    });
    socket.on('load:driver-location', response => {
      console.log('Driver location:', response);
      dispatch(
        setDrivers({
          deliveryDistance: { distanceKm: 0, durationMin: 0, durationText: '' },
          destinationCoordinate: { latitude: '', longitude: '' },
          driverId: '',
          heading: response?.data?.heading,
          latitude: response?.data?.latitude,
          loadId: response?.data?.loadId,
          longitude: response?.data?.longitude,
          pickupCoordinate: { latitude: '', longitude: '' },
          pickupDistance: { distanceKm: 0, durationMin: 0, durationText: '' },
          speed: response?.data?.speed,
          status: '',
          tripStatus: '',
          updatedAt: '',
        }),
      );
    });
    /**
     * DRIVER OFFLINE
     */
    socket.on(SOCKET_EVENTS.DRIVER_OFFLINE, (driver: DriverResponse) => {
      console.log('🔴 Driver Offline:', driver.driverId);

      dispatch(removeDriver(driver.driverId));
    });

    /**
     * TRIP STARTED
     */
    socket.on(SOCKET_EVENTS.TRIP_STARTED, trip => {
      console.log('Trip Started');

      dispatch(setActiveTrip(trip));
    });

    /**
     * TRIP COMPLETED
     */
    socket.on(SOCKET_EVENTS.TRIP_COMPLETED, () => {
      dispatch(clearActiveTrip());
    });
    socket.on('load:assigned', load => {
      console.log('LOAD_ACCEPTED =', { load });
      //  CustomerSocket.trackLoad({
      //       loadId: load?.loadId,
      //     });
      EventBus.emit(EVENTS.CLOSE_WAITING_LOADER);
      dispatch(resetBooking());
      dispatch(setActiveTrip(load));
      navigate('BottomNavigation', {
        screen: 'New Load',
        params: { load },
      });
    });
    /**
     * LOAD REJECTED
     */
    socket.on(SOCKET_EVENTS.LOAD_REJECTED, load => {
      console.log('LOAD_REJECTED:', load);
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
