import { useEffect, useRef } from 'react';
import MessageList from './MessageList';
import Composer from './Composer';
import { useChatStore } from '../../lib/store';
import { FileText, Share2, X } from 'lucide-react';
import { sessionsApi } from '../../lib/api';

export default function ChatWindow() {
  const { currentSessionId } = useChatStore();

  const handleClear = async () => {
    if (!currentSessionId) return;
    if (!confirm('Clear all messages in this session?')) return;
    await sessionsApi.clear(currentSessionId);
    window.dispatchEvent(new Event('messages-updated'));
  };
  const handleSummarize = async () => {
    if (!currentSessionId) return;
    await sessionsApi.summarize(currentSessionId);
    alert('Summarized');
    window.dispatchEvent(new Event('messages-updated'));
  };
  const handleExport = async () => {
    if (!currentSessionId) return;
    const data = await sessionsApi.export(currentSessionId);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${currentSessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="px-3 pt-3 flex items-center justify-end gap-2 text-gray-600">
        <button className="p-2 rounded hover:bg-gray-100 disabled:opacity-50" onClick={handleClear} title="Clear chat">
          <X className="w-4 h-4" />
        </button>
        <button className="p-2 rounded hover:bg-gray-100 disabled:opacity-50" onClick={handleSummarize} title="Summarize context">
          <FileText className="w-4 h-4" />
        </button>
        <button className="p-2 rounded hover:bg-gray-100 disabled:opacity-50" onClick={handleExport} title="Export JSON">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MessageList />
      </div>
      <div className="border-t border-gray-200">
        <Composer />
      </div>
    </div>
  );
}


