'use client'

import { useLanguage } from '@/hooks/use-language'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  Megaphone,
  MapPin,
  Code,
  Store,
  Hammer,
  Coffee,
  Globe,
  Smartphone,
  MessageCircle,
  Star,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Users,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { asset } from '@/lib/utils'

export function PromotionView() {
  const { language, dir } = useLanguage()
  const [copiedPhone, setCopiedPhone] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('+249115192500')
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2000)
    } catch {
      // fallback
    }
  }

  // Store 1 images: Life Complex
  const store1Images = [
    '/images/promo/store1-01.jpg',
    '/images/promo/store1-02.jpg',
    '/images/promo/store1-03.jpg',
    '/images/promo/store1-04.jpg',
  ]

  // Store 2 images: Workshop
  const store2Images = [
    '/images/promo/store2-01.jpg',
    '/images/promo/store2-02.jpg',
    '/images/promo/store2-03.jpg',
    '/images/promo/store2-04.jpg',
  ]

  return (
    <div className="max-w-5xl mx-auto" dir={dir}>
      {/* ===== Hero Section ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 mb-6"
      >
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 p-8 sm:p-12 text-white relative">
            <div className="absolute top-0 end-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 start-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                <Megaphone className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'ترويج احترافي' : 'Professional Promotion'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                {language === 'ar'
                  ? 'حوّل متجرك أو مشروعك إلى موقع إلكتروني احترافي!'
                  : 'Turn Your Store or Project into a Professional Website!'}
              </h1>

              <p className="text-lg text-purple-100 max-w-2xl mx-auto leading-relaxed mb-6">
                {language === 'ar'
                  ? 'هل تملك متجراً أو مشروعاً ولا تملك موقعاً إلكترونياً؟ نحن نصمم لك موقعاً احترافياً يعرض منتجاتك وخدماتك للعالم بأسره. شاهد أمثلة حقيقية لما يمكننا تقديمه.'
                  : 'Do you own a store or project but don\'t have a website? We design professional websites that showcase your products and services to the world. See real examples of what we can deliver.'}
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-white/20 text-white border-0 py-2 px-4 text-sm backdrop-blur-sm">
                  <Globe className="h-4 w-4 me-1.5" />
                  {language === 'ar' ? 'مواقع احترافية' : 'Professional Websites'}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 py-2 px-4 text-sm backdrop-blur-sm">
                  <Smartphone className="h-4 w-4 me-1.5" />
                  {language === 'ar' ? 'متجاوب مع الجوال' : 'Mobile Responsive'}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 py-2 px-4 text-sm backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4 me-1.5" />
                  {language === 'ar' ? 'وصول أوسع' : 'Wider Reach'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== The Problem ===== */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="px-4 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-5 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {language === 'ar' ? '⚡ لماذا تحتاج موقع إلكتروني؟' : '⚡ Why Do You Need a Website?'}
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Users className="h-6 w-6 text-red-500" />,
                    titleAr: 'جمهورك يبحث عنك أونلاين',
                    titleEn: 'Your Audience Searches Online',
                    descAr: 'أكثر من 80% من العملاء يبحثون عن المنتجات والخدمات على الإنترنت قبل الشراء. بدون موقع، أنت خسران عملاء محتملين كل يوم.',
                    descEn: 'Over 80% of customers search for products and services online before buying. Without a website, you lose potential customers every day.',
                  },
                  {
                    icon: <Store className="h-6 w-6 text-orange-500" />,
                    titleAr: 'متجرك مفتوح 24 ساعة',
                    titleEn: 'Your Store Open 24/7',
                    descAr: 'الموقع الإلكتروني يعمل على مدار الساعة. العملاء يمكنهم تصفح منتجاتك وخدماتك في أي وقت حتى بعد ساعات العمل الرسمية.',
                    descEn: 'A website works around the clock. Customers can browse your products and services anytime, even after official working hours.',
                  },
                  {
                    icon: <Star className="h-6 w-6 text-amber-500" />,
                    titleAr: 'مصداقية واحترافية',
                    titleEn: 'Credibility & Professionalism',
                    descAr: 'الموقع الإلكتروني يعطي انطباعاً احترافياً ويزيد من ثقة العملاء في عملك. المتاجر التي تملك مواقع تبدو أكثر موثوقية.',
                    descEn: 'A website gives a professional impression and increases customer trust. Stores with websites appear more reliable.',
                  },
                  {
                    icon: <Globe className="h-6 w-6 text-blue-500" />,
                    titleAr: 'وصول بلا حدود جغرافية',
                    titleEn: 'Reach Beyond Geographic Limits',
                    descAr: 'الموقع الإلكتروني يوسع نطاق وصولك ليشمل كل السودان وخارجه. لا تقتصر على العملاء في منطقتك فقط.',
                    descEn: 'A website expands your reach across all of Sudan and beyond. Don\'t limit yourself to customers in your area only.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {language === 'ar' ? item.descAr : item.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ===== Store 1: Life Complex ===== */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="px-4 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{language === 'ar' ? 'مجمع الحياة' : 'Life Complex'}</h2>
                  <p className="text-emerald-100 text-sm">
                    {language === 'ar' ? 'متجر إلكترونيات وخدمات رقمية' : 'Electronics & Digital Services Store'}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-5 space-y-4">
              {/* Store images */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {store1Images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted/30">
                    <img
                      src={asset(img)}
                      alt={`مجمع الحياة ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

              {/* Store description */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {language === 'ar'
                    ? 'مجمع الحياة هو متجر متكامل للإلكترونيات والخدمات الرقمية في دنقلا، السودان. يقدم الموقع تجربة تسوق احترافية تشمل عرض المنتجات الإلكترونية المتنوعة من هواتف وشواحن وسماعات وإكسسوارات، بالإضافة إلى خدمات متعددة مثل الطباعة والتصوير وتحميل البرامج والأفلام والمسلسلات وتحميل لعبة Genshin Impact وسوفت وير للأجهزة وتخطي حساب جوجل.'
                    : 'Life Complex is a comprehensive electronics and digital services store in Dongola, Sudan. The website provides a professional shopping experience including display of various electronic products like phones, chargers, headphones, and accessories, plus multiple services such as printing, copying, software downloads, movies and series, Genshin Impact game download, device firmware, and Google account bypass.'}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {(language === 'ar'
                    ? ['متجر إلكترونيات', 'طباعة وتصوير', 'تحميل برامج', 'أفلام ومسلسلات', 'ألعاب', 'سوفت وير', 'تخطي FRP']
                    : ['Electronics Store', 'Printing & Copying', 'Software Downloads', 'Movies & Series', 'Games', 'Firmware', 'FRP Bypass']
                  ).map((feat) => (
                    <Badge key={feat} variant="outline" className="text-xs py-1">{feat}</Badge>
                  ))}
                </div>

                {/* Location */}
                <a
                  href="https://www.google.com/maps/place/Dongola,+Sudan/@19.1708151,30.4675236,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    {language === 'ar' ? 'مجمع الحياة - دنقلا، السودان' : 'Life Complex - Dongola, Sudan'}
                  </span>
                  <ExternalLink className="h-3 w-3 text-emerald-500 ms-auto" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ===== Store 2: Workshop ===== */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="px-4 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-zinc-800 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Hammer className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {language === 'ar' ? 'ورشة عبادة عبد الحفيظ للحدادة' : 'Obada Abdulhafiz Blacksmith Workshop'}
                  </h2>
                  <p className="text-slate-300 text-sm">
                    {language === 'ar' ? 'أعمال حديدية احترافية' : 'Professional Iron Works'}
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-5 space-y-4">
              {/* Store images */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {store2Images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted/30">
                    <img
                      src={asset(img)}
                      alt={`ورشة عبادة ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

              {/* Store description */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {language === 'ar'
                    ? 'ورشة عبادة عبد الحفيظ للحدادة هي ورشة متخصصة في تصنيع أعمال حديدية متقنة بأجود الخامات في السودان. يقدم الموقع عرضاً احترافياً للمنتجات الجاهزة والمصنوعة حسب الطلب من أبواب حديد وأسرّة ومظلات وبوابات ودرابزين وسلالم، مع حاسبة تكلفة مبدئية ونظام طلبات متكامل عبر واتساب.'
                    : 'Obada Abdulhafiz Blacksmith Workshop specializes in crafting high-quality ironworks with the finest materials in Sudan. The website provides a professional showcase of ready-made and custom-order products including iron doors, beds, canopies, gates, railings, and stairs, with a cost estimator and integrated WhatsApp ordering system.'}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {(language === 'ar'
                    ? ['أبواب حديد', 'أسرّة', 'بوابات', 'درابزين', 'سلالم', 'مظلات', 'تفصيل حسب الطلب']
                    : ['Iron Doors', 'Beds', 'Gates', 'Railings', 'Stairs', 'Canopies', 'Custom Orders']
                  ).map((feat) => (
                    <Badge key={feat} variant="outline" className="text-xs py-1">{feat}</Badge>
                  ))}
                </div>

                {/* Location */}
                <a
                  href="https://wa.me/249115192500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950/50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'واتساب: 0115192500' : 'WhatsApp: 0115192500'}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ms-auto" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ===== Developer Section ===== */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="px-4 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-white text-center relative">
              <div className="absolute top-0 end-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
              <div className="absolute bottom-0 start-0 w-28 h-28 bg-white/5 rounded-full translate-y-10 -translate-x-10" />

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-4 border-white/30">
                  <Code className="h-10 w-10" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black mb-2">
                  {language === 'ar' ? 'المطور: غيلان بن عقبة' : 'Developer: Ghilan bin Aqba'}
                </h2>
                <p className="text-amber-100 text-sm max-w-xl mx-auto leading-relaxed">
                  {language === 'ar'
                    ? 'مطور مواقع ويب محترف متخصص في تصميم وتطوير المواقع الإلكترونية للمتاجر والمشاريع التجارية. أؤمن بأن كل مشروع يستحق وجوداً رقمياً احترافياً يعكس هويته ويوسع نطاق وصوله.'
                    : 'Professional web developer specializing in designing and developing websites for stores and commercial projects. I believe every project deserves a professional digital presence that reflects its identity and expands its reach.'}
                </p>
              </div>
            </div>

            <CardContent className="p-6 space-y-5">
              {/* What I offer */}
              <div>
                <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  {language === 'ar' ? 'ماذا أقدم؟' : 'What Do I Offer?'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(language === 'ar'
                    ? [
                        { icon: '🌐', title: 'مواقع متاجر إلكترونية', desc: 'موقع كامل لعرض منتجاتك وخدماتك مع إمكانية التواصل المباشر' },
                        { icon: '📱', title: 'تصميم متجاوب', desc: 'موقعك يعمل بشكل ممتاز على الهاتف والتابلت والكمبيوتر' },
                        { icon: '⚡', title: 'سرعة وأداء عالي', desc: 'مواقع سريعة التحميل ومحسنة لمحركات البحث' },
                        { icon: '🎨', title: 'تصميم احترافي', desc: 'تصميم عصري وجذاب يعكس هوية مشروعك' },
                        { icon: '🔧', title: 'لوحة تحكم سهلة', desc: 'إدارة المحتوى والمنتجات بسهولة تامة' },
                        { icon: '💬', title: 'تكامل واتساب', desc: 'ربط مباشر مع واتساب للتواصل مع العملاء' },
                      ]
                    : [
                        { icon: '🌐', title: 'E-commerce Websites', desc: 'Complete website to showcase your products and services with direct communication' },
                        { icon: '📱', title: 'Responsive Design', desc: 'Your website works perfectly on phone, tablet, and computer' },
                        { icon: '⚡', title: 'High Speed & Performance', desc: 'Fast-loading websites optimized for search engines' },
                        { icon: '🎨', title: 'Professional Design', desc: 'Modern and attractive design that reflects your project identity' },
                        { icon: '🔧', title: 'Easy Control Panel', desc: 'Manage content and products with complete ease' },
                        { icon: '💬', title: 'WhatsApp Integration', desc: 'Direct WhatsApp connection for customer communication' },
                      ]
                  ).map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* The proof */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  {language === 'ar' ? 'الدليل على الجودة' : 'Proof of Quality'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'ar'
                    ? 'الموقعان الموضحان أعلاه هما مشروعان حقيقيان تم تصميمهما وتطويرهما بالكامل من قبل المطور غيلان بن عقبة. مجمع الحياة هو متجر إلكترونيات متكامل في دنقلا، وورشة عبادة للحدادة هي ورشة أعمال حديدية في الخرطوم. كلا الموقعين يعملان حالياً ويستخدمهما العملاء.'
                    : 'The two websites shown above are real projects fully designed and developed by Ghilan bin Aqba. Life Complex is a comprehensive electronics store in Dongola, and Obada Blacksmith Workshop is an ironworks in Khartoum. Both websites are currently live and used by customers.'}
                </p>
              </div>

              {/* Contact Section */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <h3 className="text-lg font-bold mb-3 text-center">
                  {language === 'ar' ? 'تم بناء هذين الموقعين من قبل غيلان بن عقبة' : 'These two websites were built by Ghilan bin Aqba'}
                </h3>
                <p className="text-emerald-100 text-sm text-center mb-4 leading-relaxed">
                  {language === 'ar'
                    ? 'إذا أردت موقعاً مماثلاً لمتجرك أو مشروعك، تواصل معي الآن!'
                    : 'If you want a similar website for your store or project, contact me now!'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="https://wa.me/249115192500"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {language === 'ar' ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                  </a>

                  <button
                    onClick={handleCopyPhone}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                      copiedPhone
                        ? 'bg-emerald-300 text-emerald-900'
                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="h-5 w-5" />
                        {language === 'ar' ? 'تم النسخ!' : 'Copied!'}
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        {language === 'ar' ? 'نسخ الرقم: 0115192500' : 'Copy Number: 0115192500'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ===== Facebook Promo Text (Copy-paste ready) ===== */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="px-4 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                {language === 'ar' ? 'نص الترويج لفيسبوك' : 'Facebook Promo Text'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {language === 'ar' ? 'انسخ هذا النص وانشره في القروبات المحلية' : 'Copy this text and post it in local groups'}
              </p>
            </div>
            <CardContent className="p-5">
              <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-4" dir="rtl">
                <div className="text-sm leading-loose whitespace-pre-line" style={{ fontFamily: 'inherit' }}>
{language === 'ar' ? `🔥 هل تملك متجر أو مشروع وما عندك موقع إلكتروني؟

لو عندك متجر أو مشروع تجاري وعايز توصل لعملاء أكثر... الموقع الإلكتروني هو الحل!

✅ متجرك يكون متاح 24 ساعة
✅ العملاء يقدروا يشوفوا منتجاتك وخدماتك في أي وقت
✅ موقع احترافي يعكس مصداقية مشروعك
✅ وصول أوسع لكل السودان وخارجه

👇 شوف أمثلة حقيقية لمواقع عملتها:

📱 مجمع الحياة - متجر إلكترونيات وخدمات رقمية في دنقلا
→ منتجات إلكترونية + طباعة وتصوير + تحميل برامج وأفلام + سوفت وير وتخطي حساب جوجل
📍 الموقع: دنقلا، السودان

🔧 ورشة عبادة عبد الحفيظ للحدادة
→ أبواب حديد + أسرّة + بوابات + درابزين + سلالم + تفصيل حسب الطلب
📍 الموقع: الخرطوم، السودان

💬 الاتنين دول مواقع شغالة حالياً وبتخدم العملاء كل يوم!

✨ تم بناء هذين الموقعين من قبل غيلان بن عقبة

إذا أردت موقع مماثل لمتجرك أو مشروعك تواصل معي:
📞 واتساب: 0115192500
💰 أسعار مناسبة وجودة احترافية

لا تخلي مشروعك بدون وجود رقمي... تواصل الآن! 💪` : `🔥 Do you own a store or project without a website?

If you have a store or commercial project and want to reach more customers... A website is the solution!

✅ Your store available 24 hours
✅ Customers can view your products and services anytime
✅ Professional website that reflects your project's credibility
✅ Wider reach across Sudan and beyond

👇 See real examples of websites I've built:

📱 Life Complex - Electronics & Digital Services Store in Dongola
→ Electronic products + Printing & Copying + Software & Movie Downloads + Firmware & FRP Bypass
📍 Location: Dongola, Sudan

🔧 Obada Abdulhafiz Blacksmith Workshop
→ Iron doors + Beds + Gates + Railings + Stairs + Custom orders
📍 Location: Khartoum, Sudan

💬 Both websites are currently live and serving customers every day!

✨ These two websites were built by Ghilan bin Aqba

If you want a similar website for your store or project, contact me:
📞 WhatsApp: +249115192500
💰 Affordable prices & professional quality

Don't let your project go without a digital presence... Contact now! 💪`}
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  {language === 'ar'
                    ? '💡 انسخ النص أعلاه وانشره في قروبات الفيسبوك المحلية في منطقتك'
                    : '💡 Copy the text above and post it in local Facebook groups in your area'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ===== Bottom CTA ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 mb-8"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 end-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 start-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
          <div className="relative z-10">
            <Coffee className="h-8 w-8 mx-auto mb-3 opacity-80" />
            <h3 className="text-xl font-bold mb-2">
              {language === 'ar' ? 'اعجبك شغلنا؟ اشترِ لنا قهوة!' : 'Like our work? Buy us a coffee!'}
            </h3>
            <p className="text-amber-100 text-sm mb-4">
              {language === 'ar'
                ? 'دعمكم يلهمنا لنقدم المزيد - محفظة ماي كاش: 401696711'
                : 'Your support inspires us to do more - MyCash Wallet: 401696711'}
            </p>
            <a
              href="https://wa.me/249115192500"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-orange-700 font-bold text-sm hover:bg-orange-50 transition-colors shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              {language === 'ar' ? 'تواصل الآن' : 'Contact Now'}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
