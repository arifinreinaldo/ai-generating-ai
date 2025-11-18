import axios, { AxiosInstance } from 'axios';
import { AIProvider, AIMessage, AIResponse, AIProviderConfig } from './base';

interface CohereAPIResponse {
  text: string;
  generation_id: string;
  meta?: {
    billed_units?: {
      input_tokens: number;
      output_tokens: number;
    };
  };
}

export class CohereProvider extends AIProvider {
  private client: AxiosInstance;

  constructor(config: AIProviderConfig) {
    super(config);
    this.client = axios.create({
      baseURL: 'https://api.cohere.ai/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      timeout: 60000,
    });
  }

  getProviderName(): string {
    return 'Cohere';
  }

  getDefaultModel(): string {
    return 'command';
  }

  getAvailableModels(): string[] {
    return ['command', 'command-light', 'command-nightly'];
  }

  private convertMessages(messages: AIMessage[]): { preamble?: string; message: string; chatHistory?: any[] } {
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const chatHistory = conversationMessages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
      message: msg.content,
    }));

    const lastMessage = conversationMessages[conversationMessages.length - 1];

    return {
      preamble: systemMessage?.content,
      message: lastMessage?.content || '',
      chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
    };
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const { preamble, message, chatHistory } = this.convertMessages(messages);

      const requestBody: any = {
        model: this.model,
        message,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      };

      if (preamble) {
        requestBody.preamble = preamble;
      }

      if (chatHistory) {
        requestBody.chat_history = chatHistory;
      }

      const response = await this.client.post<CohereAPIResponse>('/chat', requestBody);

      return {
        content: response.data.text,
        usage: response.data.meta?.billed_units ? {
          promptTokens: response.data.meta.billed_units.input_tokens,
          completionTokens: response.data.meta.billed_units.output_tokens,
          totalTokens: response.data.meta.billed_units.input_tokens + response.data.meta.billed_units.output_tokens,
        } : undefined,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `Cohere API error: ${error.response.status} - ${
              error.response.data?.message || error.message
            }`
          );
        } else if (error.request) {
          throw new Error('No response from Cohere API. Check your internet connection.');
        }
      }
      throw error;
    }
  }
}
