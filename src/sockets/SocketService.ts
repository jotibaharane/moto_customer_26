import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(
      // 'http://192.168.1.112:6000',
      'https://stag.motohelpindia.com',
      {
        transports: ['websocket'],
        auth: {
          token,
        },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        timeout: 20000,
        forceNew: true,
      },
    );

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }

  emit(event: string, data?: any, callback?: any) {
    this.socket?.emit(event, data, callback);
  }

  on(event: string, listener: (...args: any[]) => void) {
    this.socket?.on(event, listener);
  }

  once(event: string, listener: (...args: any[]) => void) {
    this.socket?.once(event, listener);
  }

  off(event: string, listener?: (...args: any[]) => void) {
    this.socket?.off(event, listener);
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export default new SocketService();
