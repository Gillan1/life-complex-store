'use client'

import { useState } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  Printer,
  Download,
  Film,
  Gamepad2,
  Cpu,
  ShieldCheck,
  Smartphone,
  Monitor,
  Apple,
  FileText,
  HardDrive,
  Star,
  Zap,
  Lock,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  MapPin,
} from 'lucide-react'
import { GenshinGallery, genshinImages } from './genshin-gallery'
import { asset } from '@/lib/utils'

export function ServicesView() {
  const { t, language, dir } = useLanguage()
  const [genshinExpanded, setGenshinExpanded] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="max-w-7xl mx-auto" dir={dir}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 text-center mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {t('services')}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {language === 'ar'
            ? 'كل الخدمات المتوفرة بالمحل في مكان واحد'
            : 'All available in-store services in one place'}
        </p>
      </motion.div>

      {/* Genshin Impact Full Gallery (shown when expanded) */}
      {genshinExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 mb-6"
        >
          <GenshinGallery />
        </motion.div>
      )}

      {/* Services Grid */}
      <div className="px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {/* ===== 1. Printing & Copying Service ===== */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 end-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 start-0 w-20 h-20 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Printer className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{t('printingService')}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{t('printingServiceDesc')}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('printOnPaper')}</p>
                      <p className="text-xs text-muted-foreground">{t('coloredPrint')} & {t('bwPrint')}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 text-xs">
                      {t('inStore')}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                    <Printer className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('documentCopying')}</p>
                      <p className="text-xs text-muted-foreground">{t('copyColored')} & {t('copyNormal')}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-0 text-xs">
                      {t('inStore')}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                    <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('researchPrinting')}</p>
                      <p className="text-xs text-muted-foreground">{t('researchPrintingDesc')}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-xs">
                      {t('inStore')}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground">{language === 'ar' ? 'طباعة ملونة/صفحة' : 'Color print/page'}</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {language === 'ar' ? '5 ج.س' : '5 SDG'}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground">{language === 'ar' ? 'تصوير عادي/صفحة' : 'B&W copy/page'}</p>
                    <p className="font-bold text-purple-600 dark:text-purple-400 mt-1">
                      {language === 'ar' ? '2 ج.س' : '2 SDG'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ===== 2. Software Downloads ===== */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 end-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 start-0 w-20 h-20 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Download className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{t('softwareDownloads')}</h3>
                    <p className="text-emerald-100 text-sm leading-relaxed">{t('softwareDownloadsDesc')}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                    <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('forAndroid')}</p>
                      <p className="text-xs text-muted-foreground">{t('latestVersion')}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0 text-xs">APK</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30">
                    <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('forWindows')}</p>
                      <p className="text-xs text-muted-foreground">{t('latestVersion')}</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300 border-0 text-xs">EXE</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-zinc-50 dark:from-slate-950/30 dark:to-zinc-950/30">
                    <Apple className="h-5 w-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('forIPhone')}</p>
                      <p className="text-xs text-muted-foreground">{t('latestVersion')}</p>
                    </div>
                    <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300 border-0 text-xs">IPA</Badge>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    {t('popularSoftware')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['WhatsApp', 'Telegram', 'VLC', 'WinRAR', 'Chrome', 'Photoshop', 'Office 365', 'Zoom'].map((sw) => (
                      <Badge key={sw} variant="outline" className="text-xs py-1">{sw}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ===== 3. Movies & Series ===== */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 end-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 start-0 w-20 h-20 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Film className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{t('moviesSeries')}</h3>
                    <p className="text-rose-100 text-sm leading-relaxed">{t('moviesSeriesDesc')}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: t('genreAction'), icon: '💥', color: 'from-orange-100 to-red-100 dark:from-orange-950/30 dark:to-red-950/30', items: '150+' },
                    { name: t('genreRomance'), icon: '❤️', color: 'from-pink-100 to-rose-100 dark:from-pink-950/30 dark:to-rose-950/30', items: '80+' },
                    { name: t('genreComedy'), icon: '😂', color: 'from-yellow-100 to-amber-100 dark:from-yellow-950/30 dark:to-amber-950/30', items: '120+' },
                    { name: t('genreHorror'), icon: '👻', color: 'from-gray-100 to-slate-200 dark:from-gray-900/30 dark:to-slate-900/30', items: '60+' },
                    { name: t('genreDrama'), icon: '🎭', color: 'from-purple-100 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/30', items: '200+' },
                    { name: t('genreSciFi'), icon: '🚀', color: 'from-cyan-100 to-blue-100 dark:from-cyan-950/30 dark:to-blue-950/30', items: '50+' },
                    { name: t('genreThriller'), icon: '🔥', color: 'from-red-100 to-orange-100 dark:from-red-950/30 dark:to-orange-950/30', items: '90+' },
                    { name: t('genreAnimation'), icon: '✨', color: 'from-teal-100 to-emerald-100 dark:from-teal-950/30 dark:to-emerald-950/30', items: '70+' },
                  ].map((genre) => (
                    <div
                      key={genre.name}
                      className={`flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r ${genre.color} transition-transform hover:scale-105 cursor-pointer`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/60 dark:bg-white/10 flex items-center justify-center text-sm flex-shrink-0">
                        {genre.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs truncate">{genre.name}</p>
                        <p className="text-[10px] text-muted-foreground">{genre.items} {language === 'ar' ? 'عنوان' : 'titles'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">{t('movieQuality')}:</span>
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-0 text-xs">{t('qualityHD')}</Badge>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 text-xs">{t('qualityFHD')}</Badge>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-0 text-xs">{t('quality4K')}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ===== 4. Genshin Impact Game (Expanded Section) ===== */}
          <motion.div variants={itemVariants} className="md:col-span-2 xl:col-span-3">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white relative overflow-hidden cursor-pointer" onClick={() => setGenshinExpanded(!genshinExpanded)}>
                <div className="absolute top-0 end-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
                <div className="absolute bottom-0 start-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Gamepad2 className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold">{t('genshinImpact')}</h3>
                      <Badge className="bg-yellow-500/90 text-yellow-950 border-0 text-xs">
                        <Star className="h-3 w-3 me-1 inline" /> 4.8
                      </Badge>
                      <Badge className="bg-white/20 text-white border-0 text-xs">
                        50 GB | {t('forPhone')}
                      </Badge>
                    </div>
                    <p className="text-violet-100 text-sm leading-relaxed mt-1">
                      {language === 'ar'
                        ? 'لعبة مغامرات عالم مفتوح مذهلة - 30 صورة حصرية مع وصف مفصل'
                        : 'Stunning open-world adventure game - 30 exclusive images with detailed description'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {genshinExpanded ? (
                      <ChevronUp className="h-6 w-6 text-white/70" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-white/70" />
                    )}
                  </div>
                </div>
              </div>

              {/* Collapsed preview - show when NOT expanded */}
              {!genshinExpanded && (
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Mini preview of images */}
                    <div className="flex-1">
                      <div className="grid grid-cols-5 gap-1.5">
                        {genshinImages.slice(0, 10).map((img, i) => (
                          <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted/30">
                            <img src={asset(img.src)} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {language === 'ar'
                          ? `${genshinImages.length} صورة حصرية - اضغط لعرض الكل`
                          : `${genshinImages.length} exclusive images - Click to view all`}
                      </p>
                    </div>

                    {/* Quick info */}
                    <div className="sm:w-64 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/30">
                          <HardDrive className="h-4 w-4 mx-auto text-violet-600 dark:text-violet-400 mb-1" />
                          <p className="text-[10px] text-muted-foreground">{t('fileSize')}</p>
                          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">50 GB</p>
                        </div>
                        <div className="text-center p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/30">
                          <Smartphone className="h-4 w-4 mx-auto text-violet-600 dark:text-violet-400 mb-1" />
                          <p className="text-[10px] text-muted-foreground">{language === 'ar' ? 'المنصة' : 'Platform'}</p>
                          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">{t('forPhone')}</p>
                        </div>
                        <div className="text-center p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/30">
                          <Zap className="h-4 w-4 mx-auto text-violet-600 dark:text-violet-400 mb-1" />
                          <p className="text-[10px] text-muted-foreground">{t('gameGenre')}</p>
                          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">{t('adventureGame')}</p>
                        </div>
                        <div className="text-center p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                          <Star className="h-4 w-4 mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                          <p className="text-[10px] text-muted-foreground">{language === 'ar' ? 'السعر' : 'Price'}</p>
                          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{language === 'ar' ? 'مجانية' : 'Free'}</p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {language === 'ar'
                          ? 'استكشف عالم تيفات الشاسع مع أكثر من 80 شخصية قابلة للعب، 7 عناصر تفاعلية، ومناطق متعددة. اضغط لعرض المعرض الكامل والوصف المفصل.'
                          : 'Explore the vast world of Teyvat with 80+ playable characters, 7 interactive elements, and multiple regions. Click to view the full gallery and detailed description.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>

          {/* ===== 5. Firmware & Software ===== */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 end-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 start-0 w-20 h-20 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Cpu className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{t('firmwareService')}</h3>
                    <p className="text-amber-100 text-sm leading-relaxed">{t('firmwareServiceDesc')}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
                    <Smartphone className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('firmwarePhones')}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'سامسونج، شاومي، هواوي، أوبو، فيفو وأكثر' : 'Samsung, Xiaomi, Huawei, OPPO, Vivo & more'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
                    <Monitor className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('firmwareTablets')}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'آيباد، تابلت سامسونج، تابلت شاومي وأكثر' : 'iPad, Samsung Tab, Xiaomi Pad & more'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30">
                    <Cpu className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('firmwareLaptops')}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'ويندوز، تعريفات، برامج تشغيل وأكثر' : 'Windows, drivers, system software & more'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    language === 'ar' ? 'تحديث النظام' : 'System Update',
                    language === 'ar' ? 'تعريفات' : 'Drivers',
                    language === 'ar' ? 'إصلاح أعطال' : 'Bug Fixes',
                    language === 'ar' ? 'استعادة البيانات' : 'Data Recovery',
                  ].map((feat) => (
                    <Badge key={feat} variant="outline" className="text-xs py-1">{feat}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ===== 6. Google Account Bypass ===== */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 end-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 start-0 w-20 h-20 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{t('googleBypass')}</h3>
                    <p className="text-cyan-100 text-sm leading-relaxed">{t('googleBypassDesc')}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    <h4 className="font-bold text-sm">{t('frpBypass')}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {language === 'ar'
                      ? 'هل نسيت كلمة سر حساب جوجل ومقفل جهازك؟ نقدم لك خدمة احترافية لتخطي حماية FRP واستعادة الوصول لجهازك بكل أمان وسهولة.'
                      : 'Forgot your Google account password and your device is locked? We provide a professional FRP bypass service to regain access to your device safely and easily.'}
                  </p>

                  <div className="space-y-2">
                    {[
                      { step: '1', text: language === 'ar' ? 'إحضار الجهاز للمحل' : 'Bring device to store' },
                      { step: '2', text: language === 'ar' ? 'فحص الجهاز وتحديد المشكلة' : 'Diagnose the issue' },
                      { step: '3', text: language === 'ar' ? 'تخطي الحساب باحترافية' : 'Professional bypass' },
                      { step: '4', text: language === 'ar' ? 'استلام الجهاز جاهز للاستخدام' : 'Device ready to use' },
                    ].map((s) => (
                      <div key={s.step} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-200 dark:bg-cyan-800 flex items-center justify-center text-xs font-bold text-cyan-700 dark:text-cyan-200 flex-shrink-0">
                          {s.step}
                        </div>
                        <p className="text-xs">{s.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">{t('allDevices')}:</span>
                  {['Samsung', 'Xiaomi', 'Huawei', 'OPPO', 'Vivo', 'Realme'].map((brand) => (
                    <Badge key={brand} variant="outline" className="text-xs py-1">{brand}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom highlight strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mx-4 mt-8 rounded-2xl overflow-hidden shadow-xl"
      >
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white text-center">
          <h3 className="text-lg font-bold mb-1">
            {language === 'ar' ? 'كل هذه الخدمات متوفرة الآن في محل مجمع الحياة!' : 'All these services are now available at Life Complex!'}
          </h3>
          <p className="text-emerald-100 text-sm mb-3">
            {language === 'ar'
              ? 'زورنا واحصل على كل ما تحتاجه في مكان واحد'
              : 'Visit us and get everything you need in one place'}
          </p>
          <a
            href="https://www.google.com/maps/place/Dongola,+Sudan/@19.1708151,30.4675236,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors"
          >
            <MapPin className="h-4 w-4" />
            {language === 'ar' ? 'مجمع الحياة - دنقلا، السودان' : 'Life Complex - Dongola, Sudan'}
          </a>
        </div>
      </motion.div>
    </div>
  )
}
