import { useState, useEffect } from 'react';
import { useChatStore } from '../lib/store';
import { authApi, sessionsApi } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import ChatWindow from '../components/chat/ChatWindow';
import HistorySidebar from '../components/chat/HistorySidebar';
import ModelSelector from '../components/chat/ModelSelector';
import Controls from '../components/chat/Controls';

interface Session {
  _id: string;
  title: string;
  lastActivityAt: string;
  createdAt: string;
}

export default function Chat() {
  const { user, setUser, currentSessionId, setCurrentSession } = useChatStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Initialize session on first load
  useEffect(() => {
    const initializeSession = async () => {
      if (!user) return;
      
      try {
        // Check if user has existing sessions
        const data = await sessionsApi.list();
        const sessions: Session[] = data.sessions || [];
        
        if (sessions.length === 0) {
          // No sessions exist, create first session
          console.log('Creating first session for new user...');
          const newSession = await sessionsApi.create({
            title: 'Welcome to Beli! 👋',
            systemPrompt: 'You are Beli, a friendly AI study companion for students. Help them with their studies, provide summaries, answer questions, and offer support with a warm, encouraging tone.'
          });
          setCurrentSession(newSession._id);
        } else if (!currentSessionId || !sessions.find((s: Session) => s._id === currentSessionId)) {
          // No current session selected or current session doesn't exist, select the most recent one
          const mostRecent = sessions.sort((a: Session, b: Session) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime())[0];
          setCurrentSession(mostRecent._id);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setInitializing(false);
      }
    };

    initializeSession();
  }, [user, currentSessionId, setCurrentSession]);

  if (!user) {
    return null;
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Setting up your chat...</p>
        </div>
      </div>
    );
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
            <h1 className="text-xl font-semibold">Beli — Your Study Buddy</h1>
            <div className="ml-4"><ModelSelector /></div>
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
            <Controls />
          </div>
        </div>
      </div>
    </div>
  );
}


