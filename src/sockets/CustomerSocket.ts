import { SOCKET_EVENTS } from './SocketEvents';
import SocketService from './SocketService';

class CustomerSocket {
  watchDrivers(
    latitude: number,
    longitude: number,
    radius = 5,
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      SocketService.emit(
        SOCKET_EVENTS.CUSTOMER_WATCH,
        {
          latitude,
          longitude,
          radius,
        },
        (response: any) => {
          if (!response) {
            reject();

            return;
          }

          resolve(response.data ?? []);
        },
      );
    });
  }
  sendLoadOffer(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      SocketService.emit(
        SOCKET_EVENTS.CREATE_LOAD_OFFER,
        payload,
        (response: any) => {
          if (!response) {
            reject();
            return;
          }

          resolve(response);
        },
      );
    });
  }
  onDriverOnline(callback: (driver: any) => void) {
    SocketService.on('driver-online', callback);
  }

  onDriverLocation(callback: (driver: any) => void) {
    SocketService.on('nearby-driver-location', callback);
  }

  onDriverOffline(callback: (driver: any) => void) {
    SocketService.on('driver-offline', callback);
  }

  removeDriverOnline(callback: (driver: any) => void) {
    SocketService.off('driver-online', callback);
  }

  removeDriverLocation(callback: (driver: any) => void) {
    SocketService.off('nearby-driver-location', callback);
  }

  removeDriverOffline(callback: (driver: any) => void) {
    SocketService.off('driver-offline', callback);
  }

  onLoadAccepted(callback: (data: any) => void) {
    SocketService.on(SOCKET_EVENTS.LOAD_ACCEPTED, callback);
  }

  removeLoadAccepted(callback: any) {
    SocketService.off(SOCKET_EVENTS.LOAD_ACCEPTED, callback);
  }

  onLoadRejected(callback: any) {
    SocketService.on(SOCKET_EVENTS.LOAD_REJECTED, callback);
  }

  removeLoadRejected(callback: any) {
    SocketService.off(SOCKET_EVENTS.LOAD_REJECTED, callback);
  }

  onOfferExpired(callback: any) {
    SocketService.on(SOCKET_EVENTS.OFFER_EXPIRED, callback);
  }

  removeOfferExpired(callback: any) {
    SocketService.off(SOCKET_EVENTS.OFFER_EXPIRED, callback);
  }
}

export default new CustomerSocket();
