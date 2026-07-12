import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useStore } from '@/store'
import { api } from '@/api/client'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, setUser } = useStore()
  const [checking, setChecking] = useState(!user)

  useEffect(() => {
    if (!user) {
      api
        .getMe()
        .then((u) => setUser(u))
        .catch(() => setUser(null))
        .finally(() => setChecking(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tk-bg">
        <span className="font-mono text-xs text-tk-muted">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
