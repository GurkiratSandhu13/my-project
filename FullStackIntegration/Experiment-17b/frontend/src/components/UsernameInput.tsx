import React, { useState } from 'react';
import './UsernameInput.css';

interface UsernameInputProps {
  onSubmit: (username: string) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <div className="username-container">
      <div className="username-form-wrapper">
        <h1>Welcome to Real-Time Chat</h1>
        <p>Enter your name to join the conversation</p>
        <form onSubmit={handleSubmit} className="username-form">
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              maxLength={20}
              required
              className="username-input"
            />
            <button type="submit" className="join-button">
              Join Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsernameInput;