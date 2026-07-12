import { useState } from 'react'
import { Github, Shield, Bell, User as UserIcon, Loader2, Check } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useStore } from '@/store'
import { api } from '@/api/client'

export default function SettingsPage() {
  const { user, setUser } = useStore()
  const [connecting, setConnecting] = useState(false)
  const [fullName, setFullName] = useState(user?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [slackWebhook, setSlackWebhook] = useState('')

  const handleConnectGitHub = async () => {
    setConnecting(true)
    try {
      const { authorize_url } = await api.getGithubAuthorizeUrl()
      window.location.href = authorize_url
    } catch {
      setConnecting(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const updated = await api.updateProfile({ full_name: fullName })
      setUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-tk-bg">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-sans text-3xl md:text-4xl font-normal text-tk-text mb-10">
            Settings
          </h1>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="p-6 bg-tk-surface border border-tk-border">
              <div className="flex items-center gap-3 mb-6">
                <UserIcon className="w-5 h-5 text-tk-accent" />
                <h2 className="font-sans text-lg text-tk-text">Profile</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-mono text-xs text-tk-muted uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                    className="w-full bg-tk-bg border border-tk-border px-4 py-3 font-mono text-sm text-tk-text disabled:text-tk-muted focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-tk-muted uppercase tracking-wider mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-tk-bg border border-tk-border px-4 py-3 font-mono text-sm text-tk-text placeholder:text-tk-muted/50 focus:outline-none focus:border-tk-accent transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-tk-accent text-tk-bg font-mono text-xs uppercase hover:brightness-110 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Saved
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>

            {/* GitHub Integration */}
            <div className="p-6 bg-tk-surface border border-tk-border">
              <div className="flex items-center gap-3 mb-6">
                <Github className="w-5 h-5 text-tk-accent" />
                <h2 className="font-sans text-lg text-tk-text">GitHub Integration</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm text-tk-text-secondary mb-1">
                    {user?.github_connected
                      ? 'GitHub account connected'
                      : 'Connect your GitHub account to scan repositories'}
                  </p>
                  <p className="font-mono text-xs text-tk-muted">
                    {user?.github_connected
                      ? 'You can now scan any of your repositories'
                      : 'Required for GitHub repo scanning'}
                  </p>
                </div>
                <button
                  onClick={handleConnectGitHub}
                  disabled={user?.github_connected || connecting}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                    user?.github_connected
                      ? 'bg-tk-green/20 text-tk-green border border-tk-green/30 cursor-default'
                      : 'bg-tk-accent text-tk-bg hover:brightness-110'
                  } disabled:opacity-70`}
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Connecting...
                    </>
                  ) : user?.github_connected ? (
                    <>
                      <Shield className="w-3.5 h-3.5" />
                      Connected
                    </>
                  ) : (
                    <>
                      <Github className="w-3.5 h-3.5" />
                      Connect
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="p-6 bg-tk-surface border border-tk-border">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-tk-accent" />
                <h2 className="font-sans text-lg text-tk-text">Notifications</h2>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-sans text-sm text-tk-text">Email Notifications</p>
                  <p className="font-mono text-xs text-tk-muted">Get notified when scans complete</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    notifications ? 'bg-tk-accent' : 'bg-tk-border'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-tk-bg transition-transform ${
                      notifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="block font-mono text-xs text-tk-muted uppercase tracking-wider mb-2">
                  Slack Webhook URL (optional)
                </label>
                <input
                  type="text"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full bg-tk-bg border border-tk-border px-4 py-3 font-mono text-sm text-tk-text placeholder:text-tk-muted/50 focus:outline-none focus:border-tk-accent transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
