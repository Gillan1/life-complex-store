'use client'

import { useState } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, X, Copy, Check, Wallet } from 'lucide-react'

interface CoffeeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CoffeeModal({ open, onOpenChange }: CoffeeModalProps) {
  const { language, dir } = useLanguage()
  const [copied, setCopied] = useState(false)

  const walletNumber = '401696711'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = walletNumber
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            dir={dir}
            className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white relative">
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 end-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="text-center">
                <div className="text-5xl mb-3">☕</div>
                <h3 className="text-xl font-bold">
                  {language === 'ar' ? 'اشترِ لي قهوة' : 'Buy Me a Coffee'}
                </h3>
                <p className="text-amber-100 text-sm mt-1">
                  {language === 'ar'
                    ? 'ادعم المطور بقهوة بسيطة'
                    : 'Support the developer with a simple coffee'}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed text-center">
                {language === 'ar'
                  ? 'إذا أعجبك الموقع ودعمك لي يعني الكثير، يمكنك مشاركتي قهوة بسيطة عبر محفظة ماي كاش. كل دعمكم يلهمنا لتقديم المزيد!'
                  : 'If you liked the website and your support means a lot, you can buy me a simple coffee via MyCash wallet. Every support inspires us to do more!'}
              </p>

              {/* Wallet Card */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-5 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                    <Wallet className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {language === 'ar' ? 'محفظة ماي كاش' : 'MyCash Wallet'}
                    </p>
                    <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 tracking-wider mt-0.5" dir="ltr">
                      {walletNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.98]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    {language === 'ar' ? 'تم النسخ!' : 'Copied!'}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {language === 'ar' ? 'نسخ رقم المحفظة' : 'Copy Wallet Number'}
                  </>
                )}
              </button>

              {/* Thank you */}
              <p className="text-xs text-center text-muted-foreground">
                {language === 'ar'
                  ? 'شكراً لدعمكم! ❤️ كل قهوة تعني الكثير'
                  : 'Thank you for your support! ❤️ Every coffee means a lot'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function CoffeeButton({ onClick }: { onClick: () => void }) {
  const { language } = useLanguage()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-shadow"
    >
      <Coffee className="h-4 w-4" />
      {language === 'ar' ? 'اشترِ لي قهوة' : 'Buy Me a Coffee'}
    </motion.button>
  )
}
