import { SOCKET_EVENTS } from './SocketEvents';
import SocketService from './SocketService';

class CustomerSocket {
  watchDrivers(
    latitude: number,
    longitude: number,
    radius = 5,
    weight: number,
  ): Promise<any[]> {
    return SocketService.emitWithAck(SOCKET_EVENTS.CUSTOMER_WATCH, {
      latitude,
      longitude,
      radius,
      weight,
    }).then(response => response?.data ?? []);
  }

  sendLoadOffer(payload: any): Promise<any> {
    return SocketService.emitWithAck(SOCKET_EVENTS.CREATE_LOAD_OFFER, payload);
  }

  trackLoad(payload: any): Promise<any> {
    return SocketService.emitWithAck('track-load', payload);
  }

  stopTracking(payload: any): Promise<any> {
    return SocketService.emitWithAck('stop-tracking', payload);
  }
  onDriverOnline(callback: (driver: any) => void) {
    SocketService.on(SOCKET_EVENTS.DRIVER_ONLINE, callback);
  }

  onDriverLocation(callback: (driver: any) => void) {
    SocketService.on('nearby-driver-location', callback);
  }

  onDriverOffline(callback: (driver: any) => void) {
    SocketService.on(SOCKET_EVENTS.DRIVER_OFFLINE, callback);
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

  trackingDriverLocation(callback: any) {
    SocketService.on('tracking-driver-location', callback);
  }

  loadStatusChanged(callback: any) {
    SocketService.on('load-status-changed', callback);
  }

  nearDriverPickup(callback: any) {
    SocketService.on('driver-near-pickup', callback);
  }

  driverArrivedPickup(callback: any) {
    SocketService.on('driver-arrived-pickup', callback);
  }

  nearDriverDelivery(callback: any) {
    SocketService.on('driver-near-delivery', callback);
  }

  driverArrivedDelivery(callback: any) {
    SocketService.on('driver-arrived-delivery', callback);
  }

  tripCompleted(callback: any) {
    SocketService.on('trip-completed', callback);
  }
}

export default new CustomerSocket();
