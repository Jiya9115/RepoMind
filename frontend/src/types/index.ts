export interface User {
  id: number;
  name: string;
  email: string;
  githubId?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface Repository {
  id: number;
  userId?: number;
  githubUrl: string;
  name: string;
  description?: string;
  defaultBranch: string;
  analysisStatus: "PENDING" | "ANALYZING" | "COMPLETED" | "FAILED";
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressStep {
  step: string;
  label: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  detail?: string;
}

export interface AnalysisStatusResponse {
  repositoryId: number;
  status: string;
  progress: number;
  steps: ProgressStep[];
  error?: string;
}

export interface CodeSymbol {
  id: number;
  fileId: number;
  name: string;
  type: string;
  startLine: number;
  endLine: number;
}

export interface FileSummary {
  id: number;
  repositoryId: number;
  path: string;
  language: string;
  size: number;
  lineCount: number;
  symbolCount: number;
}

export interface FileDetail {
  id: number;
  repositoryId: number;
  path: string;
  language: string;
  size: number;
  lineCount: number;
  content: string;
  contentHash: string;
  symbols: CodeSymbol[];
}

export interface TreeNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  language?: string;
  size?: number;
  fileId?: number;
  children?: TreeNode[];
}

export interface Dependency {
  id: number;
  source: string;
  target: string;
  dependencyType: string;
}

export interface SecurityFinding {
  id: number;
  file: string;
  line: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  category: string;
  description: string;
  recommendation: string;
}

export interface SecurityOverview {
  score: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  findings: SecurityFinding[];
}

export interface DebtMetric {
  category: string;
  name: string;
  value: string;
  threshold: string;
  impact: string;
}

export interface Hotspot {
  file: string;
  churn: number;
  complexity: number;
  hotspotScore: number;
  reason: string;
}

export interface TechnicalDebtOverview {
  debtScore: number;
  estimatedRemediationHours: number;
  totalTodos: number;
  highComplexityFunctions: number;
  largeFilesCount: number;
  hotspots: Hotspot[];
  metrics: DebtMetric[];
  explanation: string;
}

export interface GitCommit {
  hash: string;
  author: string;
  authorEmail: string;
  message: string;
  date: string;
}

export interface GitContributor {
  name: string;
  email: string;
  commits: number;
  percentage: number;
}

export interface GitChurn {
  file: string;
  churn: number;
}

export interface GitOverview {
  totalCommits: number;
  contributors: GitContributor[];
  recentCommits: GitCommit[];
  topChurnedFiles: GitChurn[];
  codeHotspots: Hotspot[];
}

export interface ArchitectureNode {
  id: string;
  name: string;
  path: string;
  tier: string;
  fileId?: number;
  description?: string;
}

export interface ArchitectureEdge {
  source: string;
  target: string;
  label?: string;
}

export interface ArchitectureOverview {
  tiers: Record<string, ArchitectureNode[]>;
  edges: ArchitectureEdge[];
  summary: string;
}

export interface MapNode {
  id: string;
  type: string;
  data: Record<string, any>;
  position: { x: number; y: number };
  style?: Record<string, any>;
}

export interface MapEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface CodebaseMap {
  nodes: MapNode[];
  edges: MapEdge[];
  stats: Record<string, any>;
}

export interface SourceCitation {
  file: string;
  startLine: number;
  endLine: number;
  snippet?: string;
  description?: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  sources: SourceCitation[];
  createdAt: string;
}

export interface ChatResponse {
  sessionId: number;
  message: ChatMessage;
  isDemoMode: boolean;
  provider: string;
}

export interface ChatSession {
  id: number;
  repositoryId: number;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface DocItem {
  title: string;
  docType: string;
  filename: string;
  content: string;
}

export interface DocumentationResponse {
  repositoryId: number;
  repositoryName: string;
  documents: DocItem[];
}

export interface OnboardingStep {
  title: string;
  description: string;
  codeReference?: string;
  actionItem?: string;
}

export interface ReadingOrderItem {
  order: number;
  filePath: string;
  title: string;
  reason: string;
  keySymbols: string[];
}

export interface OnboardingGuide {
  projectOverview: string;
  startupInstructions: string;
  architectureOverview: string;
  keyDirectories: { path: string; description: string }[];
  entryPoints: { name: string; path: string; description: string }[];
  authFlow: OnboardingStep[];
  databaseFlow: OnboardingStep[];
  apiFlow: OnboardingStep[];
  recommendedReadingOrder: ReadingOrderItem[];
}
