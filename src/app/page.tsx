'use client'

import { useAuthStore } from '@/store/auth-store'
import { LoginScreen } from '@/components/store/login-screen'
import { AppShell } from '@/components/store/app-shell'
import { useEffect, useState, useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const initAuth = useAuthStore((s) => s.initAuth)
  const mounted = useHasMounted()
  const [hydrated, setHydrated] = useState(false)

  // Wait for zustand to hydrate + initialize Supabase session
  useEffect(() => {
    if (mounted) {
      setHydrated(true)
      initAuth()
    }
  }, [mounted, initAuth])

  if (!mounted || !hydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-muted" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return <AppShell />
}
