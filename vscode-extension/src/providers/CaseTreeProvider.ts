import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { CaseScanner } from '../data/CaseScanner';
import { CaseMeta, DirStat, CASE_DIRS } from '../data/types';

export class CaseTreeProvider implements vscode.TreeDataProvider<CaseTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<CaseTreeItem | undefined | null>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private workspaceRoot: string;
  private scanner: CaseScanner;
  private cases: CaseMeta[] = [];

  constructor(workspaceRoot: string, scanner: CaseScanner) {
    this.workspaceRoot = workspaceRoot;
    this.scanner = scanner;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: CaseTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CaseTreeItem): CaseTreeItem[] {
    if (!element) {
      // Root level: list cases
      this.cases = this.scanner.scanAll();
      return this.cases.map(c => {
        const fileCount = c.directoryStats.reduce((sum, d) => sum + d.fileCount, 0);
        const item = new CaseTreeItem(
          c.dirName,
          vscode.TreeItemCollapsibleState.Collapsed,
          'case',
        );
        item.description = `${fileCount} 文件`;
        item.tooltip = `${c.caseId} - ${fileCount} 个文件`;
        item.iconPath = new vscode.ThemeIcon('folder', new vscode.ThemeColor('charts.purple'));
        item.command = {
          command: 'suitagent.openCase',
          title: '打开案件',
          arguments: [c.dirPath],
        };
        return item;
      });
    }

    if (element.contextValue === 'case') {
      // Case level: show 12 directories
      const caseDir = this.findCaseByDirName(element.label as string);
      if (!caseDir) { return []; }

      return caseDir.directoryStats
        .filter(d => d.fileCount > 0)
        .map(d => {
          const item = new CaseTreeItem(
            `${d.emoji} ${d.label}`,
            vscode.TreeItemCollapsibleState.Collapsed,
            'directory',
          );
          item.description = `${d.fileCount}`;
          item.tooltip = `${d.label} - ${d.fileCount} 个文件`;
          item.resourceUri = d.dirPath ? vscode.Uri.file(d.dirPath) : undefined;
          return item;
        });
    }

    if (element.contextValue === 'directory') {
      // Directory level: show files
      // We need to find the actual directory path
      const parentCase = this.findParentCase(element);
      const dirLabel = (element.label as string).replace(/^[^\s]+\s/, '').trim();
      const caseMeta = parentCase ? this.findCaseByDirName(parentCase.label as string) : null;
      if (!caseMeta) { return []; }

      const dirStat = caseMeta.directoryStats.find(d => d.label === dirLabel);
      if (!dirStat || !dirStat.dirPath) { return []; }

      try {
        return fs.readdirSync(dirStat.dirPath)
          .filter(f => !f.startsWith('.') && f !== 'README.md')
          .map(f => {
            const fullPath = path.join(dirStat.dirPath, f);
            const item = new CaseTreeItem(
              f.replace(/\.md$/, ''),
              vscode.TreeItemCollapsibleState.None,
              'file',
            );
            item.iconPath = vscode.ThemeIcon.File;
            item.command = {
              command: 'suitagent.openFile',
              title: '打开文件',
              arguments: [fullPath],
            };
            return item;
          });
      } catch {
        return [];
      }
    }

    return [];
  }

  private findCaseByDirName(dirName: string): CaseMeta | undefined {
    return this.cases.find(c => c.dirName === dirName);
  }

  private findParentCase(element: CaseTreeItem): CaseTreeItem | undefined {
    // Walk up tree to find the case-level parent
    // This is a simplified approach; in production, maintain a parent map
    return undefined;
  }
}

class CaseTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
  ) {
    super(label, collapsibleState);
  }
}
