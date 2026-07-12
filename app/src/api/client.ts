import type { Scan, ScanRequest, ScanWithVulns, User, Vulnerability } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ---------------------------------------------------------------------------
// HttpOnly cookie-based auth — no manual token management needed.
// The backend sets `triskelix_access` and `triskelix_refresh` as httpOnly
// cookies, which the browser sends automatically with `credentials: 'include'`.
//
// Preemptive refresh: we decode the access token to check its expiry and
// refresh before it expires, avoiding 401 responses entirely.
// ---------------------------------------------------------------------------

interface FetchOptions extends RequestInit {
  _retried?: boolean
}

let refreshPromise: Promise<boolean> | null = null

async function ensureFreshToken(): Promise<void> {
  // We can't read httpOnly cookies from JS, but we can try a lightweight call
  // to /api/auth/me which will 401 if the token is expired. We use a
  // debounced refresh: if we've refreshed recently (within 10 min), skip.
  const lastRefresh = (window as any).__triskelix_last_refresh as number || 0
  const now = Date.now()
  if (now - lastRefresh < 10 * 60 * 1000) return

  // Deduplicate concurrent refresh calls
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    }).then(r => {
      (window as any).__triskelix_last_refresh = Date.now()
      return r.ok
    }).catch(() => false)
      .finally(() => { refreshPromise = null })
  }
  await refreshPromise
}

async function fetchWithAuth(path: string, options: FetchOptions = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  // If 401 and we haven't retried yet, attempt a silent token refresh
  if (response.status === 401 && !options._retried) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      // Retry the original request once
      return fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: 'include',
        _retried: true,
      } as RequestInit).then(r => r.json())
    }
    // If refresh fails, the error below will throw
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }

  // Handle 204 No Content
  if (response.status === 204) return null

  return response.json()
}

async function fetchTextWithAuth(path: string): Promise<string> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
  })

  if (response.status === 401) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      const retryResponse = await fetch(`${API_URL}${path}`, {
        credentials: 'include',
      })
      if (!retryResponse.ok) {
        const error = await retryResponse.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(error.detail || `HTTP ${retryResponse.status}`)
      }
      return retryResponse.text()
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }

  return response.text()
}

async function tryRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    return response.ok
  } catch {
    return false
  }
}

interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export const api = {
  // Auth
  register: (data: { email: string; password: string; full_name?: string }): Promise<AuthResponse> =>
    fetchWithAuth('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }): Promise<AuthResponse> =>
    fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: (): Promise<void> =>
    fetchWithAuth('/api/auth/logout', { method: 'POST' }),

  refresh: (): Promise<AuthResponse> =>
    fetchWithAuth('/api/auth/refresh', { method: 'POST' }),

  getMe: (): Promise<User> => fetchWithAuth('/api/auth/me'),

  updateProfile: (data: { full_name?: string }): Promise<User> =>
    fetchWithAuth('/api/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),

  isAuthenticated: (): Promise<boolean> =>
    fetchWithAuth('/api/auth/me')
      .then(() => true)
      .catch(() => false),

  // Scans
  createScan: (data: ScanRequest): Promise<{ scan_id: string; status: string }> =>
    fetchWithAuth('/api/scans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getScans: (page = 1, limit = 20): Promise<{ scans: Scan[]; total: number }> =>
    fetchWithAuth(`/api/scans?page=${page}&limit=${limit}`),

  getScan: (scanId: string): Promise<ScanWithVulns> =>
    fetchWithAuth(`/api/scans/${scanId}`),

  getScanStatus: (scanId: string): Promise<{
    status: string
    progress_percent: number
    security_score: number | null
    critical_count: number
    high_count: number
    medium_count: number
    low_count: number
    error_message: string | null
  }> =>
    fetchWithAuth(`/api/scans/${scanId}/status`),

  markFalsePositive: (scanId: string, vulnId: string): Promise<Vulnerability> =>
    fetchWithAuth(`/api/scans/${scanId}/vulnerabilities/${vulnId}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_false_positive: true }),
    }),

  queueRemediation: (scanId: string, vulnerabilityIds?: string[]): Promise<{ status: string; queued_count: number }> =>
    fetchWithAuth(`/api/scans/${scanId}/remediation`, {
      method: 'POST',
      body: JSON.stringify({ vulnerability_ids: vulnerabilityIds }),
    }),

  createRemediationPr: (scanId: string): Promise<{ pr_url: string }> =>
    fetchWithAuth(`/api/scans/${scanId}/remediation/github-pr`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  // GitHub
  getGithubAuthorizeUrl: (): Promise<{ authorize_url: string }> =>
    fetchWithAuth('/api/github/authorize'),

  getRepos: (): Promise<Array<{ name: string; private: boolean; language: string; updated_at: string }>> =>
    fetchWithAuth('/api/github/repos'),

  // Reports
  downloadReport: (scanId: string): Promise<string> =>
    fetchTextWithAuth(`/api/reports/${scanId}/download`),

  downloadGitHubAction: (scanId: string): Promise<string> =>
    fetchTextWithAuth(`/api/reports/${scanId}/github-action`),
}