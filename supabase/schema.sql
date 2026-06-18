-- ============================================================
-- مجمع الحياة - Supabase Schema
-- لتشغيله: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ============ 1) جدول المنتجات ============
CREATE TABLE IF NOT EXISTS lc_products (
  id              BIGSERIAL PRIMARY KEY,
  name_ar         TEXT NOT NULL,
  name_en         TEXT,
  description_ar  TEXT,
  description_en  TEXT,
  price           BIGINT NOT NULL,
  image_url       TEXT NOT NULL,
  category        TEXT NOT NULL,
  is_service      BOOLEAN NOT NULL DEFAULT FALSE,
  service_type    TEXT,
  size            TEXT,
  platform        TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lc_products_category ON lc_products(category) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_lc_products_sort     ON lc_products(sort_order DESC, id ASC);

-- ============ 2) جدول المبيعات ============
CREATE TABLE IF NOT EXISTS lc_sales (
  id              BIGSERIAL PRIMARY KEY,
  sale_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount    BIGINT NOT NULL,
  copy_service_type  TEXT,
  copy_service_pages INTEGER,
  copy_service_price  BIGINT,
  bank_receipt_url TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_lc_sales_date      ON lc_sales(sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_lc_sales_created   ON lc_sales(created_at DESC);

-- ============ 3) جدول عناصر المبيعات ============
CREATE TABLE IF NOT EXISTS lc_sale_items (
  id              BIGSERIAL PRIMARY KEY,
  sale_id         BIGINT NOT NULL REFERENCES lc_sales(id) ON DELETE CASCADE,
  product_id      BIGINT REFERENCES lc_products(id) ON DELETE SET NULL,
  product_name    TEXT NOT NULL,
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  unit_price      BIGINT NOT NULL,
  total_price     BIGINT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lc_sale_items_sale     ON lc_sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_lc_sale_items_product  ON lc_sale_items(product_id);

-- ============ 4) Row Level Security ============
ALTER TABLE lc_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_active_lc_products"
  ON lc_products FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

CREATE POLICY "admin_read_lc_sales"
  ON lc_sales FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "admin_read_lc_sale_items"
  ON lc_sale_items FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "admin_insert_lc_products"
  ON lc_products FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "admin_update_lc_products"
  ON lc_products FOR UPDATE
  TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "admin_delete_lc_products"
  ON lc_products FOR DELETE
  TO authenticated
  USING (TRUE);

CREATE POLICY "admin_insert_lc_sales"
  ON lc_sales FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "admin_update_lc_sales"
  ON lc_sales FOR UPDATE
  TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "admin_delete_lc_sales"
  ON lc_sales FOR DELETE
  TO authenticated
  USING (TRUE);

CREATE POLICY "admin_insert_lc_sale_items"
  ON lc_sale_items FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "admin_update_lc_sale_items"
  ON lc_sale_items FOR UPDATE
  TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "admin_delete_lc_sale_items"
  ON lc_sale_items FOR DELETE
  TO authenticated
  USING (TRUE);

-- ============ 5) Storage Buckets ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('lc-product-images', 'lc-product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('lc-receipts', 'lc-receipts', FALSE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_lc_product_images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'lc-product-images');

CREATE POLICY "admin_upload_lc_product_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lc-product-images');

CREATE POLICY "admin_update_lc_product_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'lc-product-images');

CREATE POLICY "admin_delete_lc_product_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lc-product-images');

CREATE POLICY "admin_read_lc_receipts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'lc-receipts');

CREATE POLICY "admin_upload_lc_receipts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lc-receipts');

CREATE POLICY "admin_update_lc_receipts"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'lc-receipts');

CREATE POLICY "admin_delete_lc_receipts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lc-receipts');

-- ============ 6) Triggers ============
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lc_products_set_updated_at ON lc_products;
CREATE TRIGGER lc_products_set_updated_at
  BEFORE UPDATE ON lc_products
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
