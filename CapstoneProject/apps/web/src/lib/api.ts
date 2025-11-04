import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authApi = {
  register: async (email: string, password: string) => {
    const res = await api.post('/auth/register', { email, password });
    return res.data;
  },
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
  me: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

// Chat API
export const chatApi = {
  send: async (data: {
    sessionId: string;
    content: string;
    provider?: string;
    model?: string;
    temperature?: number;
    systemPrompt?: string;
  }) => {
    const res = await api.post('/chat', data);
    return res.data;
  },
  stream: async (
    data: {
      sessionId: string;
      content: string;
      provider?: string;
      model?: string;
      temperature?: number;
      systemPrompt?: string;
    },
    onChunk: (chunk: any) => void
  ) => {
    // Send POST request with SSE streaming
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          // Skip event line
          continue;
        }
        if (line.startsWith('data: ')) {
          try {
            const chunkData = JSON.parse(line.substring(6));
            onChunk(chunkData);
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  },
};

// Sessions API
export const sessionsApi = {
  list: async () => {
    const res = await api.get('/sessions');
    return res.data;
  },
  get: async (id: string) => {
    const res = await api.get(`/sessions/${id}`);
    return res.data;
  },
  create: async (data?: { title?: string; systemPrompt?: string }) => {
    const res = await api.post('/sessions', data || {});
    return res.data;
  },
  clear: async (id: string) => {
    const res = await api.post(`/sessions/${id}/clear`);
    return res.data;
  },
  summarize: async (id: string) => {
    const res = await api.post(`/sessions/${id}/summarize`);
    return res.data;
  },
  export: async (id: string) => {
    const res = await api.get(`/sessions/export/${id}`);
    return res.data;
  },
  getMessages: async (sessionId: string) => {
    const res = await api.get(`/sessions/messages?sessionId=${sessionId}`);
    return res.data;
  },
};

// Config API
export const configApi = {
  get: async () => {
    const res = await api.get('/config');
    return res.data;
  },
};

// Metrics API
export const metricsApi = {
  get: async () => {
    const res = await api.get('/metrics');
    return res.data;
  },
};

