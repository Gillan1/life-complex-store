'use client'

import { create } from 'zustand'
import {
  fetchSales as sbFetchSales,
  insertSale as sbInsertSale,
  deleteSale as sbDeleteSale,
  uploadBankReceipt,
  getReceiptSignedUrl,
  type DbSale,
  type SaleInput
} from '@/lib/supabase'

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface CopyServiceItem {
  quantity: number
  type: 'colored' | 'normal'
  unitPrice: number
  totalPrice: number
}

export interface DailySale {
  id: string
  date: string
  items: SaleItem[]
  copyService?: CopyServiceItem
  bankReceipt?: string           // ✅ مسار الملف (يُنشأ signed URL عند العرض)
  bankReceiptUrl?: string        // ✅ signed URL محسوب عند الحاجة
  totalAmount: number
  createdAt: string
}

interface SalesState {
  sales: DailySale[]
  isLoading: boolean
  error: string | null
  lastFetch: number
  fetchSales: (force?: boolean) => Promise<void>
  addSale: (sale: Omit<DailySale, 'id' | 'createdAt'>) => Promise<string | null>
  deleteSale: (id: string) => Promise<boolean>
  uploadReceipt: (file: File) => Promise<string | null>
  getReceiptUrl: (path: string) => Promise<string | null>
}

// تحويل من DbSale إلى DailySale (للعرض)
function dbToDailySale(s: DbSale): DailySale {
  const items: SaleItem[] = (s.items || []).map(i => ({
    productId: i.product_id ? String(i.product_id) : '',
    productName: i.product_name,
    quantity: i.quantity,
    unitPrice: i.unit_price,
    totalPrice: i.total_price
  }))

  let copyService: CopyServiceItem | undefined
  if (s.copy_service_type && s.copy_service_pages && s.copy_service_price) {
    // ✅ Guard ضد division by zero
    const pages = s.copy_service_pages > 0 ? s.copy_service_pages : 1
    copyService = {
      quantity: s.copy_service_pages,
      type: s.copy_service_type as 'colored' | 'normal',
      unitPrice: Math.round(s.copy_service_price / pages),
      totalPrice: s.copy_service_price
    }
  }

  return {
    id: String(s.id),
    date: s.sale_date,
    items,
    copyService,
    // ✅ خزّن المسار فقط (URL سيُنشأ عند الحاجة)
    bankReceipt: s.bank_receipt_path || s.bank_receipt_url || undefined,
    totalAmount: s.total_amount,
    createdAt: s.created_at
  }
}

const CACHE_TTL_MS = 60 * 1000 // دقيقة واحدة (المبيعات تحتاج تحديثاً أسرع)

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: [],
  isLoading: false,
  error: null,
  lastFetch: 0,

  fetchSales: async (force = false) => {
    const { lastFetch, isLoading } = get()
    if (!force && isLoading) return
    if (!force && Date.now() - lastFetch < CACHE_TTL_MS && get().sales.length >= 0) {
      // نسمح بإعادة استخدام الكاش لو المنتجات فارغة أيضاً (لتفادي الطلبات المتكررة)
      if (get().sales.length > 0 || lastFetch > 0) return
    }

    set({ isLoading: true, error: null })
    try {
      const data = await sbFetchSales()
      set({
        sales: data.map(dbToDailySale),
        isLoading: false,
        lastFetch: Date.now()
      })
    } catch (e) {
      console.error('fetchSales error:', e)
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Failed to load sales'
      })
    }
  },

  addSale: async (sale) => {
    try {
      const saleInput: SaleInput = {
        sale_date: sale.date,
        total_amount: sale.totalAmount,
        copy_service_type: sale.copyService?.type || null,
        copy_service_pages: sale.copyService?.quantity || null,
        copy_service_price: sale.copyService?.totalPrice || null,
        bank_receipt_path: sale.bankReceipt || null, // ✅ المسار فقط
        items: sale.items.map(i => ({
          product_id: i.productId ? Number(i.productId) : null,
          product_name: i.productName,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          total_price: i.totalPrice
        }))
      }

      const result = await sbInsertSale(saleInput)
      // ✅ تمرير items الفعلية (من saleInput) بدلاً من []
      const newSale = dbToDailySale({
        ...result,
        items: sale.items.map((i, idx) => ({
          id: -idx - 1, // ID مؤقت
          sale_id: result.id,
          product_id: i.productId ? Number(i.productId) : null,
          product_name: i.productName,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          total_price: i.totalPrice,
          created_at: result.created_at
        }))
      })
      set((state) => ({ sales: [newSale, ...state.sales] }))
      // ✅ إعادة تحميل المبيعات من Supabase لضمان التزامن
      setTimeout(() => {
        get().fetchSales(true)
      }, 100)
      return newSale.id
    } catch (e) {
      console.error('addSale error:', e)
      return null
    }
  },

  deleteSale: async (id) => {
    try {
      await sbDeleteSale(Number(id))
      set((state) => ({ sales: state.sales.filter((s) => s.id !== id) }))
      return true
    } catch (e) {
      console.error('deleteSale error:', e)
      return false
    }
  },

  uploadReceipt: async (file) => {
    try {
      return await uploadBankReceipt(file)
    } catch (e) {
      console.error('uploadReceipt error:', e)
      return null
    }
  },

  // ✅ دالة جديدة: إنشاء signed URL عند الحاجة (للعرض)
  getReceiptUrl: async (path: string) => {
    try {
      return await getReceiptSignedUrl(path)
    } catch (e) {
      console.error('getReceiptUrl error:', e)
      return null
    }
  }
}))
