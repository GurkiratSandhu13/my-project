import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../lib/store';
import { chatApi } from '../../lib/api';
import { sessionsApi } from '../../lib/api';

export default function Composer() {
  const { currentSessionId, provider, model, temperature, systemPrompt, setCurrentSession } =
    useChatStore();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!content.trim() || !currentSessionId || loading || streaming) return;

    const messageContent = content;
    setContent('');
    setLoading(true);
    setStreaming(true);
    setStreamedContent('');

    try {
      await chatApi.stream(
        {
          sessionId: currentSessionId,
          content: messageContent,
          provider,
          model: model || undefined,
          temperature,
          systemPrompt: systemPrompt || undefined,
        },
        (chunk) => {
          if (chunk.type === 'text') {
            setStreamedContent((prev) => prev + chunk.delta);
          } else if (chunk.type === 'event' && chunk.name === 'end') {
            setStreaming(false);
            // Reload messages
            window.location.reload();
          } else if (chunk.type === 'event' && chunk.name === 'error') {
            setStreaming(false);
            alert('Error: ' + (chunk.data?.message || 'Unknown error'));
          }
        }
      );
    } catch (error: any) {
      setStreaming(false);
      alert('Failed to send message: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentSessionId) {
    return null;
  }

  return (
    <div className="p-4">
      {streaming && streamedContent && (
        <div className="mb-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
          <div className="font-semibold mb-1">Streaming response:</div>
          <div className="whitespace-pre-wrap">{streamedContent}</div>
        </div>
      )}
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={loading || streaming}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 resize-none"
          rows={3}
        />
        <button
          onClick={handleSend}
          disabled={loading || streaming || !content.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || streaming ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

