'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Store, LogIn, Mail, Lock, AlertCircle } from 'lucide-react'
import { asset } from '@/lib/utils'
import { toast } from 'sonner'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const { t, language, setLanguage } = useLanguage()

  const handleLogin = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError(language === 'ar' ? 'الرجاء إدخال البريد وكلمة المرور' : 'Please enter email and password')
      return
    }

    setError('')
    setLoading(true)
    const result = await login(trimmedEmail, password)
    setLoading(false)

    if (!result.success) {
      setError(result.error || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed'))
      toast.error(result.error || 'Login failed')
    } else {
      toast.success(language === 'ar' ? 'مرحباً بك' : 'Welcome')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 p-4">
      {/* Language toggle in top corner */}
      <div className="fixed top-4 left-4 right-4 flex justify-end z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
        >
          {language === 'ar' ? 'English' : 'العربية'}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-4 w-24 h-24 rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={asset("/store-logo.png")}
                alt={t('storeName')}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-emerald-700 dark:text-emerald-400"
            >
              {t('storeName')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mt-1"
            >
              {t('storeSlogan')}
            </motion.p>
          </CardHeader>
          <CardContent className="pt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-medium text-foreground">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={language === 'ar' ? 'admin@example.com' : 'admin@example.com'}
                    className="ps-10 h-12 text-base"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium text-foreground">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    className="ps-10 h-12 text-base"
                    dir="ltr"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                onClick={handleLogin}
                disabled={loading || !email.trim() || !password}
                className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
              >
                {loading ? (
                  <span className="animate-pulse">
                    {language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}
                  </span>
                ) : (
                  <>
                    <LogIn className="me-2 h-5 w-5" />
                    {t('login')}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {language === 'ar'
                  ? 'تسجيل الدخول متاح للمسؤولين فقط عبر Supabase Auth'
                  : 'Admin-only login via Supabase Auth'}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
