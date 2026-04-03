// ============================================================
// SuitAgent Console - Core Type Definitions
// ============================================================

/** Case directory metadata discovered from filesystem */
export interface CaseMeta {
  dirName: string;
  dirPath: string;
  caseId: string;           // e.g. "251112"
  hasInfoMd: boolean;
  hasInfoYaml: boolean;
  hasSchedulerYaml: boolean;
  directoryStats: DirStat[];
  lastModified: Date;
}

/** Stats for one of the 12 case directories */
export interface DirStat {
  index: string;   // "00" through "11"
  label: string;   // e.g. "日程管理"
  emoji: string;   // e.g. "📅"
  fileCount: number;
  dirPath: string;
}

/** Parsed case info from 案件信息.md or YAML */
export interface CaseInfo {
  basicInfo: CaseBasicInfo;
  parties: PartyInfo[];
  fees: FeeInfo[];
  timeline: TimelineEntry[];
  disputes: DisputeItem[];
  tasks: TaskItem[];
  deadlines: DeadlineEntry[];
  updateHistory: UpdateEntry[];
}

export interface CaseBasicInfo {
  caseName: string;
  courtCaseNumber: string;
  cause: string;
  caseType: string;
  court: string;
  currentStage: string;
  lawFirmCaseNumber: string;
  lawFirmFilingDate: string;
  courtFilingDate: string;
  disputedAmount: string;
  leadLawyer: string;
  assistingLawyer: string;
  lastUpdated: string;
}

export interface PartyInfo {
  role: 'plaintiff' | 'defendant' | 'third_party';
  name: string;
  type: string;         // "自然人" or "法人"
  idNumber: string;
  address: string;
  phone: string;
  legalRep: string;
  isOurClient: boolean;
}

export interface FeeInfo {
  type: string;
  amount: string;
  status: string;
}

export interface TimelineEntry {
  date: string;
  eventType: string;
  description: string;
  importance: number;    // 1-3 stars
  sourceFile: string;
  status: string;        // "✅ 已完成", "⏳ 待进行", etc.
}

export interface DisputeItem {
  name: string;
  description: string;
  legalBasis: string;
  supportingCases: string;
  currentStatus: string;
}

export interface TaskItem {
  text: string;
  completed: boolean;
  priority: 'today' | 'tomorrow' | 'upcoming';
}

export interface DeadlineEntry {
  type: string;          // "应诉期限", "举证期限", "上诉期限", etc.
  deadline: string;
  remainingDays: number;
  status: 'green' | 'yellow' | 'red' | 'none';
  description: string;
}

export interface UpdateEntry {
  date: string;
  updater: string;
  content: string;
  reason: string;
}

// ============================================================
// Config Layer Types
// ============================================================

export interface AgentConfig {
  fileName: string;
  filePath: string;
  name: string;
  description: string;
  tools: string;
  skills: string;
  color: string;
}

export interface RuleConfig {
  fileName: string;
  filePath: string;
  title: string;
  version: string;
  lastUpdated: string;
}

export interface CommandConfig {
  fileName: string;
  filePath: string;
  name: string;
  description: string;
}

export interface SkillConfig {
  dirName: string;
  dirPath: string;
  hasSkillMd: boolean;
}

export interface WorkflowScenario {
  id: string;
  name: string;
  description: string;
  triggerKeywords: string[];
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  agent: string;
  action: string;
  qualityGate: string;
  outputDir: string;
}

// ============================================================
// View State Types
// ============================================================

export type ViewTab = 'cases' | 'detail' | 'workflow' | 'config';

export interface DashboardState {
  activeTab: ViewTab;
  cases: CaseMeta[];
  selectedCaseId: string | null;
  caseInfo: CaseInfo | null;
  workflows: WorkflowScenario[];
  deadlines: DeadlineEntry[];
}

// ============================================================
// Message Types (Extension Host <-> Webview)
// ============================================================

export type MessageType =
  | 'init'
  | 'caseList'
  | 'caseDetail'
  | 'workflowList'
  | 'refresh'
  | 'openCase'
  | 'triggerWorkflow'
  | 'openFile';

export interface ExtensionMessage {
  type: MessageType;
  data?: unknown;
}

export interface WebviewMessage {
  type: MessageType;
  data?: unknown;
}

// ============================================================
// 12-Layer Directory Definition
// ============================================================

export const CASE_DIRS: ReadonlyArray<{ index: string; emoji: string; label: string }> = [
  { index: '00', emoji: '📅', label: '日程管理' },
  { index: '01', emoji: '🤝', label: '委托材料' },
  { index: '02', emoji: '📄', label: '案件分析' },
  { index: '03', emoji: '🔍', label: '法律研究' },
  { index: '04', emoji: '📤', label: '客户提供' },
  { index: '05', emoji: '📎', label: '证据材料' },
  { index: '06', emoji: '📝', label: '法律文书' },
  { index: '07', emoji: '📥', label: '对方提交' },
  { index: '08', emoji: '🏛️', label: '法院送达' },
  { index: '09', emoji: '🎯', label: '庭审笔录' },
  { index: '10', emoji: '📊', label: '综合报告' },
  { index: '11', emoji: '📚', label: '参考文件' },
];
