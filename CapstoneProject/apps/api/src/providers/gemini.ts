import { GoogleGenerativeAI } from '@google/generative-ai';
import type { BaseProvider, ChatRequest, ChatResponse, StreamChunk } from './base.js';
import { config } from '../config.js';
import { generateId } from '../services/ids.js';
import { logger } from '../utils/logger.js';

export class GeminiProvider implements BaseProvider {
  private client: GoogleGenerativeAI | null = null;
  private enabled: boolean;

  constructor() {
    this.enabled = config.providers.gemini.enabled;
    if (this.enabled && config.providers.gemini.apiKey) {
      try {
        this.client = new GoogleGenerativeAI(config.providers.gemini.apiKey);
      } catch (error) {
        logger.error({ error }, 'Failed to initialize Gemini client');
        this.enabled = false;
      }
    }
  }

  name(): string {
    return 'gemini';
  }

  supportsTools(): boolean {
    return config.features.tools;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async chat(req: ChatRequest, onStream?: (chunk: StreamChunk) => void): Promise<ChatResponse> {
    if (!this.enabled || !this.client) {
      throw new Error('Gemini provider is not enabled. Set GEMINI_API_KEY in .env');
    }

    const { messages, model = 'gemini-pro', temperature = 0.7, timeoutMs = 30000 } = req;

    try {
      // Convert messages to Gemini format
      const geminiModel = this.client.getGenerativeModel({ model });
      
      // Separate system prompt if present
      const systemPrompt = messages.find((m) => m.role === 'system')?.content;
      const chatMessages = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

      const chat = geminiModel.startChat({
        history: chatMessages.slice(0, -1).map((m) => ({
          role: m.role,
          parts: m.parts,
        })),
        generationConfig: {
          temperature,
        },
        systemInstruction: systemPrompt,
      });

      const lastMessage = chatMessages[chatMessages.length - 1];
      
      if (onStream) {
        onStream({ type: 'event', name: 'start' });
        
        let fullText = '';
        const result = await chat.sendMessageStream(lastMessage.parts);
        
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            fullText += text;
            onStream({ type: 'text', delta: text });
          }
        }
        
        onStream({ type: 'event', name: 'end' });
        
        const usage = await result.response.usageMetadata();
        
        return {
          id: generateId('gemini'),
          provider: 'gemini',
          model,
          usage: {
            inputTokens: usage?.promptTokenCount,
            outputTokens: usage?.candidatesTokenCount,
          },
          message: {
            role: 'assistant',
            content: fullText,
          },
        };
      } else {
        const result = await chat.sendMessage(lastMessage.parts);
        const response = await result.response;
        const text = response.text();
        const usage = response.usageMetadata();
        
        return {
          id: generateId('gemini'),
          provider: 'gemini',
          model,
          usage: {
            inputTokens: usage?.promptTokenCount,
            outputTokens: usage?.candidatesTokenCount,
          },
          message: {
            role: 'assistant',
            content: text,
          },
        };
      }
    } catch (error) {
      logger.error({ error, model }, 'Gemini chat error');
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

