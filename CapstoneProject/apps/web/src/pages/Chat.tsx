import { useState, useEffect } from 'react';
import { useChatStore } from '../lib/store';
import { authApi } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import ChatWindow from '../components/chat/ChatWindow';
import HistorySidebar from '../components/chat/HistorySidebar';

export default function Chat() {
  const { user, setUser } = useChatStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-200 bg-white`}>
        <HistorySidebar onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">MERN AI Chatbot</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="flex-1">
            <ChatWindow />
          </div>
          <div className="w-80 border-l border-gray-200 bg-white">
            {/* original Controls panel intentionally restored (component handles its UI) */}
          </div>
        </div>
      </div>
    </div>
  );
}


