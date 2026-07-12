import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AlertCircle, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { api } from '@/api/client'
import { useStore } from '@/store'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result = await api.login({ email, password })
      setUser(result.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-tk-bg">
      <Navbar />
      <div className="pt-32 pb-16 px-6 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <h1 className="font-sans text-3xl font-normal text-tk-text mb-2 text-center">
            Log in
          </h1>
          <p className="font-mono text-xs text-tk-muted mb-8 text-center">
            Welcome back to Triskelix
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-tk-muted uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-tk-surface border border-tk-border px-4 py-3 font-mono text-sm text-tk-text focus:outline-none focus:border-tk-accent transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-tk-muted uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-tk-surface border border-tk-border px-4 py-3 font-mono text-sm text-tk-text focus:outline-none focus:border-tk-accent transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-tk-accent/10 border border-tk-accent/30">
                <AlertCircle className="w-4 h-4 text-tk-accent flex-shrink-0" />
                <span className="font-mono text-xs text-tk-accent">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-tk-accent text-tk-bg font-mono text-sm uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
            >
              {submitting ? 'Logging in...' : (
                <>
                  Log In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-xs text-tk-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-tk-accent hover:brightness-110">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
