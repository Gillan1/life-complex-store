'use client'

import { useLanguage } from '@/hooks/use-language'
import { MapPin, Printer, Sticker, Smartphone, Headphones, Cable } from 'lucide-react'
import { motion } from 'framer-motion'

export function GuestMessage() {
  const { language } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <div className="rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800 shadow-lg">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
          <h3 className="text-base font-bold">
            {language === 'ar' ? '👋 أيها الزائر الكريم' : '👋 Dear Visitor'}
          </h3>
        </div>

        {/* Body */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-5">
          <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed mb-4">
            {language === 'ar'
              ? 'هذه المنتجات غير متوفرة لدينا والأسعار هي أسعار كُتبت عشوائياً. ما لدينا في المتجر فعلياً:'
              : 'These products are not available in our store and prices are randomly listed. What we actually have in-store:'}
          </p>

          {/* Available services grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {[
              { icon: <Printer className="h-4 w-4" />, textAr: 'تصوير وطباعة', textEn: 'Printing & Copying' },
              { icon: <Sticker className="h-4 w-4" />, textAr: 'استيكرات', textEn: 'Stickers' },
              { icon: <Smartphone className="h-4 w-4" />, textAr: 'جرابات', textEn: 'Phone Cases' },
              { icon: <Cable className="h-4 w-4" />, textAr: 'شواحن', textEn: 'Chargers' },
              { icon: <Headphones className="h-4 w-4" />, textAr: 'سماعات', textEn: 'Headphones' },
              { icon: <MapPin className="h-4 w-4" />, textAr: 'وأشياء أخرى', textEn: 'And more...' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {language === 'ar' ? item.textAr : item.textEn}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center p-3 rounded-xl bg-emerald-600/10 dark:bg-emerald-400/10 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {language === 'ar'
                ? '📍 قم بزيارتنا في مجمع الحياة!'
                : '📍 Visit us at Life Complex!'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
