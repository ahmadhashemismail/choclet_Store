-- Categories, mirroring the products table.
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

-- Link each product to a category (nullable so existing products keep working).
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS products_category_id_idx ON products (category_id);
