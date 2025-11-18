# Grok AI Terminal

An AI-powered code analysis terminal that uses Grok API to scan projects and provide intelligent recommendations for improvements, bug fixes, and best practices.

## Features

- 🔍 **Project Scanning**: Automatically scans your project and respects `.gitignore` patterns
- 🤖 **AI-Powered Analysis**: Uses Grok AI to analyze code and provide actionable recommendations
- 📊 **Project Overview**: Get high-level insights about your entire project architecture
- 📄 **File-Level Analysis**: Deep dive into specific files for detailed code review
- ⚙️ **Configurable**: Customize API settings, model parameters, and more
- 🎨 **Interactive CLI**: Beautiful, user-friendly terminal interface

## Installation

### Prerequisites

- Node.js 18+ installed
- Grok API key from [x.ai](https://x.ai)

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
grok-terminal
grok-terminal /path/to/your/project
```

### First-Time Setup

On first run, you'll be prompted to enter your Grok API key. The key will be securely stored in `~/.grok-config.json`.

Alternatively, set the API key as an environment variable:
```bash
export GROK_API_KEY="your-api-key-here"
```

Or create a `.env` file:
```
GROK_API_KEY=your-api-key-here
```

### Features

#### 1. Analyze Entire Project
Get a comprehensive analysis of your project including:
- Architecture recommendations
- Project structure optimization
- Missing components
- Security concerns
- Best practices

#### 2. Analyze Specific Files
Select individual files for detailed analysis:
- Bug detection
- Security vulnerabilities
- Performance optimizations
- Code quality improvements
- Edge case identification

#### 3. Configure Settings
Customize the AI behavior:
- **API Key**: Update your Grok API key
- **Model**: Change the Grok model (default: `grok-beta`)
- **Max Tokens**: Set maximum response length (default: 4096)
- **Temperature**: Adjust creativity (0.0-2.0, default: 0.7)

## Configuration

Configuration is stored in `~/.grok-config.json`:

```json
{
  "apiKey": "your-api-key",
  "model": "grok-beta",
  "maxTokens": 4096,
  "temperature": 0.7
}
```

### Supported File Types

The scanner automatically detects and analyzes:
- JavaScript/TypeScript (.js, .ts, .jsx, .tsx)
- Python (.py)
- Java (.java)
- Go (.go)
- Rust (.rs)
- C/C++ (.c, .cpp, .h, .hpp)
- C# (.cs)
- PHP (.php)
- Ruby (.rb)
- Swift (.swift)
- Kotlin (.kt)
- And many more...

### Ignored Patterns

The following are automatically ignored:
- `node_modules/`
- `.git/`
- `dist/`, `build/`
- `coverage/`
- `.env` files
- Lock files
- And patterns from your `.gitignore`

## Development

### Project Structure

```
ai-generating-ai/
├── src/
│   ├── index.ts          # Main entry point
│   ├── cli.ts            # Interactive CLI interface
│   ├── grok-client.ts    # Grok API client
│   ├── scanner.ts        # Project file scanner
│   └── config.ts         # Configuration manager
├── dist/                 # Compiled output
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

## API Key

Get your Grok API key from [x.ai](https://x.ai). The API uses the same authentication as Claude Code but connects to Grok's models.

## Examples

### Example Output - Project Analysis

```
🤖 Grok AI Terminal

Project: /home/user/my-project

? What would you like to do? 📊 Analyze entire project

✔ Analysis complete!

Project Analysis:
────────────────────────────────────────────────────────────────────────────────
Based on the project structure, here are my recommendations:

1. Architecture Improvements:
   - Consider implementing a service layer to separate business logic
   - Add dependency injection for better testability

2. Security Concerns:
   - Missing input validation in API endpoints
   - Consider adding rate limiting

3. Best Practices:
   - Add TypeScript strict mode
   - Implement proper error handling
   ...
────────────────────────────────────────────────────────────────────────────────
```

### Example Output - File Analysis

```
? Select files to analyze:
  ◉ src/api/users.ts (2.5 KB)
  ◯ src/utils/helpers.ts (1.2 KB)
  ◉ src/models/user.ts (3.1 KB)

✔ Analyzed src/api/users.ts

Analysis for: src/api/users.ts
────────────────────────────────────────────────────────────────────────────────
1. Bug Fixes:
   - Line 45: Potential null reference error when user is undefined

2. Security Vulnerabilities:
   - Line 23: SQL injection risk - use parameterized queries

3. Performance Improvements:
   - Line 67: Consider adding database indexing
   ...
────────────────────────────────────────────────────────────────────────────────
```

## Troubleshooting

### API Key Issues
- Ensure your API key is valid and has proper permissions
- Check that the key is correctly set in config or environment variables

### Network Errors
- Verify internet connection
- Check if the Grok API endpoint is accessible
- Consider firewall or proxy settings

### File Scanning Issues
- Ensure you have read permissions for the project directory
- Check `.gitignore` patterns if files are being skipped

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
