import axios, { AxiosInstance } from 'axios';
import { AIProvider, AIMessage, AIResponse, AIProviderConfig } from './base';

interface AnthropicAPIResponse {
  id: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class AnthropicProvider extends AIProvider {
  private client: AxiosInstance;

  constructor(config: AIProviderConfig) {
    super(config);
    this.client = axios.create({
      baseURL: 'https://api.anthropic.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      timeout: 60000,
    });
  }

  getProviderName(): string {
    return 'Anthropic (Claude)';
  }

  getDefaultModel(): string {
    return 'claude-3-5-sonnet-20241022';
  }

  getAvailableModels(): string[] {
    return [
      'claude-3-5-sonnet-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    try {
      // Anthropic API requires system message separate from messages
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');

      const response = await this.client.post<AnthropicAPIResponse>('/messages', {
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemMessage?.content || '',
        messages: conversationMessages,
      });

      if (response.data.content && response.data.content.length > 0) {
        return {
          content: response.data.content[0].text,
          usage: {
            promptTokens: response.data.usage.input_tokens,
            completionTokens: response.data.usage.output_tokens,
            totalTokens: response.data.usage.input_tokens + response.data.usage.output_tokens,
          },
        };
      }

      throw new Error('No response from Anthropic API');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `Anthropic API error: ${error.response.status} - ${
              error.response.data?.error?.message || error.message
            }`
          );
        } else if (error.request) {
          throw new Error('No response from Anthropic API. Check your internet connection.');
        }
      }
      throw error;
    }
  }
}
