import { useEffect, useRef } from 'react';
import MessageList from './MessageList';
import Composer from './Composer';
import { useChatStore } from '../../lib/store';

export default function ChatWindow() {
  const { currentSessionId } = useChatStore();

  if (!currentSessionId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No session selected</p>
          <p className="text-sm">Select a session from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <MessageList />
      </div>
      <div className="border-t border-gray-200">
        <Composer />
      </div>
    </div>
  );
}


