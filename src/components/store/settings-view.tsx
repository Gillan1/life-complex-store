'use client'

import { useState, useEffect, useMemo } from 'react'
import { useProductStore, type Product, type Category, categories } from '@/store/product-store'
import { useSalesStore } from '@/store/sales-store'
import { useAuthStore } from '@/store/auth-store'
import { useLanguage } from '@/hooks/use-language'
import { useTheme } from 'next-themes'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
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
  CheckSquare,
  Square,
  Loader2,
} from 'lucide-react'

export function SettingsView() {
  const { products, deleteProduct, deleteMultipleProducts, deleteAllProducts, updateProduct, fetchProducts } = useProductStore()
  const { sales, fetchSales } = useSalesStore()
  const { isAdmin } = useAuthStore()
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [deleteAllOpen, setDeleteAllOpen] = useState(false)

  // ✅ التحديد المتعدد
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

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

  // ✅ إعادة تعيين التحديد عند الخروج من وضع التحديد المتعدد
  useEffect(() => {
    if (!multiSelectMode) {
      setSelectedIds(new Set())
    }
  }, [multiSelectMode])

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

  // ✅ حذف متعدد
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    setBulkDeleting(true)
    const ids = Array.from(selectedIds)
    const result = await deleteMultipleProducts(ids)
    setBulkDeleting(false)
    if (result.failed === 0) {
      toast.success(language === 'ar'
        ? `تم حذف ${result.success} منتج بنجاح`
        : `Deleted ${result.success} products successfully`)
    } else {
      toast.warning(language === 'ar'
        ? `تم حذف ${result.success}، فشل ${result.failed}`
        : `Deleted ${result.success}, failed ${result.failed}`)
    }
    setSelectedIds(new Set())
    setMultiSelectMode(false)
  }

  // ✅ حذف الكل
  const handleDeleteAll = async () => {
    setBulkDeleting(true)
    const success = await deleteAllProducts()
    setBulkDeleting(false)
    setDeleteAllOpen(false)
    if (success) {
      toast.success(language === 'ar'
        ? 'تم حذف جميع المنتجات بنجاح'
        : 'All products deleted successfully')
      setSelectedIds(new Set())
      setMultiSelectMode(false)
    } else {
      toast.error(language === 'ar'
        ? 'فشل حذف جميع المنتجات'
        : 'Failed to delete all products')
    }
  }

  // ✅ تبديل تحديد منتج
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // ✅ تحديد الكل / إلغاء تحديد الكل
  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)))
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

  const allSelected = selectedIds.size === products.length && products.length > 0

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
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Package className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold">{t('productManagement')}</h2>
          <span className="text-sm text-muted-foreground ms-2">
            ({products.length} {language === 'ar' ? 'منتج' : 'products'})
          </span>
        </div>

        <AddProductForm />

        {/* ✅ شريط أدوات التحديد المتعدد */}
        {products.length > 0 && (
          <div className="mt-6 p-3 rounded-xl bg-muted/30 border border-border flex flex-wrap items-center gap-2">
            <Button
              variant={multiSelectMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMultiSelectMode(!multiSelectMode)}
              className={multiSelectMode ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {multiSelectMode ? (
                <CheckSquare className="h-4 w-4 me-1" />
              ) : (
                <Square className="h-4 w-4 me-1" />
              )}
              {language === 'ar' ? 'تحديد متعدد' : 'Multi-select'}
            </Button>

            {multiSelectMode && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectAll}
                  disabled={products.length === 0}
                >
                  {allSelected ? (
                    <>
                      <Square className="h-4 w-4 me-1" />
                      {language === 'ar' ? 'إلغاء تحديد الكل' : 'Deselect All'}
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 me-1" />
                      {language === 'ar' ? 'تحديد الكل' : 'Select All'}
                    </>
                  )}
                </Button>

                <span className="text-sm text-muted-foreground ms-2">
                  {language === 'ar'
                    ? `${selectedIds.size} محدد`
                    : `${selectedIds.size} selected`}
                </span>

                <div className="flex-1" />

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={selectedIds.size === 0 || bulkDeleting}
                >
                  {bulkDeleting ? (
                    <Loader2 className="h-4 w-4 me-1 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 me-1" />
                  )}
                  {language === 'ar'
                    ? `حذف المحدد (${selectedIds.size})`
                    : `Delete Selected (${selectedIds.size})`}
                </Button>
              </>
            )}

            {!multiSelectMode && products.length > 0 && (
              <>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteAllOpen(true)}
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 me-1" />
                  {language === 'ar' ? 'حذف جميع المنتجات' : 'Delete All Products'}
                </Button>
              </>
            )}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">{t('currentProducts')}</h3>
          {products.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-border bg-muted/20">
              <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">{t('noProducts')}</p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                {language === 'ar'
                  ? 'استخدم نموذج "إضافة منتج" بالأعلى لإضافة منتجاتك'
                  : 'Use the "Add Product" form above to add your products'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((product, index) => {
                const isSelected = selectedIds.has(product.id)
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.5) }}
                  >
                    <Card
                      className={`border-0 shadow-md overflow-hidden transition-all ${
                        multiSelectMode && isSelected
                          ? 'ring-2 ring-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                          : ''
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          {/* ✅ checkbox في وضع التحديد المتعدد */}
                          {multiSelectMode && (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelect(product.id)}
                              className="flex-shrink-0"
                            />
                          )}
                          <div
                            className={`w-12 h-12 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0 ${
                              multiSelectMode ? 'cursor-pointer' : ''
                            }`}
                            onClick={() => multiSelectMode && toggleSelect(product.id)}
                          >
                            <img
                              src={asset(product.image)}
                              alt={productName(product)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div
                            className={`flex-1 min-w-0 ${
                              multiSelectMode ? 'cursor-pointer' : ''
                            }`}
                            onClick={() => multiSelectMode && toggleSelect(product.id)}
                          >
                            <p className="font-medium text-sm truncate">
                              {productName(product)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getCategoryIcon(product)} {getCategoryName(product)} • {product.price.toLocaleString()} {t('currency')}
                            </p>
                          </div>
                          {/* ✅ إخفاء أزرار التعديل/الحذف في وضع التحديد المتعدد */}
                          {!multiSelectMode && (
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
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
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

      {/* Delete confirmation dialog - single product */}
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

      {/* ✅ Delete All confirmation */}
      <AlertDialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
        <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {language === 'ar' ? 'حذف جميع المنتجات' : 'Delete All Products'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar'
                ? `سيتم حذف جميع المنتجات (${products.length} منتج) نهائياً من قاعدة البيانات. لا يمكن التراجع عن هذا الإجراء.`
                : `This will permanently delete all products (${products.length} items) from the database. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkDeleting}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              disabled={bulkDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {bulkDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 me-2 animate-spin" />
                  {language === 'ar' ? 'جاري الحذف...' : 'Deleting...'}
                </>
              ) : (
                language === 'ar' ? 'نعم، احذف الكل' : 'Yes, Delete All'
              )}
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
