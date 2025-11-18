import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { ConfigManager } from './config';
import { GrokClient } from './grok-client';
import { ProjectScanner } from './scanner';

export class CLI {
  private configManager: ConfigManager;
  private grokClient?: GrokClient;

  constructor() {
    this.configManager = new ConfigManager();
  }

  private async ensureApiKey(): Promise<void> {
    if (!this.configManager.hasApiKey()) {
      console.log(chalk.yellow('No API key found. Please configure your Grok API key.'));
      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your Grok API key:',
          validate: (input: string) => input.length > 0 || 'API key is required',
        },
      ]);
      this.configManager.setApiKey(apiKey);
      console.log(chalk.green('API key saved successfully!'));
    }
  }

  private initializeGrokClient(): void {
    const apiKey = this.configManager.getApiKey();
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const config = this.configManager.getConfig();
    this.grokClient = new GrokClient(
      apiKey,
      config.model,
      config.maxTokens,
      config.temperature
    );
  }

  private async analyzeProjectOverview(projectPath: string): Promise<void> {
    if (!this.grokClient) {
      throw new Error('Grok client not initialized');
    }

    const spinner = ora('Scanning project...').start();

    try {
      const scanner = new ProjectScanner(projectPath);
      const scanResult = scanner.scan(projectPath);

      spinner.text = `Found ${scanResult.totalFiles} files. Generating summary...`;

      const summary = scanner.generateProjectSummary(scanResult);

      spinner.text = 'Analyzing project with Grok AI...';

      const analysis = await this.grokClient.analyzeProject(summary);

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
    if (!this.grokClient) {
      throw new Error('Grok client not initialized');
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
          const analysis = await this.grokClient.analyzeCode(file.content, file.relativePath);

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

    console.log(chalk.cyan('\nCurrent Configuration:'));
    console.log(chalk.white(`API Key: ${config.apiKey ? '***configured***' : 'not set'}`));
    console.log(chalk.white(`Model: ${config.model}`));
    console.log(chalk.white(`Max Tokens: ${config.maxTokens}`));
    console.log(chalk.white(`Temperature: ${config.temperature}\n`));

    const { whatToChange } = await inquirer.prompt([
      {
        type: 'list',
        name: 'whatToChange',
        message: 'What would you like to configure?',
        choices: [
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

    switch (whatToChange) {
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
        break;

      case 'model':
        const { model } = await inquirer.prompt([
          {
            type: 'input',
            name: 'model',
            message: 'Enter model name:',
            default: config.model,
          },
        ]);
        newValue = { model };
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
        break;
    }

    this.configManager.saveConfig(newValue);
    console.log(chalk.green('Configuration updated successfully!'));
  }

  public async run(projectPath?: string): Promise<void> {
    console.log(chalk.bold.cyan('\n🤖 Grok AI Terminal\n'));

    await this.ensureApiKey();
    this.initializeGrokClient();

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
            // Reinitialize client if API key changed
            if (this.configManager.hasApiKey()) {
              this.initializeGrokClient();
            }
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
