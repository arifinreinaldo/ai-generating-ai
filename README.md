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

## 🚀 Quick Start

**For the impatient:**

### Windows
```cmd
# 1. Install Node.js from https://nodejs.org
# 2. Open Command Prompt and run:
cd %USERPROFILE%\Documents
git clone <repository-url>
cd ai-generating-ai
npm install && npm run build
npm start
```

### macOS
```bash
# 1. Install Homebrew and Node.js
brew install node

# 2. Open Terminal and run:
cd ~/Documents
git clone <repository-url>
cd ai-generating-ai
npm install && npm run build
npm start
```

**On first run**, you'll select your AI provider and enter your API key. That's it!

💡 **Recommended for beginners:** Use **DeepSeek** - excellent code analysis, very affordable.

---

## Installation & Setup

### Platform Requirements

✅ **Windows** (10/11)
✅ **macOS** (Sequoia 15.x, Sonoma 14.x, Ventura 13.x, and earlier)
✅ **Linux** (Ubuntu, Debian, Fedora, etc.)
✅ **Apple Silicon** (M1/M2/M3/M4) - Native support

### Prerequisites

**All Platforms:**
- Node.js 18+ installed
- Git installed
- API key from at least one supported provider

---

### Windows Installation

#### Step 1: Install Node.js

**Option A: Download Installer**
1. Visit https://nodejs.org/
2. Download the **LTS version** for Windows
3. Run the `.msi` installer
4. Follow the installation wizard (keep default settings)
5. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

**Option B: Using Chocolatey**
```cmd
choco install nodejs-lts
```

#### Step 2: Clone & Setup

Open **Command Prompt** or **PowerShell**:

```cmd
# Navigate to your preferred location
cd %USERPROFILE%\Documents

# Clone the repository
git clone <repository-url>
cd ai-generating-ai

# Install dependencies
npm install

# Build the project
npm run build
```

#### Step 3: Configure API Key (Windows)

**Method 1: Environment Variable (Session)**
```cmd
# Command Prompt
set DEEPSEEK_API_KEY=your-api-key-here

# PowerShell
$env:DEEPSEEK_API_KEY="your-api-key-here"
```

**Method 2: .env File (Recommended)**
```cmd
# Copy example file
copy .env.example .env

# Edit with Notepad
notepad .env
```

Add your API key:
```env
DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

#### Step 4: Run on Windows

```cmd
# Analyze current directory
npm start

# Analyze specific project
npm start C:\Projects\my-app

# Or with quotes for paths with spaces
npm start "C:\My Projects\my-app"
```

**Optional: Global Installation**
```cmd
npm link
grok-terminal C:\Projects\my-app
```

---

### macOS Installation

#### Step 1: Install Node.js

**Option A: Using Homebrew (Recommended)**
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

**Option B: Download Installer**
1. Visit https://nodejs.org/
2. Download **LTS version** for macOS
3. Open the `.pkg` file and follow installer
4. Verify in Terminal: `node --version`

#### Step 2: Clone & Setup

Open **Terminal** (Cmd + Space, type "Terminal"):

```bash
# Navigate to your preferred location
cd ~/Documents

# Clone the repository
git clone <repository-url>
cd ai-generating-ai

# Install dependencies
npm install

# Build the project
npm run build
```

#### Step 3: Configure API Key (macOS)

**Method 1: Environment Variable (Session)**
```bash
export DEEPSEEK_API_KEY="your-api-key-here"
```

**Method 2: Permanent (Add to shell profile)**

For **zsh** (default on macOS):
```bash
echo 'export DEEPSEEK_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

For **bash**:
```bash
echo 'export DEEPSEEK_API_KEY="your-api-key-here"' >> ~/.bash_profile
source ~/.bash_profile
```

**Method 3: .env File (Recommended)**
```bash
# Copy example file
cp .env.example .env

# Edit with your preferred editor
nano .env
# or
open -e .env
```

