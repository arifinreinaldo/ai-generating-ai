import axios, { AxiosInstance } from 'axios';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokResponse {
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

export class GrokClient {
  private client: AxiosInstance;
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor(
    apiKey: string,
    model: string = 'grok-beta',
    maxTokens: number = 4096,
    temperature: number = 0.7
  ) {
    this.apiKey = apiKey;
    this.model = model;
    this.maxTokens = maxTokens;
    this.temperature = temperature;

    this.client = axios.create({
      baseURL: 'https://api.x.ai/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      timeout: 60000,
    });
  }

  async chat(messages: GrokMessage[]): Promise<string> {
    try {
      const response = await this.client.post<GrokResponse>('/chat/completions', {
        model: this.model,
        messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      }

      throw new Error('No response from Grok API');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `Grok API error: ${error.response.status} - ${
              error.response.data?.error?.message || error.message
            }`
          );
        } else if (error.request) {
          throw new Error('No response from Grok API. Check your internet connection.');
        }
      }
      throw error;
    }
  }

  async analyzeCode(code: string, filePath: string): Promise<string> {
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: 'You are an expert code reviewer and analyzer. Analyze the provided code and give specific, actionable recommendations for improvements, bug fixes, security issues, performance optimizations, and best practices.',
      },
      {
        role: 'user',
        content: `Analyze this code from file: ${filePath}\n\n\`\`\`\n${code}\n\`\`\`\n\nProvide specific recommendations for:\n1. Bug fixes\n2. Security vulnerabilities\n3. Performance improvements\n4. Code quality and best practices\n5. Potential edge cases\n\nBe concise but specific.`,
      },
    ];

    return this.chat(messages);
  }

  async analyzeProject(projectSummary: string): Promise<string> {
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: 'You are an expert software architect and code reviewer. Analyze the project structure and provide high-level recommendations.',
      },
      {
        role: 'user',
        content: `Analyze this project:\n\n${projectSummary}\n\nProvide recommendations for:\n1. Architecture improvements\n2. Project structure optimization\n3. Missing components or files\n4. Security concerns\n5. Best practices\n\nBe specific and actionable.`,
      },
    ];

    return this.chat(messages);
  }
}
