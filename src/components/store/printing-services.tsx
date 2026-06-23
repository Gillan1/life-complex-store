'use client'

import { useState } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  Printer,
  FileText,
  Copy,
  GraduationCap,
  Banknote,
  User,
  Image as ImageIcon,
  Book,
  Scan,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Phone,
} from 'lucide-react'

/**
 * قسم احترافي لخدمات التصوير والطباعة - العمل الرئيسي للمحل.
 * يشمل: تصوير مستندات، طباعة شيتات، إشعارات بنكك، صور شخصية،
 * طباعة مستندات، تصوير ملصقات، تغليف وتجليد، مسح ضوئي.
 */
export function PrintingServices() {
  const { language, dir } = useLanguage()
  const [expanded, setExpanded] = useState<number | null>(0)

  const isAr = language === 'ar'

  interface ServiceItem {
    id: number
    icon: React.ReactNode
    titleAr: string
    titleEn: string
    descAr: string
    descEn: string
    color: string
    bgColor: string
    items: { ar: string; en: string; price?: string }[]
  }

  const services: ServiceItem[] = [
    {
      id: 0,
      icon: <Copy className="h-7 w-7" />,
      titleAr: 'تصوير المستندات',
      titleEn: 'Document Copying',
      descAr: 'تصوير مستندات بجودة عالية - أبيض/أسود وملون',
      descEn: 'High-quality document copying - B&W and color',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
      items: [
        { ar: 'تصوير أبيض/أسود (صفحة)', en: 'B&W copy (page)', price: '2 ج.س' },
        { ar: 'تصوير ملون (صفحة)', en: 'Color copy (page)', price: '5 ج.س' },
        { ar: 'تصوير جوازات وشهادات', en: 'Passports & certificates', price: 'حسب الحجم' },
        { ar: 'تصوير مستندات رسمية', en: 'Official documents', price: 'حسب الحجم' },
      ],
    },
    {
      id: 1,
      icon: <FileText className="h-7 w-7" />,
      titleAr: 'طباعة المستندات',
      titleEn: 'Document Printing',
      descAr: 'طباعة من USB، إيميل، واتساب - Word/PDF/Excel',
      descEn: 'Print from USB, email, WhatsApp - Word/PDF/Excel',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
      items: [
        { ar: 'طباعة من USB/فلاشة', en: 'Print from USB', price: '2-5 ج.س/صفحة' },
        { ar: 'طباعة من الإيميل/واتساب', en: 'Print from email/WhatsApp', price: '2-5 ج.س/صفحة' },
        { ar: 'طباعة Word / PDF / Excel', en: 'Word / PDF / Excel', price: 'حسب النوع' },
        { ar: 'طباعة ملونة أو أبيض/أسود', en: 'Color or B&W', price: '2-5 ج.س' },
      ],
    },
    {
      id: 2,
      icon: <GraduationCap className="h-7 w-7" />,
      titleAr: 'استخراج الشيتات',
      titleEn: 'Sheets Extraction',
      descAr: 'استخراج شيتات الجامعات والمدارس والكليات',
      descEn: 'University, school, and college sheets',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30',
      items: [
        { ar: 'شيتات جامعية', en: 'University sheets', price: 'حسب الحجم' },
        { ar: 'شيتات المدارس', en: 'School sheets', price: 'حسب الحجم' },
        { ar: 'شيتات الكليات', en: 'College sheets', price: 'حسب الحجم' },
        { ar: 'تنسيق وطباعة البحوث', en: 'Research formatting', price: 'حسب الحجم' },
      ],
    },
    {
      id: 3,
      icon: <Banknote className="h-7 w-7" />,
      titleAr: 'إشعارات بنكك',
      titleEn: 'Bankak Notifications',
      descAr: 'طباعة إشعارات تطبيق بنكك والإيصالات البنكية',
      descEn: 'Print Bankak app notifications and bank receipts',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
      items: [
        { ar: 'طباعة إشعارات بنكك', en: 'Bankak notifications print', price: '5 ج.س/صفحة' },
        { ar: 'طباعة إيصالات التحويل', en: 'Transfer receipts', price: '5 ج.س/صفحة' },
        { ar: 'طباعة كشوف الحساب', en: 'Account statements', price: '5 ج.س/صفحة' },
        { ar: 'طباعة إيصالات الدفع', en: 'Payment receipts', price: '5 ج.س/صفحة' },
      ],
    },
    {
      id: 4,
      icon: <User className="h-7 w-7" />,
      titleAr: 'الصور الشخصية',
      titleEn: 'Personal Photos',
      descAr: 'صور جوازات، هويات، صور شخصية بأحجام مختلفة',
      descEn: 'Passport, ID, and personal photos in various sizes',
      color: 'from-rose-500 to-red-600',
      bgColor: 'from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30',
      items: [
        { ar: 'صور جوازات (4×6)', en: 'Passport photos (4×6)', price: 'حسب الحجم' },
        { ar: 'صور هويات', en: 'ID photos', price: 'حسب الحجم' },
        { ar: 'صور شخصية بأحجام مختلفة', en: 'Various personal sizes', price: 'حسب الحجم' },
        { ar: 'صور عائلية ومناسبات', en: 'Family & events', price: 'حسب الحجم' },
      ],
    },
    {
      id: 5,
      icon: <ImageIcon className="h-7 w-7" />,
      titleAr: 'تصوير وتكبير الملصقات',
      titleEn: 'Poster Printing & Enlargement',
      descAr: 'تصوير وتكبير الملصقات والصور حتى A3',
      descEn: 'Print and enlarge posters and photos up to A3',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30',
      items: [
        { ar: 'تكبير الصور حتى A3', en: 'Enlarge up to A3', price: 'حسب الحجم' },
        { ar: 'طباعة ملصقات', en: 'Posters', price: 'حسب الحجم' },
        { ar: 'تصوير ملصقات', en: 'Copy posters', price: 'حسب الحجم' },
        { ar: 'طباعة لوحات إعلانية', en: 'Signs', price: 'حسب الحجم' },
      ],
    },
    {
      id: 6,
      icon: <Book className="h-7 w-7" />,
      titleAr: 'التغليف والتجليد',
      titleEn: 'Lamination & Binding',
      descAr: 'تغليف حراري وتجليد الملفات والكتب',
      descEn: 'Thermal lamination and binding of files and books',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
      items: [
        { ar: 'تغليف حراري للمستندات', en: 'Thermal lamination', price: '10 ج.س' },
        { ar: 'تجليد ملفات (سلك/حراري)', en: 'File binding', price: '20 ج.س' },
        { ar: 'تجليد كتب ورسائل', en: 'Book binding', price: 'حسب الحجم' },
        { ar: 'تغليف بطاقات وبطاقات شخصية', en: 'Card lamination', price: '5 ج.س' },
      ],
    },
    {
      id: 7,
      icon: <Scan className="h-7 w-7" />,
      titleAr: 'المسح الضوئي (Scan)',
      titleEn: 'Scanning',
      descAr: 'مسح ضوئي إلى PDF/إيميل/واتساب بجودة عالية',
      descEn: 'Scan to PDF/email/WhatsApp in high quality',
      color: 'from-teal-500 to-emerald-600',
      bgColor: 'from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30',
      items: [
        { ar: 'مسح ضوئي إلى PDF', en: 'Scan to PDF', price: '5 ج.س/صفحة' },
        { ar: 'إرسال عبر الإيميل/واتساب', en: 'Send via email/WhatsApp', price: '5 ج.س' },
        { ar: 'مسح صور بجودة عالية', en: 'High-quality photo scan', price: '10 ج.س' },
        { ar: 'مسح مستندات متعددة', en: 'Multi-page scan', price: 'حسب الحجم' },
      ],
    },
  ]

  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <div className="space-y-6" dir={dir}>
      {/* ✅ عنوان احترافي + شريط معلومات */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800">
          <Printer className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {isAr ? 'خدماتنا الرئيسية' : 'Our Main Services'}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {isAr ? 'التصوير والطباعة' : 'Photocopy & Printing'}
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          {isAr
            ? 'خدمات تصوير وطباعة احترافية شاملة لجميع احتياجاتك - من المستندات الرسمية إلى البحوث الجامعية والصور الشخصية'
            : 'Professional photocopy and printing services for all your needs - from official documents to university research and personal photos'}
        </p>

        {/* ✅ مزايا سريعة */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {isAr ? 'جودة عالية' : 'High Quality'}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {isAr ? 'خدمة سريعة' : 'Fast Service'}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {isAr ? 'أسعار مناسبة' : 'Affordable Prices'}
          </div>
        </div>
      </motion.div>

      {/* ✅ شبكة الخدمات الاحترافية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={`h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${
              expanded === service.id ? 'ring-2 ring-emerald-500/50' : ''
            }`}>
              {/* رأس البطاقة - متدرج اللون */}
              <div
                className={`bg-gradient-to-br ${service.color} p-5 text-white relative overflow-hidden`}
                onClick={() => toggleExpand(service.id)}
              >
                <div className="absolute top-0 end-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 start-0 w-16 h-16 bg-white/10 rounded-full translate-y-4 -translate-x-4 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg mb-1 leading-tight">
                      {isAr ? service.titleAr : service.titleEn}
                    </h3>
                    <p className="text-white/80 text-xs leading-relaxed line-clamp-2">
                      {isAr ? service.descAr : service.descEn}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {expanded === service.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* ✅ قائمة الخدمات - تظهر دائماً على الموبايل، وعند التوسيع على الكمبيوتر */}
              <CardContent className={`p-0 ${expanded === service.id ? 'block' : 'hidden sm:block'}`}>
                <div className="divide-y divide-border">
                  {service.items.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between gap-2 px-4 py-2.5 bg-gradient-to-r ${service.bgColor} hover:brightness-95 transition-all`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${service.color} flex-shrink-0`} />
                        <span className="text-xs sm:text-sm text-foreground font-medium truncate">
                          {isAr ? item.ar : item.en}
                        </span>
                      </div>
                      {item.price && (
                        <Badge variant="outline" className="text-xs flex-shrink-0 bg-white/80 dark:bg-gray-900/80 border-border">
                          {item.price}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ✅ شريط دعوة لاتخاذ إجراء */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700 p-6 sm:p-8 text-white text-center shadow-xl"
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-2">
          {isAr ? 'هل تحتاج خدمة تصوير أو طباعة؟' : 'Need photocopy or printing?'}
        </h3>
        <p className="text-white/90 mb-4 max-w-xl mx-auto">
          {isAr
            ? 'زورنا في مجمع الحياة - دنقلا، أو تواصل معنا للحصول على خدمة احترافية بأفضل الأسعار'
            : 'Visit us at Life Complex - Dongola, or contact us for professional service at the best prices'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="tel:+249"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 transition-colors font-semibold shadow-md"
          >
            <Phone className="h-4 w-4" />
            {isAr ? 'اتصل بنا' : 'Call Us'}
          </a>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 text-white border border-white/30 backdrop-blur-sm">
            <Clock className="h-4 w-4" />
            <span className="font-medium">
              {isAr ? 'السبت - الخميس: 8ص - 11م' : 'Sat - Thu: 8AM - 11PM'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
