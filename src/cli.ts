import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { ConfigManager } from './config';
import { AIProvider, ProviderFactory, ProviderType, AVAILABLE_PROVIDERS } from './providers';
import { ProjectScanner } from './scanner';

export class CLI {
  private configManager: ConfigManager;
  private aiProvider?: AIProvider;

  constructor() {
    this.configManager = new ConfigManager();
  }

  private async ensureProviderAndApiKey(): Promise<void> {
    const config = this.configManager.getConfig();

    // Check if provider is set
    if (!config.provider) {
      console.log(chalk.yellow('No AI provider configured. Let\'s set one up!\n'));
      await this.selectProvider();
    }

    // Check if API key exists
    if (!this.configManager.hasApiKey()) {
      const providerInfo = ProviderFactory.getProviderInfo(this.configManager.getProvider());
      console.log(chalk.yellow(`\nNo API key found for ${providerInfo.name}.`));
      console.log(chalk.gray(`You can also set the ${providerInfo.envVarName} environment variable.\n`));

      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: `Enter your ${providerInfo.name} API key:`,
          validate: (input: string) => input.length > 0 || 'API key is required',
        },
      ]);
      this.configManager.setApiKey(apiKey);
      console.log(chalk.green('API key saved successfully!'));
    }
  }

  private async selectProvider(): Promise<void> {
    const choices = AVAILABLE_PROVIDERS.map(provider => ({
      name: `${provider.name} - ${provider.description}`,
      value: provider.id,
    }));

    const { provider } = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'Select your AI provider:',
        choices,
      },
    ]);

    this.configManager.setProvider(provider);

    const providerInfo = ProviderFactory.getProviderInfo(provider);
    console.log(chalk.green(`\nProvider set to ${providerInfo.name}`));
  }

  private initializeAIProvider(): void {
    const apiKey = this.configManager.getApiKey();
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const config = this.configManager.getConfig();
    const provider = this.configManager.getProvider();

    this.aiProvider = ProviderFactory.createProvider(provider, {
      apiKey,
      model: config.model,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
    });
  }

  private async analyzeProjectOverview(projectPath: string): Promise<void> {
    if (!this.aiProvider) {
      throw new Error('AI provider not initialized');
    }

    const spinner = ora('Scanning project...').start();

    try {
      const scanner = new ProjectScanner(projectPath);
      const scanResult = scanner.scan(projectPath);

      spinner.text = `Found ${scanResult.totalFiles} files. Generating summary...`;

      const summary = scanner.generateProjectSummary(scanResult);

      spinner.text = `Analyzing project with ${this.aiProvider.getProviderName()}...`;

      const analysis = await this.aiProvider.analyzeProject(summary);

      spinner.succeed(chalk.green('Analysis complete!'));

      console.log('\n' + chalk.bold.cyan('Project Analysis:'));
      console.log(chalk.white('─'.repeat(80)));
      console.log(analysis);
      console.log(chalk.white('─'.repeat(80)) + '\n');
    } catch (error) {
      spinner.fail(chalk.red('Analysis failed'));
      throw error;
    }
  }

  private async analyzeSpecificFiles(projectPath: string): Promise<void> {
    if (!this.aiProvider) {
      throw new Error('AI provider not initialized');
    }

    const spinner = ora('Scanning project...').start();

    try {
      const scanner = new ProjectScanner(projectPath);
      const scanResult = scanner.scan(projectPath);

      spinner.stop();

      if (scanResult.files.length === 0) {
        console.log(chalk.yellow('No files found to analyze.'));
        return;
      }

      // Group files by directory for better selection
      const fileChoices = scanResult.files.map(file => ({
        name: `${file.relativePath} (${(file.size / 1024).toFixed(2)} KB)`,
        value: file,
      }));

      const { selectedFiles } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedFiles',
          message: 'Select files to analyze (use space to select, enter to confirm):',
          choices: fileChoices,
          pageSize: 15,
          validate: (input: any[]) => input.length > 0 || 'Please select at least one file',
        },
      ]);

      for (const file of selectedFiles) {
        const fileSpinner = ora(`Analyzing ${file.relativePath}...`).start();

        try {
          const analysis = await this.aiProvider.analyzeCode(file.content, file.relativePath);

          fileSpinner.succeed(chalk.green(`Analyzed ${file.relativePath}`));

          console.log('\n' + chalk.bold.cyan(`Analysis for: ${file.relativePath}`));
          console.log(chalk.white('─'.repeat(80)));
          console.log(analysis);
          console.log(chalk.white('─'.repeat(80)) + '\n');
        } catch (error) {
          fileSpinner.fail(chalk.red(`Failed to analyze ${file.relativePath}`));
          console.error(chalk.red(`Error: ${error}`));
        }
      }
    } catch (error) {
      spinner.fail(chalk.red('Scan failed'));
      throw error;
    }
  }

  private async configureSettings(): Promise<void> {
    const config = this.configManager.getConfig();
    const providerInfo = ProviderFactory.getProviderInfo(this.configManager.getProvider());

    console.log(chalk.cyan('\nCurrent Configuration:'));
    console.log(chalk.white(`Provider: ${providerInfo.name}`));
    console.log(chalk.white(`API Key: ${config.apiKey ? '***configured***' : 'not set'}`));
    console.log(chalk.white(`Model: ${config.model || providerInfo.defaultModel}`));
    console.log(chalk.white(`Max Tokens: ${config.maxTokens}`));
    console.log(chalk.white(`Temperature: ${config.temperature}\n`));

    const { whatToChange } = await inquirer.prompt([
      {
        type: 'list',
        name: 'whatToChange',
        message: 'What would you like to configure?',
        choices: [
          { name: 'AI Provider', value: 'provider' },
          { name: 'API Key', value: 'apiKey' },
          { name: 'Model', value: 'model' },
          { name: 'Max Tokens', value: 'maxTokens' },
          { name: 'Temperature', value: 'temperature' },
          { name: 'Go Back', value: 'back' },
        ],
      },
    ]);

    if (whatToChange === 'back') {
      return;
    }

    let newValue: any;
    let needsReinitialize = false;

    switch (whatToChange) {
      case 'provider':
        await this.selectProvider();
        // Clear API key when changing provider
        this.configManager.saveConfig({ apiKey: undefined });
        await this.ensureProviderAndApiKey();
        needsReinitialize = true;
        break;

      case 'apiKey':
        const { apiKey } = await inquirer.prompt([
          {
            type: 'password',
            name: 'apiKey',
            message: 'Enter new API key:',
            validate: (input: string) => input.length > 0 || 'API key is required',
          },
        ]);
        newValue = { apiKey };
        needsReinitialize = true;
        break;

      case 'model':
        // Show available models for current provider
        if (this.aiProvider) {
          const availableModels = this.aiProvider.getAvailableModels();
          const modelChoices = availableModels.map(m => ({ name: m, value: m }));
          modelChoices.push({ name: 'Custom (enter manually)', value: 'custom' });

          const { modelChoice } = await inquirer.prompt([
            {
              type: 'list',
              name: 'modelChoice',
              message: 'Select a model:',
              choices: modelChoices,
            },
          ]);

          if (modelChoice === 'custom') {
            const { model } = await inquirer.prompt([
              {
                type: 'input',
                name: 'model',
                message: 'Enter model name:',
                default: config.model,
              },
            ]);
            newValue = { model };
          } else {
            newValue = { model: modelChoice };
          }
        }
        needsReinitialize = true;
        break;

      case 'maxTokens':
        const { maxTokens } = await inquirer.prompt([
          {
            type: 'number',
            name: 'maxTokens',
            message: 'Enter max tokens:',
            default: config.maxTokens,
            validate: (input: number) => input > 0 || 'Must be greater than 0',
          },
        ]);
        newValue = { maxTokens };
        needsReinitialize = true;
        break;

      case 'temperature':
        const { temperature } = await inquirer.prompt([
          {
            type: 'number',
            name: 'temperature',
            message: 'Enter temperature (0.0 - 2.0):',
            default: config.temperature,
            validate: (input: number) =>
              (input >= 0 && input <= 2) || 'Must be between 0.0 and 2.0',
          },
        ]);
        newValue = { temperature };
        needsReinitialize = true;
        break;
    }

    if (newValue) {
      this.configManager.saveConfig(newValue);
      console.log(chalk.green('Configuration updated successfully!'));
    }

    // Reinitialize if needed
    if (needsReinitialize && this.configManager.hasApiKey()) {
      this.initializeAIProvider();
    }
  }

  public async run(projectPath?: string): Promise<void> {
    const providerInfo = ProviderFactory.getProviderInfo(this.configManager.getProvider());

    console.log(chalk.bold.cyan('\n🤖 AI Code Analysis Terminal\n'));

    await this.ensureProviderAndApiKey();
    this.initializeAIProvider();

    console.log(chalk.gray(`Using: ${this.aiProvider?.getProviderName()}\n`));

    const targetPath = projectPath || process.cwd();
    const absolutePath = path.resolve(targetPath);

    console.log(chalk.gray(`Project: ${absolutePath}\n`));

    let continueRunning = true;

    while (continueRunning) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '📊 Analyze entire project', value: 'project' },
            { name: '📄 Analyze specific files', value: 'files' },
            { name: '⚙️  Configure settings', value: 'config' },
            { name: '🚪 Exit', value: 'exit' },
          ],
        },
      ]);

      try {
        switch (action) {
          case 'project':
            await this.analyzeProjectOverview(absolutePath);
            break;

          case 'files':
            await this.analyzeSpecificFiles(absolutePath);
            break;

          case 'config':
            await this.configureSettings();
            break;

          case 'exit':
            continueRunning = false;
            console.log(chalk.cyan('\nGoodbye! 👋\n'));
            break;
        }
      } catch (error) {
        console.error(chalk.red(`\nError: ${error}\n`));
      }
    }
  }
}
