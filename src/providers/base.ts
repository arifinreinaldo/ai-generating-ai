export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProviderConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export abstract class AIProvider {
  protected apiKey: string;
  protected model: string;
  protected maxTokens: number;
  protected temperature: number;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || this.getDefaultModel();
    this.maxTokens = config.maxTokens || 4096;
    this.temperature = config.temperature || 0.7;
  }

  abstract getProviderName(): string;
  abstract getDefaultModel(): string;
  abstract getAvailableModels(): string[];
  abstract chat(messages: AIMessage[]): Promise<AIResponse>;

  async analyzeCode(code: string, filePath: string): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert code reviewer and analyzer. Analyze the provided code and give specific, actionable recommendations for improvements, bug fixes, security issues, performance optimizations, and best practices.',
      },
      {
        role: 'user',
        content: `Analyze this code from file: ${filePath}\n\n\`\`\`\n${code}\n\`\`\`\n\nProvide specific recommendations for:\n1. Bug fixes\n2. Security vulnerabilities\n3. Performance improvements\n4. Code quality and best practices\n5. Potential edge cases\n\nBe concise but specific.`,
      },
    ];

    const response = await this.chat(messages);
    return response.content;
  }

  async analyzeProject(projectSummary: string): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert software architect and code reviewer. Analyze the project structure and provide high-level recommendations.',
      },
      {
        role: 'user',
        content: `Analyze this project:\n\n${projectSummary}\n\nProvide recommendations for:\n1. Architecture improvements\n2. Project structure optimization\n3. Missing components or files\n4. Security concerns\n5. Best practices\n\nBe specific and actionable.`,
      },
    ];

    const response = await this.chat(messages);
    return response.content;
  }
}
