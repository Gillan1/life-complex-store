'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config'

// Singleton client
let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'life-complex-admin-session'
    }
  })
  return _client
}

// ============ أنواع المنتجات ============
export interface DbProduct {
  id: number
  name_ar: string
  name_en: string | null
  description_ar: string | null
  description_en: string | null
  price: number
  image_url: string
  category: string
  is_service: boolean
  service_type: string | null
  size: string | null
  platform: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============ أنواع المبيعات ============
export interface DbSaleItem {
  id: number
  sale_id: number
  product_id: number | null
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface DbSale {
  id: number
  sale_date: string
  total_amount: number
  copy_service_type: string | null
  copy_service_pages: number | null
  copy_service_price: number | null
  bank_receipt_path: string | null       // ✅ مسار الملف فقط (لا URL موقّع)
  notes: string | null
  created_at: string
  created_by: string | null
  items?: DbSaleItem[]
  // ✅ حقل محسوب عند العرض فقط (لا يُخزن في DB)
  bank_receipt_url?: string | null
}

// ============ دوال المنتجات ============
export async function fetchProducts(): Promise<DbProduct[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('lc_products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: false })
    .order('id', { ascending: true })
  if (error) throw error
  return data || []
}

export async function insertProduct(
  product: Omit<DbProduct, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'sort_order'>
): Promise<DbProduct> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('lc_products')
    .insert({
      ...product,
      is_active: true,
      sort_order: 0
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(
  id: number,
  updates: Partial<DbProduct>
): Promise<DbProduct> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('lc_products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id: number): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('lc_products').delete().eq('id', id)
  if (error) throw error
}

// ✅ حذف جميع المنتجات (للمسؤول فقط - يتطلب RLS policy أن يسمح بـ DELETE للمسؤول)
export async function deleteAllProducts(): Promise<void> {
  const supabase = getSupabase()
  // حذف جميع الصفوف - يتطلب صلاحية DELETE
  const { error } = await supabase.from('lc_products').delete().neq('id', -1)
  if (error) throw error
}

// ============ دوال رفع الصور ============
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = getSupabase()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const fileName = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('lc-product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('lc-product-images').getPublicUrl(fileName)
  return data.publicUrl
}

// ✅ إصلاح: يخزن المسار فقط بدلاً من signed URL (الـ URL ينتهي بعد 7 أيام)
export async function uploadBankReceipt(file: File): Promise<string> {
  const supabase = getSupabase()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('lc-receipts')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    })
  if (uploadError) throw uploadError

  // ✅ نعيد المسار فقط - الـ URL سيُنشأ عند العرض
  return fileName
}

// ✅ دالة جديدة: إنشاء signed URL عند الحاجة (للعرض)
export async function getReceiptSignedUrl(path: string): Promise<string | null> {
  if (!path) return null
  // إذا كان URL كامل بالفعل (للتوافق مع البيانات القديمة)
  if (path.startsWith('http')) return path
  const supabase = getSupabase()
  const { data, error } = await supabase.storage
    .from('lc-receipts')
    .createSignedUrl(path, 3600) // صالح لساعة واحدة فقط عند العرض
  if (error) {
    console.error('getReceiptSignedUrl error:', error)
    return null
  }
  return data.signedUrl
}

// ============ دوال المبيعات ============
// ✅ إصلاح: استخدم join مدمج بدل استعلامين منفصلين (يحل race condition)
export async function fetchSales(): Promise<DbSale[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('lc_sales')
    .select('*, items:lc_sale_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  if (!data || data.length === 0) return []

  // ✅ تحويل أسماء الحقول من snake_case إلى camelCase + items
  return data.map((sale: Record<string, unknown>) => {
    const items = (sale.items as DbSaleItem[]) || []
    return {
      id: sale.id as number,
      sale_date: sale.sale_date as string,
      total_amount: sale.total_amount as number,
      copy_service_type: sale.copy_service_type as string | null,
      copy_service_pages: sale.copy_service_pages as number | null,
      copy_service_price: sale.copy_service_price as number | null,
      bank_receipt_path: sale.bank_receipt_path as string | null,
      notes: sale.notes as string | null,
      created_at: sale.created_at as string,
      created_by: sale.created_by as string | null,
      items
    }
  })
}

export interface SaleItemInput {
  product_id: number | null
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface SaleInput {
  sale_date?: string
  total_amount: number
  copy_service_type?: 'colored' | 'normal' | null
  copy_service_pages?: number | null
  copy_service_price?: number | null
  bank_receipt_path?: string | null      // ✅ المسار فقط
  notes?: string | null
  items: SaleItemInput[]
}

// ✅ إصلاح: استخدم RPC transactional لإدراج sale + items معاً
export async function insertSale(sale: SaleInput): Promise<DbSale> {
  const supabase = getSupabase()

  // استدعاء RPC الذي ينفذ العملية في transaction واحدة
  // ✅ p_items يجب أن يكون JSONB array (وليس string)
  const { data, error } = await supabase.rpc('insert_sale_with_items', {
    p_sale_date: sale.sale_date || new Date().toISOString().split('T')[0],
    p_total_amount: sale.total_amount,
    p_copy_service_type: sale.copy_service_type || null,
    p_copy_service_pages: sale.copy_service_pages || null,
    p_copy_service_price: sale.copy_service_price || null,
    p_bank_receipt_path: sale.bank_receipt_path || null,
    p_notes: sale.notes || null,
    p_items: sale.items.map(i => ({
      product_id: i.product_id ? String(i.product_id) : '',
      product_name: i.product_name,
      quantity: String(i.quantity),
      unit_price: String(i.unit_price),
      total_price: String(i.total_price)
    }))
  })

  if (error) throw error
  // الـ RPC يعيد sale بدون items (نحتاج إضافتها يدوياً للـ optimistic update)
  return {
    ...data,
    items: sale.items.map((i, idx) => ({
      id: -idx - 1,
      sale_id: data.id,
      product_id: i.product_id,
      product_name: i.product_name,
      quantity: i.quantity,
      unit_price: i.unit_price,
      total_price: i.total_price,
      created_at: data.created_at
    }))
  } as DbSale
}

export async function deleteSale(id: number): Promise<void> {
  const supabase = getSupabase()
  // lc_sale_items تُحذف تلقائياً بـ ON DELETE CASCADE
  const { error } = await supabase.from('lc_sales').delete().eq('id', id)
  if (error) throw error
}
