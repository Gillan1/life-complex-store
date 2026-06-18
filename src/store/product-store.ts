'use client'

import { create } from 'zustand'
import {
  fetchProducts as sbFetchProducts,
  insertProduct as sbInsertProduct,
  updateProduct as sbUpdateProduct,
  deleteProduct as sbDeleteProduct,
  uploadProductImage,
  type DbProduct
} from '@/lib/supabase'

// ============ أنواع المنتجات ============
export type Category =
  | 'phones'
  | 'chargers'
  | 'headphones'
  | 'accessories'
  | 'smartwatches'
  | 'tablets'
  | 'phone_cases'
  | 'laptops'
  | 'cameras'
  | 'storage'
  | 'speakers'
  | 'networking'
  | 'printers'
  | 'gaming'
  | 'cables'
  | 'screen_protectors'
  | 'power_banks'
  | 'mouse_keyboard'
  | 'monitors'
  | 'smart_home'

export const categories: { id: Category; nameAr: string; nameEn: string; icon: string }[] = [
  { id: 'phones', nameAr: 'هواتف', nameEn: 'Phones', icon: '📱' },
  { id: 'chargers', nameAr: 'شواحن وكابلات', nameEn: 'Chargers & Cables', icon: '🔌' },
  { id: 'headphones', nameAr: 'سماعات', nameEn: 'Headphones', icon: '🎧' },
  { id: 'accessories', nameAr: 'إكسسوارات', nameEn: 'Accessories', icon: '⌨️' },
  { id: 'smartwatches', nameAr: 'ساعات ذكية', nameEn: 'Smartwatches', icon: '⌚' },
  { id: 'tablets', nameAr: 'أجهزة لوحية', nameEn: 'Tablets', icon: '💻' },
  { id: 'phone_cases', nameAr: 'جرابات الهاتف', nameEn: 'Phone Cases', icon: '🛡️' },
  { id: 'laptops', nameAr: 'لابتوب', nameEn: 'Laptops', icon: '💻' },
  { id: 'cameras', nameAr: 'كاميرات', nameEn: 'Cameras', icon: '📷' },
  { id: 'storage', nameAr: 'ذاكرة وتخزين', nameEn: 'Storage', icon: '💾' },
  { id: 'speakers', nameAr: 'سبيكرات', nameEn: 'Speakers', icon: '🔊' },
  { id: 'networking', nameAr: 'شبكات وراتر', nameEn: 'Networking', icon: '📶' },
  { id: 'printers', nameAr: 'طابعات', nameEn: 'Printers', icon: '🖨️' },
  { id: 'gaming', nameAr: 'ألعاب', nameEn: 'Gaming', icon: '🎮' },
  { id: 'cables', nameAr: 'كابلات', nameEn: 'Cables', icon: '🔌' },
  { id: 'screen_protectors', nameAr: 'حماية شاشة', nameEn: 'Screen Protectors', icon: '🛡️' },
  { id: 'power_banks', nameAr: 'باور بانك', nameEn: 'Power Banks', icon: '🔋' },
  { id: 'mouse_keyboard', nameAr: 'ماوس وكيبورد', nameEn: 'Mouse & Keyboard', icon: '🖱️' },
  { id: 'monitors', nameAr: 'شاشات', nameEn: 'Monitors', icon: '🖥️' },
  { id: 'smart_home', nameAr: 'منزل ذكي', nameEn: 'Smart Home', icon: '🏠' },
]

export interface Product {
  id: string                      // ✅ string للحفاظ على توافق المكونات الحالية
  nameAr: string
  nameEn: string
  price: number
  image: string
  category: Category
  descriptionAr?: string
  descriptionEn?: string
  isService?: boolean
  serviceType?: 'printing' | 'software' | 'movies' | 'games' | 'firmware' | 'google_bypass'
  size?: string
  platform?: string
  sortOrder?: number
}

// ============ تحويلات ============
function dbToProduct(p: DbProduct): Product {
  return {
    id: String(p.id),                   // number → string للتوافق مع المكونات
    nameAr: p.name_ar,
    nameEn: p.name_en || p.name_ar,
    price: p.price,
    image: p.image_url,
    category: p.category as Category,
    descriptionAr: p.description_ar || undefined,
    descriptionEn: p.description_en || undefined,
    isService: p.is_service,
    serviceType: (p.service_type as Product['serviceType']) || undefined,
    size: p.size || undefined,
    platform: p.platform || undefined,
    sortOrder: p.sort_order
  }
}

function productToDbInsert(p: Partial<Product>) {
  return {
    name_ar: p.nameAr || '',
    name_en: p.nameEn || p.nameAr || '',
    description_ar: p.descriptionAr || null,
    description_en: p.descriptionEn || null,
    price: p.price ?? 0,
    image_url: p.image || '',
    category: p.category || 'accessories',
    is_service: p.isService || false,
    service_type: p.serviceType || null,
    size: p.size || null,
    platform: p.platform || null
  }
}

// ============ Zustand Store ============
interface ProductState {
  products: Product[]
  isLoading: boolean
  error: string | null
  lastFetch: number
  fetchProducts: (force?: boolean) => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<boolean>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>
  uploadImage: (file: File) => Promise<string | null>
}

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 دقائق

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  lastFetch: 0,

  fetchProducts: async (force = false) => {
    const { lastFetch, isLoading } = get()
    if (!force && isLoading) return
    if (!force && Date.now() - lastFetch < CACHE_TTL_MS && get().products.length > 0) return

    set({ isLoading: true, error: null })
    try {
      const data = await sbFetchProducts()
      set({
        products: data.map(dbToProduct),
        isLoading: false,
        lastFetch: Date.now()
      })
    } catch (e) {
      console.error('fetchProducts error:', e)
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Failed to load products'
      })
    }
  },

  addProduct: async (product) => {
    try {
      const dbProduct = await sbInsertProduct(productToDbInsert(product))
      const newProduct = dbToProduct(dbProduct)
      set((state) => ({ products: [newProduct, ...state.products] }))
      return newProduct
    } catch (e) {
      console.error('addProduct error:', e)
      return null
    }
  },

  deleteProduct: async (id) => {
    try {
      await sbDeleteProduct(Number(id))
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }))
      return true
    } catch (e) {
      console.error('deleteProduct error:', e)
      return false
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const dbUpdates: Record<string, unknown> = {}
      if (updates.nameAr !== undefined) dbUpdates.name_ar = updates.nameAr
      if (updates.nameEn !== undefined) dbUpdates.name_en = updates.nameEn
      if (updates.descriptionAr !== undefined) dbUpdates.description_ar = updates.descriptionAr
      if (updates.descriptionEn !== undefined) dbUpdates.description_en = updates.descriptionEn
      if (updates.price !== undefined) dbUpdates.price = updates.price
      if (updates.image !== undefined) dbUpdates.image_url = updates.image
      if (updates.category !== undefined) dbUpdates.category = updates.category
      if (updates.isService !== undefined) dbUpdates.is_service = updates.isService
      if (updates.serviceType !== undefined) dbUpdates.service_type = updates.serviceType
      if (updates.size !== undefined) dbUpdates.size = updates.size
      if (updates.platform !== undefined) dbUpdates.platform = updates.platform

      await sbUpdateProduct(Number(id), dbUpdates)
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        )
      }))
      return true
    } catch (e) {
      console.error('updateProduct error:', e)
      return false
    }
  },

  uploadImage: async (file) => {
    try {
      return await uploadProductImage(file)
    } catch (e) {
      console.error('uploadImage error:', e)
      return null
    }
  }
}))
