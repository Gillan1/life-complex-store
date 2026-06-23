'use client'

import { useTheme } from 'next-themes'
import { useAuthStore } from '@/store/auth-store'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Moon, Sun, Globe, LogOut, Menu, Shield, LogIn } from 'lucide-react'
import { asset } from '@/lib/utils'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { username, isAdmin, logout, setShowLoginDialog } = useAuthStore()
  const { t, language, setLanguage } = useLanguage()

  const handleAdminLoginClick = () => {
    setShowLoginDialog(true)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden flex-shrink-0"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo & Store Name */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img
              src={asset("/store-logo.png")}
              alt="Store Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-400 hidden sm:block">
            {t('storeName')}
          </h1>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User info - hidden on small screens */}
        <div className="flex items-center gap-2">
          {isAdmin && username && (
            <span className="text-xs sm:text-sm text-muted-foreground hidden md:block max-w-[150px] truncate">
              {t('welcome')}, {username}
            </span>
          )}
          <Badge
            variant={isAdmin ? 'default' : 'secondary'}
            className={
              isAdmin
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : ''
            }
          >
            {isAdmin ? t('adminBadge') : t('guestBadge')}
          </Badge>
        </div>

        {/* Admin Login / Logout button */}
        {isAdmin ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title={t('logout')}
            className="flex-shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdminLoginClick}
            className="hidden sm:flex gap-1.5 flex-shrink-0 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden lg:inline">
              {language === 'ar' ? 'دخول المسؤول' : 'Admin Login'}
            </span>
          </Button>
        )}

        {/* Language toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setLanguage('ar')}
              className={language === 'ar' ? 'bg-accent' : ''}
            >
              {t('arabic')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage('en')}
              className={language === 'en' ? 'bg-accent' : ''}
            >
              {t('english')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex-shrink-0"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('darkMode')}</span>
        </Button>
      </div>
    </header>
  )
}
