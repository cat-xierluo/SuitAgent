import * as vscode from 'vscode';
import { CaseScanner } from './data/CaseScanner';
import { CaseTreeProvider } from './providers/CaseTreeProvider';
import { DashboardPanel } from './panels/DashboardPanel';
import { DeadlineService } from './services/DeadlineService';
import { FileWatcher } from './services/FileWatcher';
import { ClaudeLauncher } from './services/ClaudeLauncher';

let caseScanner: CaseScanner;
let caseTreeProvider: CaseTreeProvider;
let deadlineService: DeadlineService;
let fileWatcher: FileWatcher;
let claudeLauncher: ClaudeLauncher;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) {
    vscode.window.showWarningMessage('SuitAgent: 请先打开一个工作区');
    return;
  }

  // Read configuration
  const config = vscode.workspace.getConfiguration('suitagent');
  const warningDays = config.get<number>('deadlineWarningDays', 7);
  const refreshInterval = config.get<number>('autoRefreshInterval', 5000);
  const claudePath = config.get<string>('claudeCommandPath', 'claude');

  // --- Core Services ---
  caseScanner = new CaseScanner(workspaceRoot);
  deadlineService = new DeadlineService(caseScanner, warningDays);
  claudeLauncher = new ClaudeLauncher(claudePath);
  fileWatcher = new FileWatcher(workspaceRoot, refreshInterval);

  // --- Status Bar ---
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = 'suitagent.showDeadlines';
  context.subscriptions.push(statusBarItem);
  updateStatusBar();

  // --- Sidebar Tree View ---
  caseTreeProvider = new CaseTreeProvider(workspaceRoot, caseScanner);
  const treeView = vscode.window.createTreeView('suitagent-cases', {
    treeDataProvider: caseTreeProvider,
    showCollapseAll: true,
  });
  context.subscriptions.push(treeView);

  // --- File Watcher ---
  fileWatcher.on('refresh', () => {
    caseTreeProvider.refresh();
    DashboardPanel.refreshAll();
    updateStatusBar();
  });
  fileWatcher.start();
  context.subscriptions.push({ dispose: () => fileWatcher.dispose() });

  // --- Commands ---
  context.subscriptions.push(
    vscode.commands.registerCommand('suitagent.openDashboard', () => {
      DashboardPanel.createOrShow(context.extensionUri, workspaceRoot, caseScanner);
    }),

    vscode.commands.registerCommand('suitagent.refreshCases', () => {
      caseTreeProvider.refresh();
      DashboardPanel.refreshAll();
      updateStatusBar();
      vscode.window.showInformationMessage('SuitAgent: 案件列表已刷新');
    }),

    vscode.commands.registerCommand('suitagent.openCase', (casePath: string) => {
      DashboardPanel.createOrShow(context.extensionUri, workspaceRoot, caseScanner, casePath);
    }),

    vscode.commands.registerCommand('suitagent.openFile', (filePath: string) => {
      const openPath = vscode.Uri.file(filePath);
      vscode.workspace.openTextDocument(openPath).then(doc => {
        vscode.window.showTextDocument(doc);
      });
    }),

    vscode.commands.registerCommand('suitagent.showDeadlines', () => {
      DashboardPanel.createOrShow(context.extensionUri, workspaceRoot, caseScanner);
      // TODO: auto-switch to deadlines tab when implemented
    }),

    vscode.commands.registerCommand('suitagent.triggerWorkflow', (scenarioId: string) => {
      // Find the case and launch workflow
      const cases = caseScanner.scanAll();
      if (cases.length === 0) {
        vscode.window.showWarningMessage('SuitAgent: 没有找到案件目录');
        return;
      }
      // For now, launch in the first case directory
      // TODO: let user select case
      const selectedCase = cases[0];
      claudeLauncher.launchPrompt(scenarioId, selectedCase.dirPath);
    }),

    vscode.commands.registerCommand('suitagent.fixCaseStructure', () => {
      const results = caseScanner.ensureAllCaseStructures();
      if (results.size === 0) {
        vscode.window.showInformationMessage('SuitAgent: 所有案件目录结构完整，无需修复');
        return;
      }
      const totalCreated = Array.from(results.values()).reduce((s, v) => s + v.length, 0);
      const caseNames = Array.from(results.keys()).map(k => `"${k}"`).join('、');
      vscode.window.showInformationMessage(
        `SuitAgent: 已修复 ${results.size} 个案件，共创建 ${totalCreated} 个目录（${caseNames}）`
      );
      caseTreeProvider.refresh();
      DashboardPanel.refreshAll();
    }),
  );

  // --- Configuration change listener ---
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('suitagent')) {
        const newConfig = vscode.workspace.getConfiguration('suitagent');
        deadlineService.setWarningDays(newConfig.get<number>('deadlineWarningDays', 7));
        claudeLauncher.setClaudePath(newConfig.get<string>('claudeCommandPath', 'claude'));
        updateStatusBar();
      }
    }),
  );
}

function updateStatusBar() {
  try {
    const urgentCount = deadlineService.getUrgentCount();
    if (urgentCount > 0) {
      statusBarItem.text = `$(alert) ${urgentCount} 个期限临近`;
      statusBarItem.tooltip = `SuitAgent: ${urgentCount} 个期限在 7 天内到期`;
      statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
      statusBarItem.show();
    } else {
      statusBarItem.text = '$(check) SuitAgent';
      statusBarItem.tooltip = 'SuitAgent: 无紧急期限';
      statusBarItem.backgroundColor = undefined;
      statusBarItem.show();
    }
  } catch {
    statusBarItem.hide();
  }
}

export function deactivate() {
  claudeLauncher?.dispose();
  fileWatcher?.dispose();
  statusBarItem?.dispose();
}
