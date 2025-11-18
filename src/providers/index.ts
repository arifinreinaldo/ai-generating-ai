import { AIProvider, AIProviderConfig } from './base';
import { GrokProvider } from './grok';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';
import { GoogleProvider } from './google';
import { CohereProvider } from './cohere';

export type ProviderType = 'grok' | 'openai' | 'anthropic' | 'google' | 'cohere';

export interface ProviderInfo {
  id: ProviderType;
  name: string;
  description: string;
  defaultModel: string;
  envVarName: string;
}

export const AVAILABLE_PROVIDERS: ProviderInfo[] = [
  {
    id: 'grok',
    name: 'Grok (X.AI)',
    description: 'X.AI\'s Grok models - Fast and powerful',
    defaultModel: 'grok-beta',
    envVarName: 'GROK_API_KEY',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 models',
    defaultModel: 'gpt-4-turbo-preview',
    envVarName: 'OPENAI_API_KEY',
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    description: 'Claude 3 models - Opus, Sonnet, and Haiku',
    defaultModel: 'claude-3-5-sonnet-20241022',
    envVarName: 'ANTHROPIC_API_KEY',
  },
  {
    id: 'google',
    name: 'Google (Gemini)',
    description: 'Google\'s Gemini models',
    defaultModel: 'gemini-pro',
    envVarName: 'GOOGLE_API_KEY',
  },
  {
    id: 'cohere',
    name: 'Cohere',
    description: 'Cohere Command models',
    defaultModel: 'command',
    envVarName: 'COHERE_API_KEY',
  },
];

export class ProviderFactory {
  static createProvider(type: ProviderType, config: AIProviderConfig): AIProvider {
    switch (type) {
      case 'grok':
        return new GrokProvider(config);
      case 'openai':
        return new OpenAIProvider(config);
      case 'anthropic':
        return new AnthropicProvider(config);
      case 'google':
        return new GoogleProvider(config);
      case 'cohere':
        return new CohereProvider(config);
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }

  static getProviderInfo(type: ProviderType): ProviderInfo {
    const info = AVAILABLE_PROVIDERS.find(p => p.id === type);
    if (!info) {
      throw new Error(`Unknown provider type: ${type}`);
    }
    return info;
  }

  static getAllProviders(): ProviderInfo[] {
    return AVAILABLE_PROVIDERS;
  }
}

// Export everything
export { AIProvider, AIProviderConfig, AIMessage, AIResponse } from './base';
export { GrokProvider } from './grok';
export { OpenAIProvider } from './openai';
export { AnthropicProvider } from './anthropic';
export { GoogleProvider } from './google';
export { CohereProvider } from './cohere';
