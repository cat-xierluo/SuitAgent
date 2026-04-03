import * as fs from 'fs';
import {
  CaseInfo, CaseBasicInfo, PartyInfo, FeeInfo,
  TimelineEntry, TaskItem, DeadlineEntry, UpdateEntry
} from './types';

/**
 * Parses SuitAgent case info markdown files (*案件信息.md).
 * These files use a section-based table structure that varies between cases.
 * Returns Partial<CaseInfo> — missing sections are undefined, never throws.
 */
export class MarkdownParser {
  /** Parse a case info markdown file */
  parseFile(filePath: string): Partial<CaseInfo> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return this.parseContent(content);
    } catch {
      return {};
    }
  }

  /** Parse markdown content string */
  parseContent(content: string): Partial<CaseInfo> {
    const sections = this.splitSections(content);
    return {
      basicInfo: this.extractBasicInfo(sections),
      parties: this.extractParties(sections),
      fees: this.extractFees(sections),
      timeline: this.extractTimeline(sections),
      tasks: this.extractTasks(content),
      deadlines: this.extractDeadlines(sections),
      updateHistory: this.extractUpdateHistory(sections),
    };
  }

  // ============================================================
  // Section Splitting
  // ============================================================

  private splitSections(content: string): Map<string, string> {
    const sections = new Map<string, string>();
    const lines = content.split('\n');
    let currentHeader = '__header__';
    let currentLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('## ') || line.startsWith('### ')) {
        if (currentLines.length > 0) {
          sections.set(currentHeader, currentLines.join('\n'));
        }
        currentHeader = line.replace(/^#+\s*/, '').trim();
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    }
    if (currentLines.length > 0) {
      sections.set(currentHeader, currentLines.join('\n'));
    }

    return sections;
  }

  /** Find a section by partial keyword match */
  private findSection(sections: Map<string, string>, keyword: string): string | undefined {
    for (const [header, content] of sections) {
      if (header.includes(keyword)) {
        return content;
      }
    }
    return undefined;
  }

  // ============================================================
  // Table Extraction Utilities
  // ============================================================

  /** Extract all markdown tables from content, returns array of 2D string arrays */
  private extractTables(content: string): string[][][] {
    const tables: string[][][] = [];
    const lines = content.split('\n');
    let currentTable: string[][] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        // Skip separator lines (| --- | --- |)
        if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
          continue;
        }
        const cells = trimmed.split('|')
          .slice(1, -1)
          .map(c => c.trim().replace(/\*\*/g, ''));
        currentTable.push(cells);
      } else {
        if (currentTable.length > 0) {
          tables.push(currentTable);
          currentTable = [];
        }
      }
    }
    if (currentTable.length > 0) {
      tables.push(currentTable);
    }

    return tables;
  }

  /** Convert a 2-column table to key-value map */
  private tableToKV(rows: string[][]): Map<string, string> {
    const map = new Map<string, string>();
    for (const row of rows) {
      if (row.length >= 2) {
        map.set(row[0], row[1]);
      }
    }
    return map;
  }

  // ============================================================
  // Section Parsers
  // ============================================================

  private extractBasicInfo(sections: Map<string, string>): CaseBasicInfo | undefined {
    const content = this.findSection(sections, '案件基本信息') ||
                    this.findSection(sections, '案件概要');
    if (!content) { return undefined; }

    const tables = this.extractTables(content);
    const info = new Map<string, string>();

    // Merge all 2-column tables into one map
    for (const table of tables) {
      if (table.length > 0 && table[0].length === 2) {
        for (const [key, val] of this.tableToKV(table)) {
          info.set(key, val);
        }
      }
    }

    const get = (keys: string[]): string => {
      for (const k of keys) {
        for (const [key, val] of info) {
          if (key.includes(k)) { return val; }
        }
      }
      return '';
    };

    return {
      caseName: get(['案件名称']),
      courtCaseNumber: get(['法院案号', '案号']),
      cause: get(['案由']),
      caseType: get(['案件类型']),
      court: get(['管辖法院']),
      currentStage: get(['当前阶段']),
      lawFirmCaseNumber: get(['律所案号']),
      lawFirmFilingDate: get(['律所立案日期']),
      courtFilingDate: get(['法院立案日期']),
      disputedAmount: get(['争议标的']),
      leadLawyer: get(['承办律师']),
      assistingLawyer: get(['协办律师']),
      lastUpdated: get(['最后更新']),
    };
  }

  private extractParties(sections: Map<string, string>): PartyInfo[] {
    const content = this.findSection(sections, '当事人信息');
    if (!content) { return []; }

    const parties: PartyInfo[] = [];
    // Parse party info from table-like structure
    // Format: side-by-side tables or bullet lists under 原告/被告 headers

    // Look for plaintiff/defendant indicators
    const plaintiffMatch = content.match(/原告[^）)]*[）)]\s*\n([\s\S]*?)(?=被告|$)/);
    const defendantMatch = content.match(/被告[^）)]*[）)]\s*\n([\s\S]*?)$/);

    if (plaintiffMatch) {
      parties.push(this.parsePartyBlock(plaintiffMatch[1], 'plaintiff'));
    }
    if (defendantMatch) {
      parties.push(this.parsePartyBlock(defendantMatch[1], 'defendant'));
    }

    return parties;
  }

  private parsePartyBlock(block: string, role: 'plaintiff' | 'defendant'): PartyInfo {
    const get = (pattern: RegExp): string => {
      const m = block.match(pattern);
      return m ? m[1].trim() : '';
    };

    return {
      role,
      name: get(/(?:姓名|名称)[:：]?\s*(.+)/) || get(/(?:\*\*|)(.+?)(?:\*\*|)\s*$/m),
      type: get(/类型[:：]\s*(.+)/),
      idNumber: get(/(?:身份证号|统一社会信用代码)[:：]\s*(.+)/),
      address: get(/地址[:：]\s*(.+)/),
      phone: get(/联系电话[:：]\s*(.+)/),
      legalRep: get(/(?:法定代表人|负责人)[:：]\s*(.+)/),
      isOurClient: block.includes('我方代理') && block.includes('✅'),
    };
  }

  private extractFees(sections: Map<string, string>): FeeInfo[] {
    const content = this.findSection(sections, '费用');
    if (!content) { return []; }

    const tables = this.extractTables(content);
    const fees: FeeInfo[] = [];

    for (const table of tables) {
      // Skip the header row, look for 3-column tables (type, amount, status)
      for (const row of table) {
        if (row.length >= 3 && !row[0].includes('费用类型')) {
          fees.push({
            type: row[0],
            amount: row[1],
            status: row[2],
          });
        }
      }
    }

    return fees;
  }

  private extractTimeline(sections: Map<string, string>): TimelineEntry[] {
    const content = this.findSection(sections, '时间线') ||
                    this.findSection(sections, '案件时间线');
    if (!content) { return []; }

    const tables = this.extractTables(content);
    const entries: TimelineEntry[] = [];

    for (const table of tables) {
      for (const row of table) {
        if (row.length >= 4 && !row[0].includes('日期')) {
          const importance = (row[3]?.match(/⭐/g) || []).length;
          entries.push({
            date: row[0],
            eventType: row[1],
            description: row[2],
            importance: Math.min(importance, 3),
            sourceFile: row[4] || '',
            status: row[5] || '',
          });
        }
      }
    }

    return entries;
  }

  private extractTasks(content: string): TaskItem[] {
    const tasks: TaskItem[] = [];
    const lines = content.split('\n');

    let currentPriority: TaskItem['priority'] = 'upcoming';
    for (const line of lines) {
      if (line.includes('今日待办') || line.includes('今天')) {
        currentPriority = 'today';
        continue;
      }
      if (line.includes('明日待办') || line.includes('明天')) {
        currentPriority = 'tomorrow';
        continue;
      }
      if (line.includes('近期') || line.includes('待办') || line.includes('重要任务')) {
        currentPriority = 'upcoming';
        continue;
      }

      const checkboxMatch = line.match(/- \[([ xX])\]\s*(.+)/);
      if (checkboxMatch) {
        tasks.push({
          completed: checkboxMatch[1].toLowerCase() === 'x',
          text: checkboxMatch[2].trim(),
          priority: currentPriority,
        });
      }
    }

    return tasks;
  }

  private extractDeadlines(sections: Map<string, string>): DeadlineEntry[] {
    const content = this.findSection(sections, '期限');
    if (!content) { return []; }

    const deadlines: DeadlineEntry[] = [];
    const tables = this.extractTables(content);

    for (const table of tables) {
      for (const row of table) {
        if (row.length >= 2 && !row[0].includes('期限类型') && !row[0].includes('类型')) {
          // Try to extract remaining days from content like "[5天]" or "剩余3天"
          const remainingMatch = row.join(' ').match(/(\d+)\s*天/);
          const remainingDays = remainingMatch ? parseInt(remainingMatch[1], 10) : -1;

          let status: DeadlineEntry['status'] = 'none';
          if (remainingDays >= 0 && remainingDays <= 3) { status = 'red'; }
          else if (remainingDays > 3 && remainingDays <= 7) { status = 'yellow'; }
          else if (remainingDays > 7) { status = 'green'; }

          deadlines.push({
            type: row[0],
            deadline: row[1] || '',
            remainingDays,
            status,
            description: row.slice(2).join(' '),
          });
        }
      }
    }

    // Also look for inline deadline patterns in non-table content
    const lines = content.split('\n');
    for (const line of lines) {
      const deadlineMatch = line.match(/(.+?)[：:]\s*(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}日?).*?(\d+)\s*天/);
      if (deadlineMatch) {
        const remainingDays = parseInt(deadlineMatch[3], 10);
        deadlines.push({
          type: deadlineMatch[1].trim(),
          deadline: deadlineMatch[2],
          remainingDays,
          status: remainingDays <= 3 ? 'red' : remainingDays <= 7 ? 'yellow' : 'green',
          description: line.trim(),
        });
      }
    }

    return deadlines;
  }

  private extractUpdateHistory(sections: Map<string, string>): UpdateEntry[] {
    const content = this.findSection(sections, '更新历史');
    if (!content) { return []; }

    const tables = this.extractTables(content);
    const entries: UpdateEntry[] = [];

    for (const table of tables) {
      for (const row of table) {
        if (row.length >= 3 && !row[0].includes('日期')) {
          entries.push({
            date: row[0],
            updater: row[1] || '',
            content: row[2],
            reason: row[3] || '',
          });
        }
      }
    }

    return entries;
  }
}
