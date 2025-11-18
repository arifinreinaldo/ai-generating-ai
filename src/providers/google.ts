import axios, { AxiosInstance } from 'axios';
import { AIProvider, AIMessage, AIResponse, AIProviderConfig } from './base';

interface GoogleAPIResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export class GoogleProvider extends AIProvider {
  private client: AxiosInstance;

  constructor(config: AIProviderConfig) {
    super(config);
    this.client = axios.create({
      baseURL: 'https://generativelanguage.googleapis.com/v1beta',
      timeout: 60000,
    });
  }

  getProviderName(): string {
    return 'Google (Gemini)';
  }

  getDefaultModel(): string {
    return 'gemini-pro';
  }

  getAvailableModels(): string[] {
    return ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'];
  }

  private convertMessages(messages: AIMessage[]): any {
    // Google Gemini has a different message format
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const contents = conversationMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    return {
      systemInstruction: systemMessage ? {
        parts: [{ text: systemMessage.content }]
      } : undefined,
      contents,
    };
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const { systemInstruction, contents } = this.convertMessages(messages);

      const requestBody: any = {
        contents,
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxTokens,
        },
      };

      if (systemInstruction) {
        requestBody.systemInstruction = systemInstruction;
      }

      const response = await this.client.post<GoogleAPIResponse>(
        `/models/${this.model}:generateContent?key=${this.apiKey}`,
        requestBody
      );

      if (response.data.candidates && response.data.candidates.length > 0) {
        const content = response.data.candidates[0].content.parts[0].text;

        return {
          content,
          usage: response.data.usageMetadata ? {
            promptTokens: response.data.usageMetadata.promptTokenCount,
            completionTokens: response.data.usageMetadata.candidatesTokenCount,
            totalTokens: response.data.usageMetadata.totalTokenCount,
          } : undefined,
        };
      }

      throw new Error('No response from Google API');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `Google API error: ${error.response.status} - ${
              error.response.data?.error?.message || error.message
            }`
          );
        } else if (error.request) {
          throw new Error('No response from Google API. Check your internet connection.');
        }
      }
      throw error;
    }
  }
}
