'use client'

import { useState, useEffect, useMemo } from 'react'
import { useProductStore, type Product, type Category, categories } from '@/store/product-store'
import { useSalesStore } from '@/store/sales-store'
import { useAuthStore } from '@/store/auth-store'
import { useLanguage } from '@/hooks/use-language'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { AddProductForm } from './add-product-form'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { asset } from '@/lib/utils'
import {
  Trash2,
  Package,
  Sun,
  Moon,
  Globe,
  Palette,
  Download,
  Pencil,
  Database,
  AlertTriangle,
} from 'lucide-react'

export function SettingsView() {
  const { products, deleteProduct, updateProduct, fetchProducts } = useProductStore()
  const { sales, fetchSales } = useSalesStore()
  const { isAdmin } = useAuthStore()
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [editTarget, setEditTarget] = useState<Product | null>(null)

  // Edit form state
  const [editNameAr, setEditNameAr] = useState('')
  const [editNameEn, setEditNameEn] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editImage, setEditImage] = useState('')
  const [editCategory, setEditCategory] = useState<Category>('phones')
  const [editDescAr, setEditDescAr] = useState('')
  const [editDescEn, setEditDescEn] = useState('')

  // ✅ useEffect لتحديث editCategory عند تغيير المنتجات
  useEffect(() => {
    if (products.length > 0 && !products.find(p => p.category === editCategory)) {
      setEditCategory(products[0].category)
    }
  }, [products, editCategory])

  if (!isAdmin) return null

  const handleDelete = async () => {
    if (deleteTarget) {
      const success = await deleteProduct(deleteTarget.id)
      if (success) {
        toast.success(t('productDeleted'))
      } else {
        toast.error(language === 'ar' ? 'فشل الحذف' : 'Failed to delete')
      }
      setDeleteTarget(null)
    }
  }

  const handleEdit = (product: Product) => {
    setEditTarget(product)
    setEditNameAr(product.nameAr)
    setEditNameEn(product.nameEn)
    setEditPrice(product.price.toString())
    setEditImage(product.image)
    setEditCategory(product.category)
    setEditDescAr(product.descriptionAr || '')
    setEditDescEn(product.descriptionEn || '')
  }

  const handleSaveEdit = async () => {
    if (!editTarget) return
    if (!editNameAr.trim() || !editNameEn.trim() || !editPrice) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    const success = await updateProduct(editTarget.id, {
      nameAr: editNameAr.trim(),
      nameEn: editNameEn.trim(),
      price: parseFloat(editPrice),
      image: editImage || '/images/products/phone.png',
      category: editCategory,
      descriptionAr: editDescAr.trim() || undefined,
      descriptionEn: editDescEn.trim() || undefined,
    })

    if (success) {
      toast.success(t('productUpdated'))
      setEditTarget(null)
    } else {
      toast.error(language === 'ar' ? 'فشل التحديث' : 'Failed to update')
    }
  }

  const productName = (p: Product) => (language === 'ar' ? p.nameAr : p.nameEn)
  const getCategoryName = (p: Product) => {
    const cat = categories.find((c) => c.id === p.category)
    return cat ? (language === 'ar' ? cat.nameAr : cat.nameEn) : ''
  }
  const getCategoryIcon = (p: Product) => {
    const cat = categories.find((c) => c.id === p.category)
    return cat?.icon || ''
  }

  // Export data as JSON (للنسخ الاحتياطي)
  const handleExportData = () => {
    const data = {
      products,
      sales,
      exportDate: new Date().toISOString(),
      version: '2.0',
      note: 'Backup from Supabase-backed app'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `store-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(t('exportSuccess'))
  }

  // ✅ إصلاح منطق "مخزون منخفض" - count <= 1 وليس === 1
  const lowStockCategories = useMemo(() => {
    return categories.filter((cat) => {
      const count = products.filter((p) => p.category === cat.id).length
      return count <= 1
    })
  }, [products])

  // ✅ زر تحديث من Supabase
  const handleRefreshFromCloud = async () => {
    await Promise.all([fetchProducts(true), fetchSales(true)])
    toast.success(language === 'ar' ? 'تم التحديث من السحابة' : 'Refreshed from cloud')
  }

  return (
    <div className="space-y-6 p-4">
      {/* Stock Alerts */}
      {lowStockCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-amber-700 dark:text-amber-400">{t('lowStockWarning')}</h3>
            </div>
            <div className="space-y-1">
              {lowStockCategories.map((cat) => (
                <p key={cat.id} className="text-sm text-amber-600 dark:text-amber-400/80">
                  {cat.icon} {language === 'ar' ? cat.nameAr : cat.nameEn} - {t('lowStockMessage')}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Product Management */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold">{t('productManagement')}</h2>
        </div>

        <AddProductForm />

        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">{t('currentProducts')}</h3>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t('noProducts')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                          <img
                            src={asset(product.image)}
                            alt={productName(product)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {productName(product)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getCategoryIcon(product)} {getCategoryName(product)} • {product.price.toLocaleString()} {t('currency')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <Separator />

      {/* Data Backup */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold">{t('dataBackup')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-medium">{t('exportData')}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{t('exportDescription')}</p>
              <Button
                onClick={handleExportData}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="h-4 w-4 me-2" />
                {t('exportData')}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium">{language === 'ar' ? 'تحديث من السحابة' : 'Refresh from Cloud'}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'المنتجات تُخزَّن في Supabase. اضغط هنا لإعادة التحميل من السحابة.' : 'Products are stored in Supabase. Click to reload from cloud.'}</p>
              <Button
                variant="outline"
                onClick={handleRefreshFromCloud}
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
              >
                <Database className="h-4 w-4 me-2" />
                {language === 'ar' ? 'تحديث' : 'Refresh'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <Separator />

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold">{t('appearance')}</h2>
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4 space-y-4">
            {/* Dark mode toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
                <Label htmlFor="dark-mode">{t('darkMode')}</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>

            <Separator />

            {/* Language toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Label>{t('language')}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={language === 'ar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('ar')}
                  className={language === 'ar' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  {t('arabic')}
                </Button>
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  {t('english')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && `${productName(deleteTarget)} - ${deleteTarget.price.toLocaleString()} ${t('currency')}`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit product dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-blue-600" />
              {t('editProduct')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('productNameAr')}</Label>
                <Input value={editNameAr} onChange={(e) => setEditNameAr(e.target.value)} dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label>{t('productNameEn')}</Label>
                <Input value={editNameEn} onChange={(e) => setEditNameEn(e.target.value)} dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t('price')}</Label>
                <Input type="number" min="0" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('imageUrl')}</Label>
                <Input value={editImage} onChange={(e) => setEditImage(e.target.value)} dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>{t('category')}</Label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as typeof editCategory)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('descriptionAr')}</Label>
                <Input value={editDescAr} onChange={(e) => setEditDescAr(e.target.value)} dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label>{t('descriptionEn')}</Label>
                <Input value={editDescEn} onChange={(e) => setEditDescEn(e.target.value)} dir="ltr" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
