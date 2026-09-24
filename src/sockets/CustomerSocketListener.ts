import { api } from '@api/api';
import EventBus from '../events/EventBus';
import { EVENTS } from '../events/events';
import { navigate } from '@navigation/NavigationService';
import { store } from '@store/index';
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
import CustomerSocket from './CustomerSocket';
import { SOCKET_EVENTS } from './SocketEvents';
import SocketService from './SocketService';

/**
 * Tears down local state for a load that ended without completing
 * (cancelled by either side). state.map / activeTrip are single global
 * "currently tracked load" slots, so a cancel for some OTHER load must not
 * wipe the one actually being tracked. The REST loads list is force-
 * refetched because it's cached and only refreshes on screen focus, which
 * would otherwise keep offering a Cancel button for a dead load.
 */
const endLoadLocally = (dispatch: any, loadId?: string) => {
  const trackedLoadId = store.getState().map.driver?.loadId;
  if (!loadId || !trackedLoadId || trackedLoadId === loadId) {
    dispatch(clearActiveTrip());
    dispatch(resetMap());
  }
  dispatch(
    api.endpoints.getLoads.initiate(undefined, { forceRefetch: true }),
  );
};

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
      dispatch(resetBooking());
      dispatch(setActiveTrip(load));

      // state.map.driver is a single global "currently tracked load" slot,
      // not scoped per-loadId. If the customer already has a DIFFERENT
      // load actively in progress (its tracking hasn't been cleared by a
      // completion/cancellation yet — see resetMap() calls above/below),
      // overwriting it here with the newly-accepted load's data would rip
      // the map/markers out from under whatever screen is currently
      // showing that other, still-live trip (ReportingScreen's
      // MapComponent, LiveTrackingScreen) — pins and the vehicle marker
      // would jump between two unrelated loads' coordinates, which is
      // exactly the "flicker" this was causing. Only auto-switch the
      // live tracking view when there's nothing else already in progress;
      // otherwise just notify — the customer can view the new load from
      // their loads list once they're done with the current one.
      const existingLoadId = store.getState().map.driver?.loadId;
      const hasDifferentActiveLoad =
        !!existingLoadId && existingLoadId !== load?.loadId;

      if (hasDifferentActiveLoad) {
        Alert.alert(
          'Load Accepted',
          'A driver has accepted your other load. You can view it from your loads list.',
        );
        return;
      }

      // Join the load's tracking room the instant it's accepted — without
      // this, the customer only starts receiving 'tracking-driver-location'
      // broadcasts once something else (e.g. ReportingScreen's own mount
      // effect, only reliable on a fresh app start) happens to call
      // trackLoad() first. The backend room broadcast is fire-and-forget
      // with no replay, so any pings before that join are lost — this is
      // why the map/polyline previously stayed frozen until an app reload.
      if (load?.loadId) {
        CustomerSocket.trackLoad({ loadId: load.loadId })
          .then(response => {
            if (response?.current) dispatch(setDrivers(response.current));
          })
          .catch(() => {});
      }
      navigate('BottomNavigation', {
        screen: 'New Load',
        params: { load },
      });
    });

    socket.on(
      SOCKET_EVENTS.LOAD_REJECTED,

      load => {
        console.log('LOAD_REJECTED =', { load });
        EventBus.emit(EVENTS.OFFER_ENDED, {
          loadId: load?.loadId,
          reason: 'REJECTED',
        });
      },
    );
    socket.on(SOCKET_EVENTS.OFFER_EXPIRED, load => {
      console.log('OFFER_EXPIRED =', { load });
      EventBus.emit(EVENTS.OFFER_ENDED, {
        loadId: load?.loadId,
        reason: 'EXPIRED',
      });
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
    socket.on(SOCKET_EVENTS.TRIP_CANCELLED, data => {
      endLoadLocally(dispatch, data?.loadId);
    });

    /**
     * Load Cancelled — fired by the backend when the DRIVER (or a runner,
     * treated as a driver) cancels a load this customer owns (see
     * services/socket-service/src/trip/cancellation.socket.ts). The
     * customer's own cancel-load emit gets its result via the emitWithAck
     * response instead, not this listener.
     */
    socket.on(SOCKET_EVENTS.LOAD_CANCELLED, data => {
      console.log('LOAD_CANCELLED =', { data });
      endLoadLocally(dispatch, data?.loadId);
      // The customer's own cancel already alerts from its ack callback;
      // this event echoes back to the load room, so only alert when the
      // other party cancelled.
      if (data?.cancelledBy !== 'CUSTOMER') {
        Alert.alert('Load Cancelled', 'The driver has cancelled this load.');
      }
    });

    // new

    // Statuses that mean "the trip is over, wipe the map" — checked
    // wherever the backend reports a status, since the value it actually
    // sends depends on which code path fired. In practice the backend
    // deletes its tracking cache the moment the driver marks delivery
    // complete (see trip.socket.ts's DELIVERY_COMPLETED handler calling
    // removeTracking() before payment/OTP even runs), so a later
    // "TRIP_COMPLETED" status set during payment verification is set on an
    // already-deleted record and effectively never reaches the client via
    // tracking-driver-location again. DELIVERY_COMPLETED — sent reliably
    // via 'load-status-changed' the instant the driver marks it — is the
    // one signal guaranteed to actually arrive.
    const isTripOverStatus = (status?: string) =>
      status === 'DELIVERY_COMPLETED' || status === 'TRIP_COMPLETED';

    socket.on('tracking-driver-location', data => {
      console.log('Tracking Location : ', { data });
      if (isTripOverStatus(data?.tripStatus)) {
        dispatch(clearActiveTrip());
        dispatch(resetMap());
      } else {
        dispatch(setDrivers(data));
      }
    });

    socket.on('load-status-changed', data => {
      console.log('Load Status Changed : ', { data });
      if (isTripOverStatus(data?.tripStatus)) {
        dispatch(clearActiveTrip());
        dispatch(resetMap());
      }
    });

    // Some status transitions (e.g. the payment-driven "TRIP_COMPLETED",
    // when it does succeed) are broadcast here instead of via
    // load-status-changed — see status.worker.ts's TRACKING_STATUS
    // subscriber, which emits this to the load/customer/driver rooms.
    socket.on('trip-status', data => {
      console.log('Trip Status : ', { data });
      if (isTripOverStatus(data?.status)) {
        dispatch(clearActiveTrip());
        dispatch(resetMap());
      }
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
