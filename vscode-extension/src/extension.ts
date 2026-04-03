import * as vscode from 'vscode';
import { CaseScanner } from './data/CaseScanner';
import { CaseTreeProvider } from './providers/CaseTreeProvider';
import { DashboardPanel } from './panels/DashboardPanel';

let caseScanner: CaseScanner;
let caseTreeProvider: CaseTreeProvider;

export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) {
    vscode.window.showWarningMessage('SuitAgent: 请先打开一个工作区');
    return;
  }

  caseScanner = new CaseScanner(workspaceRoot);

  // --- Sidebar Tree View ---
  caseTreeProvider = new CaseTreeProvider(workspaceRoot, caseScanner);
  const treeView = vscode.window.createTreeView('suitagent-cases', {
    treeDataProvider: caseTreeProvider,
    showCollapseAll: true,
  });
  context.subscriptions.push(treeView);

  // --- Commands ---
  context.subscriptions.push(
    vscode.commands.registerCommand('suitagent.openDashboard', () => {
      DashboardPanel.createOrShow(context.extensionUri, workspaceRoot, caseScanner);
    }),

    vscode.commands.registerCommand('suitagent.refreshCases', () => {
      caseTreeProvider.refresh();
      // Also refresh any open dashboard panel
      DashboardPanel.refreshAll();
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
  );
}

export function deactivate() {
  // Cleanup handled by disposables
}
