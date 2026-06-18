'use client'

import { useState } from 'react'
import { useLanguage } from '@/hooks/use-language'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { asset } from '@/lib/utils'
import {
  Gamepad2,
  HardDrive,
  Smartphone,
  Zap,
  Star,
  Globe,
  Users,
  Swords,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Sparkles,
  Shield,
  Wind,
  Flame,
  Droplets,
  Mountain,
  Leaf,
  Snowflake,
} from 'lucide-react'

// 20 images from internet search with Arabic/English captions
export const genshinImages = [
  { src: '/images/genshin/web-01.jpg', captionAr: 'منظر طبيعي خلاب من عالم تيفات مع غروب الشمس والجزر وأزهار الكرز', captionEn: 'Stunning Teyvat landscape with sunset, islands, and cherry blossoms', category: 'world' },
  { src: '/images/genshin/web-02.jpg', captionAr: 'شوغن رايدن في أرض خضراء مع عناصر واجهة اللعبة', captionEn: 'Raiden Shogun in a lush landscape with game UI elements', category: 'character' },
  { src: '/images/genshin/web-03.jpg', captionAr: 'قتال ملحمي مع فريق من الشخصيات القوية', captionEn: 'Epic combat with a team of powerful characters', category: 'combat' },
  { src: '/images/genshin/web-04.jpg', captionAr: 'شخصية تطل على منظر طبيعي مع قلعة ونهر', captionEn: 'Character overlooking a scenic landscape with castle and river', category: 'world' },
  { src: '/images/genshin/web-05.jpg', captionAr: 'شخصية نارية في فناء على الطراز الصيني التقليدي', captionEn: 'Fiery character in a traditional Chinese-style courtyard', category: 'character' },
  { src: '/images/genshin/web-06.jpg', captionAr: 'مشهد خيالي مع زهرة متوهجة وبوابة توري حمراء', captionEn: 'Fantasy scene with a glowing blue flower and red torii gate', category: 'world' },
  { src: '/images/genshin/web-07.jpg', captionAr: 'طيران فوق النهر مع الطيور في مشهد غروب ساحر', captionEn: 'Flying over a river with birds in a breathtaking sunset', category: 'world' },
  { src: '/images/genshin/web-08.jpg', captionAr: 'إيثير ونوفيليت في مغامرة معاً', captionEn: 'Aether and Neuvillette on an adventure together', category: 'character' },
  { src: '/images/genshin/web-09.jpg', captionAr: 'ياي ميكيو تواجه أعداء من المستوى 90', captionEn: 'Yae Miko facing level 90 enemies', category: 'combat' },
  { src: '/images/genshin/web-10.jpg', captionAr: 'منظر طبيعي مذهل مع طريق حجري وأشجار ملونة', captionEn: 'Stunning landscape with stone path and colorful trees', category: 'world' },
  { src: '/images/genshin/web-11.jpg', captionAr: 'مجموعة من 16 شخصية أنيمي من اللعبة', captionEn: 'Collection of 16 anime character portraits from the game', category: 'character' },
  { src: '/images/genshin/web-12.jpg', captionAr: 'شخصيتان أنيمي في مشهد مميز', captionEn: 'Two anime characters in a featured scene', category: 'character' },
  { src: '/images/genshin/web-13.jpg', captionAr: 'شخصية أنثوية بشعر أحمر وملابس سوداء وحمراء', captionEn: 'Red-haired female character in black and red outfit', category: 'character' },
  { src: '/images/genshin/web-14.jpg', captionAr: 'خمس شخصيات من اللعبة معاً في مشهد جماعي', captionEn: 'Five Genshin Impact characters together in a group scene', category: 'character' },
  { src: '/images/genshin/web-15.jpg', captionAr: 'صورة ترويجية لإيثير ولومين من تعاون HoYoverse × ufotable', captionEn: 'Promotional image of Aether and Lumine from HoYoverse × ufotable', category: 'gameplay' },
  { src: '/images/genshin/web-16.jpg', captionAr: 'شخصيتان بشعر أحمر وعيون خضراء', captionEn: 'Two characters with red hair and green eyes', category: 'character' },
  { src: '/images/genshin/web-17.jpg', captionAr: 'شخصية أنيمي بشعر أزرق وجوهرة متوهجة', captionEn: 'Blue-haired anime character with a glowing gem', category: 'character' },
  { src: '/images/genshin/web-18.jpg', captionAr: 'شيان يون وتشونغ يون في صورة مشتركة', captionEn: 'Xianyun and Chongyun in a collaborative portrait', category: 'character' },
  { src: '/images/genshin/web-19.jpg', captionAr: 'شخصية أنيمي بشعر أزرق وعصا سحرية', captionEn: 'Blue-haired anime character with a magical staff', category: 'character' },
  { src: '/images/genshin/web-20.jpg', captionAr: 'شبكة شخصيات اللعبة مع مستويات وقوتها', captionEn: 'Grid of game characters with levels and powers', category: 'gameplay' },
]

