import Config from 'react-native-config';
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(Config.SOCKET_URL ?? '', {
      transports: ['websocket'],
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      forceNew: true,
    });

    return this.socket;
  }

  /**
   * Called after an HTTP token refresh so the socket doesn't keep
   * authenticating with a stale token for the rest of the session.
   */
  updateAuthToken(token: string) {
    if (!this.socket) {
      return;
    }

    this.socket.auth = { token };

    if (this.socket.connected) {
      this.socket.disconnect();
      this.socket.connect();
    }
  }

  /**
   * Called when the app returns to the foreground or the network comes
   * back — the socket can silently die while backgrounded/offline
   * without emitting a `disconnect` event, so this re-establishes it
   * (and refreshes the auth token in case it changed meanwhile).
   */
  ensureConnected(token: string) {
    if (!this.socket) {
      this.connect(token);
      return;
    }

    if (!this.socket.connected) {
      this.socket.auth = { token };
      this.socket.connect();
    }
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

  /**
   * Emit-with-ack, but rejects after `timeoutMs` instead of hanging
   * forever if the server never responds.
   */
  emitWithAck<T = any>(
    event: string,
    data?: any,
    timeoutMs = 10000,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      const timer = setTimeout(() => {
        reject(new Error(`Timed out waiting for ack on "${event}"`));
      }, timeoutMs);

      this.socket.emit(event, data, (response: T) => {
        clearTimeout(timer);

        if (!response) {
          reject(new Error(`Empty ack response for "${event}"`));
          return;
        }

        resolve(response);
      });
    });
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
