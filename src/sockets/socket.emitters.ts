import { SOCKET_EVENTS } from './socket.events';
import { getSocket } from './socket.service';
import { CreateCustomerLoadPayload } from './socket.types';

const emitWithConnection = (callback: () => void) => {
  const socket = getSocket();

  if (socket.connected) {
    callback();
  } else {
    socket.once('connect', callback);
  }
};

export const emitCreateCustomerLoad = (payload: CreateCustomerLoadPayload) => {
  const socket = getSocket();

  emitWithConnection(() => {
    socket.emit(SOCKET_EVENTS.CREATE_CUSTOMER_LOAD, payload);
  });
};

export const emitCustomerJoin = (customerId: string) => {
  const socket = getSocket();

  emitWithConnection(() => {
    socket.emit(SOCKET_EVENTS.JOIN, {
      userId: customerId,
      role: 'customer',
    });
  });
};

export const emitCustomerLocation = (
  lat: number,
  lng: number,
  Approximate_weight: string,
  customerId: string,
) => {
  console.log('emitCustomerLocation********************************');
  const socket = getSocket();

  emitWithConnection(() => {
    socket.emit(SOCKET_EVENTS.CUSTOMER_LOCATION, {
      lat,
      lng,
      Approximate_weight,
      customerId,
    });
  });
  console.log('emitCustomerLocation', SOCKET_EVENTS.CUSTOMER_LOCATION, {
    lat,
    lng,
    Approximate_weight,
  });
};

// ✅ Join Room
export const emitJoinRoom = (loadId: string) => {
  const socket = getSocket();

  emitWithConnection(() => {
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { loadId });
  });
};
