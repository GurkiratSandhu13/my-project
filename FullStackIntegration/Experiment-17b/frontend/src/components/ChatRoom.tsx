import React, { useState, useEffect, useRef } from 'react';
import { Message, User, SystemMessage, TypingUser } from '../types';
import socketService from '../services/socket';
import './ChatRoom.css';

interface ChatRoomProps {
  username: string;
  onLeave: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ username, onLeave }) => {
  const [messages, setMessages] = useState<(Message | SystemMessage)[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect to socket and set up event listeners
    const socket = socketService.connect();

    // Set up event listeners
    socketService.onConnect(() => {
      console.log('Connected to socket server');
      setIsConnected(true);
      socketService.joinChat(username);
    });

    socketService.onDisconnect(() => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    socketService.onConnectError((error: any) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    socketService.onReceiveMessage((message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socketService.onUserJoined((data: SystemMessage) => {
      setMessages(prev => [...prev, data]);
    });

    socketService.onUserLeft((data: SystemMessage) => {
      setMessages(prev => [...prev, data]);
    });

    socketService.onUsersList((usersList: User[]) => {
      setUsers(usersList);
    });

    socketService.onUserTyping((data: TypingUser) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.username !== data.username);
        if (data.isTyping) {
          return [...filtered, data];
        }
        return filtered;
      });
    });

    // Cleanup
    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [username]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      socketService.sendMessage(newMessage.trim());
      setNewMessage('');
      
      // Stop typing indicator
      socketService.sendTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Send typing indicator
    socketService.sendTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendTyping(false);
    }, 2000);
  };

  const handleLeave = () => {
    socketService.disconnect();
    onLeave();
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isSystemMessage = (msg: Message | SystemMessage): msg is SystemMessage => {
    return !('id' in msg);
  };

  const isUserMessage = (msg: Message | SystemMessage): msg is Message => {
    return 'id' in msg;
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div className="chat-title">
          <h2>Real-Time Chat</h2>
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
        <button onClick={handleLeave} className="leave-button">
          Leave Chat
        </button>
      </div>

      <div className="chat-body">
        <div className="users-panel">
          <h3>Online Users ({users.length})</h3>
          <div className="users-list">
            {users.map((user) => (
              <div key={user.id} className="user-item">
                <span className="user-indicator">👤</span>
                <span className={user.username === username ? 'current-user' : ''}>
                  {user.username}
                  {user.username === username && ' (You)'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="messages-panel">
          <div className="messages-container">
            {messages.map((msg, index) => {
              if (isSystemMessage(msg)) {
                return (
                  <div key={index} className="message system-message">
                    <div className="system-text">
                      <span>{msg.message}</span>
                      <span className="timestamp">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                );
              }
              if (isUserMessage(msg)) {
                const userMsg = msg as Message;
                return (
                  <div key={index} className="message user-message">
                    <div className={`message-content ${userMsg.username === username ? 'own-message' : ''}`}>
                      <div className="message-header">
                        <span className="username">{userMsg.username}</span>
                        <span className="timestamp">{formatTime(userMsg.timestamp)}</span>
                      </div>
                      <div className="message-text">{userMsg.message}</div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
            
            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                <span>
                  {typingUsers.map(user => user.username).join(', ')} 
                  {typingUsers.length === 1 ? ' is' : ' are'} typing...
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={!isConnected}
              className="message-input"
              maxLength={500}
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim() || !isConnected}
              className="send-button"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;