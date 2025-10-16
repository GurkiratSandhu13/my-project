import React, { useState } from 'react';
import './App.css';
import UsernameInput from './components/UsernameInput';
import ChatRoom from './components/ChatRoom';

function App() {
  const [username, setUsername] = useState<string | null>(null);

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
  };

  const handleLeaveChat = () => {
    setUsername(null);
  };

  return (
    <div className="App">
      {username ? (
        <ChatRoom username={username} onLeave={handleLeaveChat} />
      ) : (
        <UsernameInput onSubmit={handleUsernameSubmit} />
      )}
    </div>
  );
}

export default App;
