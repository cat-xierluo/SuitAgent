import * as vscode from 'vscode';
import { WorkflowScenario } from '../data/types';

/**
 * Launches Claude Code commands in the VSCode integrated terminal.
 * Injects workflow trigger text and case context.
 */
export class ClaudeLauncher {
  private terminal: vscode.Terminal | undefined;
  private claudePath: string;

  constructor(claudePath = 'claude') {
    this.claudePath = claudePath;
  }

  /** Update the claude CLI path */
  setClaudePath(path: string) {
    this.claudePath = path;
  }

  /** Launch a workflow scenario in the terminal */
  launchWorkflow(scenario: WorkflowScenario, casePath?: string) {
    const terminal = this.getTerminal();
    terminal.show(true);

    // Use the first trigger keyword as the prompt
    const trigger = scenario.triggerKeywords[0] || scenario.name;

    if (casePath) {
      terminal.sendText(`cd "${casePath}" && ${this.claudePath}`);
      // Small delay to let claude start, then send the trigger
      setTimeout(() => {
        terminal.sendText(trigger);
      }, 1500);
    } else {
      terminal.sendText(this.claudePath);
      setTimeout(() => {
        terminal.sendText(trigger);
      }, 1500);
    }
  }

  /** Launch a simple command prompt in the terminal */
  launchPrompt(prompt: string, casePath?: string) {
    const terminal = this.getTerminal();
    terminal.show(true);

    if (casePath) {
      terminal.sendText(`cd "${casePath}" && ${this.claudePath}`);
      setTimeout(() => {
        terminal.sendText(prompt);
      }, 1500);
    } else {
      terminal.sendText(this.claudePath);
      setTimeout(() => {
        terminal.sendText(prompt);
      }, 1500);
    }
  }

  /** Open an agent-specific session */
  launchAgent(agentName: string, casePath?: string) {
    const terminal = this.getTerminal();
    terminal.show(true);

    const cmd = casePath
      ? `cd "${casePath}" && ${this.claudePath} --agent ${agentName}`
      : `${this.claudePath} --agent ${agentName}`;

    terminal.sendText(cmd);
  }

  /** Get or create a named terminal */
  private getTerminal(): vscode.Terminal {
    // Reuse existing SuitAgent terminal if available
    const existing = vscode.window.terminals.find(t => t.name === 'SuitAgent');
    if (existing) {
      this.terminal = existing;
    }

    if (!this.terminal) {
      this.terminal = vscode.window.createTerminal('SuitAgent');
    }

    return this.terminal;
  }

  dispose() {
    this.terminal?.dispose();
  }
}
