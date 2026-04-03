import * as fs from 'fs';
import * as path from 'path';
import { CaseMeta, DirStat, CASE_DIRS } from './types';

/**
 * Scans the SuitAgent project root for case directories.
 * Case directories match pattern: YYMMDD + space + description
 */
export class CaseScanner {
  private workspaceRoot: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  /** Scan all case directories and return metadata */
  scanAll(): CaseMeta[] {
    const entries = this.listCaseDirs();
    return entries
      .map(dirName => this.scanCase(dirName))
      .filter((m): m is CaseMeta => m !== null)
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }

  /** Check if a directory name looks like a case directory */
  static isCaseDir(dirName: string): boolean {
    // Match: 6 digits + space + description (e.g. "251112 张敏娟 亿驰能源 房租催缴")
    return /^\d{6}\s/.test(dirName);
  }

  /** List all case directory names */
  private listCaseDirs(): string[] {
    try {
      return fs.readdirSync(this.workspaceRoot)
        .filter(name => {
          if (!CaseScanner.isCaseDir(name)) { return false; }
          const fullPath = path.join(this.workspaceRoot, name);
          return fs.statSync(fullPath).isDirectory();
        });
    } catch {
      return [];
    }
  }

  /** Scan a single case directory */
  scanCase(dirName: string): CaseMeta | null {
    const dirPath = path.join(this.workspaceRoot, dirName);
    try {
      const caseId = dirName.substring(0, 6);
      const files = fs.readdirSync(dirPath);

      // Detect info files
      const hasInfoMd = files.some(f => f.endsWith('案件信息.md'));
      const hasInfoYaml = files.some(f => f.includes('案件基础信息表') && f.endsWith('.yaml'));

      // Detect scheduler YAML in 00 - 📅 日程管理/
      const schedulerDir = files.find(f => f.startsWith('00'));
      let hasSchedulerYaml = false;
      if (schedulerDir) {
        const schedulerPath = path.join(dirPath, schedulerDir);
        if (fs.statSync(schedulerPath).isDirectory()) {
          hasSchedulerYaml = fs.readdirSync(schedulerPath)
            .some(f => f.endsWith('.yaml') && !f.includes('案件基础信息表'));
        }
      }

      // Build directory stats for 12 layers
      const directoryStats = this.buildDirStats(dirPath, files);

      // Get last modified time
      const lastModified = this.getLastModified(dirPath);

      return {
        dirName,
        dirPath,
        caseId,
        hasInfoMd,
        hasInfoYaml,
        hasSchedulerYaml,
        directoryStats,
        lastModified,
      };
    } catch {
      return null;
    }
  }

  /** Build stats for the 12 standard directories */
  private buildDirStats(caseDirPath: string, topFiles: string[]): DirStat[] {
    const stats: DirStat[] = [];

    for (const def of CASE_DIRS) {
      const matchingDir = topFiles.find(f =>
        f.startsWith(def.index) || f.includes(def.label)
      );

      if (!matchingDir) {
        stats.push({
          index: def.index,
          label: def.label,
          emoji: def.emoji,
          fileCount: 0,
          dirPath: '',
        });
        continue;
      }

      const fullPath = path.join(caseDirPath, matchingDir);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const subFiles = fs.readdirSync(fullPath)
            .filter(f => !f.startsWith('.') && f !== 'README.md');
          stats.push({
            index: def.index,
            label: def.label,
            emoji: def.emoji,
            fileCount: subFiles.length,
            dirPath: fullPath,
          });
        } else {
          stats.push({
            index: def.index,
            label: def.label,
            emoji: def.emoji,
            fileCount: 0,
            dirPath: '',
          });
        }
      } catch {
        stats.push({
          index: def.index,
          label: def.label,
          emoji: def.emoji,
          fileCount: 0,
          dirPath: '',
        });
      }
    }

    return stats;
  }

  /** Get the most recent modification time across all files in case dir */
  private getLastModified(dirPath: string): Date {
    let latest = new Date(0);
    try {
      this.walkDir(dirPath, (filePath) => {
        try {
          const stat = fs.statSync(filePath);
          if (stat.mtime > latest) {
            latest = stat.mtime;
          }
        } catch { /* skip */ }
      });
    } catch { /* skip */ }
    return latest;
  }

  /** Recursively walk directory */
  private walkDir(dir: string, callback: (filePath: string) => void): void {
    let entries: string[];
    try {
      entries = fs.readdirSync(dir);
    } catch { return; }

    for (const entry of entries) {
      if (entry.startsWith('.')) { continue; }
      const fullPath = path.join(dir, entry);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          this.walkDir(fullPath, callback);
        } else {
          callback(fullPath);
        }
      } catch { /* skip */ }
    }
  }
}
