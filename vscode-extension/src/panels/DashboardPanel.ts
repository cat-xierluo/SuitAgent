import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { CaseScanner } from '../data/CaseScanner';
import { MarkdownParser } from '../data/MarkdownParser';
import { YamlParser } from '../data/YamlParser';
import { CaseMeta, CaseInfo, ExtensionMessage, WebviewMessage } from '../data/types';

/**
 * Manages the main Dashboard webview panel.
 * Uses the singleton pattern — only one panel at a time.
 */
export class DashboardPanel {
  public static currentPanel: DashboardPanel | undefined;
  private static readonly viewType = 'suitagent-dashboard';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private readonly _workspaceRoot: string;
  private readonly _scanner: CaseScanner;
  private readonly _mdParser: MarkdownParser;
  private readonly _yamlParser: YamlParser;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(
    extensionUri: vscode.Uri,
    workspaceRoot: string,
    scanner: CaseScanner,
    openCasePath?: string,
  ) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel._panel.reveal(column);
      if (openCasePath) {
        DashboardPanel.currentPanel._sendCaseDetail(openCasePath);
      }
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      DashboardPanel.viewType,
      'SuitAgent 控制台',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, 'dist'),
          vscode.Uri.joinPath(extensionUri, 'webview-ui'),
        ],
      },
    );

    DashboardPanel.currentPanel = new DashboardPanel(
      panel,
      extensionUri,
      workspaceRoot,
      scanner,
    );

    if (openCasePath) {
      DashboardPanel.currentPanel._sendCaseDetail(openCasePath);
    }
  }

  public static refreshAll() {
    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel._sendCaseList();
    }
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    workspaceRoot: string,
    scanner: CaseScanner,
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._workspaceRoot = workspaceRoot;
    this._scanner = scanner;
    this._mdParser = new MarkdownParser();
    this._yamlParser = new YamlParser();

    this._panel.webview.html = this._getHtmlForWebview(panel.webview);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      (message: WebviewMessage) => this._handleMessage(message),
      null,
      this._disposables,
    );

    // Send initial data
    this._sendCaseList();
  }

  public dispose() {
    DashboardPanel.currentPanel = undefined;
    this._panel.dispose();
    for (const d of this._disposables) {
      d.dispose();
    }
  }

  // ============================================================
  // Message Handling
  // ============================================================

  private _handleMessage(message: WebviewMessage) {
    switch (message.type) {
      case 'refresh':
        this._sendCaseList();
        break;
      case 'openCase':
        if (typeof message.data === 'string') {
          this._sendCaseDetail(message.data);
        }
        break;
      case 'openFile':
        if (typeof message.data === 'string') {
          const openPath = vscode.Uri.file(message.data);
          vscode.workspace.openTextDocument(openPath).then(doc => {
            vscode.window.showTextDocument(doc);
          });
        }
        break;
    }
  }

  private _sendCaseList() {
    const cases = this._scanner.scanAll();
    this._postMessage({ type: 'caseList', data: cases });
  }

  private _sendCaseDetail(casePath: string) {
    const meta = this._scanner.scanCase(path.basename(casePath));
    if (!meta) { return; }

    let caseInfo: Partial<CaseInfo> = {};

    // Try markdown info file first
    if (meta.hasInfoMd) {
      const infoFiles = fs.readdirSync(casePath)
        .filter(f => f.endsWith('案件信息.md'));
      if (infoFiles.length > 0) {
        caseInfo = this._mdParser.parseFile(path.join(casePath, infoFiles[0]));
      }
    }

    // Fall back to YAML if no basicInfo
    if (!caseInfo.basicInfo && meta.hasInfoYaml) {
      const yamlFiles = fs.readdirSync(casePath)
        .filter(f => f.includes('案件基础信息表') && f.endsWith('.yaml'));
      if (yamlFiles.length > 0) {
        caseInfo.basicInfo = this._yamlParser.parseCaseInfoYaml(
          path.join(casePath, yamlFiles[0]),
        );
      }
    }

    // Supplement with scheduler YAML deadlines
    if (meta.hasSchedulerYaml) {
      const schedulerDir = fs.readdirSync(casePath)
        .find(f => f.startsWith('00'));
      if (schedulerDir) {
        const yamlFiles = fs.readdirSync(path.join(casePath, schedulerDir))
          .filter(f => f.endsWith('.yaml') && !f.includes('案件基础信息表'));
        if (yamlFiles.length > 0) {
          const deadlines = this._yamlParser.parseSchedulerYaml(
            path.join(casePath, schedulerDir, yamlFiles[0]),
          );
          if (deadlines.length > 0) {
            caseInfo.deadlines = deadlines;
          }
        }
      }
    }

    this._postMessage({ type: 'caseDetail', data: { meta, caseInfo } });
  }

  private _postMessage(message: ExtensionMessage) {
    this._panel.webview.postMessage(message);
  }

  // ============================================================
  // Webview HTML
  // ============================================================

  private _getHtmlForWebview(webview: vscode.Webview): string {
    // Use nonce for CSP
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
    style-src 'nonce-${nonce}' 'unsafe-inline';
    script-src 'nonce-${nonce}';
    img-src 'self' data:;">
  <title>SuitAgent 控制台</title>
  <style nonce="${nonce}">
    ${this._getStyles()}
  </style>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}">
    // Minimal vanilla JS for Phase 1 MVP
    // Will be replaced with React webview in later phase
    const vscode = acquireVsCodeApi();
    let currentCases = [];
    let currentCaseDetail = null;

    // Tab navigation
    let activeTab = 'cases';

    window.addEventListener('message', event => {
      const msg = event.data;
      switch (msg.type) {
        case 'caseList':
          currentCases = msg.data;
          render();
          break;
        case 'caseDetail':
          currentCaseDetail = msg.data;
          activeTab = 'detail';
          render();
          break;
      }
    });

    function render() {
      const root = document.getElementById('root');
      root.innerHTML = renderHeader() + renderContent();
      bindEvents();
    }

    function renderHeader() {
      return '<div class="header">'
        + '<button class="tab' + (activeTab === 'cases' ? ' active' : '') + '" data-tab="cases">案件列表</button>'
        + '<button class="tab' + (activeTab === 'detail' ? ' active' : '') + '" data-tab="detail">案件详情</button>'
        + '<button class="tab" data-tab="workflow">工作流</button>'
        + '<button class="tab" data-tab="config">配置</button>'
        + '<button class="refresh-btn" id="refreshBtn">刷新</button>'
        + '</div>';
    }

    function renderContent() {
      if (activeTab === 'cases') { return renderCaseList(); }
      if (activeTab === 'detail') { return renderCaseDetail(); }
      if (activeTab === 'workflow') { return renderPlaceholder('工作流控制（Phase 3）'); }
      if (activeTab === 'config') { return renderPlaceholder('配置管理（Phase 4）'); }
      return '';
    }

    function renderCaseList() {
      if (currentCases.length === 0) {
        return '<div class="empty">暂无案件</div>';
      }
      let html = '<div class="case-grid">';
      for (const c of currentCases) {
        const totalFiles = c.directoryStats.reduce((s, d) => s + d.fileCount, 0);
        const filledDirs = c.directoryStats.filter(d => d.fileCount > 0).length;
        const stage = '案件分析中'; // TODO: parse from case info
        html += '<div class="case-card" data-case-path="' + c.dirPath + '">'
          + '<div class="case-card-header">'
          + '<div class="case-name">' + c.dirName + '</div>'
          + '<div class="case-stage">' + stage + '</div>'
          + '</div>'
          + '<div class="dir-bar">'
          + c.directoryStats.map(d =>
            '<div class="dir-cell' + (d.fileCount > 0 ? ' filled' : '') + '" title="' + d.emoji + ' ' + d.label + ': ' + d.fileCount + ' 文件">' + d.emoji + '</div>'
          ).join('')
          + '</div>'
          + '<div class="case-card-footer">'
          + '<span>' + totalFiles + ' 文件</span>'
          + '<span>' + filledDirs + '/12 目录</span>'
          + '</div>'
          + '</div>';
      }
      html += '</div>';
      return html;
    }

    function renderCaseDetail() {
      if (!currentCaseDetail) {
        return '<div class="empty">请从案件列表选择一个案件</div>';
      }
      const info = currentCaseDetail.caseInfo || {};
      const basic = info.basicInfo || {};
      const meta = currentCaseDetail.meta || {};

      let html = '<div class="detail-view">';
      html += '<h2>' + (basic.caseName || meta.dirName) + '</h2>';

      // Basic info table
      html += '<div class="info-grid">';
      const fields = [
        ['案号', basic.courtCaseNumber],
        ['案由', basic.cause],
        ['阶段', basic.currentStage],
        ['法院', basic.court],
        ['标的', basic.disputedAmount],
        ['承办律师', basic.leadLawyer],
      ];
      for (const [label, value] of fields) {
        if (value) {
          html += '<div class="info-item"><span class="info-label">' + label + '</span><span class="info-value">' + value + '</span></div>';
        }
      }
      html += '</div>';

      // Directory stats
      html += '<h3>目录结构</h3>';
      html += '<div class="dir-list">';
      for (const d of meta.directoryStats || []) {
        if (d.fileCount > 0) {
          html += '<div class="dir-row">'
            + '<span class="dir-emoji">' + d.emoji + '</span>'
            + '<span class="dir-label">' + d.label + '</span>'
            + '<span class="dir-count">' + d.fileCount + ' 文件</span>'
            + '</div>';
        }
      }
      html += '</div>';

      // Timeline
      if (info.timeline && info.timeline.length > 0) {
        html += '<h3>案件时间线</h3>';
        html += '<div class="timeline">';
        for (const t of info.timeline) {
          html += '<div class="timeline-item">'
            + '<div class="timeline-date">' + t.date + '</div>'
            + '<div class="timeline-content">'
            + '<div class="timeline-desc">' + t.description + '</div>'
            + '<div class="timeline-status">' + t.status + '</div>'
            + '</div></div>';
        }
        html += '</div>';
      }

      // Deadlines
      if (info.deadlines && info.deadlines.length > 0) {
        html += '<h3>期限管理</h3>';
        html += '<div class="deadline-list">';
        for (const d of info.deadlines) {
          const cls = d.remainingDays >= 0 && d.remainingDays <= 3 ? 'urgent' : '';
          html += '<div class="deadline-item ' + cls + '">'
            + '<span>' + d.type + '</span>'
            + '<span>' + d.deadline + '</span>'
            + (d.remainingDays >= 0 ? '<span class="countdown">' + d.remainingDays + '天</span>' : '')
            + '</div>';
        }
        html += '</div>';
      }

      html += '</div>';
      return html;
    }

    function renderPlaceholder(text) {
      return '<div class="empty">' + text + '</div>';
    }

    function bindEvents() {
      // Tab clicks
      document.querySelectorAll('.tab').forEach(btn => {
        btn.addEventListener('click', () => {
          activeTab = btn.dataset.tab;
          render();
        });
      });

      // Case card clicks
      document.querySelectorAll('.case-card').forEach(card => {
        card.addEventListener('click', () => {
          const casePath = card.dataset.casePath;
          vscode.postMessage({ type: 'openCase', data: casePath });
        });
      });

      // Refresh button
      const refreshBtn = document.getElementById('refreshBtn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          vscode.postMessage({ type: 'refresh' });
        });
      }
    }

    // Request initial data
    vscode.postMessage({ type: 'refresh' });
  </script>