Add your API key:
```env
DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

#### Step 4: Run on macOS

```bash
# Analyze current directory
npm start

# Analyze specific project
npm start ~/Projects/my-app
npm start /Users/yourname/Documents/project

# Relative paths
npm start ../another-project
```

**Optional: Global Installation**
```bash
npm link
grok-terminal ~/Projects/my-app
```

---

## Usage

### First-Time Interactive Setup

The easiest way to get started on **both Windows and macOS**:

```bash
# Just run the program
npm start
```

You'll be guided through:
1. **Select AI Provider** - Choose from 6 options
2. **Enter API Key** - Securely stored in your home directory
3. **Start Analyzing** - Immediate code analysis

### Running the Terminal

**Windows:**
```cmd
# Current directory
npm start

# Specific project
npm start C:\Projects\my-app

# Path with spaces (use quotes)
npm start "C:\My Documents\Projects\my-app"

# If globally installed
grok-terminal C:\Projects\my-app
```

**macOS:**
```bash
# Current directory
npm start

# Specific project (absolute path)
npm start ~/Projects/my-app
npm start /Users/yourname/Documents/my-app

# Relative path
npm start ../another-project

# If globally installed
grok-terminal ~/Projects/my-app
```

### Configuration Storage Locations

**Windows:**
- Config file: `C:\Users\YourUsername\.ai-terminal-config.json`
- .env file: `C:\path\to\ai-generating-ai\.env`

**macOS:**
- Config file: `~/.ai-terminal-config.json`
- .env file: `~/Documents/ai-generating-ai/.env` (or wherever you cloned)

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

Configuration is automatically saved after first setup:

**Windows:** `C:\Users\YourUsername\.ai-terminal-config.json`
**macOS/Linux:** `~/.ai-terminal-config.json`

```json
{
  "provider": "deepseek",
  "apiKey": "your-api-key",
  "model": "deepseek-chat",
  "maxTokens": 4096,
  "temperature": 0.7
}
```

You can manually edit this file or use the interactive configuration menu (`⚙️ Configure settings`).

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

### General Issues

**API Key Issues**
- Ensure your API key is valid and has proper permissions
- Check that the key is correctly set in config or environment variables
- Verify you're using the correct provider's API key

**Network Errors**
- Verify internet connection
- Check if the API endpoint is accessible
- Consider firewall or proxy settings

**File Scanning Issues**
- Ensure you have read permissions for the project directory
- Check `.gitignore` patterns if files are being skipped
- Large files (>1MB) are automatically skipped

---

### Windows-Specific Issues

**"npm is not recognized" Error**
```cmd
# Restart terminal after installing Node.js
# Or add to PATH manually:
# 1. Search "Environment Variables" in Windows
# 2. Edit PATH variable
# 3. Add: C:\Program Files\nodejs\
```

**Permission Errors**
```cmd
# Run Command Prompt as Administrator
# Right-click → "Run as administrator"
```

**PowerShell Execution Policy**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Path with Spaces**
```cmd
# Always use quotes
npm start "C:\My Projects\my-app"
```

**Firewall Blocking Node.js**
- Windows Security → Firewall & Network Protection
- Allow Node.js through firewall

---

### macOS-Specific Issues

**Permission Errors**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Using nvm (Recommended)**
```bash
# Install nvm to avoid permission issues
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js via nvm
nvm install --lts
nvm use --lts
```

**Xcode Command Line Tools Required**
```bash
xcode-select --install
```

**"Command not found" after npm link**
```bash
# Add npm global bin to PATH
echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.zshrc
source ~/.zshrc
```

**M1/M2/M3/M4 Apple Silicon**
- Works natively on ARM64 (no Rosetta needed)
- If issues occur: `arch -x86_64 npm install`

**macOS Firewall**
- System Settings → Network → Firewall
- Allow Node.js if prompted

---

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
