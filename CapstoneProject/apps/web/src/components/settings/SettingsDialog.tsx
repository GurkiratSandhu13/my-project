import { useEffect, useState } from 'react';
import { useChatStore } from '../../lib/store';
import { sessionsApi } from '../../lib/api';

export default function SettingsDialog({ onClose }: { onClose: () => void }) {
  const { currentSessionId, systemPrompt, setSystemPrompt, temperature, setTemperature } = useChatStore();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!currentSessionId) return onClose();
    setSaving(true);
    try {
      await sessionsApi.update(currentSessionId, { systemPrompt, temperature });
      onClose();
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded" aria-label="Close">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature: {temperature.toFixed(1)}</label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}