'use client'

import { useState, useRef } from 'react'
import { useProductStore, categories, type Category } from '@/store/product-store'
import { useLanguage } from '@/hooks/use-language'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, PackagePlus, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { asset } from '@/lib/utils'

export function AddProductForm() {
  const { addProduct, uploadImage } = useProductStore()
  const { t, language } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [nameAr, setNameAr] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('/images/products/phone.png')
  const [category, setCategory] = useState<Category>('phones')
  const [descriptionAr, setDescriptionAr] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  // ✅ نخزن الـ File مباشرة (لا base64 في state)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(language === 'ar' ? 'يرجى اختيار ملف صورة فقط' : 'Please select an image file only')
      return
    }

    // Validate file size (max 5MB now - لأننا نخزن في Storage وليس localStorage)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'ar' ? 'حجم الصورة كبير جداً (الحد الأقصى 5 ميجا)' : 'Image too large (max 5MB)')
      return
    }

    // معاينة فورية باستخدام URL.createObjectURL (لا يخزن base64 في state)
    setIsUploading(true)
    setPendingFile(file)
    setImagePreview(URL.createObjectURL(file))
    setIsUploading(false)
    toast.success(language === 'ar' ? 'تم اختيار الصورة' : 'Image selected')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nameAr.trim() || !nameEn.trim() || !price) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    setIsSubmitting(true)

    // رفع الصورة إلى Supabase Storage إن وُجدت
    let finalImageUrl = image
    if (pendingFile) {
      const uploadedUrl = await uploadImage(pendingFile)
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl
      } else {
        toast.error(language === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload image')
        setIsSubmitting(false)
        return
      }
    }

    const result = await addProduct({
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      price: parseFloat(price),
      image: finalImageUrl || '/images/products/phone.png',
      category,
      descriptionAr: descriptionAr.trim() || undefined,
      descriptionEn: descriptionEn.trim() || undefined,
    })

    setIsSubmitting(false)

    if (result) {
      toast.success(t('productAdded'))
      // إعادة تعيين النموذج
      setNameAr('')
      setNameEn('')
      setPrice('')
      setImage('/images/products/phone.png')
      setCategory('phones')
      setDescriptionAr('')
      setDescriptionEn('')
      setImagePreview(null)
      setPendingFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } else {
      toast.error(language === 'ar' ? 'فشل إضافة المنتج' : 'Failed to add product')
    }
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PackagePlus className="h-5 w-5 text-emerald-600" />
          {t('addProduct')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameAr">{t('productNameAr')}</Label>
              <Input
                id="nameAr"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder={t('productNameAr')}
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">{t('productNameEn')}</Label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder={t('productNameEn')}
                required
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('price')}</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t('price')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t('category')}</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {language === 'ar' ? cat.nameAr : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>{t('image')}</Label>
            <div className="flex gap-3 items-start">
              {/* Image preview */}
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden flex-shrink-0 flex items-center justify-center bg-muted/20">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 me-2 animate-spin" />
                      {t('uploading')}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 me-2" />
                      {t('uploadImage')}
                    </>
                  )}
                </Button>

                {/* Also show URL input as alternative */}
                <details className="text-xs">
                  <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
                    {language === 'ar' ? 'أو أدخل رابط الصورة يدوياً' : 'Or enter image URL manually'}
                  </summary>
                  <Input
                    value={pendingFile ? '' : image}
                    onChange={(e) => {
                      setImage(e.target.value)
                      setImagePreview(e.target.value || null)
                      setPendingFile(null)
                    }}
                    placeholder={t('imageUrl')}
                    dir="ltr"
                    className="mt-1 h-8 text-xs"
                  />
                </details>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="descAr">{t('descriptionAr')}</Label>
              <Input
                id="descAr"
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder={t('descriptionAr')}
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descEn">{t('descriptionEn')}</Label>
              <Input
                id="descEn"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder={t('descriptionEn')}
                dir="ltr"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isUploading || isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
                {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 me-2" />
                {t('addProduct')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
