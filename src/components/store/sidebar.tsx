'use client'

import { useAuthStore } from '@/store/auth-store'
import { useLanguage } from '@/hooks/use-language'
import { cn } from '@/lib/utils'
import { Home, BarChart3, Settings, Shield, Wrench, Megaphone, LogIn, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export type ViewType = 'home' | 'sales' | 'settings' | 'services' | 'promotion'

interface SidebarProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ activeView, onViewChange, isOpen, onClose }: SidebarProps) {
  const { isAdmin, setShowLoginDialog } = useAuthStore()
  const { t, dir, language } = useLanguage()
  const isRtl = dir === 'rtl'
  const [isMobile, setIsMobile] = useState(false)

  // تتبع حجم الشاشة
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // إغلاق القائمة عند الضغط على Escape (للموبايل)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const navItems: { id: ViewType; icon: React.ReactNode; label: string; adminOnly: boolean }[] = [
    { id: 'home', icon: <Home className="h-5 w-5" />, label: t('home'), adminOnly: false },
    { id: 'services', icon: <Wrench className="h-5 w-5" />, label: t('services'), adminOnly: false },
    { id: 'promotion', icon: <Megaphone className="h-5 w-5" />, label: language === 'ar' ? 'الترويج' : 'Promotion', adminOnly: false },
    { id: 'sales', icon: <BarChart3 className="h-5 w-5" />, label: t('sales'), adminOnly: true },
    { id: 'settings', icon: <Settings className="h-5 w-5" />, label: t('settings'), adminOnly: true },
  ]

  const filteredItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  const handleAdminLoginClick = () => {
    setShowLoginDialog(true)
    onClose()
  }

  const handleItemClick = (id: ViewType) => {
    onViewChange(id)
    onClose()
  }

  return (
    <>
      {/* ✅ Mobile overlay - يظهر فقط على الموبايل عند فتح القائمة */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // ✅ على الموبايل: fixed ويتحكم به isOpen
          // ✅ على الكمبيوتر: sticky ودائماً ظاهر
          'fixed top-14 z-50 h-[calc(100vh-3.5rem)] w-64 border-e bg-sidebar transition-transform duration-300 ease-in-out',
          // ✅ الموضع حسب اتجاه اللغة
          isRtl ? 'right-0' : 'left-0',
          // ✅ إظهار/إخفاء على الموبايل
          isOpen
            ? 'translate-x-0'
            : isRtl
              ? 'translate-x-full'
              : '-translate-x-full',
          // ✅ على الكمبيوتر: دائماً ظاهر
          'md:sticky md:top-14 md:z-auto md:h-[calc(100vh-3.5rem)] md:translate-x-0'
        )}
        aria-hidden={!isOpen && isMobile}
      >
        <div className="flex h-full flex-col gap-2 p-4">
          {/* ✅ زر إغلاق على الموبايل */}
          {isMobile && (
            <button
              onClick={onClose}
              className="self-end mb-2 p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground"
              aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {isAdmin && (
            <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {t('adminSection')}
              </span>
            </div>
          )}

          <nav className="flex flex-col gap-1">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm sm:text-base font-medium transition-all duration-200 w-full text-start min-h-[44px]',
                  activeView === item.id
                    ? item.id === 'services'
                      ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 shadow-sm'
                      : item.id === 'promotion'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 shadow-sm'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* ✅ قسم المسؤول/الموقع - في أسفل القائمة */}
          <div className="mt-auto space-y-3">
            {!isAdmin ? (
              <button
                onClick={handleAdminLoginClick}
                className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm min-h-[44px]"
              >
                <LogIn className="h-4 w-4" />
                {language === 'ar' ? 'دخول المسؤول' : 'Admin Login'}
              </button>
            ) : null}

            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 text-center leading-relaxed">
                {language === 'ar' ? '📍 مجمع الحياة - دنقلا' : '📍 Life Complex - Dongola'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
