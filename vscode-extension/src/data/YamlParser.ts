import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { CaseBasicInfo, DeadlineEntry } from './types';

/**
 * Parses SuitAgent YAML files:
 * 1. Case info YAML (*案件基础信息表.yaml) — legacy format
 * 2. Scheduler YAML (00 - 📅 日程管理/[案件编号].yaml) — deadline/schedule data
 */
export class YamlParser {
  /** Parse a legacy case info YAML file */
  parseCaseInfoYaml(filePath: string): CaseBasicInfo | undefined {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = yaml.load(content) as Record<string, any>;

      const info = data?.case_info?.basic_info || data?.案件基本信息 || {};
      return {
        caseName: info.案件名称 || info.case_name || '',
        courtCaseNumber: info.法院案号 || info.court_case_number || '',
        cause: info.案由 || info.cause || '',
        caseType: info.案件类型 || info.case_type || '',
        court: info.管辖法院 || info.court || '',
        currentStage: info.当前阶段 || info.current_stage || '',
        lawFirmCaseNumber: info.律所案号 || info.law_firm_case_number || '',
        lawFirmFilingDate: info.律所立案日期 || info.law_firm_filing_date || '',
        courtFilingDate: info.法院立案日期 || info.court_filing_date || '',
        disputedAmount: info.争议标的 || info.disputed_amount || '',
        leadLawyer: info.承办律师 || info.lead_lawyer || '',
        assistingLawyer: info.协办律师 || info.assisting_lawyer || '',
        lastUpdated: info.最后更新 || info.last_updated || '',
      };
    } catch {
      return undefined;
    }
  }

  /** Parse a scheduler YAML file for deadlines */
  parseSchedulerYaml(filePath: string): DeadlineEntry[] {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = yaml.load(content) as Record<string, any>;

      const deadlines: DeadlineEntry[] = [];

      // Extract from 法定期限管理 section
      const deadlineSection = data?.法定期限管理 || data?.deadlines;
      if (deadlineSection && typeof deadlineSection === 'object') {
        for (const [key, val] of Object.entries(deadlineSection)) {
          if (typeof val === 'object' && val !== null) {
            const v = val as Record<string, any>;
            const remainingDays = typeof v.剩余天数 === 'number'
              ? v.剩余天数
              : this.parseRemainingDays(v.截止日期);

            deadlines.push({
              type: v.类型 || key,
              deadline: v.截止日期 || '',
              remainingDays,
              status: this.getDeadlineStatus(remainingDays),
              description: v.描述 || v.备注 || '',
            });
          }
        }
      }

      return deadlines;
    } catch {
      return [];
    }
  }

  /** Parse agent config YAML frontmatter from .claude/agents/*.md files */
  parseAgentFrontmatter(filePath: string): Record<string, string> | undefined {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (!match) { return undefined; }

      const frontmatter = yaml.load(match[1]) as Record<string, string>;
      return frontmatter;
    } catch {
      return undefined;
    }
  }

  /** Parse command config YAML frontmatter */
  parseCommandFrontmatter(filePath: string): Record<string, string> | undefined {
    return this.parseAgentFrontmatter(filePath); // Same format
  }

  // ============================================================
  // Helpers
  // ============================================================

  private parseRemainingDays(deadlineStr: string): number {
    if (!deadlineStr || typeof deadlineStr !== 'string') { return -1; }

    try {
      const deadline = new Date(deadlineStr.replace(/[年月]/g, '-').replace(/日/g, ''));
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } catch {
      return -1;
    }
  }

  private getDeadlineStatus(days: number): DeadlineEntry['status'] {
    if (days < 0) { return 'none'; }
    if (days <= 3) { return 'red'; }
    if (days <= 7) { return 'yellow'; }
    return 'green';
  }
}
