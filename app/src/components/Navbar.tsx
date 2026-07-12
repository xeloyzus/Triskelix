import { Link, useLocation, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { Shield, Menu, X, Terminal, LogOut } from 'lucide-react'
import { useStore } from '@/store'
import { api } from '@/api/client'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => location.pathname === path

  const navLinks = user
    ? [
        { path: '/scan', label: 'Scan' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/settings', label: 'Settings' },
      ]
    : []

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-tk-bg/90 backdrop-blur-md border-b border-tk-border'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <Shield className="w-6 h-6 text-tk-accent transition-transform group-hover:scale-110" />
            <span className="font-sans text-xl font-semibold text-tk-text tracking-tight">
              Triskelix
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-mono text-xs uppercase tracking-widest transition-colors hover:text-tk-accent ${
                  isActive(link.path) ? 'text-tk-accent' : 'text-tk-text-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/scan"
                  className="flex items-center gap-2 px-4 py-2 bg-tk-accent text-tk-bg font-mono text-xs uppercase tracking-widest hover:brightness-110 transition-all"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  New Scan
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-tk-text-secondary hover:text-tk-accent transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-mono text-xs uppercase tracking-widest text-tk-text-secondary hover:text-tk-accent transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-tk-accent text-tk-bg font-mono text-xs uppercase tracking-widest hover:brightness-110 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-tk-text"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-tk-bg/95 backdrop-blur-md border-b border-tk-border">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block font-mono text-sm uppercase tracking-widest transition-colors hover:text-tk-accent ${
                  isActive(link.path) ? 'text-tk-accent' : 'text-tk-text-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/scan"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-tk-accent text-tk-bg font-mono text-sm uppercase tracking-widest"
                >
                  <Terminal className="w-4 h-4" />
                  New Scan
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-tk-border text-tk-text-secondary font-mono text-sm uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center font-mono text-sm uppercase tracking-widest text-tk-text-secondary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-tk-accent text-tk-bg font-mono text-sm uppercase tracking-widest"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
