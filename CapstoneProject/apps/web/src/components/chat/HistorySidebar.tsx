import { useEffect, useState } from 'react';
import { useChatStore } from '../../lib/store';
import { sessionsApi } from '../../lib/api';
import { formatRelativeTime } from '../../lib/format';

interface Session {
  _id: string;
  title: string;
  lastActivityAt: string;
  createdAt: string;
}

export default function HistorySidebar({ onClose }: { onClose: () => void }) {
  const { currentSessionId, setCurrentSession } = useChatStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await sessionsApi.list();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      const session = await sessionsApi.create();
      setCurrentSession(session._id);
      await loadSessions();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSession(sessionId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sessions</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-2 border-b border-gray-200">
        <button
          onClick={handleCreateSession}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          + New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No sessions yet</div>
        ) : (
          <div className="p-2">
            {sessions.map((session) => (
              <button
                key={session._id}
                onClick={() => handleSelectSession(session._id)}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                  currentSessionId === session._id
                    ? 'bg-indigo-100 text-indigo-900'
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
              >
                <div className="font-medium truncate">{session.title}</div>
                <div className="text-xs text-gray-500">
                  {formatRelativeTime(session.lastActivityAt)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

