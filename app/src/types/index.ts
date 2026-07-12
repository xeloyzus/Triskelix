export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
export type ScanStatus = 'pending' | 'ingesting' | 'analysing' | 'reporting' | 'complete' | 'failed'
export type InputType = 'code' | 'github' | 'url'
export type ScanMode = 'committed_only' | 'full_environment'
export type FindingSurface = 'code' | 'agent'
export type FindingCertainty = 'deterministic' | 'semi' | 'heuristic'
export type FixStatus = 'not_requested' | 'queued' | 'generating' | 'ready' | 'failed'
export type RemediationStatus = 'not_requested' | 'queued' | 'generating' | 'ready' | 'pr_created' | 'failed'

export interface Scan {
  id: string
  user_id: string
  input_type: InputType
  input_value: string | null
  stack: string[]
  status: ScanStatus
  progress_percent: number
  error_message: string | null
  file_count: number | null
  total_lines: number | null
  indexed_file_count: number
  indexed_chunk_count: number
  static_finding_count: number
  ai_analyzed_chunk_count: number
  security_score: number | null
  critical_count: number
  high_count: number
  medium_count: number
  low_count: number
  remediation_status: RemediationStatus
  remediation_pr_url: string | null
  remediation_error: string | null
  created_at: string
  completed_at: string | null
}

export interface VulnerabilityLocation {
  file: string
  line: number | null
}

export interface Vulnerability {
  id: string
  scan_id: string
  severity: SeverityLevel
  surface: FindingSurface
  certainty: FindingCertainty
  category: string
  title: string
  description: string
  file_path: string | null
  line_number: number | null
  locations: VulnerabilityLocation[]
  code_snippet: string | null
  evidence: string | null
  cwe_id: string | null
  owasp_category: string | null
  fix_patch: string | null
  cursor_prompt: string | null
  fix_status: FixStatus
  fix_error: string | null
  is_false_positive: boolean
  composed_path_id: string | null
  created_at: string
}

export interface Report {
  id: string
  scan_id: string
  markdown_content: string
  github_action_yaml: string
  trust_badge_eligible: boolean
  report_url: string | null
  created_at: string
}

export interface TrustMap {
  id: string
  scan_id: string
  mode: ScanMode
  agents: AgentConfig[]
  mcp_servers: MCPServer[]
  external_sources: ExternalSource[]
  credentials: CredentialFinding[]
  created_at: string
}

export interface AgentExecution {
  auto_approve: boolean
  shell_access: boolean
  fs_scope: 'workspace' | 'home' | 'unrestricted'
  dangerous_flags: string[]
}

export interface AgentConfig {
  id: string
  kind: 'claude_code' | 'cursor' | 'copilot' | 'other'
  execution: AgentExecution
  mcp_servers: string[]
}

export interface MCPServer {
  id: string
  name: string
  transport: 'stdio' | 'sse' | 'http'
  endpoint: string | null
  tools: string[]
  oauth_scopes: string[]
  token_lifetime: 'long_lived' | 'short_lived' | 'unknown'
  returns_external_data: boolean
  pinned: boolean
  supply_chain_risk: 'typosquat' | 'unpinned' | 'ownership_change' | 'none'
}

export interface ExternalSource {
  id: string
  type: string
  side: 'read' | 'write'
  exposure: 'client_embedded' | 'server_only' | 'committed'
  reaches_agent_via: string | null
}

export interface CredentialFinding {
  id: string
  type: string
  location: string
  side: 'read' | 'write'
  exposure: 'client_embedded' | 'server_only' | 'committed'
  redacted_preview: string
}

export interface ComposedPath {
  id: string
  scan_id: string
  name: string
  severity: SeverityLevel
  chain: string[]
  narrative: string
  break_the_chain: string
  member_finding_ids: string[]
  created_at: string
}

export interface Attestation {
  id: string
  scan_id: string
  markdown_content: string
  pdf_url: string | null
  nis2_mapped: boolean
  exported_at: string | null
  created_at: string
}

export interface ScanWithVulns extends Scan {
  vulnerabilities: Vulnerability[]
  report: Report | null
  trust_map: TrustMap | null
  composed_paths: ComposedPath[]
  attestation: Attestation | null
}

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  github_connected: boolean
}

export interface ScanRequest {
  input_type: InputType
  input_value?: string
  code?: string
  stack: string[]
  scan_mode?: ScanMode
}

export const STACK_OPTIONS = [
  'Next.js', 'Supabase', 'FastAPI', 'React', 'Firebase',
  'Vercel', 'Remix', 'SvelteKit', 'Node.js', 'Python',
  'TypeScript', 'Prisma', 'Drizzle', 'PostgreSQL', 'MongoDB'
] as const

export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  CRITICAL: '#ff3c3c',
  HIGH: '#ff8844',
  MEDIUM: '#ffcc00',
  LOW: '#00ff88',
  INFO: '#a8b4ff',
}

export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  INFO: 'Info',
}

export const CERTAINTY_CONFIG: Record<FindingCertainty, { label: string; color: string; badge: string }> = {
  deterministic: { label: 'Deterministic', color: '#00ff88', badge: 'bg-tk-green/20 text-tk-green border-tk-green/30' },
  semi: { label: 'Semi-deterministic', color: '#ffcc00', badge: 'bg-tk-yellow/20 text-tk-yellow border-tk-yellow/30' },
  heuristic: { label: 'Heuristic', color: '#ff8844', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
}
