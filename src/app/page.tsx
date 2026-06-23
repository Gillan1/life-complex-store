'use client'

import { useAuthStore } from '@/store/auth-store'
import { AppShell } from '@/components/store/app-shell'
import { AdminLoginDialog } from '@/components/store/admin-login-dialog'
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
  const initAuth = useAuthStore((s) => s.initAuth)
  const showLoginDialog = useAuthStore((s) => s.showLoginDialog)
  const mounted = useHasMounted()
  const [hydrated, setHydrated] = useState(false)

  // Wait for zustand to hydrate + initialize Supabase session
  useEffect(() => {
    if (mounted) {
      setHydrated(true)
      initAuth()
    }
  }, [mounted, initAuth])

  if (!mounted || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-muted" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <>
      <AppShell />
      <AdminLoginDialog open={showLoginDialog} />
    </>
  )
}