const categoryFilters = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: Globe },
  { id: 'world', labelAr: 'العالم', labelEn: 'World', icon: MapPin },
  { id: 'character', labelAr: 'الشخصيات', labelEn: 'Characters', icon: Users },
  { id: 'combat', labelAr: 'القتال', labelEn: 'Combat', icon: Swords },
  { id: 'gameplay', labelAr: 'أسلوب اللعب', labelEn: 'Gameplay', icon: Gamepad2 },
]

const elements = [
  { nameAr: 'بيرو (نار)', nameEn: 'Pyro (Fire)', icon: Flame, color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
  { nameAr: 'هيدرو (ماء)', nameEn: 'Hydro (Water)', icon: Droplets, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  { nameAr: 'أنيمو (رياح)', nameEn: 'Anemo (Wind)', icon: Wind, color: 'text-teal-500 bg-teal-100 dark:bg-teal-900/30' },
  { nameAr: 'إلكترو (برق)', nameEn: 'Electro (Lightning)', icon: Zap, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
  { nameAr: 'ديندرو (طبيعة)', nameEn: 'Dendro (Nature)', icon: Leaf, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
  { nameAr: 'كريو (جليد)', nameEn: 'Cryo (Ice)', icon: Snowflake, color: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30' },
  { nameAr: 'جيو (صخور)', nameEn: 'Geo (Earth)', icon: Mountain, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
]

export function GenshinGallery() {
  const { language, dir } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filteredImages = selectedCategory === 'all'
    ? genshinImages
    : genshinImages.filter((img) => img.category === selectedCategory)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const goNext = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length)
  }

  const goPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

  return (
    <div dir={dir} className="space-y-8">
      {/* ===== Hero Section ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900" />
        <div className="absolute inset-0 opacity-20">
          <img
            src={asset("/images/genshin/web-01.jpg")}
            alt="Genshin Impact"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/90 via-violet-900/50 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 text-white">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-2xl flex-shrink-0 border-4 border-white/20">
              <span className="text-3xl sm:text-5xl font-black">G</span>
            </div>

            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-black mb-2">Genshin Impact</h2>
              <p className="text-violet-200 text-sm sm:text-base leading-relaxed mb-4">
                {language === 'ar'
                  ? 'لعبة مغامرات عالم مفتوح من تطوير استوديو miHoYo (HoYoverse). انطلق في رحلة ملحمية عبر عالم تيفات الشاسع، اكتشف سبع مناطق فريدة، كل منها ترتبط بعنصر مختلف وإله يحكمها. اللعبة تجمع بين استكشاف العالم المفتوح، نظام القتال بالعناصر التفاعلية، وحكايات شخصيات مؤثرة في قصة رئيسية مثيرة لاكتشاف أسرار هذا العالم.'
                  : 'An open-world action RPG developed by miHoYo (HoYoverse). Embark on an epic journey across the vast world of Teyvat, discover seven unique regions each tied to a different element and ruled by its own god. The game combines open-world exploration, an interactive elemental combat system, and deeply emotional character stories in a thrilling main quest to uncover the secrets of this world.'}
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm py-1.5 px-3">
                  <HardDrive className="h-3.5 w-3.5 me-1.5" />
                  {language === 'ar' ? '50 جيجابايت' : '50 GB'}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm py-1.5 px-3">
                  <Smartphone className="h-3.5 w-3.5 me-1.5" />
                  {language === 'ar' ? 'أندرويد / آيفون / PC / PS' : 'Android / iOS / PC / PS'}
                </Badge>
                <Badge className="bg-yellow-500/90 text-yellow-950 border-0 py-1.5 px-3">
                  <Star className="h-3.5 w-3.5 me-1.5" />
                  4.8/5
                </Badge>
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm py-1.5 px-3">
                  <Users className="h-3.5 w-3.5 me-1.5" />
                  65M+ {language === 'ar' ? 'لاعب' : 'players'}
                </Badge>
                <Badge className="bg-emerald-500/90 text-white border-0 py-1.5 px-3">
                  {language === 'ar' ? 'مجانية' : 'Free to Play'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== Story & Elements ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {language === 'ar' ? 'القصة والحبكة' : 'Story & Plot'}
              </h3>
            </div>
            <CardContent className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === 'ar'
                  ? 'أنت وشقيقك التوأم مسافران بين العوالم عندما تقابلكم إلهة غامضة تُدعى "المجهول" فتقوم بفصلكما عن بعضكما البعض وسلبكما قواك. تستيقظ وحيداً في عالم تيفات الغريب، وتلتقي بـ "بايمون" - مرشدتك الصغيرة الطائرة - التي تصبح رفيقتك في هذه الرحلة. مهمتك هي البحث عن شقيقك المفقود، وفي طريقك ستكتشف أسرار الآلهة السبعة، والممالك القديمة، والقوى الخفية التي تتحكم بمصير هذا العالم.'
                  : 'You and your twin sibling are interdimensional travelers when a mysterious god known as the "Sustainer of Heavenly Principles" separates you both and strips away your powers. You awaken alone in the strange world of Teyvat, and meet Paimon - your tiny floating companion who becomes your guide. Your mission is to find your lost sibling, and along the way you will uncover the secrets of the Seven Archons, ancient kingdoms, and the hidden forces that control the fate of this world.'}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === 'ar'
                  ? 'عالم تيفات مقسم إلى سبع مناطق كبرى، كل منطقة تحكمها إلهة (أرشون) مرتبطة بعنصر مختلف. من سهول مونديشت الهادئة التي تحكمها إلهة الرياح، إلى ميناء ليويه التجاري المحمي بإله الصخور، مروراً بجزر إينازوما الرعدية وغابات سوميرو المورقة، وصولاً إلى فونتين المائية وناتلان النارية - كل منطقة تقدم تجربة فريدة بقصصها وشخصياتها وأسرارها الخاصة.'
                  : 'The world of Teyvat is divided into seven major regions, each ruled by an Archon associated with a different element. From the calm plains of Mondstadt ruled by the Anemo Archon, to the commercial hub of Liyue Harbor protected by the Geo Archon, through the thunderous Inazuma islands and lush Sumeru forests, to the aquatic Fontaine and fiery Natlan - each region offers a unique experience with its own stories, characters, and secrets.'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {language === 'ar' ? 'العناصر السبعة والميزات' : 'Seven Elements & Features'}
              </h3>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {elements.map((el) => (
                  <div key={el.nameEn} className={`flex items-center gap-2 p-2.5 rounded-xl ${el.color} transition-transform hover:scale-105`}>
                    <el.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs font-semibold">{language === 'ar' ? el.nameAr : el.nameEn}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mt-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {language === 'ar' ? 'أبرز الميزات' : 'Key Features'}
                </p>
                {[
                  { icon: <Globe className="h-4 w-4 text-violet-500" />, textAr: 'عالم مفتوح ضخم قابل للاستكشاف بالكامل', textEn: 'Massive fully explorable open world' },
                  { icon: <Swords className="h-4 w-4 text-red-500" />, textAr: 'نظام قتال فريد بالعناصر التفاعلية - أكثر من 30 تفاعل', textEn: 'Unique elemental reaction combat - 30+ reactions' },
                  { icon: <Users className="h-4 w-4 text-blue-500" />, textAr: 'أكثر من 80 شخصية قابلة للعب', textEn: '80+ playable characters' },
                  { icon: <Gamepad2 className="h-4 w-4 text-green-500" />, textAr: 'لعب تعاوني حتى 4 لاعبين', textEn: 'Co-op multiplayer up to 4 players' },
                  { icon: <Sparkles className="h-4 w-4 text-amber-500" />, textAr: 'تحديثات مستمرة كل 6 أسابيع', textEn: 'Continuous updates every 6 weeks' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                    <div className="mt-0.5 flex-shrink-0">{feat.icon}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {language === 'ar' ? feat.textAr : feat.textEn}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ===== Game Specs ===== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { labelAr: 'النوع', labelEn: 'Genre', valueAr: 'أكشن RPG عالم مفتوح', valueEn: 'Open World Action RPG', icon: Gamepad2, color: 'from-violet-500 to-purple-600' },
          { labelAr: 'المطور', labelEn: 'Developer', valueAr: 'HoYoverse (miHoYo)', valueEn: 'HoYoverse (miHoYo)', icon: Sparkles, color: 'from-indigo-500 to-blue-600' },
          { labelAr: 'سنة الإصدار', labelEn: 'Release Year', valueAr: '2020', valueEn: '2020', icon: Star, color: 'from-amber-500 to-orange-600' },
          { labelAr: 'السعر', labelEn: 'Price', valueAr: 'مجانية بالكامل', valueEn: 'Completely Free', icon: Shield, color: 'from-emerald-500 to-teal-600' },
        ].map((spec, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-lg">
            <div className={`bg-gradient-to-br ${spec.color} p-3 text-white text-center`}>
              <spec.icon className="h-5 w-5 mx-auto mb-1 opacity-80" />
              <p className="text-[10px] opacity-80">{language === 'ar' ? spec.labelAr : spec.labelEn}</p>
              <p className="text-xs font-bold mt-0.5">{language === 'ar' ? spec.valueAr : spec.valueEn}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ===== Image Gallery ===== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-violet-700 p-4 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              {language === 'ar'
                ? `معرض صور Genshin Impact (${genshinImages.length} صورة)`
                : `Genshin Impact Gallery (${genshinImages.length} images)`}
            </h3>
            <p className="text-purple-200 text-xs mt-1">
              {language === 'ar' ? 'اضغط على أي صورة لتكبيرها' : 'Click any image to view full size'}
            </p>
          </div>

          <CardContent className="p-4">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {categoryFilters.map((cat) => {
                const isActive = selectedCategory === cat.id
                const count = cat.id === 'all'
                  ? genshinImages.length
                  : genshinImages.filter((img) => img.category === cat.id).length
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                      isActive ? 'bg-violet-600 text-white shadow-md' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <cat.icon className="h-3.5 w-3.5" />
                    {language === 'ar' ? cat.labelAr : cat.labelEn}
                    <span className={`text-[10px] ${isActive ? 'text-violet-200' : 'text-muted-foreground/60'}`}>({count})</span>
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {filteredImages.map((img, index) => (
                <motion.div
                  key={img.src}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-muted/30">
                    <img
                      src={asset(img.src)}
                      alt={language === 'ar' ? img.captionAr : img.captionEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-[10px] text-white leading-tight line-clamp-2">
                        {language === 'ar' ? img.captionAr : img.captionEn}
                      </p>
                    </div>
                    <Badge className="absolute top-1.5 start-1.5 text-[9px] py-0 px-1.5 bg-black/50 text-white border-0 backdrop-blur-sm">
                      {categoryFilters.find((c) => c.id === img.category)?.labelAr && img.category !== 'all'
                        ? language === 'ar'
                          ? categoryFilters.find((c) => c.id === img.category)?.labelAr
                          : categoryFilters.find((c) => c.id === img.category)?.labelEn
                        : ''}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== Lightbox ===== */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 end-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goPrev() }} className="absolute start-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <ChevronRight className="h-7 w-7" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goNext() }} className="absolute end-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <ChevronLeft className="h-7 w-7" />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-[90vw] max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={asset(filteredImages[lightboxIndex]?.src || '')}
                alt={language === 'ar' ? filteredImages[lightboxIndex]?.captionAr : filteredImages[lightboxIndex]?.captionEn}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <p className="text-white text-sm text-center">
                  {language === 'ar' ? filteredImages[lightboxIndex]?.captionAr : filteredImages[lightboxIndex]?.captionEn}
                </p>
                <p className="text-white/60 text-xs text-center mt-1">{lightboxIndex + 1} / {filteredImages.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Download CTA ===== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 end-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 start-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">
              {language === 'ar' ? 'حمل Genshin Impact الآن من محلنا!' : 'Download Genshin Impact from our store!'}
            </h3>
            <p className="text-violet-100 text-sm mb-4 leading-relaxed">
              {language === 'ar'
                ? 'اللعبة متوفرة للهاتف بحجم 50 جيجابايت. يمكنك الحصول عليها من محل مجمع الحياة مباشرة - لا تحتاج إنترنت سريع لتحميلها!'
                : 'The game is available for mobile at 50GB. Get it directly from Life Complex store - no fast internet needed to download!'}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge className="bg-white/20 text-white border-0 py-2 px-4 text-sm">
                <Smartphone className="h-4 w-4 me-1.5" />
                {language === 'ar' ? 'أندرويد' : 'Android'}
              </Badge>
              <Badge className="bg-white/20 text-white border-0 py-2 px-4 text-sm">
                {language === 'ar' ? 'آيفون' : 'iPhone'}
              </Badge>
              <Badge className="bg-white/20 text-white border-0 py-2 px-4 text-sm">
                <HardDrive className="h-4 w-4 me-1.5" />
                50 GB
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
