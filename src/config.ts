import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ProviderType, ProviderFactory } from './providers';

export interface Config {
  provider?: ProviderType;
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class ConfigManager {
  private configPath: string;
  private config: Config;

  constructor() {
    this.configPath = path.join(os.homedir(), '.ai-terminal-config.json');
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Failed to load config, using defaults');
    }
    return {
      provider: 'grok',
      model: 'grok-beta',
      maxTokens: 4096,
      temperature: 0.7,
    };
  }

  public saveConfig(config: Partial<Config>): void {
    this.config = { ...this.config, ...config };
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      throw new Error(`Failed to save config: ${error}`);
    }
  }

  public getConfig(): Config {
    return { ...this.config };
  }

  public getProvider(): ProviderType {
    return this.config.provider || 'grok';
  }

  public setProvider(provider: ProviderType): void {
    this.saveConfig({ provider });
  }

  public getApiKey(): string | undefined {
    const provider = this.getProvider();
    const providerInfo = ProviderFactory.getProviderInfo(provider);

    // Check environment variable first
    const envKey = process.env[providerInfo.envVarName];
    if (envKey) {
      return envKey;
    }

    return this.config.apiKey;
  }

  public setApiKey(apiKey: string): void {
    this.saveConfig({ apiKey });
  }

  public hasApiKey(): boolean {
    return !!this.getApiKey();
  }

  public getModel(): string | undefined {
    return this.config.model;
  }

  public setModel(model: string): void {
    this.saveConfig({ model });
  }
}
