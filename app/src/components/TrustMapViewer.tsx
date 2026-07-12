import { Shield, Server, ExternalLink, Key, AlertTriangle, CheckCircle, Lock } from 'lucide-react'
import type { TrustMap, MCPServer, AgentConfig, CredentialFinding } from '@/types'

function MCPServerCard({ server }: { server: MCPServer }) {
  return (
    <div className="p-4 bg-tk-bg border border-tk-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-tk-code" />
          <span className="font-mono text-sm text-tk-text">{server.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {server.returns_external_data && (
            <span className="px-2 py-0.5 font-mono text-xs bg-tk-yellow/20 text-tk-yellow border border-tk-yellow/30">
              External Data
            </span>
          )}
          {!server.pinned && (
            <span className="px-2 py-0.5 font-mono text-xs bg-tk-accent/20 text-tk-accent border border-tk-accent/30">
              Unpinned
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 font-mono text-xs text-tk-muted">
        <span>Transport: {server.transport}</span>
        <span>Token: {server.token_lifetime}</span>
        {server.endpoint && (
          <span className="col-span-2 truncate">{server.endpoint}</span>
        )}
        {server.tools.length > 0 && (
          <span className="col-span-2">Tools: {server.tools.join(', ')}</span>
        )}
      </div>
    </div>
  )
}

function AgentCard({ agent }: { agent: AgentConfig }) {
  const isOverprivileged = agent.execution.auto_approve && agent.execution.shell_access

  return (
    <div className={`p-4 bg-tk-bg border ${isOverprivileged ? 'border-tk-accent' : 'border-tk-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${isOverprivileged ? 'text-tk-accent' : 'text-tk-green'}`} />
          <span className="font-mono text-sm text-tk-text">{agent.kind}</span>
        </div>
        {isOverprivileged && (
          <span className="flex items-center gap-1 px-2 py-0.5 font-mono text-xs bg-tk-accent/20 text-tk-accent border border-tk-accent/30">
            <AlertTriangle className="w-3 h-3" />
            Overprivileged
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 font-mono text-xs text-tk-muted">
        <span className={agent.execution.auto_approve ? 'text-tk-accent' : 'text-tk-green'}>
          Auto-approve: {agent.execution.auto_approve ? 'ON' : 'OFF'}
        </span>
        <span className={agent.execution.shell_access ? 'text-tk-accent' : 'text-tk-green'}>
          Shell: {agent.execution.shell_access ? 'ON' : 'OFF'}
        </span>
        <span>FS Scope: {agent.execution.fs_scope}</span>
        {agent.execution.dangerous_flags.length > 0 && (
          <span className="col-span-2 text-tk-accent">
            Flags: {agent.execution.dangerous_flags.join(', ')}
          </span>
        )}
      </div>
    </div>
  )
}

function CredentialCard({ cred }: { cred: CredentialFinding }) {
  const isExposed = cred.exposure === 'client_embedded'

  return (
    <div className={`p-4 bg-tk-bg border ${isExposed ? 'border-tk-accent' : 'border-tk-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Key className={`w-4 h-4 ${isExposed ? 'text-tk-accent' : 'text-tk-yellow'}`} />
          <span className="font-mono text-sm text-tk-text">{cred.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 font-mono text-xs border ${
            cred.side === 'write' ? 'bg-tk-accent/20 text-tk-accent border-tk-accent/30' : 'bg-tk-green/20 text-tk-green border-tk-green/30'
          }`}>
            {cred.side}
          </span>
          <span className={`px-2 py-0.5 font-mono text-xs border ${
            isExposed ? 'bg-tk-accent/20 text-tk-accent border-tk-accent/30' : 'bg-tk-muted/20 text-tk-muted'
          }`}>
            {cred.exposure}
          </span>
        </div>
      </div>
      <div className="font-mono text-xs text-tk-muted">
        <span className="text-tk-code">{cred.redacted_preview}</span>
        <span className="mx-2">·</span>
        <span>{cred.location}</span>
      </div>
    </div>
  )
}

export default function TrustMapViewer({ trustMap }: { trustMap: TrustMap }) {
  return (
    <div className="space-y-6">
      {/* Mode badge */}
      <div className="flex items-center gap-3">
        <Lock className="w-4 h-4 text-tk-code" />
        <span className="font-mono text-xs uppercase tracking-wider text-tk-muted">
          Scan Mode:
        </span>
        <span className={`px-2 py-0.5 font-mono text-xs border ${
          trustMap.mode === 'full_environment'
            ? 'bg-tk-accent/20 text-tk-accent border-tk-accent/30'
            : 'bg-tk-green/20 text-tk-green border-tk-green/30'
        }`}>
          {trustMap.mode === 'full_environment' ? 'Full Environment' : 'Committed Only'}
        </span>
      </div>

      {/* Agents */}
      {trustMap.agents.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-tk-muted mb-3">
            <Shield className="w-4 h-4" />
            Agents ({trustMap.agents.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trustMap.agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {/* MCP Servers */}
      {trustMap.mcp_servers.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-tk-muted mb-3">
            <Server className="w-4 h-4" />
            MCP Servers ({trustMap.mcp_servers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trustMap.mcp_servers.map((server) => (
              <MCPServerCard key={server.id} server={server} />
            ))}
          </div>
        </div>
      )}

      {/* Credentials */}
      {trustMap.credentials.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-tk-muted mb-3">
            <Key className="w-4 h-4" />
            Credentials ({trustMap.credentials.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trustMap.credentials.map((cred) => (
              <CredentialCard key={cred.id} cred={cred} />
            ))}
          </div>
        </div>
      )}

      {/* External Sources */}
      {trustMap.external_sources.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-tk-muted mb-3">
            <ExternalLink className="w-4 h-4" />
            External Sources ({trustMap.external_sources.length})
          </h3>
          <div className="space-y-2">
            {trustMap.external_sources.map((src) => (
              <div key={src.id} className="flex items-center gap-3 p-3 bg-tk-bg border border-tk-border font-mono text-xs">
                <span className="text-tk-text">{src.type}</span>
                <span className="text-tk-muted">·</span>
                <span className={src.side === 'write' ? 'text-tk-accent' : 'text-tk-green'}>{src.side}</span>
                <span className="text-tk-muted">·</span>
                <span className={src.exposure === 'client_embedded' ? 'text-tk-accent' : 'text-tk-muted'}>{src.exposure}</span>
                {src.reaches_agent_via && (
                  <>
                    <span className="text-tk-muted">→</span>
                    <span className="text-tk-code">{src.reaches_agent_via}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {trustMap.agents.length === 0 && trustMap.mcp_servers.length === 0 && trustMap.credentials.length === 0 && (
        <div className="flex items-center gap-3 p-6 bg-tk-bg border border-tk-border border-dashed">
          <CheckCircle className="w-5 h-5 text-tk-green" />
          <div>
            <p className="font-sans text-sm text-tk-text">No agent configuration detected</p>
            <p className="font-mono text-xs text-tk-muted mt-1">
              {trustMap.mode === 'committed_only'
                ? 'Try full-environment mode to scan editor/agent config files.'
                : 'No MCP servers, agent configs, or exposed credentials found in the scanned environment.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
