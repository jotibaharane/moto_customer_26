import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  /**
   * Connect customer to socket gateway
   */
  connect(token: string): Socket {
    // Already connected
    if (this.socket?.connected) {
      return this.socket;
    }

    // Existing socket but disconnected
    if (this.socket) {
      this.socket.auth = {
        token,
      };

      this.socket.connect();

      return this.socket;
    }

    console.log('🔌 Creating Socket Connection...');

    this.socket = io('http://192.168.1.112:6001', {
      transports: ['websocket'],

      auth: {
        token,
      },

      /**
       * Socket.IO uses /socket.io by default.
       *
       * Gateway:
       * /socket.io
       *       ↓
       * Socket Service :5005
       */
      path: '/socket.io',

      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,

      timeout: 20000,

      autoConnect: true,

      forceNew: false,
    });

    /**
     * Basic connection logs
     */
    this.socket.on('connect', () => {
      console.log('🟢 Socket Connected');
      console.log('🆔 Socket ID:', this.socket?.id);
    });

    this.socket.on('connect_error', error => {
      console.log('🔴 Socket Connection Error:', error.message);
    });

    this.socket.on('disconnect', reason => {
      console.log('🟠 Socket Disconnected:', reason);
    });

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (!this.socket) {
      return;
    }

    console.log('🔌 Disconnecting Socket...');

    this.socket.disconnect();
    this.socket = null;
  }

  /**
   * Get current socket
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Connection status
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Emit event
   */
  emit(event: string, data?: any, callback?: (...args: any[]) => void) {
    if (!this.socket) {
      console.warn(`⚠️ Socket not initialized. Event: ${event}`);
      return;
    }

    if (!this.socket.connected) {
      console.warn(`⚠️ Socket not connected. Event: ${event}`);
      return;
    }

    console.log(`📤 Socket Emit: ${event}`, data);

    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
  }

  /**
   * Listen
   */
  on(event: string, listener: (...args: any[]) => void) {
    this.socket?.on(event, listener);
  }

  /**
   * Listen once
   */
  once(event: string, listener: (...args: any[]) => void) {
    this.socket?.once(event, listener);
  }

  /**
   * Remove listener
   */
  off(event: string, listener?: (...args: any[]) => void) {
    this.socket?.off(event, listener);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export default new SocketService();
