import axios, { AxiosInstance } from 'axios';
import { AIProvider, AIMessage, AIResponse, AIProviderConfig } from './base';

interface DeepSeekAPIResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class DeepSeekProvider extends AIProvider {
  private client: AxiosInstance;

  constructor(config: AIProviderConfig) {
    super(config);
    this.client = axios.create({
      baseURL: 'https://api.deepseek.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      timeout: 60000,
    });
  }

  getProviderName(): string {
    return 'DeepSeek';
  }

  getDefaultModel(): string {
    return 'deepseek-chat';
  }

  getAvailableModels(): string[] {
    return [
      'deepseek-chat',
      'deepseek-coder',
    ];
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const response = await this.client.post<DeepSeekAPIResponse>('/chat/completions', {
        model: this.model,
        messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      if (response.data.choices && response.data.choices.length > 0) {
        return {
          content: response.data.choices[0].message.content,
          usage: {
            promptTokens: response.data.usage.prompt_tokens,
            completionTokens: response.data.usage.completion_tokens,
            totalTokens: response.data.usage.total_tokens,
          },
        };
      }

      throw new Error('No response from DeepSeek API');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `DeepSeek API error: ${error.response.status} - ${
              error.response.data?.error?.message || error.message
            }`
          );
        } else if (error.request) {
          throw new Error('No response from DeepSeek API. Check your internet connection.');
        }
      }
      throw error;
    }
  }
}
