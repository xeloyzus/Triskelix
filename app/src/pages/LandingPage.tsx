import { Link } from 'react-router'
import { Shield, Zap, Lock, Eye, ArrowRight, Terminal, FileText, CheckCircle, BarChart3, Server, Globe, Cpu } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-tk-bg">
      {/* Top Bar */}
      <header className="relative z-20 border-b border-tk-border/50 bg-tk-bg/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-tk-accent rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-sans text-lg font-medium text-tk-text tracking-tight">
              Triskelix
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="font-sans text-sm text-tk-text-secondary hover:text-tk-text transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-tk-accent text-white font-sans text-sm font-medium rounded hover:brightness-110 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-tk-accent/10 border border-tk-accent/20 rounded-full">
              <span className="w-2 h-2 bg-tk-green rounded-full animate-pulse" />
              <span className="font-mono text-xs text-tk-accent uppercase tracking-wider">
                Enterprise-Grade Application Security
              </span>
            </div>

            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-semibold text-tk-text leading-[1.1] tracking-tight max-w-4xl">
              Continuous security for
              <br />
              <span className="text-tk-accent">AI-augmented</span> codebases
            </h1>

            <p className="font-sans text-lg text-tk-text-secondary max-w-2xl mt-8 leading-relaxed">
              Triskelix provides automated vulnerability detection, agent-configuration auditing,
              and compliance mapping for modern development teams. Scan your repositories, APIs, and
              AI agent configurations against NIS2, SOC 2, and ISO 27001 frameworks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/scan"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-tk-accent text-white font-sans text-sm font-medium rounded-lg hover:brightness-110 transition-all shadow-lg shadow-tk-accent/20"
              >
                Start a Free Scan
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-tk-border text-tk-text font-sans text-sm font-medium rounded-lg hover:border-tk-accent/50 hover:bg-tk-surface/50 transition-all"
              >
                Create Account
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-tk-border/30">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-tk-green" />
                <span className="font-mono text-xs text-tk-muted">NIS2 Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-tk-green" />
                <span className="font-mono text-xs text-tk-muted">SOC 2 Mapped</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-tk-green" />
                <span className="font-mono text-xs text-tk-muted">ISO 27001</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-tk-green" />
                <span className="font-mono text-xs text-tk-muted">GDPR Audit-Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-tk-green" />
                <span className="font-mono text-xs text-tk-muted">AI Agent Auditing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6 border-t border-b border-tk-border/30 bg-tk-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-sans text-4xl font-semibold text-tk-text mb-2">15+</div>
              <div className="font-mono text-xs text-tk-muted uppercase tracking-wide">Vulnerability Categories</div>
            </div>
            <div>
              <div className="font-sans text-4xl font-semibold text-tk-text mb-2">{"<60s"}</div>
              <div className="font-mono text-xs text-tk-muted uppercase tracking-wide">Average Scan Time</div>
            </div>
            <div>
              <div className="font-sans text-4xl font-semibold text-tk-text mb-2">150+</div>
              <div className="font-mono text-xs text-tk-muted uppercase tracking-wide">Secret Patterns Detected</div>
            </div>
            <div>
              <div className="font-sans text-4xl font-semibold text-tk-text mb-2">5</div>
              <div className="font-mono text-xs text-tk-muted uppercase tracking-wide">AI Analyst Agents</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-mono text-xs text-tk-accent uppercase tracking-[0.2em]">Process</span>
            <h2 className="font-sans text-4xl md:text-5xl font-semibold text-tk-text mt-4 mb-6">
              Four-stage security pipeline
            </h2>
            <p className="font-sans text-base text-tk-text-secondary max-w-2xl mx-auto leading-relaxed">
              Our multi-agent AI pipeline ingests your codebase, maps the attack surface,
              cross-validates findings across five specialized security models, and produces
              compliance-mapped audit reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Ingestion',
                desc: 'Pull code from repositories, pastes, or live URLs. Multi-language parsing with 500KB throughput.',
                icon: Server,
              },
              {
                step: '02',
                title: 'Triage',
                desc: 'Map entry points, authentication flows, and trust boundaries. Identify the full attack surface.',
                icon: Eye,
              },
              {
                step: '03',
                title: 'Analysis',
                desc: 'Five specialized AI agents cross-validate findings across OWASP, cloud IAM, cryptography, framework, and supply-chain domains.',
                icon: BarChart3,
              },
              {
                step: '04',
                title: 'Reporting',
                desc: 'Compliance-mapped reports with auto-generated patches, Cursor-ready prompts, and NIS2 attestation evidence.',
                icon: FileText,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group p-8 rounded-lg border border-tk-border/50 bg-tk-surface/20 hover:border-tk-accent/30 hover:bg-tk-surface/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-2xl font-semibold text-tk-accent/40 group-hover:text-tk-accent transition-colors">
                    {item.step}
                  </span>
                  <item.icon className="w-5 h-5 text-tk-muted group-hover:text-tk-accent transition-colors" />
                </div>
                <h3 className="font-sans text-lg font-semibold text-tk-text mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-tk-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-28 px-6 border-t border-tk-border/30 bg-tk-surface/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-mono text-xs text-tk-accent uppercase tracking-[0.2em]">Capabilities</span>
            <h2 className="font-sans text-4xl md:text-5xl font-semibold text-tk-text mt-4 mb-6">
              Comprehensive security intelligence
            </h2>
            <p className="font-sans text-base text-tk-text-secondary max-w-2xl mx-auto leading-relaxed">
              From exposed credentials to AI agent misconfigurations, our platform covers the
              full spectrum of modern application security risks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Code Vulnerability Analysis',
                desc: 'Static and AI-powered detection across 15+ categories including injection, broken access control, cryptographic failures, and IDOR.',
                icon: BugIcon,
              },
              {
                title: 'Agent & MCP Configuration Audit',
                desc: 'Map every AI agent, MCP server, credential, and external data source. Detect over-privileged execution, rogue servers, and injection sinks.',
                icon: Cpu,
              },
              {
                title: 'Composed Attack Path Detection',
                desc: 'Chain individual findings into multi-step exploit scenarios. Understand how an attacker would move through your system.',
                icon: Lock,
              },
              {
                title: 'Compliance Auto-Mapping',
                desc: 'Automatically map every finding to NIS2 Articles, SOC 2 Trust Services Criteria, ISO 27001 Annex A controls, and GDPR requirements.',
                icon: FileText,
              },
              {
                title: 'Autonomous Remediation',
                desc: 'AI-generated fix patches with verification tests. Low-severity findings auto-fixed. High-severity findings come with detailed remediation guides.',
                icon: Terminal,
              },
              {
                title: 'Security Copilot',
                desc: 'Conversational AI grounded in your scan data. Ask natural-language questions about your risk posture and get specific, actionable answers.',
                icon: Zap,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-lg border border-tk-border/40 hover:border-tk-accent/20 transition-all duration-300"
              >
                <feature.icon />
                <h3 className="font-sans text-base font-semibold text-tk-text mt-4 mb-3">
                  {feature.title}
                </h3>
                <p className="font-sans text-sm text-tk-text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="relative z-10 py-28 px-6 border-t border-tk-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-mono text-xs text-tk-accent uppercase tracking-[0.2em]">Governance</span>
              <h2 className="font-sans text-4xl font-semibold text-tk-text mt-4 mb-6">
                Built for regulatory compliance
              </h2>
              <p className="font-sans text-base text-tk-text-secondary leading-relaxed mb-8">
                Triskelix generates audit-ready evidence for NIS2 Article 21, SOC 2, ISO 27001,
                and GDPR. Every scan produces a timestamped attestation report with framework
                mappings and remediation status — ready for your compliance auditor.
              </p>
              <div className="space-y-4">
                {[
                  'NIS2 Article 21 governance & risk management evidence',
                  'SOC 2 Trust Services Criteria mapping',
                  'ISO 27001 Annex A control coverage reports',
                  'GDPR Article 32 data security attestations',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-tk-green shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-tk-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative p-8 rounded-lg border border-tk-border/40 bg-tk-surface/30">
              <div className="space-y-6">
                {[
                  { label: 'Security Score', value: '85/100', color: 'bg-tk-green' },
                  { label: 'Compliance Readiness', value: 'Audit Ready', color: 'bg-tk-green' },
                  { label: 'Framework Coverage', value: '4 Frameworks', color: 'bg-tk-accent' },
                  { label: 'Remediation Coverage', value: '100%', color: 'bg-tk-green' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-tk-muted uppercase tracking-wide">
                        {stat.label}
                      </span>
                      <span className="font-mono text-xs text-tk-text font-medium">{stat.value}</span>
                    </div>
                    <div className="h-1.5 bg-tk-border/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color} rounded-full transition-all duration-1000`}
                        style={{ width: stat.value.includes('/') ? '85%' : stat.value === '4 Frameworks' ? '70%' : '100%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6 border-t border-tk-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-sans text-4xl md:text-5xl font-semibold text-tk-text mb-6">
            Secure your AI-augmented codebase today
          </h2>
          <p className="font-sans text-lg text-tk-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            Your first scan is free. No credit card required. Identify vulnerabilities,
            audit AI agent configurations, and produce compliance-ready reports in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/scan"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-tk-accent text-white font-sans text-sm font-medium rounded-lg hover:brightness-110 transition-all shadow-lg shadow-tk-accent/20"
            >
              <Terminal className="w-4 h-4" />
              Start Free Scan
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-tk-border text-tk-text font-sans text-sm font-medium rounded-lg hover:border-tk-accent/50 hover:bg-tk-surface/50 transition-all"
            >
              Create Enterprise Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-tk-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-tk-accent rounded flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-sans text-sm text-tk-text font-medium">Triskelix, Inc.</span>
            </div>
            <div className="flex items-center gap-8">
              <span className="font-mono text-xs text-tk-muted hover:text-tk-text cursor-pointer transition-colors">
                Privacy Policy
              </span>
              <span className="font-mono text-xs text-tk-muted hover:text-tk-text cursor-pointer transition-colors">
                Terms of Service
              </span>
              <span className="font-mono text-xs text-tk-muted hover:text-tk-text cursor-pointer transition-colors">
                Security
              </span>
              <span className="font-mono text-xs text-tk-muted hover:text-tk-text cursor-pointer transition-colors">
                Documentation
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tk-green" />
              <span className="font-mono text-xs text-tk-muted">System Status: Operational</span>
            </div>
          </div>
          <div className="text-center mt-8 pt-6 border-t border-tk-border/30">
            <span className="font-mono text-xs text-tk-muted">
              &copy; {new Date().getFullYear()} Triskelix, Inc. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Custom Bug icon (not in lucide-react)
function BugIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-tk-muted"
    >
      <path d="M12 4V2" />
      <path d="M8 4.5l-2-2" />
      <path d="M16 4.5l2-2" />
      <path d="M7 10c0-2.76 2.24-5 5-5s5 2.24 5 5v5c0 2.76-2.24 5-5 5s-5-2.24-5-5v-5z" />
      <path d="M3 13h4" />
      <path d="M17 13h4" />
      <path d="M3 17h4" />
      <path d="M17 17h4" />
    </svg>
  )
}