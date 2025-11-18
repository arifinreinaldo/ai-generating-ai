# AI Code Analysis Terminal

An AI-powered code analysis terminal that supports multiple AI providers (Grok, OpenAI, Claude, Gemini, Cohere, DeepSeek) to scan projects and provide intelligent recommendations for improvements, bug fixes, and best practices.

## Features

- 🤖 **Multiple AI Providers**: Choose from Grok, OpenAI GPT-4, Claude, Google Gemini, Cohere, or DeepSeek
- 🔍 **Project Scanning**: Automatically scans your project and respects `.gitignore` patterns
- 📊 **Project Overview**: Get high-level insights about your entire project architecture
- 📄 **File-Level Analysis**: Deep dive into specific files for detailed code review
- ⚙️ **Configurable**: Customize provider, model, tokens, temperature, and more
- 🎨 **Interactive CLI**: Beautiful, user-friendly terminal interface
- 🔐 **Secure**: API keys stored locally or via environment variables

## Supported AI Providers

| Provider | Models | API Key Source |
|----------|--------|----------------|
| **Grok (X.AI)** | grok-beta, grok-2-1212, grok-2-vision-1212 | [x.ai](https://x.ai) |
| **OpenAI** | gpt-4-turbo-preview, gpt-4, gpt-3.5-turbo | [OpenAI Platform](https://platform.openai.com) |
| **Anthropic** | claude-3-5-sonnet, claude-3-opus, claude-3-sonnet, claude-3-haiku | [Anthropic Console](https://console.anthropic.com) |
| **Google** | gemini-pro, gemini-1.5-pro, gemini-1.5-flash | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| **Cohere** | command, command-light, command-nightly | [Cohere Dashboard](https://dashboard.cohere.com) |
| **DeepSeek** | deepseek-chat, deepseek-coder | [DeepSeek Platform](https://platform.deepseek.com) |

## Installation

### Prerequisites

- Node.js 18+ installed
- API key from at least one supported provider

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-generating-ai
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. (Optional) Link globally to use from anywhere:
```bash
npm link
```

## Usage

### Running the Terminal

Run in the current directory:
```bash
npm start
```

Or specify a project path:
```bash
npm start /path/to/your/project
```

If installed globally:
```bash
grok-terminal /path/to/your/project
```

### First-Time Setup

On first run, you'll be prompted to:
1. **Select an AI provider** - Choose from Grok, OpenAI, Claude, Gemini, Cohere, or DeepSeek
2. **Enter your API key** - The key will be securely stored in `~/.ai-terminal-config.json`

### API Key Configuration

You can configure API keys in three ways:

#### 1. Interactive Prompt (Recommended)
The CLI will prompt you for your API key on first run.

#### 2. Environment Variables
Set the appropriate environment variable:
```bash
export GROK_API_KEY="your-key-here"
export OPENAI_API_KEY="your-key-here"
export ANTHROPIC_API_KEY="your-key-here"
export GOOGLE_API_KEY="your-key-here"
export COHERE_API_KEY="your-key-here"
export DEEPSEEK_API_KEY="your-key-here"
```

#### 3. .env File
Create a `.env` file (use `.env.example` as template):
```env
# Choose your provider and set the corresponding API key
GROK_API_KEY=your-grok-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here
GOOGLE_API_KEY=your-google-api-key-here
COHERE_API_KEY=your-cohere-api-key-here
DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

## Features Guide

### 1. Analyze Entire Project
Get a comprehensive analysis of your project including:
- Architecture recommendations
- Project structure optimization
- Missing components or files
- Security concerns at project level
- Best practices for your stack

### 2. Analyze Specific Files
Select individual files for detailed analysis:
- Bug detection and fixes
- Security vulnerabilities
- Performance optimizations
- Code quality improvements
- Edge case identification
- Best practices per file

### 3. Configure Settings
Customize the AI behavior through an interactive menu:
- **AI Provider**: Switch between Grok, OpenAI, Claude, Gemini, Cohere, or DeepSeek
- **API Key**: Update your API key for the current provider
- **Model**: Choose from available models or enter custom model name
- **Max Tokens**: Set maximum response length (default: 4096)
- **Temperature**: Adjust creativity/randomness (0.0-2.0, default: 0.7)

## Configuration

Configuration is stored in `~/.ai-terminal-config.json`:

```json
{
  "provider": "grok",
  "apiKey": "your-api-key",
  "model": "grok-beta",
  "maxTokens": 4096,
  "temperature": 0.7
}
```

## Supported File Types

The scanner automatically detects and analyzes:

**Languages:** JavaScript, TypeScript, Python, Java, Go, Rust, C/C++, C#, PHP, Ruby, Swift, Kotlin, Scala, R, Objective-C

**Web:** HTML, CSS, SCSS, SASS, LESS, Vue, Svelte

**Config:** JSON, YAML, TOML, XML, SQL, Markdown

And many more...

## Ignored Patterns

The following are automatically ignored:
- `node_modules/`, `.git/`, `dist/`, `build/`
- `coverage/`, `.next/`, `.nuxt/`, `out/`
- `__pycache__/`, `.pytest_cache/`, `venv/`, `vendor/`
- `.env` files, lock files
- Patterns from your `.gitignore`

## Example Usage

### Switching Providers

```bash
$ npm start

🤖 AI Code Analysis Terminal

? Select your AI provider:
  Grok (X.AI) - X.AI's Grok models - Fast and powerful
❯ OpenAI - GPT-4 and GPT-3.5 models
  Anthropic (Claude) - Claude 3 models - Opus, Sonnet, and Haiku
  Google (Gemini) - Google's Gemini models
  Cohere - Cohere Command models
  DeepSeek - DeepSeek Chat and Coder models - Excellent for code
```

### Project Analysis Example

```
? What would you like to do? 📊 Analyze entire project

⠹ Analyzing project with OpenAI...
✔ Analysis complete!

Project Analysis:
────────────────────────────────────────────────────────────────────────────────
Based on the project structure, here are my recommendations:

1. Architecture Improvements:
   - Consider implementing a service layer pattern
   - Add dependency injection for better testability

2. Security Concerns:
   - Missing input validation in API endpoints (src/api/users.ts)
   - Add rate limiting middleware

3. Best Practices:
   - Enable TypeScript strict mode in tsconfig.json
   - Implement comprehensive error handling
   ...
────────────────────────────────────────────────────────────────────────────────
```

### File Analysis Example

```
? Select files to analyze:
  ◉ src/api/users.ts (2.5 KB)
  ◯ src/utils/helpers.ts (1.2 KB)
  ◉ src/models/user.ts (3.1 KB)

⠹ Analyzing src/api/users.ts...
✔ Analyzed src/api/users.ts

Analysis for: src/api/users.ts
────────────────────────────────────────────────────────────────────────────────
1. Bug Fixes:
   - Line 45: Potential null reference when user is undefined
   - Line 78: Array index out of bounds possible

2. Security Vulnerabilities:
   - Line 23: SQL injection risk - use parameterized queries
   - Line 56: Missing authentication check

3. Performance:
   - Line 67: N+1 query problem - use JOIN or batch loading
   ...
────────────────────────────────────────────────────────────────────────────────
```

## Development

### Project Structure

```
ai-generating-ai/
├── src/
│   ├── providers/          # AI provider implementations
│   │   ├── base.ts         # Abstract provider interface
│   │   ├── grok.ts         # Grok provider
│   │   ├── openai.ts       # OpenAI provider
│   │   ├── anthropic.ts    # Anthropic provider
│   │   ├── google.ts       # Google provider
│   │   ├── cohere.ts       # Cohere provider
│   │   └── index.ts        # Provider factory
│   ├── index.ts            # Main entry point
│   ├── cli.ts              # Interactive CLI
│   ├── scanner.ts          # Project file scanner
│   └── config.ts           # Configuration manager
├── dist/                   # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

## Comparison of AI Providers

| Feature | Grok | OpenAI | Claude | Gemini | Cohere | DeepSeek |
|---------|------|--------|--------|--------|--------|----------|
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡⚡⚡ | ⚡⚡ | ⚡⚡⚡ |
| Code Understanding | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Cost | $ | $$$ | $$ | $ | $$ | $ |
| Context Window | Large | Large | Very Large | Very Large | Medium | Very Large |
| Best For | Quick analysis | General purpose | Deep analysis | Fast insights | NLP tasks | Code-focused |

## Troubleshooting

### API Key Issues
- Ensure your API key is valid and has proper permissions
- Check that the key is correctly set in config or environment variables
- Verify you're using the correct provider's API key

### Network Errors
- Verify internet connection
- Check if the API endpoint is accessible
- Consider firewall or proxy settings

### File Scanning Issues
- Ensure you have read permissions for the project directory
- Check `.gitignore` patterns if files are being skipped
- Large files (>1MB) are automatically skipped

### Provider-Specific Issues

**Grok:** Requires API access from X.AI - check your account status

**OpenAI:** Rate limits may apply - check your usage tier

**Claude:** Requires Anthropic API access - separate from Claude.ai web access

**Gemini:** Ensure API key is from Google AI Studio, not Google Cloud

**Cohere:** Check dashboard for usage limits and quotas

**DeepSeek:** Verify API access from DeepSeek Platform - excellent for code analysis tasks

## Contributing

Contributions are welcome! To add a new AI provider:

1. Create a new provider class in `src/providers/`
2. Extend the `AIProvider` abstract class
3. Implement required methods: `getProviderName()`, `getDefaultModel()`, `getAvailableModels()`, `chat()`
4. Add provider to `ProviderFactory` and `AVAILABLE_PROVIDERS`
5. Update documentation

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

## Changelog

### v2.1.0 - DeepSeek Integration
- Added DeepSeek provider support
- DeepSeek Chat and Coder models for excellent code analysis
- Cost-effective option with large context window

### v2.0.0 - Multi-Provider Support
- Added support for OpenAI, Anthropic Claude, Google Gemini, and Cohere
- Provider abstraction layer for easy extension
- Interactive provider selection
- Model selection per provider
- Updated configuration system

### v1.0.0 - Initial Release
- Grok AI integration
- Project and file-level analysis
- Interactive CLI
- Configuration management
