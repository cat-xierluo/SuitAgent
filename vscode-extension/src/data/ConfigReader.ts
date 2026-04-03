import * as fs from 'fs';
import * as path from 'path';
import { AgentConfig, RuleConfig, CommandConfig, SkillConfig, WorkflowScenario, WorkflowStep } from './types';
import { YamlParser } from './YamlParser';

/**
 * Reads the .claude/ configuration layer:
 * agents, rules, commands, skills, and workflow definitions.
 */
export class ConfigReader {
  private claudeDir: string;
  private yamlParser: YamlParser;

  constructor(workspaceRoot: string) {
    this.claudeDir = path.join(workspaceRoot, '.claude');
    this.yamlParser = new YamlParser();
  }

  // ============================================================
  // Agents
  // ============================================================

  getAgents(): AgentConfig[] {
    const dir = path.join(this.claudeDir, 'agents');
    return this.readDir(dir, '.md')
      .map(f => {
        const filePath = path.join(dir, f);
        const frontmatter = this.yamlParser.parseAgentFrontmatter(filePath);
        return {
          fileName: f,
          filePath,
          name: frontmatter?.name || f.replace('.md', ''),
          description: frontmatter?.description || '',
          tools: frontmatter?.tools || '',
          skills: frontmatter?.skills || '',
          color: frontmatter?.color || '',
        };
      });
  }

  // ============================================================
  // Rules
  // ============================================================

  getRules(): RuleConfig[] {
    const dir = path.join(this.claudeDir, 'rules');
    return this.readDir(dir, '.md')
      .map(f => {
        const filePath = path.join(dir, f);
        const content = this.tryReadFile(filePath);
        const titleMatch = content?.match(/^#\s+(.+)/m);
        const versionMatch = content?.match(/\*\*版本\*\*:\s*(.+)/);
        const dateMatch = content?.match(/\*\*最后更新\*\*:\s*(.+)/);
        return {
          fileName: f,
          filePath,
          title: titleMatch?.[1] || f.replace('.md', ''),
          version: versionMatch?.[1]?.trim() || '',
          lastUpdated: dateMatch?.[1]?.trim() || '',
        };
      });
  }

  // ============================================================
  // Commands
  // ============================================================

  getCommands(): CommandConfig[] {
    const dir = path.join(this.claudeDir, 'commands');
    return this.readDir(dir, '.md')
      .map(f => {
        const filePath = path.join(dir, f);
        const frontmatter = this.yamlParser.parseCommandFrontmatter(filePath);
        return {
          fileName: f,
          filePath,
          name: frontmatter?.name || f.replace('.md', ''),
          description: frontmatter?.description || '',
        };
      });
  }

  // ============================================================
  // Skills
  // ============================================================

  getSkills(): SkillConfig[] {
    const dir = path.join(this.claudeDir, 'skills');
    return this.readDir(dir, undefined, true)
      .map(d => ({
        dirName: d,
        dirPath: path.join(dir, d),
        hasSkillMd: fs.existsSync(path.join(dir, d, 'SKILL.md')),
      }));
  }

  // ============================================================
  // Workflows
  // ============================================================

  getWorkflows(): WorkflowScenario[] {
    const filePath = path.join(this.claudeDir, 'rules', 'Workflow.md');
    const content = this.tryReadFile(filePath);
    if (!content) { return []; }

    const workflows: WorkflowScenario[] = [];

    // Parse workflow scenario sections
    // Pattern: "### 场景N：名称" followed by trigger keywords and steps
    const scenarioRegex = /### 场景\d+[：:]\s*(.+?)(?=\n)\n\n\*\*描述\*\*[：:]\s*(.+?)(?=\n)\n\n\*\*触发关键词\*\*[：:]\s*(.+?)(?=\n)([\s\S]*?)(?=### 场景|$)/g;

    let match;
    while ((match = scenarioRegex.exec(content)) !== null) {
      const name = match[1].trim();
      const description = match[2].trim();
      const triggerRaw = match[3].trim();
      const body = match[4];

      // Parse trigger keywords
      const triggerKeywords = triggerRaw
        .replace(/[「」""'']/g, '')
        .split(/[、，,]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Parse steps
      const steps = this.parseWorkflowSteps(body || '');

      workflows.push({
        id: `scenario-${workflows.length + 1}`,
        name,
        description,
        triggerKeywords,
        steps,
      });
    }

    // If regex didn't match, try simpler pattern matching
    if (workflows.length === 0) {
      const simpleRegex = /### 场景\d+[：:]\s*(.+)/g;
      let simpleMatch;
      let idx = 0;
      while ((simpleMatch = simpleRegex.exec(content)) !== null) {
        workflows.push({
          id: `scenario-${++idx}`,
          name: simpleMatch[1].trim(),
          description: '',
          triggerKeywords: [],
          steps: [],
        });
      }
    }

    return workflows;
  }

  private parseWorkflowSteps(body: string): WorkflowStep[] {
    const steps: WorkflowStep[] = [];
    const lines = body.split('\n');

    for (const line of lines) {
      // Match patterns like "1. **DocAnalyzer** (分析起诉状)"
      const stepMatch = line.match(/\d+\.\s+\*\*(\w+)\*\*\s+\((.+?)\)/);
      if (stepMatch) {
        steps.push({
          agent: stepMatch[1],
          action: stepMatch[2],
          qualityGate: '',
          outputDir: '',
        });
      }
    }

    return steps;
  }

  // ============================================================
  // Helpers
  // ============================================================

  private readDir(dir: string, ext?: string, dirsOnly = false): string[] {
    try {
      const entries = fs.readdirSync(dir);
      if (dirsOnly) {
        return entries.filter(e => {
          try { return fs.statSync(path.join(dir, e)).isDirectory(); } catch { return false; }
        }).filter(e => !e.startsWith('.'));
      }
      return entries
        .filter(e => {
          if (e.startsWith('.')) { return false; }
          if (ext && !e.endsWith(ext)) { return false; }
          try { return fs.statSync(path.join(dir, e)).isFile(); } catch { return false; }
        });
    } catch {
      return [];
    }
  }

  private tryReadFile(filePath: string): string | undefined {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch {
      return undefined;
    }
  }
}
