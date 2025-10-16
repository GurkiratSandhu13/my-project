import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private serverUrl = 'http://localhost:3002';

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(this.serverUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });
    }
    
    if (!this.socket.connected) {
      this.socket.connect();
    }
    
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // User methods
  joinChat(username: string): void {
    if (this.socket) {
      this.socket.emit('user_join', username);
    }
  }

  sendMessage(message: string): void {
    if (this.socket) {
      this.socket.emit('send_message', { message });
    }
  }

  sendTyping(isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit('typing', { isTyping });
    }
  }

  // Event listeners
  onConnect(callback: () => void): void {
    if (this.socket) {
      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
        callback();
      });
    }
  }

  onDisconnect(callback: () => void): void {
    if (this.socket) {
      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        callback();
      });
    }
  }

  onConnectError(callback: (error: any) => void): void {
    if (this.socket) {
      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        callback(error);
      });
    }
  }

  onReceiveMessage(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  onUserJoined(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  onUserLeft(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('user_left', callback);
    }
  }

  onUsersList(callback: (users: any[]) => void): void {
    if (this.socket) {
      this.socket.on('users_list', callback);
    }
  }

  onUserTyping(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  // Remove listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();