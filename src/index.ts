#!/usr/bin/env node

import { Command } from 'commander';
import { CLI } from './cli';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('grok-terminal')
  .description('AI-powered code analysis terminal using Grok API')
  .version('1.0.0')
  .argument('[project-path]', 'Path to the project to analyze', process.cwd())
  .action(async (projectPath: string) => {
    try {
      const cli = new CLI();
      await cli.run(projectPath);
    } catch (error) {
      console.error('Fatal error:', error);
      process.exit(1);
    }
  });

program.parse();
