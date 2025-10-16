export interface Message {
  id: number;
  username: string;
  message: string;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  joinedAt: Date;
}

export interface SystemMessage {
  username: string;
  message: string;
  timestamp: Date;
}

export interface TypingUser {
  username: string;
  isTyping: boolean;
}