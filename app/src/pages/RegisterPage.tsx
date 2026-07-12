import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AlertCircle, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { api } from '@/api/client'
import { useStore } from '@/store'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useStore()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    try {
      const result = await api.register({ email, password, full_name: fullName || undefined })
      setUser(result.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.')
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
            Create account
          </h1>
          <p className="font-mono text-xs text-tk-muted mb-8 text-center">
            Start scanning your code with Triskelix
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-tk-muted uppercase tracking-wider mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-tk-surface border border-tk-border px-4 py-3 font-mono text-sm text-tk-text focus:outline-none focus:border-tk-accent transition-colors"
              />
            </div>
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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-tk-surface border border-tk-border px-4 py-3 font-mono text-sm text-tk-text focus:outline-none focus:border-tk-accent transition-colors"
              />
              <p className="mt-2 font-mono text-xs text-tk-muted">At least 8 characters.</p>
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
              {submitting ? 'Creating account...' : (
                <>
                  Sign Up
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-xs text-tk-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-tk-accent hover:brightness-110">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
