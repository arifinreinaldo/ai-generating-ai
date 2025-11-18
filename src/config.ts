import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Config {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class ConfigManager {
  private configPath: string;
  private config: Config;

  constructor() {
    this.configPath = path.join(os.homedir(), '.grok-config.json');
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

  public getApiKey(): string | undefined {
    // Check environment variable first
    const envKey = process.env.GROK_API_KEY;
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
}
