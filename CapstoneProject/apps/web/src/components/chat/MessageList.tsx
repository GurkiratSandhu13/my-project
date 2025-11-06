import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../lib/store';
import { sessionsApi } from '../../lib/api';
import { formatTime } from '../../lib/format';

interface Message {
  _id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  createdAt: string;
  providerMeta?: {
    provider: string;
    model: string;
  };
}

export default function MessageList() {
  const { currentSessionId } = useChatStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentSessionId) return;

    const loadMessages = async () => {
      if (!currentSessionId) return;
      
      setLoading(true);
      try {
        const data = await sessionsApi.getMessages(currentSessionId);
        setMessages(data.messages || []);
      } catch (error: any) {
        console.error('Failed to load messages:', error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to load messages';
        // Only show error if it's not a 404 (no messages yet)
        if (error?.response?.status !== 404) {
          alert(`Error loading messages: ${errorMessage}`);
        }
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Listen for messages-updated event
    const handleMessagesUpdate = () => {
      loadMessages();
    };
    window.addEventListener('messages-updated', handleMessagesUpdate);
    
    return () => {
      window.removeEventListener('messages-updated', handleMessagesUpdate);
    };
  }, [currentSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">Start a conversation below</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-3xl rounded-lg px-4 py-2 ${
              message.role === 'user'
                ? 'bg-indigo-600 text-white'
                : message.role === 'system'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
          >
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
            <div
              className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
              }`}
            >
              {formatTime(message.createdAt)}
              {message.providerMeta && (
                <span className="ml-2">
                  {message.providerMeta.provider} / {message.providerMeta.model}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}


