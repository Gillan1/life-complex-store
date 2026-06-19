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
  price           BIGINT NOT NULL CHECK (price >= 0),
  image_url       TEXT NOT NULL,
  category        TEXT NOT NULL,
  is_service      BOOLEAN NOT NULL DEFAULT FALSE,
  service_type    TEXT,
  size            TEXT,
  platform        TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
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
  total_amount    BIGINT NOT NULL CHECK (total_amount >= 0),
  copy_service_type  TEXT,
  copy_service_pages INTEGER CHECK (copy_service_pages IS NULL OR copy_service_pages > 0),
  copy_service_price  BIGINT CHECK (copy_service_price IS NULL OR copy_service_price >= 0),
  bank_receipt_path TEXT,                          -- ✅ مسار الملف فقط (يُنشأ signed URL عند العرض)
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL
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
  unit_price      BIGINT NOT NULL CHECK (unit_price >= 0),
  total_price     BIGINT NOT NULL CHECK (total_price >= 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lc_sale_items_sale     ON lc_sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_lc_sale_items_product  ON lc_sale_items(product_id);

-- ============ 4) Row Level Security ============
ALTER TABLE lc_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_sale_items ENABLE ROW LEVEL SECURITY;

-- ✅ قراءة عامة للمنتجات النشطة فقط
CREATE POLICY "public_read_active_lc_products"
  ON lc_products FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- ✅ المسؤول فقط (مقيّد ببريد المسؤول) يقرأ/يكتب المبيعات وعناصرها
CREATE POLICY "admin_read_lc_sales"
  ON lc_sales FOR SELECT
  TO authenticated
  USING (auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_read_lc_sale_items"
  ON lc_sale_items FOR SELECT
  TO authenticated
  USING (auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_insert_lc_products"
  ON lc_products FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_update_lc_products"
  ON lc_products FOR UPDATE
  TO authenticated
  USING (auth.email() = 'ghanim.workshop@protonmail.com')
  WITH CHECK (auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_delete_lc_products"
  ON lc_products FOR DELETE
  TO authenticated
  USING (auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_insert_lc_sales"
  ON lc_sales FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_update_lc_sales"
  ON lc_sales FOR UPDATE
  TO authenticated
  USING (auth.email() = 'ghanim.workshop@protonmail.com')
  WITH CHECK (auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_delete_lc_sales"
  ON lc_sales FOR DELETE
  TO authenticated
  USING (auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_insert_lc_sale_items"
  ON lc_sale_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_update_lc_sale_items"
  ON lc_sale_items FOR UPDATE
  TO authenticated
  USING (auth.email() = 'ghanim.workshop@protonmail.com')
  WITH CHECK (auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_delete_lc_sale_items"
  ON lc_sale_items FOR DELETE
  TO authenticated
  USING (auth.email() = 'ghanim.workshop@protonmail.com');

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
  WITH CHECK (bucket_id = 'lc-product-images' AND auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_update_lc_product_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'lc-product-images' AND auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_delete_lc_product_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lc-product-images' AND auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_read_lc_receipts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'lc-receipts' AND auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_upload_lc_receipts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lc-receipts' AND auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_update_lc_receipts"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'lc-receipts' AND auth.email() = 'ghanim.workshop@protonmail.com');

CREATE POLICY "admin_delete_lc_receipts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lc-receipts' AND auth.email() = 'ghanim.workshop@protonmail.com');

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

-- ============ 7) دالة RPC لإدراج بيعة مع عناصرها في transaction واحدة ============
-- تحل مشكلة atomicity: إذا فشل إدراج العناصر، يفشل إدراج الـ sale بالكامل
CREATE OR REPLACE FUNCTION insert_sale_with_items(
  p_sale_date DATE,
  p_total_amount BIGINT,
  p_copy_service_type TEXT,
  p_copy_service_pages INTEGER,
  p_copy_service_price BIGINT,
  p_bank_receipt_path TEXT,
  p_notes TEXT,
  p_items JSONB
) RETURNS lc_sales AS $$
DECLARE
  v_sale lc_sales;
  v_item JSONB;
BEGIN
  -- إدراج الـ sale
  INSERT INTO lc_sales (
    sale_date, total_amount, copy_service_type, copy_service_pages,
    copy_service_price, bank_receipt_path, notes, created_by
  ) VALUES (
    p_sale_date, p_total_amount, p_copy_service_type, p_copy_service_pages,
    p_copy_service_price, p_bank_receipt_path, p_notes, auth.uid()
  ) RETURNING * INTO v_sale;

  -- إدراج العناصر
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    INSERT INTO lc_sale_items (
      sale_id, product_id, product_name, quantity, unit_price, total_price
    ) VALUES (
      v_sale.id,
      NULLIF(v_item->>'product_id', '')::BIGINT,
      v_item->>'product_name',
      (v_item->>'quantity')::INTEGER,
      (v_item->>'unit_price')::BIGINT,
      (v_item->>'total_price')::BIGINT
    );
  END LOOP;

  RETURN v_sale;
EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- منح صلاحية تنفيذ الدالة للمسؤولين فقط
REVOKE ALL ON FUNCTION insert_sale_with_items FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION insert_sale_with_items TO authenticated;
