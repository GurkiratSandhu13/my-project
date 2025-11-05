import { Routes, Route, Navigate } from 'react-router-dom';
import { useChatStore } from './lib/store';
import Login from './pages/Login';
import Chat from './pages/Chat';
import { useEffect } from 'react';
import { authApi } from './lib/api';

function App() {
  const { user, setUser } = useChatStore();

  useEffect(() => {
    // Check if user is logged in
    authApi
      .me()
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, [setUser]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={user ? '/chat' : '/login'} />} />
    </Routes>
  );
}

export default App;


