import * as fs from 'fs';
import * as path from 'path';
import { CaseScanner } from '../data/CaseScanner';
import { MarkdownParser } from '../data/MarkdownParser';
import { YamlParser } from '../data/YamlParser';
import { CaseMeta, DeadlineEntry } from '../data/types';

interface CaseDeadline {
  caseId: string;
  caseName: string;
  casePath: string;
  deadline: DeadlineEntry;
}

/**
 * Scans all cases for deadlines, sorts by urgency,
 * and provides aggregated deadline alerts.
 */
export class DeadlineService {
  private scanner: CaseScanner;
  private mdParser: MarkdownParser;
  private yamlParser: YamlParser;
  private warningDays: number;

  constructor(scanner: CaseScanner, warningDays = 7) {
    this.scanner = scanner;
    this.mdParser = new MarkdownParser();
    this.yamlParser = new YamlParser();
    this.warningDays = warningDays;
  }

  /** Get all deadlines across all cases, sorted by urgency */
  getAllDeadlines(): CaseDeadline[] {
    const cases = this.scanner.scanAll();
    const allDeadlines: CaseDeadline[] = [];

    for (const c of cases) {
      const deadlines = this.getCaseDeadlines(c);
      for (const d of deadlines) {
        allDeadlines.push({
          caseId: c.caseId,
          caseName: c.dirName,
          casePath: c.dirPath,
          deadline: d,
        });
      }
    }

    // Sort: most urgent first (lowest remaining days, negative = overdue first)
    return allDeadlines.sort((a, b) => {
      const aDays = a.deadline.remainingDays;
      const bDays = b.deadline.remainingDays;
      // Overdue items first, then by remaining days
      if (aDays < 0 && bDays >= 0) { return -1; }
      if (bDays < 0 && aDays >= 0) { return 1; }
      return aDays - bDays;
    });
  }

  /** Get deadlines that are within the warning threshold */
  getUrgentDeadlines(): CaseDeadline[] {
    return this.getAllDeadlines().filter(
      cd => cd.deadline.remainingDays >= 0 && cd.deadline.remainingDays <= this.warningDays
    );
  }

  /** Get overdue deadlines */
  getOverdueDeadlines(): CaseDeadline[] {
    return this.getAllDeadlines().filter(cd => cd.deadline.remainingDays < 0);
  }

  /** Count urgent deadlines for status bar display */
  getUrgentCount(): number {
    return this.getUrgentDeadlines().length + this.getOverdueDeadlines().length;
  }

  /** Update the warning threshold */
  setWarningDays(days: number) {
    this.warningDays = days;
  }

  // ============================================================
  // Private
  // ============================================================

  private getCaseDeadlines(meta: CaseMeta): DeadlineEntry[] {
    let deadlines: DeadlineEntry[] = [];

    // Try markdown info file first
    if (meta.hasInfoMd) {
      try {
        const files = fs.readdirSync(meta.dirPath)
          .filter(f => f.endsWith('案件信息.md'));
        if (files.length > 0) {
          const info = this.mdParser.parseFile(path.join(meta.dirPath, files[0]));
          if (info.deadlines && info.deadlines.length > 0) {
            deadlines = info.deadlines;
          }
        }
      } catch { /* skip */ }
    }

    // Supplement with scheduler YAML
    if (meta.hasSchedulerYaml) {
      try {
        const schedulerDir = fs.readdirSync(meta.dirPath)
          .find(f => f.startsWith('00'));
        if (schedulerDir) {
          const yamlFiles = fs.readdirSync(path.join(meta.dirPath, schedulerDir))
            .filter(f => f.endsWith('.yaml') && !f.includes('案件基础信息表'));
          if (yamlFiles.length > 0) {
            const yamlDeadlines = this.yamlParser.parseSchedulerYaml(
              path.join(meta.dirPath, schedulerDir, yamlFiles[0]),
            );
            // Merge: YAML deadlines supplement MD deadlines
            const existingTypes = new Set(deadlines.map(d => d.type));
            for (const d of yamlDeadlines) {
              if (!existingTypes.has(d.type)) {
                deadlines.push(d);
              }
            }
          }
        }
      } catch { /* skip */ }
    }

    return deadlines;
  }
}