</body>
</html>`;
  }

  private _getStyles(): string {
    return `
      :root {
        --primary: #5B2A86;
        --accent: #F39C12;
        --bg: var(--vscode-editor-background);
        --fg: var(--vscode-editor-foreground);
        --card-bg: var(--vscode-sideBar-background, #1e1e2e);
        --border: var(--vscode-panel-border, #333);
        --hover: var(--vscode-list-hoverBackground, rgba(91, 42, 134, 0.15));
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: var(--fg);
        background: var(--bg);
        padding: 16px;
      }
      .header {
        display: flex;
        gap: 4px;
        margin-bottom: 16px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 8px;
      }
      .tab {
        padding: 6px 16px;
        border: none;
        background: transparent;
        color: var(--fg);
        cursor: pointer;
        border-radius: 4px 4px 0 0;
        font-size: 13px;
        opacity: 0.6;
      }
      .tab:hover { background: var(--hover); opacity: 0.8; }
      .tab.active {
        opacity: 1;
        border-bottom: 2px solid var(--accent);
        color: var(--accent);
        font-weight: 600;
      }
      .refresh-btn {
        margin-left: auto;
        padding: 4px 12px;
        border: 1px solid var(--border);
        background: transparent;
        color: var(--fg);
        cursor: pointer;
        border-radius: 4px;
        font-size: 12px;
      }
      .refresh-btn:hover { background: var(--hover); }

      .empty {
        text-align: center;
        padding: 48px 16px;
        opacity: 0.5;
        font-size: 14px;
      }

      .case-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 12px;
      }
      .case-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 12px;
        cursor: pointer;
        transition: border-color 0.2s;
      }
      .case-card:hover {
        border-color: var(--primary);
        box-shadow: 0 2px 8px rgba(91, 42, 134, 0.2);
      }
      .case-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      }
      .case-name {
        font-size: 13px;
        font-weight: 600;
        flex: 1;
        line-height: 1.3;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .case-stage {
        font-size: 11px;
        padding: 2px 6px;
        background: rgba(243, 156, 18, 0.15);
        color: var(--accent);
        border-radius: 4px;
        white-space: nowrap;
        margin-left: 8px;
      }
      .dir-bar {
        display: flex;
        gap: 2px;
        margin: 8px 0;
      }
      .dir-cell {
        flex: 1;
        text-align: center;
        font-size: 11px;
        padding: 2px;
        opacity: 0.3;
        border-radius: 2px;
      }
      .dir-cell.filled {
        opacity: 1;
        background: rgba(91, 42, 134, 0.1);
      }
      .case-card-footer {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        opacity: 0.6;
      }

      /* Detail view */
      .detail-view { max-width: 800px; }
      .detail-view h2 { margin-bottom: 16px; font-size: 18px; color: var(--accent); }
      .detail-view h3 { margin: 16px 0 8px; font-size: 14px; color: var(--primary); }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 8px;
        margin-bottom: 16px;
      }
      .info-item {
        padding: 8px;
        background: var(--card-bg);
        border-radius: 4px;
        border: 1px solid var(--border);
      }
      .info-label { font-size: 11px; opacity: 0.6; display: block; }
      .info-value { font-size: 13px; font-weight: 500; }
      .dir-list { display: flex; flex-direction: column; gap: 4px; }
      .dir-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        background: var(--card-bg);
        border-radius: 4px;
        border: 1px solid var(--border);
      }
      .dir-emoji { font-size: 14px; }
      .dir-label { flex: 1; font-size: 13px; }
      .dir-count { font-size: 11px; opacity: 0.6; }
      .timeline { display: flex; flex-direction: column; gap: 4px; }
      .timeline-item {
        display: flex;
        gap: 12px;
        padding: 6px 0;
        border-left: 2px solid var(--primary);
        padding-left: 12px;
      }
      .timeline-date { font-size: 12px; opacity: 0.6; white-space: nowrap; min-width: 100px; }
      .timeline-desc { font-size: 13px; }
      .timeline-status { font-size: 11px; opacity: 0.7; }
      .deadline-list { display: flex; flex-direction: column; gap: 4px; }
      .deadline-item {
        display: flex;
        gap: 12px;
        padding: 6px 8px;
        background: var(--card-bg);
        border-radius: 4px;
        border: 1px solid var(--border);
        font-size: 13px;
      }
      .deadline-item.urgent { border-color: #e74c3c; background: rgba(231, 76, 60, 0.1); }
      .countdown { font-weight: 600; color: var(--accent); margin-left: auto; }
      .urgent .countdown { color: #e74c3c; }
    `;
  }
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
