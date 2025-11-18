import * as fs from 'fs';
import * as path from 'path';
import ignore, { Ignore } from 'ignore';

export interface FileInfo {
  path: string;
  relativePath: string;
  content: string;
  size: number;
  extension: string;
}

export interface ScanResult {
  files: FileInfo[];
  totalFiles: number;
  totalSize: number;
  projectRoot: string;
}

export class ProjectScanner {
  private ignorePatterns: Ignore;
  private maxFileSize: number = 1024 * 1024; // 1MB
  private codeExtensions = new Set([
    '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rs',
    '.c', '.cpp', '.h', '.hpp', '.cs', '.php', '.rb', '.swift',
    '.kt', '.scala', '.r', '.m', '.mm', '.sh', '.bash', '.zsh',
    '.html', '.css', '.scss', '.sass', '.less', '.vue', '.svelte',
    '.json', '.yaml', '.yml', '.toml', '.xml', '.sql', '.md',
  ]);

  constructor(projectRoot: string) {
    this.ignorePatterns = ignore();
    this.loadGitignore(projectRoot);
    this.addDefaultIgnores();
  }

  private loadGitignore(projectRoot: string): void {
    const gitignorePath = path.join(projectRoot, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      try {
        const content = fs.readFileSync(gitignorePath, 'utf-8');
        const patterns = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'));
        this.ignorePatterns.add(patterns);
      } catch (error) {
        console.warn('Failed to load .gitignore');
      }
    }
  }

  private addDefaultIgnores(): void {
    this.ignorePatterns.add([
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      '.next',
      '.nuxt',
      'out',
      '__pycache__',
      '*.pyc',
      '.pytest_cache',
      '.venv',
      'venv',
      'vendor',
      'target',
      '.DS_Store',
      '*.log',
      '.env',
      '.env.local',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ]);
  }

  private shouldIncludeFile(filePath: string, relativePath: string): boolean {
    // Check if ignored
    if (this.ignorePatterns.ignores(relativePath)) {
      return false;
    }

    // Check file size
    try {
      const stats = fs.statSync(filePath);
      if (stats.size > this.maxFileSize) {
        return false;
      }
    } catch (error) {
      return false;
    }

    // Check extension
    const ext = path.extname(filePath).toLowerCase();
    return this.codeExtensions.has(ext);
  }

  private scanDirectory(dirPath: string, projectRoot: string, files: FileInfo[]): void {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(projectRoot, fullPath);

        if (this.ignorePatterns.ignores(relativePath)) {
          continue;
        }

        if (entry.isDirectory()) {
          this.scanDirectory(fullPath, projectRoot, files);
        } else if (entry.isFile() && this.shouldIncludeFile(fullPath, relativePath)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const stats = fs.statSync(fullPath);

            files.push({
              path: fullPath,
              relativePath,
              content,
              size: stats.size,
              extension: path.extname(fullPath),
            });
          } catch (error) {
            // Skip files that can't be read
            console.warn(`Skipping file: ${relativePath}`);
          }
        }
      }
    } catch (error) {
      console.warn(`Error scanning directory: ${dirPath}`);
    }
  }

  public scan(projectRoot: string): ScanResult {
    const files: FileInfo[] = [];

    if (!fs.existsSync(projectRoot)) {
      throw new Error(`Project root does not exist: ${projectRoot}`);
    }

    const stats = fs.statSync(projectRoot);
    if (!stats.isDirectory()) {
      throw new Error(`Project root is not a directory: ${projectRoot}`);
    }

    this.scanDirectory(projectRoot, projectRoot, files);

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    return {
      files,
      totalFiles: files.length,
      totalSize,
      projectRoot,
    };
  }

  public generateProjectSummary(scanResult: ScanResult): string {
    const { files, totalFiles, totalSize } = scanResult;

    const filesByExt = new Map<string, number>();
    files.forEach(file => {
      const count = filesByExt.get(file.extension) || 0;
      filesByExt.set(file.extension, count + 1);
    });

    let summary = `Project Summary:\n`;
    summary += `Total Files: ${totalFiles}\n`;
    summary += `Total Size: ${(totalSize / 1024).toFixed(2)} KB\n\n`;
    summary += `Files by Extension:\n`;

    Array.from(filesByExt.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([ext, count]) => {
        summary += `  ${ext}: ${count} files\n`;
      });

    summary += `\nFile Structure:\n`;
    files.forEach(file => {
      summary += `  ${file.relativePath}\n`;
    });

    return summary;
  }
}
