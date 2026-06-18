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
  bank_receipt_url: string | null
  notes: string | null
  created_at: string
  created_by: string | null
  items?: DbSaleItem[]
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

  // لـ private bucket نحتاج URL موقّع
  const { data, error: signedError } = await supabase.storage
    .from('lc-receipts')
    .createSignedUrl(fileName, 3600 * 24 * 7) // صالح 7 أيام
  if (signedError) throw signedError
  return data.signedUrl
}

// ============ دوال المبيعات ============
export async function fetchSales(): Promise<DbSale[]> {
  const supabase = getSupabase()
  // جلب المبيعات أولاً
  const { data: sales, error: salesError } = await supabase
    .from('lc_sales')
    .select('*')
    .order('created_at', { ascending: false })
  if (salesError) throw salesError
  if (!sales || sales.length === 0) return []

  // جلب عناصر المبيعات
  const saleIds = sales.map(s => s.id)
  const { data: items, error: itemsError } = await supabase
    .from('lc_sale_items')
    .select('*')
    .in('sale_id', saleIds)
  if (itemsError) throw itemsError

  // تجميع
  return sales.map(sale => ({
    ...sale,
    items: (items || []).filter(i => i.sale_id === sale.id)
  }))
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
  bank_receipt_url?: string | null
  notes?: string | null
  items: SaleItemInput[]
}

export async function insertSale(sale: SaleInput): Promise<DbSale> {
  const supabase = getSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  // إدراج الـ sale
  const { data: saleRow, error: saleError } = await supabase
    .from('lc_sales')
    .insert({
      sale_date: sale.sale_date || new Date().toISOString().split('T')[0],
      total_amount: sale.total_amount,
      copy_service_type: sale.copy_service_type || null,
      copy_service_pages: sale.copy_service_pages || null,
      copy_service_price: sale.copy_service_price || null,
      bank_receipt_url: sale.bank_receipt_url || null,
      notes: sale.notes || null,
      created_by: user?.id || null
    })
    .select()
    .single()
  if (saleError) throw saleError

  // إدراج العناصر
  if (sale.items.length > 0) {
    const itemsToInsert = sale.items.map(item => ({
      ...item,
      sale_id: saleRow.id
    }))
    const { error: itemsError } = await supabase
      .from('lc_sale_items')
      .insert(itemsToInsert)
    if (itemsError) throw itemsError
  }

  return saleRow
}

export async function deleteSale(id: number): Promise<void> {
  const supabase = getSupabase()
  // lc_sale_items تُحذف تلقائياً بـ ON DELETE CASCADE
  const { error } = await supabase.from('lc_sales').delete().eq('id', id)
  if (error) throw error
}
